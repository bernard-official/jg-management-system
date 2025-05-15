"use client";
import { MenuItem } from "@/lib/utils";
import { supabase } from "@/utils/supabase/clients";
import { UUID } from "crypto";
import { createContext, useEffect, useState } from "react";

// Define the Order interface
export interface Order {
  id?: number; // Assuming Supabase uses numeric IDs
  created_at?: string;
  order_id: number;
  customer_name: string;
  table_number: number | null;
  items: string;
  total: number;
  status: "pending" | "preparing" | "completed" | "cancelled";
  action: string;
  user_id?: UUID; //info about who created the order
}

export interface OrderContext {
  open: boolean;
  openEditOrder: boolean;
  orders: Order[];
  toggleOrder: () => void;
  toggleEditOrder: () => void;
  createOrder: (order: Omit<Order, "id" | "created_at">) => void;
  updateOrder: (id: number, order: Partial<Order>) => void;
  deleteOrder: (id: number) => void;
  handleItemClick: (item: MenuItem) => void;
}

export const OrderContext = createContext<OrderContext | null>(null);

export const OrderProvider = ({ children }: { children: React.ReactNode }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [open, setOpen] = useState(false);
  const [openEditOrder, setOpenEditOrder] = useState(false);
  const [selectedItems, setSelectedItems] = useState<MenuItem[]>([]);
  // const [selectedEditedItemId, setSelectedEditedItemId] = useState<Order | null>(null);

  // Fetch orders on mount and set up real-time subscription
  useEffect(() => {
    const fetchOrders = async () => {
      const { data, error } = await supabase.from("orders").select("*");
      if (error) {
        console.error("Error fetching orders:", error);
      } else {
        setOrders(data || []);
      }
    };

    fetchOrders();

    const channel = supabase
      .channel("orders-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setOrders((prev) => {
              // Avoid duplicates by checking if the order already exists
              if (prev.some((o) => o.id === payload.new.id)) return prev;
              return [...prev, payload.new as Order];
            });
          } else if (payload.eventType === "UPDATE") {
            setOrders((prev) =>
              prev.map((o) =>
                o.id === payload.new.id ? (payload.new as Order) : o
              )
            );
          } else if (payload.eventType === "DELETE") {
            setOrders((prev) => prev.filter((o) => o.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, []); // No dependencies since supabase is stable

  //toggle order
  const toggleOrder = () => {
    setOpen(!open);
  };

  const toggleEditOrder = () => {
    setOpenEditOrder(!openEditOrder);
  };

  // Create a new order
  const createOrder = async (order: Omit<Order, "id" | "created_at">) => {
    const { data, error } = await supabase
      .from("orders")
      .insert([order])
      .select();
    if (error) {
      console.error("Error creating order:", {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      });
    } else if (data && data.length > 0) {
      setOrders((prevOrders) => {
        // Avoid duplicates if real-time already added it
        if (prevOrders.some((o) => o.id === data[0].id)) return prevOrders;
        return [...prevOrders, data[0]];
      });
    }
  };

  // Update an existing order
  const updateOrder = async (id: number, order: Partial<Order>) => {
    const { data, error } = await supabase
      .from("orders")
      .update(order)
      .eq("id", id)
      .select();
    if (error) {
      console.error("Error updating order:", error);
    } else if (data && data.length > 0) {
      setOrders((prevOrders) =>
        prevOrders.map((prevOrder) =>
          prevOrder.id === id ? { ...prevOrder, ...data[0] } : prevOrder
        )
      );
    }
  };

  // Delete an order
  const deleteOrder = async (id: number) => {
    const { error } = await supabase.from("orders").delete().eq("id", id);
    if (error) {
      console.error("Error deleting order:", error);
    } else {
      setOrders((prevOrders) => prevOrders.filter((order) => order.id !== id));
    }
  };

    const handleItemClick = (item: MenuItem) => {
      setSelectedItems((prev) => {
        const existingItemIndex = prev.findIndex((i) => i.id === item.id);
        if (existingItemIndex !== -1) {
          const updatedItems = [...prev];
          updatedItems[existingItemIndex] = {
            ...updatedItems[existingItemIndex],
            quantity: (updatedItems[existingItemIndex].quantity || 1) + 1,
          };
          return updatedItems;
        } else {
          return [...prev, { ...item, quantity: 1 }];
        }
      });
    };

  return (
    <OrderContext.Provider
      value={{
        open,
        openEditOrder,
        orders,
        toggleOrder,
        toggleEditOrder,
        createOrder,
        updateOrder,
        deleteOrder,
        handleItemClick
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};
