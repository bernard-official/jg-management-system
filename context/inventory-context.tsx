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
export interface RestockHistory {
  id: number;
  menu_item_id: number;
  quantity: number;
  restocked_at: string;
  created_by?: string;
}
export interface InventoryContextType {
  inventory: InventoryItem[];
  menu: MenuItem[];
  restockHistory: RestockHistory[];
  fetchInventory: () => Promise<void>;
  fetchRestockHistory: () => Promise<void>;
  restockItem: (menu_item_id: number, quantity: number, created_by?: string) => Promise<void>;
  addProduct: (product: {
    name: string;
    price: number;
    category: string;
    description?: string;
    initial_stock: number;
  }) => Promise<void>;
  deductStock: (items: { menu_item_id: number; quantity: number }[]) => Promise<void>;
}

export const InventoryContext = createContext<InventoryContextType | null>(null);

export const InventoryProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [restockHistory, setRestockHistory] = useState<RestockHistory[]>([]);

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

  const fetchRestockHistory = async () => {
    const { data, error } = await supabase
      .from("restock_history")
      .select("*")
      .order("restocked_at", { ascending: false });
    if (error) {
      console.error("Error fetching restock history:", error);
    } else {
      setRestockHistory(data || []);
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

  const restockItem = async (menu_item_id: number, quantity: number, created_by?: string) => {
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

      // Log restock to history
      const { error: historyError } = await supabase
        .from("restock_history")
        .insert({
          menu_item_id,
          quantity,
          created_by: created_by || "System",
        });
      if (historyError) throw historyError;

      console.log(`Restocked ${quantity} units for menu_item_id ${menu_item_id}`);
      fetchInventory();
      fetchRestockHistory();
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

  const deductStock = async (items: { menu_item_id: number; quantity: number }[]) => {
    try {
      for (const { menu_item_id, quantity } of items) {
        const { data, error } = await supabase
          .from("inventory")
          .select("stock_quantity")
          .eq("menu_item_id", menu_item_id)
          .single();
        if (error) throw error;
        if (data.stock_quantity < quantity) {
          throw new Error(`Insufficient stock for menu_item_id ${menu_item_id}`);
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


// "use client";
// import { supabase } from "@/lib/supabase/clients";
// import { MenuItem } from "@/lib/utils";
// import React, { createContext, useState, useEffect } from "react";

// export interface InventoryItem {
//   id: number;
//   menu_item_id: number;
//   stock_quantity: number;
//   low_stock_threshold: number;
//   menu_item_name: string;
// }
// export interface InventoryContextType {
//   inventory: InventoryItem[];
//   menu: MenuItem[];
//   fetchInventory: () => Promise<void>;
//   restockItem: (menu_item_id: number, quantity: number) => Promise<void>;
//   addProduct: (product: {
//     name: string;
//     price: number;
//     category: string;
//     description?: string;
//     initial_stock: number;
//   }) => Promise<void>;
//   deductStock: (items: { menu_item_id: number; quantity: number }[]) => Promise<void>;
// }

// export const InventoryContext = createContext<InventoryContextType | null>(null);

// export const InventoryProvider = ({
//   children,
// }: {
//   children: React.ReactNode;
// }) => {
//   const [inventory, setInventory] = useState<InventoryItem[]>([]);
//   const [menu, setMenu] = useState<MenuItem[]>([]);

//   const fetchInventory = async () => {
//     const { data, error } = await supabase.from("inventory").select(`
//       id,
//       menu_item_id,
//       stock_quantity,
//       low_stock_threshold,
//       menu_item:menu(id, name)
//     `);
//     if (error) {
//       console.error("Error fetching inventory:", error);
//     } else {
//       const formattedData = data.map((item) => ({
//         id: item.id,
//         menu_item_id: item.menu_item_id,
//         stock_quantity: item.stock_quantity,
//         low_stock_threshold: item.low_stock_threshold,
//         menu_item_name: item.menu_item.name,
//       }));
//       setInventory(formattedData);
//     }
//   };

//   const fetchMenu = async () => {
//     const { data, error } = await supabase.from("menu").select("*");
//     if (error) {
//       console.error("Error fetching menu:", error);
//     } else {
//       setMenu(data);
//     }
//   };

//   useEffect(() => {
//     fetchInventory();
//     fetchMenu();

//     const inventoryChannel = supabase
//       .channel("inventory")
//       .on(
//         "postgres_changes",
//         { event: "*", schema: "public", table: "inventory" },
//         () => fetchInventory()
//       )
//       .subscribe();

//     const menuChannel = supabase
//       .channel("menu")
//       .on(
//         "postgres_changes",
//         { event: "*", schema: "public", table: "menu" },
//         () => fetchMenu()
//       )
//       .subscribe();

//     return () => {
//       supabase.removeChannel(inventoryChannel);
//       supabase.removeChannel(menuChannel);
//     };
//   }, []);

//   const restockItem = async (menu_item_id: number, quantity: number) => {
//     try {
//       const { data, error } = await supabase
//         .from("inventory")
//         .select("stock_quantity")
//         .eq("menu_item_id", menu_item_id)
//         .single();
//       if (error) throw error;
//       const newQuantity = data.stock_quantity + quantity;
//       const { error: updateError } = await supabase
//         .from("inventory")
//         .update({ stock_quantity: newQuantity })
//         .eq("menu_item_id", menu_item_id);
//       if (updateError) throw updateError;
//       console.log(`Restocked ${quantity} units for menu_item_id ${menu_item_id}`);
//       fetchInventory();
//     } catch (err) {
//       console.error("Error restocking item:", err);
//       throw err;
//     }
//   };

//   const addProduct = async (product: {
//     name: string;
//     price: number;
//     category: string;
//     description?: string;
//     initial_stock: number;
//   }) => {
//     try {
//       // Check for duplicate menu item
//       const { data: existing } = await supabase
//         .from("menu")
//         .select("id")
//         .eq("name", product.name)
//         .single();
//       if (existing) {
//         throw new Error("Product already exists in menu");
//       }
//       //Add to menu
//       const { data: menuData, error: menuError } = await supabase
//         .from("menu")
//         .insert({
//           name: product.name,
//           price: product.price,
//           category: product.category,
//           description: product.description,
//         })
//         .select()
//         .single();
//       if (menuError) throw menuError;
//        // Add to inventory
//       const { error: inventoryError } = await supabase
//         .from("inventory")
//         .insert({
//           menu_item_id: menuData.id,
//           stock_quantity: product.initial_stock,
//           low_stock_threshold: 5,
//         });
//       if (inventoryError) throw inventoryError;
//       console.log("Product added to menu and inventory");
//       fetchMenu();
//       fetchInventory();
//     } catch (err) {
//       console.error("Error adding product:", err);
//       throw err;
//     }
//   };

//   const deductStock = async (items: { menu_item_id: number; quantity: number }[]) => {
//     try {
//       for (const { menu_item_id, quantity } of items) {
//         const { data, error } = await supabase
//           .from("inventory")
//           .select("stock_quantity")
//           .eq("menu_item_id", menu_item_id)
//           .single();
//         if (error) throw error;
//         if (data.stock_quantity < quantity) {
//           throw new Error(`Insufficient stock for menu_item_id ${menu_item_id}`);
//         }
//         const newQuantity = data.stock_quantity - quantity;
//         const { error: updateError } = await supabase
//           .from("inventory")
//           .update({ stock_quantity: newQuantity })
//           .eq("menu_item_id", menu_item_id);
//         if (updateError) throw updateError;
//       }
//       console.log("Stock deducted successfully");
//       fetchInventory();
//     } catch (err) {
//       console.error("Error deducting stock:", err);
//       throw err;
//     }
//   };

//   return (
//     <InventoryContext.Provider
//       value={{
//         inventory,
//         menu,
//         fetchInventory,
//         restockItem,
//         addProduct,
//         deductStock,
//       }}
//     >
//       {children}
//     </InventoryContext.Provider>
//   );
// };
