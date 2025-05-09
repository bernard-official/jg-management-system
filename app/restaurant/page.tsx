import React from "react";
import RestaurantClient from "@/components/restaurantClient";

export default async function Restaurant() {

  return (
    <div className="flex flex-col space-y-8">
      <h1 className="text-xl font-bold px-4 pt-4 .mb-4">Quick Orders</h1>
      {/* main pane */}
      <RestaurantClient  />
    </div>
  );
}
