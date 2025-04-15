import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import cleardrink from "@/public/cleardrink.png";
import food from "@/public/food.png";
import { MenuItem } from "@/lib/utils";

interface MenulistProps {
  menu: MenuItem[];
  onItemClick?: (item: MenuItem) => void;
  handleDecreaseQuantity?: (itemId: number) => void;
  handleIncreaseQuantity?: (itemId: number) => void;
}

function Menulist({
  menu,
  onItemClick,
}: MenulistProps) {
  return (
    <>
      <Card className="">
        <CardHeader>
          <CardTitle>Menu List</CardTitle>
          <CardDescription>
            Our appetizers are perfect for sharing with friends and family, or
            enjoying on your own as a snack.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <Image
            src={food}
            alt={"food background picture"}
            className="h-20 .object-fill object-cover .object-contain"
          />
          <h2 className=" font-semibold underline">Dishes</h2>
          {menu
            .filter((item) => item.category !== "Drinks")
            .map((item: MenuItem) => (
              <div
                key={item.id}
                className="flex w-full items-center justify-between space-y-1
                cursor-pointer hover:bg-gray-100"
                onClick={() => onItemClick?.(item)}
              >
                <div>{item.name}</div>
                <div className="flex item-center space-x-1">
                  <div className="flex item center">GHC{item.price}</div>

                  <div className="hover"></div>
                </div>
              </div>
            ))}
          <Image
            src={cleardrink}
            alt={"food background picture"}
            className="h-20 .object-fill object-cover .object-contain"
          />
          <h2 className=" font-semibold underline">Drinks</h2>
          {menu
            .filter((item: MenuItem) => item.category === "Drinks")
            .map((item: MenuItem) => (
              <div
                key={item.id}
                className="flex w-full items-center justify-between space-y-1
                cursor-pointer hover:bg-gray-100"
                onClick={() => onItemClick?.(item)}
              >
                <div>{item.name}</div>
                <div className="flex item-center space-x-8">
                  <div className=" flex item-center">GHC{item.price}</div>
                </div>
              </div>
            ))}
        </CardContent>
      </Card>
    </>
  );
}

export default Menulist;
