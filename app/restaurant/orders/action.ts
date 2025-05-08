import React from "react";
import { OrderContext } from "@/context/order-context";
import { createClient } from "@/utils/supabase/server";
import { useContext } from "react";

const supabase = await createClient();
const { orders } = useContext(OrderContext);
export async function fetchOrders() {
  const { data, error } = await supabase.from("orders").select("*");
}
