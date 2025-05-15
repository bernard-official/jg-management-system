"use client";
import { supabase } from "@/utils/supabase/clients";
import { MenuItem } from "@/lib/utils";
import { UUID } from "crypto";
import React, { createContext, useState, useEffect } from "react";

export interface InventoryItem {
  id: number;
  menu_item_id: number;
  stock_quantity: number;
  low_stock_threshold: number;
  // menu_item: {
  //   id: number;
  //   name: string;
  // };
  menu_item_name: string;
}
export interface RestockHistory {
  id: number;
  menu_item_id: number;
  quantity: number;
  restocked_at: string;
  staff_name: string  ;
  staff_id:  UUID;
}
export interface InventoryContextType {
  inventory: InventoryItem[];
  menu: MenuItem[];
  restockHistory: RestockHistory[];
  fetchInventory: () => Promise<void>;
  fetchRestockHistory: () => Promise<void>;
  // restockItem: (menu_item_id: number, quantity: number, staff_name?: UUID) => Promise<void>;
  restockItem: (menu_item_id: number, quantity: number) => Promise<void>;
  addProduct: (product: {
    name: string;
    price: number;
    category: string;
    description?: string;
    initial_stock: number;
  }) => Promise<void>;
  deductStock: (
    items: { menu_item_id: number; quantity: number }[]
  ) => Promise<void>;
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
  const [restockHistory, setRestockHistory] = useState<RestockHistory[]>([]);
  // const[err, setErr] = useState<string | null>(null)

  const restockItem = async (menu_item_id: number, quantity: number) => {
    try {
      // Get the current authenticated user
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();
      // console.log("Authenticated user:", user);
      if (authError || !user) {
        throw new Error("Unauthorized: Please log in to restock items");
      }

      // Verify user is a manager
      const { data: currentUser, error: userError } = await supabase
        .from("users")
        .select("role, full_name")
        .eq("id", user.id)
        .single();
      if (userError || currentUser?.role !== "manager") {
        throw new Error("Unauthorized: Only managers can restock items");
      }

      // Update inventory stock
      const { data, error } = await supabase
        .from("inventory")
        .select("stock_quantity")
        .eq("menu_item_id", menu_item_id)
        .single();
      if (error)
        throw new Error(`Failed to fetch inventory: ${error.message || error}`);

      const newQuantity = data.stock_quantity + quantity;
      const { error: updateError } = await supabase
        .from("inventory")
        .update({ stock_quantity: newQuantity })
        .eq("menu_item_id", menu_item_id);
      if (updateError)
        throw new Error(
          `Failed to update inventory: ${updateError.message || updateError}`
        );

      // Log restock to history
      const { error: historyError } = await supabase
        .from("restock_history")
        .insert({
          menu_item_id,
          quantity,
          staff_id: user.id, // Use authenticated user's UUID
          staff_name: currentUser?.full_name, // Use current user fetched from the users table
        });
      if (historyError)
        throw new Error(
          `Failed to log restock: ${historyError.message || historyError}`
        );

      console.log(
        `Restocked ${quantity} units for menu_item_id ${menu_item_id} by user ${user.id}`
      );
      fetchInventory();
      fetchRestockHistory();
    } catch (err: any) {
    // } catch (err: unknown) {
      throw new Error(err.message || "Failed to restock item");
      // if (err instanceof Error) {
      //   setErr(err.message || "Failed to restock item");
      // } else {
      //   setErr("An unknown error occurred");
      // }
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
      const { data: existing } = await supabase
        .from("menu")
        .select("id")
        .eq("name", product.name)
        .single();
      if (existing) {
        throw new Error("Product already exists in menu");
      }
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

  const deductStock = async (
    items: { menu_item_id: number; quantity: number }[]
  ) => {
    try {
      for (const { menu_item_id, quantity } of items) {
        const { data, error } = await supabase
          .from("inventory")
          .select("stock_quantity")
          .eq("menu_item_id", menu_item_id)
          .single();
        if (error) throw error;
        if (data.stock_quantity < quantity) {
          throw new Error(
            `Insufficient stock for menu_item_id ${menu_item_id}`
          );
        }
        const newQuantity = data.stock_quantity - quantity;
        const { error: updateError } = await supabase
          .from("inventory")
          .update({ stock_quantity: newQuantity })
          .eq("menu_item_id", menu_item_id);
        if (updateError) throw updateError;
      }
      console.log("Stock deducted successfully");
      fetchInventory();
    } catch (err) {
      console.error("Error deducting stock:", err);
      throw err;
    }
  };

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
        // @ts-expect-error: we are handling it later
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

  // context/inventory-context.tsx
const fetchRestockHistory = async () => {
  try {
    const { data, error } = await supabase
      .from("restock_history")
      .select(`
        id,
        menu_item_id,
        quantity,
        restocked_at,
        staff_name,
        staff_id
      `)
      .order("restocked_at", { ascending: false });
    if (error) {
      console.error("Error fetching restock history:", error.message || error);
      throw new Error(`Failed to fetch restock history: ${error.message || error}`);
    }

    const formattedData = data?.map((item) => ({
      id: item.id,
      menu_item_id: item.menu_item_id,
      quantity: item.quantity,
      restocked_at: item.restocked_at,
      staff_id: item.staff_id,
      staff_name: item.staff_name,
    })) || [];

    console.log('Fetched restock history:', formattedData);
    setRestockHistory(formattedData);
  } catch (err: any) {
    console.error("Fetch restock history error:", err.message || err);
    setRestockHistory([]);
  }
};

  useEffect(() => {
    fetchInventory();
    fetchMenu();
    fetchRestockHistory();

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

    const restockChannel = supabase
      .channel("restock_history")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "restock_history" },
        () => fetchRestockHistory()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(inventoryChannel);
      supabase.removeChannel(menuChannel);
      supabase.removeChannel(restockChannel);
    };
  }, []);

  return (
    <InventoryContext.Provider
      value={{
        inventory,
        menu,
        restockHistory,
        fetchInventory,
        fetchRestockHistory,
        restockItem,
        addProduct,
        deductStock,
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
};
