"use client";
import { supabase } from "@/lib/supabase/clients";
import { MenuItem } from "@/lib/utils";
import React, { createContext, useState, useEffect } from "react";

export interface InventoryItem {
  id: number;
  menu_item_id: number;
  stock_quantity: number;
  low_stock_threshold: number;
  menu_item_name: string;
}
export interface InventoryContextType {
  inventory: InventoryItem[];
  menu: MenuItem[];
  fetchInventory: () => Promise<void>;
  restockItem: (menu_item_id: number, quantity: number) => Promise<void>;
  addProduct: (product: {
    name: string;
    price: number;
    category: string;
    description?: string;
    initial_stock: number;
  }) => Promise<void>;
}

export const InventoryContext = createContext<InventoryContextType | null>(
  null
);

export const InventoryProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [menu, setMenu] = useState<MenuItem[]>([]);

  const fetchInventory = async () => {
    const { data, error } = await supabase.from("inventory").select(`
            id,
            menu_item_id,
            stock_quantity,
            low_stock_threshold,
            menu_item:menu(id, name)
          `);
    if (error) {
      console.error("Error fetching inventory:", error);
    } else {
      const formattedData = data.map((item) => ({
        id: item.id,
        menu_item_id: item.menu_item_id,
        stock_quantity: item.stock_quantity,
        low_stock_threshold: item.low_stock_threshold,
        menu_item_name: item.menu_item.name,
      }));
      setInventory(formattedData);
    }
  };

  const fetchMenu = async () => {
    const { data, error } = await supabase.from("menu").select("*");
    if (error) {
      console.error("Error fetching menu:", error);
    } else {
      setMenu(data);
    }
  };

  useEffect(()=>{
    fetchInventory();
    fetchMenu();

    const inventoryChannel = supabase
      .channel("inventory")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "inventory" },
        () => fetchInventory()
      )
      .subscribe();

    const menuChannel = supabase
      .channel("menu")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "menu" },
        () => fetchMenu()
      )
      .subscribe();

      return () => {
        supabase.removeChannel(inventoryChannel);
        supabase.removeChannel(menuChannel);
      };
  },[]);

  const restockItem = async (menu_item_id: number, quantity: number) => {
    try {
      const { data, error } = await supabase
        .from("inventory")
        .select("stock_quantity")
        .eq("menu_item_id", menu_item_id)
        .single();
      if (error) throw error;
      const newQuantity = data.stock_quantity + quantity;
      const { error: updateError } = await supabase
        .from("inventory")
        .update({ stock_quantity: newQuantity })
        .eq("menu_item_id", menu_item_id);
      if (updateError) throw updateError;
      console.log(`Restocked ${quantity} units for menu_item_id ${menu_item_id}`);
      fetchInventory();
    } catch (err) {
      console.error("Error restocking item:", err);
      throw err;
    }
  };

  const addProduct = async (product: {
    name: string;
    price: number;
    category: string;
    description?: string;
    initial_stock: number;
  }) => {
    try {
      // Check for duplicate menu item
      const { data: existing } = await supabase
        .from("menu")
        .select("id")
        .eq("name", product.name)
        .single();
      if (existing) {
        throw new Error("Product already exists in menu");
      }
      // Add to menu
      const { data: menuData, error: menuError } = await supabase
        .from("menu")
        .insert({
          name: product.name,
          price: product.price,
          category: product.category,
          description: product.description,
        })
        .select()
        .single();
      if (menuError) throw menuError;
      // Add to inventory
      const { error: inventoryError } = await supabase
        .from("inventory")
        .insert({
          menu_item_id: menuData.id,
          stock_quantity: product.initial_stock,
          low_stock_threshold: 5,
        });
      if (inventoryError) throw inventoryError;
      console.log("Product added to menu and inventory");
      fetchMenu();
      fetchInventory();
    } catch (err) {
      console.error("Error adding product:", err);
      throw err;
    }
  };

  return (
    <InventoryContext.Provider 
        value={{
            inventory,
            menu,
            fetchInventory,
            restockItem,
            addProduct,
        }}
    >
        {children}
        </InventoryContext.Provider>
  );
};
