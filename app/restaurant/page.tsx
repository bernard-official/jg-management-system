import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import cleardrink from "@/public/cleardrink.png";
import food from "@/public/food.png";
import OrderSummary from "@/components/order-summary";
// import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import Menulist from "@/components/menulist";

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
      <div className="flex space-y-8 .border w-full">
        <div className="px-4 space-y-4  w-full">
          <div className="flex space-x-4">

            <Button> new order</Button>
             
            <Button>existing orders</Button>
          </div>
          <Tabs defaultValue="menu" className=".w-[400px] space-y-4">
            <TabsList className=" grid grid-cols-4 w-full md:w-1/2 ">
              <TabsTrigger value="menu" className="font-bold">
                Full menu
              </TabsTrigger>
              <TabsTrigger value="appetizers" className="font-bold">
                Starters
              </TabsTrigger>
              <TabsTrigger value="password" className="font-bold">
                Main Dishes
              </TabsTrigger>
              <TabsTrigger value="beverages" className="font-bold">
                Beverages
              </TabsTrigger>
            </TabsList>
            <TabsContent value="menu" className="">
              <Menulist menu={menu} />
              {/* <Card className="">
                <CardHeader>
                  <CardTitle>Menu List</CardTitle>
                  <CardDescription>
                    Our appetizers are perfect for sharing with friends and
                    family, or enjoying on your own as a snack.
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
                    .map((item) => (
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
                    .filter((item) => item.category === "Drinks")
                    .map((item) => (
                      <div
                        key={item.id}
                        className="flex w-full justify-between space-y-1"
                      >
                        <div>{item.name}</div>
                        <div>GHC{item.price}</div>
                      </div>
                    ))}
                </CardContent>
              </Card> */}
            </TabsContent>
            <TabsContent value="appetizers">
              <Card>
                <CardContent className="space-y-2">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 ">
                    {menu
                      .filter((item) => item.category === "Drinks")
                      .map((item) => (
                        <Card key={item.id} className="">
                          <CardContent className="p-1  space-y-2">
                            {/* <Image src="https://www.pexels.com/photo/clear-glass-footed-drinking-glass-with-orange-juice-338713/" alt={"image of drinks"} width={100} height={100} /> */}

                            <Image
                              src={cleardrink}
                              alt={"image of drinks"}
                              width={500}
                              height={200}
                              className=" h-60"
                            />
                          </CardContent>
                          <CardHeader>
                            <CardTitle>{item.name}</CardTitle>
                            <CardDescription>
                              Change your password here. After saving,
                              you&apos;ll be logged out.
                            </CardDescription>
                          </CardHeader>
                          <CardFooter className="space-y-2 flex flex-col">
                            <CardDescription>GHC {item.price}</CardDescription>
                            <div>
                              <Button> -</Button>
                              <span> 2 </span>
                              <Button> +</Button>
                            </div>
                          </CardFooter>
                        </Card>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="password">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 ">
                {menu
                  .filter((item) => item.category !== "Drinks")
                  .map((item) => (
                    <Card key={item.id} className="">
                      <CardContent className="p-1  space-y-2">
                        {/* <Image src="https://www.pexels.com/photo/clear-glass-footed-drinking-glass-with-orange-juice-338713/" alt={"image of drinks"} width={100} height={100} /> */}

                        <Image
                          src={food}
                          alt={"image of drinks"}
                          width={500}
                          height={200}
                          className="h-60"
                        />
                      </CardContent>
                      <CardHeader>
                        <CardTitle>{item.name}</CardTitle>
                        {/* <CardDescription>
                        Change your password here. After saving, you&apos;ll be
                        logged out.
                      </CardDescription> */}
                      </CardHeader>
                      <CardFooter className="space-y-2 flex flex-col">
                        <CardDescription>GHC {item.price}</CardDescription>
                        <div>
                          <Button> -</Button>
                          <span> 2 </span>
                          <Button> +</Button>
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
              </div>
            </TabsContent>
            <TabsContent value="beverages">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 ">
                {menu
                  .filter((item) => item.category === "Drinks")
                  .map((item) => (
                    <Card key={item.id} className="">
                      <CardContent className="p-1  space-y-2">
                        {/* <Image src="https://www.pexels.com/photo/clear-glass-footed-drinking-glass-with-orange-juice-338713/" alt={"image of drinks"} width={100} height={100} /> */}

                        <Image
                          src={cleardrink}
                          alt={"image of drinks"}
                          width={500}
                          height={200}
                          className=" h-60"
                        />
                      </CardContent>
                      <CardHeader>
                        <CardTitle>{item.name}</CardTitle>
                        <CardDescription>
                          Change your password here. After saving, you&apos;ll
                          be logged out.
                        </CardDescription>
                      </CardHeader>
                      <CardFooter className="space-y-2 flex flex-col">
                        <CardDescription>GHC {item.price}</CardDescription>
                        <div>
                          <Button> -</Button>
                          <span> 2 </span>
                          <Button> +</Button>
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
        {/* pop-up right pane */}
        {/* <div className="pt-4 space-y-4 ">
          <Card className="border w-[400px] ">
            <OrderSummary />
          </Card>
        </div> */}
      </div>
    </div>
  );
}
