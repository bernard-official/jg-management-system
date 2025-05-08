"use client"
import React, { useContext } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { IoEllipsisVerticalOutline, IoPrintOutline, IoWalletOutline } from "react-icons/io5";
import { MdOutlineBalance } from "react-icons/md";
import { BsCashCoin } from "react-icons/bs";
import { BsBank } from "react-icons/bs";
import { Order } from "@/context/order-context";



const OrderCards = ({orders}:{ orders: Order }) => {

    const orderActivities = [
      { title: "total orders ", amount: 3000, icon: <IoWalletOutline /> },
      { title: "orders items over time", amount: 3000, icon: <MdOutlineBalance /> },
      { title: "return orders", amount: 3000, icon: <BsBank /> },
      { title: "furfilled Orders overtime", amount: 3000, icon: <BsCashCoin /> },
    ];

  return (
    <>
      <div className=" space-y-4 flex flex-wrap justify-center">
        {orderActivities.map((activity, index) => (
          <div
            key={index}
            className=".space-y-4 w-full md:w-1/2 lg:w-1/3 xl:w-1/4 px-4"
          >
            <Card className="flex flex-col h-full ">
              <CardContent className="pt-4">
                <div className="flex justify-between">
                  <div>{activity.icon}</div>
                  <div>
                    <IoEllipsisVerticalOutline />{" "}
                  </div>
                </div>
                <div className="flex items-center  h-1/2">
                  <span className="font-light text-sm">{activity.title}</span>
                </div>
                <div className="flex items-center  h-1/2">
                  <span className="text-xl font-extrabold">
                    GHC {activity.amount}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </>
  );
};

export default OrderCards;
