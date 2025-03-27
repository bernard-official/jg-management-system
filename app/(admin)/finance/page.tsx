import { Card, CardContent } from "@/components/ui/card";
import React from "react";
import { IoEllipsisVerticalOutline, IoPrintOutline, IoWalletOutline } from "react-icons/io5";
import { MdOutlineBalance } from "react-icons/md";
import { BsCashCoin } from "react-icons/bs";
import { BsBank } from "react-icons/bs";
import { TransactionTable } from "@/components/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
const financialActivities = [
  { title: "transfers via wallet", amount: 3000, icon: <IoWalletOutline /> },
  { title: "overall balance", amount: 3000, icon: <MdOutlineBalance /> },
  { title: "investments", amount: 3000, icon: <BsBank /> },
  { title: "payouts", amount: 3000, icon: <BsCashCoin /> },
];

export default function Finance() {
  return (
    <div className="space-y-8">
      <h1  className="text-xl font-bold px-4 pt-4 .mb-4">Financial Activities</h1>
      {/* top pane */}
      <div className=" space-y-4 flex flex-wrap justify-center">
        {financialActivities.map((activity, index) => (
          <div key={index} className=".space-y-4 w-full md:w-1/2 lg:w-1/3 xl:w-1/4 px-4">
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
        <div className="px-4 space-y-4">
          <h1 className="font-bold">Transactions</h1>
          <div className="flex justify-between">
            <form action="">
              <Input placeholder="filter..."/>
            </form>
            <Button><IoPrintOutline /></Button>
          </div>
        <TransactionTable />
        </div>
    </div>
  );
}
