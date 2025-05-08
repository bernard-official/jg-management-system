import React from "react";
import { createClient } from "@/utils/supabase/server";
import RestaurantClient from "@/components/restaurantClient";

export default async function Restaurant() {
  // fetch menu from supabase  table
  // later add RLS or authorization to it

  // const { open, toggleOrder } = React.useContext(OrderContext);

  const supabase = await createClient();
  const { data: menu, error } = await supabase.from("menu").select("*");

  if (error) {
    console.error("Error fetching menu:", error);
    return <div>Failed to load menu.</div>;
  }

  return (
    <div className="flex flex-col space-y-8">
      <h1 className="text-xl font-bold px-4 pt-4 .mb-4">Quick Orders</h1>
      {/* main pane */}
      <RestaurantClient menu={menu} />
    </div>
  );
}
