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



function Menulist({menu}:{menu:MenuItem}) {
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
            .filter((item: { category: string; }) => item.category !== "Drinks")
            .map((item:MenuItem ) => (
              <div
                key={item.id}
                className="flex w-full justify-between space-y-1"
              >
                <div>{item.name}</div>
                <div>GHC{item.price}</div>
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
                className="flex w-full justify-between space-y-1"
              >
                <div>{item.name}</div>
                <div>GHC{item.price}</div>
              </div>
            ))}
        </CardContent>
      </Card>
    </>
  );
}

export default Menulist;
