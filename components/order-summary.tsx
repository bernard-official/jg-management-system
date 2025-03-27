import React from "react";
import  {menu_items} from "@/dummydata";

// pops up when are new order is being made. Preparing a receipt for the client

const OrderSummary = () => {
  return (
    <div className="px-2">
      {menu_items.slice(0, 5).map((items, index) => (
        <div key={index} className="flex justify-between">
          {items.name}
          <p>4</p>
          {items.price}
        </div>
      ))}
    </div>
  );
};

export default OrderSummary;
