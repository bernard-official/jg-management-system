import React from "react";
import {
  Card,
  CardContent
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import Image from "next/image";
// import cleardrink from "@/public/cleardrink.png";
// import food from "@/public/food.png";
import OrderSummary from "@/components/order-summary";

export const tables = [
  {
    id: 1,
    name: "Margherita Pizza",
    description: "Fresh tomatoes, mozzarella, and basil",
    price: 15.99,
    category: "Pizza",
  },
  {
    id: 2,
    name: "Spaghetti Bolognese",
    description: "Spaghetti with ground beef and tomato sauce",
    price: 16.99,
    category: "Pasta",
  },
  {
    id: 3,
    name: "Chicken Fajitas",
    description: "Sliced chicken, bell peppers, onions, and tortillas",
    price: 18.99,
    category: "Mexican",
  },
  {
    id: 4,
    name: "Veggie Burger",
    description: "Black bean patty, lettuce, tomato, and avocado",
    price: 14.99,
    category: "Burgers",
  },
  {
    id: 5,
    name: "Grilled Salmon",
    description: "Fresh salmon, lemon, and herbs",
    price: 22.99,
    category: "Seafood",
  },
  {
    id: 6,
    name: "Chicken Caesar Salad",
    description: "Romaine lettuce, grilled chicken, and Caesar dressing",
    price: 13.99,
    category: "Salads",
  },
  {
    id: 7,
    name: "Meatball Sub",
    description: "Meatballs, marinara sauce, and melted mozzarella",
    price: 12.99,
    category: "Sandwiches",
  },
  {
    id: 8,
    name: "Quesadillas",
    description: "Tortillas, cheese, and choice of chicken or steak",
    price: 10.99,
    category: "Mexican",
  },
  {
    id: 9,
    name: "Fried Chicken Tenders",
    description: "Breaded and fried chicken tenders with dipping sauce",
    price: 11.99,
    category: "Appetizers",
  },
  {
    id: 10,
    name: "Greek Salad",
    description: "Tomatoes, cucumbers, feta cheese, and olives",
    price: 12.99,
    category: "Salads",
  },
  {
    id: 11,
    name: "Soft Drinks",
    description: "Coke, Diet Coke, Sprite, Root Beer",
    price: 2.99,
    category: "Drinks",
  },
  {
    id: 12,
    name: "Iced Tea",
    description: "Sweet or bitter tea",
    price: 2.49,
    category: "Drinks",
  },
  {
    id: 13,
    name: "Lemonade",
    description: "Freshly squeezed lemonade",
    price: 3.49,
    category: "Drinks",
  },
  {
    id: 14,
    name: "Coffee",
    description: "Hot or iced coffee",
    price: 2.49,
    category: "Drinks",
  },
  {
    id: 15,
    name: "Beer",
    description: "Domestic or imported beer",
    price: 5.99,
    category: "Drinks",
  },
  {
    id: 16,
    name: "Wine",
    description: "Red, white, or sparkling wine",
    price: 7.99,
    category: "Drinks",
  },
  {
    id: 17,
    name: "Fresh Juice",
    description: "Orange, apple, or cranberry juice",
    price: 4.99,
    category: "Drinks",
  },
  {
    id: 18,
    name: "Smoothies",
    description: "Blend of yogurt, fruit, and honey",
    price: 5.99,
    category: "Drinks",
  },
  {
    id: 19,
    name: "Milkshakes",
    description: "Thick and creamy milkshake",
    price: 6.99,
    category: "Drinks",
  },
  {
    id: 20,
    name: "Bottled Water",
    description: "Still or sparkling water",
    price: 3.99,
    category: "Drinks",
  },
];

export default function Restaurant() {
  return (
    <div className="flex flex-col  space-y-8">
      <h1 className="text-xl font-bold px-4 pt-4 .mb-4">Quick Orders</h1>
      {/* main pane */}
      <div className="flex space-y-8 w-full">
        <div className="px-4 space-y-4 w-full">
          <Tabs defaultValue="main space" className=".w-[400px] space-y-4 ">
            <TabsList className="border grid grid-cols-2 w-full md:w-1/2 ">
              <TabsTrigger value="main space" className="font-bold">
                Main space
              </TabsTrigger>
              <TabsTrigger value="Terrace" className="font-bold">
                Terrace
              </TabsTrigger>
            </TabsList>
            <TabsContent value="main space">
              <div className="grid grid-cols-4 gap-2 md:gap-4 ">
                {tables.map((item, index) => (
                  <Card
                    key={index}
                    className="flex justify-center items-center w-[100px] md:w-[200px] h-[100px] md:h-[200px]"
                  >
                    <CardContent className="">{item.id}</CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="Terrace">
              <div className="grid grid-cols-4 gap-2 md:gap-4 ">
                {tables.slice(-5).map((item, index) => (
                  <Card
                    key={index}
                    className="flex justify-center items-center w-[100px] md:w-[200px] h-[100px] md:h-[200px]"
                  >
                    <CardContent className="">{item.id}</CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
        {/* pop-up right pane */}
        <div className="pt-4 space-y-4 ">
        <h1 className="text-xl font-bold">Order Summary &#40;total&#41;</h1>
        <div className="border w-[400px] ">
        <OrderSummary />
        </div>
      </div>
      </div>
    </div>
  );
}
