"use client";
import React, { useState } from "react";
import { menu_items } from "@/dummydata";
import { Button } from "./ui/button";
import { Trash2 } from "lucide-react";

// pops up when are new order is being made. Preparing a receipt for the client
export type OrderedItems = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  specialInstructions?: string;
};

export const newOrder = [
  {
    id: "1",
    name: "Plate of Rice",
    price: 25.0,
    quantity: 1,
    specialInstructions: "",
  },
  {
    id: "2",
    name: "Box of Pizza",
    price: 30.0,
    quantity: 2,
    specialInstructions: "",
  },
  {
    id: "3",
    name: "Bottle of Beer",
    price: 15.0,
    quantity: 1,
    specialInstructions: "",
  },
  {
    id: "4",
    name: "Glass of Wine",
    price: 30.0,
    quantity: 1,
    specialInstructions: "",
  },
];

const OrderSummary = () => {
  const [orderedItems, setOrderedItems] = useState<OrderedItems[]>(newOrder);

  const subtotal = orderedItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const serviceFee = 5.0;

  const total = subtotal + serviceFee;

  return (
    <div className="px-2">
      <div className="p-4 space-y-4">
        <h2 className="text-lg font-semibold">
          Order Summary ({orderedItems.length} items)
        </h2>

        <div className="space-y-4">
          {orderedItems.map((item) => (
            <div key={item.id} className="flex justify-between items-start">
              <div className="flex-1">
                <p className="font-medium">
                  {item.quantity} x {item.name}
                </p>
                {item.specialInstructions && (
                  <p className="text-sm text-gray-500">
                    Note: {item.specialInstructions}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-4 ml-4">
                <span className="font-medium">
                  GHC{(item.price * item.quantity).toFixed(2)}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  // onClick={() => /* Add remove logic */}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>GHC{subtotal.toFixed(2)}</span>
          </div>

          <div className="flex justify-between">
            <span>Service Fee</span>
            <span>GHC{serviceFee.toFixed(2)}</span>
          </div>

          <div className="flex justify-between font-bold border-t pt-2">
            <span>Total</span>
            <span>GHC{total.toFixed(2)}</span>
          </div>
        </div>

        <Button className="w-full">Proceed to Checkout</Button>
      </div>

      {/* {menu_items.slice(0, 5).map((items, index) => (
        <div key={index} className="flex justify-between">
          {items.name}
          <p>4</p>
          {items.price}
        </div>
      ))} */}
    </div>
  );
};

export default OrderSummary;
