"use client";
import React, { useState } from "react";
import { IoMdClose } from "react-icons/io";
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
import { MenuItem } from "@/lib/utils";
import Menulist from "./menulist";
import { useContext } from "react";
import { Order, OrderContext } from "@/context/order-context";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";


export default function RestaurantClient({ menu }: { menu: MenuItem[] }) {
  //@ts-ignore
  const { open, openEditOrder, toggleOrder, toggleEditOrder, createOrder, orders } = useContext(OrderContext);
  const [selectedItems, setSelectedItems] = useState<MenuItem[]>([]); // Track items in the new order

  const handleExistingOrders = () => {
    //close the table //open the exact id or row clicked
    
    toggleEditOrder();

  }

  const handleItemClick = (item: MenuItem) => {
    setSelectedItems((prev) => {
      // Check if the item already exists in the selectedItems array
      const existingItemIndex = prev.findIndex((i) => i.id === item.id);

      if (existingItemIndex !== -1) {
        // If it exists, update the quantity
        const updatedItems = [...prev];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: (updatedItems[existingItemIndex].quantity || 1) + 1,
        };
        return updatedItems;
      } else {
        // If it doesn't exist, add it with quantity 1
        return [...prev, { ...item, quantity: 1 }];
      }
    });
  };

  const handleIncreaseQuantity = (itemId: number) => {
    setSelectedItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? { ...item, quantity: (item.quantity || 1) + 1 }
          : item
      )
    );
  };

  const handleDecreaseQuantity = (itemId: number) => {
    setSelectedItems((prev) => {
      const updatedItems = prev.map((item) =>
        item.id === itemId && (item.quantity || 1) > 1
          ? { ...item, quantity: (item.quantity || 1) - 1 }
          : item
      );
      // Remove item if quantity would drop to 0
      return updatedItems.filter((item) => (item.quantity || 1) > 0);
    });
  };

  const handleSubmitOrder = () => {
    if (selectedItems.length === 0) return;

    const total = selectedItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const order = {
      order_id: Date.now(), // Temporary unique ID (replace with a better strategy)
      customer_name: "Guest", // Add input for this later
      table_number: null, // Add input for this later
      items: selectedItems.map((i) => `${i.name} (x${i.quantity})`).join(", "), // Combine items
      total,
      status: "pending",
      action: "new",
    };

    console.log("Submitting order:", order); // Log the order before sending
    createOrder(order)
      .then(() => {
        console.log("Order created successfully");
        setSelectedItems([]);
        toggleOrder();
      })
      .catch((err) => console.error("Failed to create order:", err));
  };

  const handleCancelOrder = () => {
    setSelectedItems([]); // Clear the current order
    toggleOrder(); // Close the order pane
  };


  return (
    <div className="flex space-y-8 w-full">
      <div className="px-4 space-y-4  w-full">
        <div className="flex space-x-4">
          <Button onClick={toggleOrder}>New Order</Button>
          {/* existing orders button */}
          <Dialog>

            <DialogTrigger asChild>
              <Button variant={"default"}>Existing Orders</Button>
            </DialogTrigger>
            <DialogContent className="">
              <DialogHeader>
                <DialogTitle>Existing Orders</DialogTitle>
                <DialogDescription>
                  View all existing orders in the system
                </DialogDescription>
              </DialogHeader>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Order ID</TableHead>
                    <TableHead>Name </TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                
                  {orders.map((order: Order) => (
                    // make sure the dialog close itself upon selecting a row
                    <TableRow key={order.id} onClick={() => handleExistingOrders()}>
                      <TableCell className="font-medium">
                        {order.order_id}
                      </TableCell>
                      <TableCell>{order.customer_name}</TableCell>
                      <TableCell>{order.status}</TableCell>
                      <TableCell className="text-right">
                        {order.total}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                {/* <TableFooter>
                  <TableRow>
                    <TableCell colSpan={3}>Total</TableCell>
                    <TableCell className="text-right">$2,500.00</TableCell>
                  </TableRow>
                </TableFooter> */}
              </Table>
            </DialogContent>
          </Dialog>

          {/* <Button
            onClick={async () => {
              const testOrder = {
                order_id: Date.now(),
                customer_name: "Test User",
                table_number: null,
                items: "Test Item (x1)",
                total: 10.5,
                status: "pending",
                action: "new",
              };
              await createOrder(testOrder);
            }}
          >
            Test Insert
          </Button> */}
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
            <Menulist
              menu={menu}
              onItemClick={handleItemClick}
              handleDecreaseQuantity={handleDecreaseQuantity}
              handleIncreaseQuantity={handleIncreaseQuantity}
            />
          </TabsContent>
          <TabsContent value="appetizers">
            <Card>
              <CardContent className="space-y-2">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 ">
                  {menu
                    .filter((item) => item.category === "Drinks")
                    .map((item) => (
                      <Card
                        key={item.id}
                        className=""
                        onClick={() => handleItemClick(item)}
                      >
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
                          {/* <div>
                            <Button variant={"outline"}> -</Button>
                            <span> 2 </span>
                            <Button variant={"outline"}> +</Button>
                          </div> */}
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
                  <Card
                    key={item.id}
                    className=""
                    onClick={() => handleItemClick(item)}
                  >
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
                      {/* <div>
                        <Button variant={'outline'}> -</Button>
                        <span> 2 </span>
                        <Button variant={'outline'}> +</Button>
                      </div> */}
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
                  <Card
                    key={item.id}
                    className=""
                    onClick={() => handleItemClick(item)}
                  >
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
                        Change your password here. After saving, you&apos;ll be
                        logged out.
                      </CardDescription>
                    </CardHeader>
                    <CardFooter className="space-y-2 flex flex-col">
                      <CardDescription>GHC {item.price}</CardDescription>
                      {/* <div>
                        <Button variant={'outline'}> -</Button>
                        <span> 2 </span>
                        <Button variant={"outline"}> +</Button>
                      </div> */}
                    </CardFooter>
                  </Card>
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      {/* pop-up right pane */}
      {open && (
        <div className="border pt-4 space-y-4">
          <Card className="border w-[400px] p-4">
            <div className="flex justify-end">
              <IoMdClose onClick={handleCancelOrder} />
            </div>
            <h2 className="text-lg flex justify-center font-bold">
              Jasglynn Bar
            </h2>
            {selectedItems.length === 0 ? (
              <p>No items selected</p>
            ) : (
              <>
                <div className="py-4 flex justify-center">#orderId</div>
                <div className="text-xs font-semibold flex justify-between ">
                  <p>Item</p>
                  <p>Qty</p>
                  {/* <p>
                Price 
                </p> */}
                  <p>Amt</p>
                </div>
                <ul>
                  {selectedItems.map((item, index) => (
                    <li key={index} className="flex justify-between">
                      <div className="flex items-center">{item.name}</div>
                      <div className="flex space-x-2 ">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDecreaseQuantity(item.id)}
                        >
                          -
                        </Button>
                        <div className="flex items-center">
                          x{item.quantity}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleIncreaseQuantity(item.id)}
                        >
                          +
                        </Button>
                      </div>
                      <div className="flex items-center">
                        GHC {item.price * item.quantity}
                      </div>
                    </li>
                  ))}
                </ul>
              </>
            )}

            <div className="flex justify-between font-semibold border-t pt-2">
              <span>Service Fee</span>
              {/* <span>GHC{serviceFee.toFixed(2)}</span> */}
            </div>

            <div className="flex justify-between font-bold border-t pt-2">
              <span>Total</span>
              {/* <span>GHC{total.toFixed(2)}</span> */}
            </div>

            <div className="flex justify-between w-full ">
              <Button onClick={handleSubmitOrder} className="mt-4">
                Save Order
              </Button>
              <Button onClick={handleSubmitOrder} className="mt-4">
                Proceed to CheckOut
              </Button>
            </div>
          </Card>
          <OrderSummary selectedItems={selectedItems} />
        </div>
      )}
      {openEditOrder && (
        <div className="border pt-4 space-y-4">
          <Card className="border w-[400px] p-4">
            <div className="flex justify-end">
              <IoMdClose onClick={toggleEditOrder} />
            </div>
            <h2 className="text-lg flex justify-center font-bold">
              Jasglynn Bar
            </h2>
            {selectedItems.length === 0 ? (
              <p>No items selected</p>
            ) : (
              <>
                <div className="py-4 flex justify-center">#orderId</div>
                <div className="text-xs font-semibold flex justify-between ">
                  <p>Item</p>
                  <p>Qty</p>
                  {/* <p>
                Price 
                </p> */}
                  <p>Amt</p>
                </div>
                <ul>
                  {selectedItems.map((item, index) => (
                    <li key={index} className="flex justify-between">
                      <div className="flex items-center">{item.name}</div>
                      <div className="flex space-x-2 ">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDecreaseQuantity(item.id)}
                        >
                          -
                        </Button>
                        <div className="flex items-center">
                          x{item.quantity}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleIncreaseQuantity(item.id)}
                        >
                          +
                        </Button>
                      </div>
                      <div className="flex items-center">
                        GHC {item.price * item.quantity}
                      </div>
                    </li>
                  ))}
                  {/* {selectedItems.map((item, index) => (
                    <li key={index} className="flex justify-between">
                      <div className="flex items-center">{item.name}</div>
                      <div className="flex space-x-2 ">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDecreaseQuantity(item.id)}
                        >
                          -
                        </Button>
                        <div className="flex items-center">
                          x{item.quantity}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleIncreaseQuantity(item.id)}
                        >
                          +
                        </Button>
                      </div>
                      <div className="flex items-center">
                        GHC {item.price * item.quantity}
                      </div>
                    </li>
                  ))} */}
                </ul>
              </>
            )}

            <div className="flex justify-between font-semibold border-t pt-2">
              <span>Service Fee</span>
              {/* <span>GHC{serviceFee.toFixed(2)}</span> */}
            </div>

            <div className="flex justify-between font-bold border-t pt-2">
              <span>Total</span>
              {/* <span>GHC{total.toFixed(2)}</span> */}
            </div>

            <div className="flex justify-between w-full ">
              <Button onClick={handleSubmitOrder} className="mt-4">
                Save Order
              </Button>
              <Button onClick={handleSubmitOrder} className="mt-4">
                Proceed to CheckOut
              </Button>
            </div>
          </Card>
                </div>
      )}
      {/* {open && (
        <div className="pt-4 space-y-4 ">
          <Card className="border w-[400px] ">
            <OrderSummary />
          </Card>
        </div>
      )} */}
    </div>
  );
}
