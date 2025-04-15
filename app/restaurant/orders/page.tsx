"use client";
import React, { useContext } from "react";
import {
  IoPrintOutline,
} from "react-icons/io5";
import { MdOutlineBalance } from "react-icons/md";
import { BsCashCoin } from "react-icons/bs";
import { BsBank } from "react-icons/bs";
// import { TransactionTable } from "@/components/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { OrderContext } from "@/context/order-context";
import { OrderTable } from "@/components/order-table";
import OrderCards from "@/components/order-cards";



export default function Orders() {
  const { orders } = useContext(OrderContext);

  return (
    <div className="space-y-8">
      <div className="">
        <h1 className="text-xl font-bold px-4 pt-4 .mb-4">Orders</h1>
        <span className="px-4 pt-4 .mb-4 text-sm">
          Manage and track Orders seamlessly
        </span>

        {/* top pane */}
      </div>
      <OrderCards orders={orders} />
      <div className="px-4 space-y-4">
        <div className="flex justify-between">
          <form action="">
            <Input placeholder="filter..." />
          </form>
          <Button>
            <IoPrintOutline />
          </Button>
        </div>
        <OrderTable orders={orders} />
      </div>
    </div>
  );
}
