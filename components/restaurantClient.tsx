"use client";
import React, { useMemo, useState, useContext } from "react";
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
import { MenuItem } from "@/lib/utils";
import Menulist from "./menulist";
import { Order, OrderContext } from "@/context/order-context";
import { InventoryContext } from "@/context/inventory-context";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

export default function RestaurantClient({ menu: initialMenu }: { menu: MenuItem[] }) {
  const {
    open,
    openEditOrder,
    toggleOrder,
    toggleEditOrder,
    createOrder,
    updateOrder,
    deleteOrder,
    orders,
  } = useContext(OrderContext)!;
  const { menu, inventory, deductStock } = useContext(InventoryContext)!;
  const [selectedItems, setSelectedItems] = useState<MenuItem[]>([]);
  const [selectedEditedItemId, setSelectedEditedItemId] = useState<Order | null>(null);
  const [editedOrderItems, setEditedOrderItems] = useState<
    { name: string; quantity: number }[]
  >([]);
  const [customerName, setCustomerName] = useState("");
  const [tableNumber, setTableNumber] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const serviceFee = 0.00;
  const total = useMemo(
    () =>
      selectedItems.reduce(
        (sum, item) => sum + item.price * (item.quantity || 1),
        0
      ) + serviceFee,
    [selectedItems]
  );

  const parseOrderItems = (itemsString: string): { name: string; quantity: number }[] => {
    if (!itemsString) return [];
    return itemsString.split(", ").map((item) => {
      const match = item.match(/(.+)\s\(x(\d+)\)/);
      if (match) {
        return {
          name: match[1].trim(),
          quantity: parseInt(match[2], 10),
        };
      }
      return { name: item.trim(), quantity: 1 };
    });
  };

  const getItemPrice = (itemName: string): number => {
    const menuItem = menu.find((m) => m.name === itemName);
    if (!menuItem) {
      console.warn(`Item "${itemName}" not found in menu. Using price 0.`);
      return 0;
    }
    return menuItem.price;
  };

  const checkStock = (items: MenuItem[]): { menu_item_id: number; quantity: number }[] => {
    return items.map((item) => {
      const inventoryItem = inventory.find((inv) => inv.menu_item_id === item.id);
      if (!inventoryItem || inventoryItem.stock_quantity < (item.quantity || 1)) {
        throw new Error(`Insufficient stock for ${item.name}`);
      }
      return { menu_item_id: item.id, quantity: item.quantity || 1 };
    });
  };

  const handleExistingOrders = (id: number) => {
    const selected = orders.find((order) => order.id === id);
    if (selected) {
      setSelectedEditedItemId(selected);
      setEditedOrderItems(parseOrderItems(selected.items));
      toggleEditOrder();
    }
  };

  const handleItemClick = (item: MenuItem) => {
    setSelectedItems((prev) => {
      const existingItemIndex = prev.findIndex((i) => i.id === item.id);
      if (existingItemIndex !== -1) {
        const updatedItems = [...prev];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: (updatedItems[existingItemIndex].quantity || 1) + 1,
        };
        return updatedItems;
      } else {
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
      return updatedItems.filter((item) => (item.quantity || 1) > 0);
    });
  };

  const handleIncreaseQuantityExisting = (index: number) => {
    setEditedOrderItems((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const handleDecreaseQuantityExisting = (index: number) => {
    setEditedOrderItems((prev) => {
      const updated = prev.map((item, i) =>
        i === index && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      );
      return updated.filter((item) => item.quantity > 0);
    });
  };

  const handleSubmitOrder = async () => {
    if (selectedItems.length === 0) return;

    try {
      checkStock(selectedItems); // Validate stock before saving
      const order = {
        order_id: Date.now(),
        customer_name: customerName.trim() || "Guest",
        table_number: tableNumber || null,
        items: selectedItems
          .map((i) => `${i.name} (x${i.quantity || 1})`)
          .join(", "),
        total,
        status: "pending",
        action: "new",
      };

      await createOrder(order);
      console.log("Order created successfully");
      setSelectedItems([]);
      setCustomerName("");
      setTableNumber(null);
      toggleOrder();
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to create order");
    }
  };

  const handleUpdateOrder = async () => {
    if (!selectedEditedItemId) return;

    const allItems = [
      ...editedOrderItems.map((item) => `${item.name} (x${item.quantity})`),
      ...selectedItems.map((item) => `${item.name} (x${item.quantity || 1})`),
    ].join(", ");

    const total = [
      ...editedOrderItems.map((item) => {
        const menuItem = menu.find((m) => m.name === item.name);
        return menuItem ? menuItem.price * item.quantity : 0;
      }),
      selectedItems.reduce(
        (sum, item) => sum + item.price * (item.quantity || 1),
        0
      ),
    ].reduce((sum, val) => sum + val, 0) + serviceFee;

    try {
      checkStock(selectedItems); // Validate new items
      const updatedOrder = {
        items: allItems,
        total,
        status: selectedEditedItemId.status,
        customer_name: selectedEditedItemId.customer_name,
        table_number: selectedEditedItemId.table_number,
        action: "updated",
      };

      await updateOrder(selectedEditedItemId.id!, updatedOrder);
      console.log("Order updated successfully");
      setSelectedItems([]);
      setEditedOrderItems([]);
      setSelectedEditedItemId(null);
      toggleEditOrder();
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to update order");
    }
  };

  const handleCheckout = async (isEditOrder: boolean) => {
    if (!isEditOrder && selectedItems.length === 0) return;
    if (isEditOrder && !selectedEditedItemId) return;

    let orderToPrint: Order;

    try {
      if (isEditOrder) {
        const allItems = [
          ...editedOrderItems.map((item) => `${item.name} (x${item.quantity})`),
          ...selectedItems.map((item) => `${item.name} (x${item.quantity || 1})`),
        ].join(", ");

        const total = [
          ...editedOrderItems.map((item) => {
            const menuItem = menu.find((m) => m.name === item.name);
            return menuItem ? menuItem.price * item.quantity : 0;
          }),
          selectedItems.reduce(
            (sum, item) => sum + item.price * (item.quantity || 1),
            0
          ),
        ].reduce((sum, val) => sum + val, 0) + serviceFee;

        const stockItems = [
          ...editedOrderItems.map((item) => {
            const menuItem = menu.find((m) => m.name === item.name);
            return { menu_item_id: menuItem?.id!, quantity: item.quantity };
          }),
          ...selectedItems.map((item) => ({
            menu_item_id: item.id,
            quantity: item.quantity || 1,
          })),
        ];

        await deductStock(stockItems); // Deduct stock for all items

        const updatedOrder = {
          items: allItems,
          total,
          status: "completed",
          customer_name: selectedEditedItemId.customer_name,
          table_number: selectedEditedItemId.table_number,
          action: "completed",
        };

        await updateOrder(selectedEditedItemId.id!, updatedOrder);
        orderToPrint = { ...selectedEditedItemId, ...updatedOrder };
        console.log("Order checked out successfully");
      } else {
        const stockItems = selectedItems.map((item) => ({
          menu_item_id: item.id,
          quantity: item.quantity || 1,
        }));

        await deductStock(stockItems); // Deduct stock

        const order = {
          order_id: Date.now(),
          customer_name: "Guest",
          table_number: null,
          items: selectedItems
            .map((i) => `${i.name} (x${i.quantity || 1})`)
            .join(", "),
          total,
          status: "completed",
          action: "completed",
        };

        await createOrder(order);
        orderToPrint = order;
        console.log("Order checked out successfully");
      }

      // Trigger print
      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Order Receipt</title>
              <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                h1 { text-align: center; }
                .receipt { max-width: 300px; margin: 0 auto; }
                .items { width: 100%; border-collapse: collapse; }
                .items th, .items td { padding: 5px; border-bottom: 1px solid #ddd; }
                .total { font-weight: bold; margin-top: 10px; }
              </style>
            </head>
            <body>
              <div class="receipt">
                <h1>Jasglynn Bar</h1>
                <p>Order #${orderToPrint.order_id}</p>
                <p>Customer: ${orderToPrint.customer_name}</p>
                <p>Date: ${new Date().toLocaleDateString()}</p>
                <table class="items">
                  <tr>
                    <th>Item</th>
                    <th>Qty</th>
                    <th>Price</th>
                  </tr>
                  ${parseOrderItems(orderToPrint.items)
                    .map(
                      (item) => `
                    <tr>
                      <td>${item.name}</td>
                      <td>${item.quantity}</td>
                      <td>GHC ${(getItemPrice(item.name) * item.quantity).toFixed(2)}</td>
                    </tr>
                  `
                    )
                    .join("")}
                </table>
                <div class="total">
                  <p>Service Fee: GHC ${serviceFee.toFixed(2)}</p>
                  <p>Total: GHC ${orderToPrint.total.toFixed(2)}</p>
                </div>
              </div>
              <script>
                window.onload = () => {
                  window.print();
                  setTimeout(() => window.close(), 100);
                };
              </script>
            </body>
          </html>
        `);
        printWindow.document.close();
      }

      setSelectedItems([]);
      setEditedOrderItems([]);
      setSelectedEditedItemId(null);
      if (isEditOrder) {
        toggleEditOrder();
      } else {
        toggleOrder();
      }
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to checkout order");
    }
  };

  const handleCancelOrder = () => {
    setSelectedItems([]);
    toggleOrder();
    setError(null);
  };

  return (
    <div className="flex space-y-8 w-full">
      <div className="px-4 space-y-4 w-full">
        {error && <p className="text-red-500">{error}</p>}
        <div className="flex space-x-4">
          <Button onClick={toggleOrder}>New Order</Button>
          <Dialog >
            <DialogTrigger asChild>
              <Button variant="default">Existing Orders</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Existing Orders</DialogTitle>
                <DialogDescription>
                  View all existing orders in the system
                </DialogDescription>
              </DialogHeader>
                  <div className=" h-[60vh] overflow-auto ">
              <Table className=" max-h-96 overflow-x-hidden">
                {/* <TableHeader className=" .bg-white .sticky .fixed"> */}
                <TableHeader  >
                  

                  <TableRow>
                    <TableHead className="w-[100px]">Order ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className=".text-right">Amount</TableHead>
                  </TableRow>
                 
                </TableHeader>
                  {/* <div className="border border-red-500 h-[30vh] w-full .overflow-auto "> */}
                <TableBody>
                  {orders
                   .filter((order) => order.status !== "completed")
                  .map((order: Order) => (
                    <TableRow
                    key={order.id}
                    onClick={() => handleExistingOrders(order.id!)}
                    >
                      <TableCell className="font-medium">{order.order_id}</TableCell>
                      <TableCell>{order.customer_name}</TableCell>
                      <TableCell>{order.status}</TableCell>
                      <TableCell className=".text-right">GHC {order.total}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                  {/* </div> */}
              </Table>
                  </div>
            </DialogContent>
          </Dialog>
        </div>
        <Tabs defaultValue="menu" className="space-y-4">
          <TabsList className="grid grid-cols-4 w-full md:w-1/2">
            <TabsTrigger value="menu" className="font-bold">Full Menu</TabsTrigger>
            <TabsTrigger value="appetizers" className="font-bold">Starters</TabsTrigger>
            <TabsTrigger value="main" className="font-bold">Main Dishes</TabsTrigger>
            <TabsTrigger value="beverages" className="font-bold">Beverages</TabsTrigger>
          </TabsList>
          <TabsContent value="menu">
            <Menulist menu={menu} onItemClick={handleItemClick} />
          </TabsContent>
          <TabsContent value="appetizers">
            <Card>
              <CardContent className="space-y-2">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
                  {menu
                    .filter((item) => item.category === "Starters")
                    .map((item) => (
                      <Card key={item.id} onClick={() => handleItemClick(item)}>
                        <CardContent className="p-1 space-y-2">
                          <Image
                            src={food}
                            alt="starters"
                            width={500}
                            height={200}
                            className="h-60"
                          />
                        </CardContent>
                        <CardHeader>
                          <CardTitle>{item.name}</CardTitle>
                          <CardDescription>{item.description}</CardDescription>
                        </CardHeader>
                        <CardFooter className="space-y-2 flex flex-col">
                          <CardDescription>GHC {item.price}</CardDescription>
                        </CardFooter>
                      </Card>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="main">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
              {menu
                .filter((item) => item.category === "Main Dishes")
                .map((item) => (
                  <Card key={item.id} onClick={() => handleItemClick(item)}>
                    <CardContent className="p-1 space-y-2">
                      <Image
                        src={food}
                        alt="main dishes"
                        width={500}
                        height={200}
                        className="h-60"
                      />
                    </CardContent>
                    <CardHeader>
                      <CardTitle>{item.name}</CardTitle>
                      <CardDescription>{item.description}</CardDescription>
                    </CardHeader>
                    <CardFooter className="space-y-2 flex flex-col">
                      <CardDescription>GHC {item.price}</CardDescription>
                    </CardFooter>
                  </Card>
                ))}
            </div>
          </TabsContent>
          <TabsContent value="beverages">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
              {menu
                .filter((item) => item.category === "Drinks")
                .map((item) => (
                  <Card key={item.id} onClick={() => handleItemClick(item)}>
                    <CardContent className="p-1 space-y-2">
                      <Image
                        src={cleardrink}
                        alt="drinks"
                        width={500}
                        height={200}
                        className="h-60"
                      />
                    </CardContent>
                    <CardHeader>
                      <CardTitle>{item.name}</CardTitle>
                      <CardDescription>{item.description}</CardDescription>
                    </CardHeader>
                    <CardFooter className="space-y-2 flex flex-col">
                      <CardDescription>GHC {item.price}</CardDescription>
                    </CardFooter>
                  </Card>
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      {open && (
        <div className="pt-16">
          <Card className="border w-[400px] p-4">
            <div className="flex justify-end">
              <IoMdClose onClick={handleCancelOrder} />
            </div>
            <h2 className="text-lg flex justify-center font-bold">Jasglynn Bar</h2>
            {selectedItems.length === 0 ? (
              <p>No items selected</p>
            ) : (
              <>
                <div className="py-4 flex justify-center">#orderId</div>
                <div  className="py-4 flex justify-start">
                  <Label className="text-xs font-semibold capitalize flex space-x-2 items-center pr-2">
                    name:
                  </Label>
                  <Input placeholder='Guest name'  
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="flex item-center  w-3/4" /> 
                  
                  <Label className="text-xs font-semibold capitalize flex space-x-2 items-center pl-1 pr-2">
                    table:
                  </Label>
                  <Input placeholder='1'  type="number" 
                  value={tableNumber ?? ""}
                  onChange={(e) =>
                    setTableNumber(
                      e.target.value === "" ? null : Number(e.target.value)
                    )
                  }
                  className="flex item-center w-1/4" /> 

                </div>
                <div className="text-xs font-semibold flex justify-between">
                  <p>Item</p>
                  <p>Qty</p>
                  <p>Amt</p>
                </div>
                <ul className="mb-2">
                  {selectedItems.map((item, index) => (
                    <li key={index} className="flex justify-between">
                      <div className="flex items-center">{item.name}</div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDecreaseQuantity(item.id)}
                        >
                          -
                        </Button>
                        <div className="flex items-center">x{item.quantity || 1}</div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleIncreaseQuantity(item.id)}
                        >
                          +
                        </Button>
                      </div>
                      <div className="flex items-center">
                        GHC {(item.price * (item.quantity || 1)).toFixed(2)}
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="flex justify-between font-semibold border-t pt-2">
                  <span>Service Fee</span>
                  <span>GHC {serviceFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold border-t pt-2">
                  <span>Total</span>
                  <span>GHC {total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between w-full">
                  <Button onClick={handleSubmitOrder} className="mt-4">
                    Save Order
                  </Button>
                  <Button onClick={() => handleCheckout(false)} className="mt-4">
                    Proceed to CheckOut
                  </Button>
                </div>
              </>
            )}
          </Card>
        </div>
      )}
      {openEditOrder && (
        <div className="pt-16">
          <Card className="border w-[400px] p-4">
            <div className="flex justify-end">
              <IoMdClose onClick={toggleEditOrder} />
            </div>
            <h2 className="text-lg flex justify-center font-bold">Jasglynn Bar</h2>
            {selectedEditedItemId ? (
              <>
                <div className="py-4 flex justify-center">#{selectedEditedItemId.order_id}</div>
                <div className="py-4 flex justify-start">
                  <span className="text-xs font-semibold capitalize flex space-x-2 items-center pr-3">
                    name:
                  </span>
                  <span className="flex item-center font-bold">
                    {selectedEditedItemId.customer_name}
                  </span>
                  <span className="text-xs font-semibold capitalize flex space-x-2 items-center pl-8 pr-3">
                    table:
                  </span>
                  <span className="flex item-center font-bold">
                    {selectedEditedItemId.table_number}
                  </span>
                </div>
                <div className="text-xs font-semibold flex justify-between">
                  <p>Item</p>
                  <p>Qty</p>
                  <p>Amt</p>
                </div>
                <ul>
                  {parseOrderItems(selectedEditedItemId.items || "").map((item, index) => (
                    <li key={`existing-${index}`} className="flex justify-between">
                      <div className="flex items-center">{item.name}</div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDecreaseQuantityExisting(index)}
                        >
                          -
                        </Button>
                        <div className="flex items-center">x{item.quantity}</div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleIncreaseQuantityExisting(index)}
                        >
                          +
                        </Button>
                      </div>
                      <div className="flex items-center">
                        GHC {(getItemPrice(item.name) * item.quantity).toFixed(2)}
                      </div>
                    </li>
                  ))}
                  {selectedItems.map((item, index) => (
                    <li key={`new-${index}`} className="flex justify-between">
                      <div className="flex items-center">{item.name}</div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDecreaseQuantity(item.id)}
                        >
                          -
                        </Button>
                        <div className="flex items-center">x{item.quantity || 1}</div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleIncreaseQuantity(item.id)}
                        >
                          +
                        </Button>
                      </div>
                      <div className="flex items-center">
                        GHC {(item.price * (item.quantity || 1)).toFixed(2)}
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="flex justify-between font-semibold border-t pt-2">
                  <span>Service Fee</span>
                  <span>GHC {serviceFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold border-t pt-2">
                  <span>Total</span>
                  <span>
                    GHC{" "}
                    {[
                      ...parseOrderItems(selectedEditedItemId.items || "").map(
                        (item) => getItemPrice(item.name) * item.quantity
                      ),
                      selectedItems.reduce(
                        (sum, item) => sum + item.price * (item.quantity || 1),
                        0
                      ),
                    ]
                      .reduce((sum, val) => sum + val, 0)
                      .toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between w-full">
                  <Button onClick={handleUpdateOrder} className="mt-4">
                    Save Order
                  </Button>
                  <Button onClick={() => handleCheckout(true)} className="mt-4">
                    Proceed to CheckOut
                  </Button>
                </div>
              </>
            ) : (
              <p>No order selected</p>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}





// "use client";
// import React, { useMemo, useState } from "react";
// import { IoMdClose } from "react-icons/io";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import Image from "next/image";
// import cleardrink from "@/public/cleardrink.png";
// import food from "@/public/food.png";
// import { MenuItem } from "@/lib/utils";
// import Menulist from "./menulist";
// import { useContext } from "react";
// import { Order, OrderContext } from "@/context/order-context";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "./ui/dialog";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "./ui/table";

// export default function RestaurantClient({ menu }: { menu: MenuItem[] }) {
//   const {
//     open,
//     openEditOrder,
//     toggleOrder,
//     toggleEditOrder,
//     createOrder,
//     updateOrder,
//     deleteOrder,
//     orders,
//   } = useContext(OrderContext)!;
//   const [selectedItems, setSelectedItems] = useState<MenuItem[]>([]);
//   const [selectedEditedItemId, setSelectedEditedItemId] = useState<Order | null>(null);
//   const [editedOrderItems, setEditedOrderItems] = useState<
//     { name: string; quantity: number }[]
//   >([]);

//   const serviceFee = 0.00;
//   const total = useMemo(
//     () =>
//       selectedItems.reduce(
//         (sum, item) => sum + item.price * (item.quantity || 1),
//         0
//       ) + serviceFee,
//     [selectedItems]
//   );

//   const parseOrderItems = (itemsString: string): { name: string; quantity: number }[] => {
//     if (!itemsString) return [];
//     return itemsString.split(", ").map((item) => {
//       const match = item.match(/(.+)\s\(x(\d+)\)/);
//       if (match) {
//         return {
//           name: match[1].trim(),
//           quantity: parseInt(match[2], 10),
//         };
//       }
//       return { name: item.trim(), quantity: 1 };
//     });
//   };

//   const getItemPrice = (itemName: string): number => {
//     const menuItem = menu.find((m) => m.name === itemName);
//     if (!menuItem) {
//       console.warn(`Item "${itemName}" not found in menu. Using price 0.`);
//       return 0;
//     }
//     return menuItem.price;
//   };

//   const handleExistingOrders = (id: number) => {
//     const selected = orders.find((order) => order.id === id);
//     if (selected) {
//       setSelectedEditedItemId(selected);
//       setEditedOrderItems(parseOrderItems(selected.items));
//       toggleEditOrder();
//     }
//   };

//   const handleItemClick = (item: MenuItem) => {
//     setSelectedItems((prev) => {
//       const existingItemIndex = prev.findIndex((i) => i.id === item.id);
//       if (existingItemIndex !== -1) {
//         const updatedItems = [...prev];
//         updatedItems[existingItemIndex] = {
//           ...updatedItems[existingItemIndex],
//           quantity: (updatedItems[existingItemIndex].quantity || 1) + 1,
//         };
//         return updatedItems;
//       } else {
//         return [...prev, { ...item, quantity: 1 }];
//       }
//     });
//   };

//   const handleIncreaseQuantity = (itemId: number) => {
//     setSelectedItems((prev) =>
//       prev.map((item) =>
//         item.id === itemId
//           ? { ...item, quantity: (item.quantity || 1) + 1 }
//           : item
//       )
//     );
//   };

//   const handleDecreaseQuantity = (itemId: number) => {
//     setSelectedItems((prev) => {
//       const updatedItems = prev.map((item) =>
//         item.id === itemId && (item.quantity || 1) > 1
//           ? { ...item, quantity: (item.quantity || 1) - 1 }
//           : item
//       );
//       return updatedItems.filter((item) => (item.quantity || 1) > 0);
//     });
//   };

//   const handleIncreaseQuantityExisting = (index: number) => {
//     setEditedOrderItems((prev) =>
//       prev.map((item, i) =>
//         i === index ? { ...item, quantity: item.quantity + 1 } : item
//       )
//     );
//   };

//   const handleDecreaseQuantityExisting = (index: number) => {
//     setEditedOrderItems((prev) => {
//       const updated = prev.map((item, i) =>
//         i === index && item.quantity > 1
//           ? { ...item, quantity: item.quantity - 1 }
//           : item
//       );
//       return updated.filter((item) => item.quantity > 0);
//     });
//   };

//   const handleSubmitOrder = async () => {
//     if (selectedItems.length === 0) return;

//     const order = {
//       order_id: Date.now(),
//       customer_name: "Guest",
//       table_number: null,
//       items: selectedItems
//         .map((i) => `${i.name} (x${i.quantity || 1})`)
//         .join(", "),
//       total,
//       status: "pending",
//       action: "new",
//     };

//     try {
//       await createOrder(order);
//       console.log("Order created successfully");
//       setSelectedItems([]);
//       toggleOrder();
//     } catch (err) {
//       console.error("Failed to create order:", err);
//     }
//   };

//   const handleUpdateOrder = async () => {
//     if (!selectedEditedItemId) return;

//     const allItems = [
//       ...editedOrderItems.map((item) => `${item.name} (x${item.quantity})`),
//       ...selectedItems.map((item) => `${item.name} (x${item.quantity || 1})`),
//     ].join(", ");

//     const total = [
//       ...editedOrderItems.map((item) => {
//         const menuItem = menu.find((m) => m.name === item.name);
//         return menuItem ? menuItem.price * item.quantity : 0;
//       }),
//       selectedItems.reduce(
//         (sum, item) => sum + item.price * (item.quantity || 1),
//         0
//       ),
//     ].reduce((sum, val) => sum + val, 0) + serviceFee;

//     const updatedOrder = {
//       items: allItems,
//       total,
//       status: selectedEditedItemId.status,
//       customer_name: selectedEditedItemId.customer_name,
//       table_number: selectedEditedItemId.table_number,
//       action: "updated",
//     };

//     try {
//       await updateOrder(selectedEditedItemId.id!, updatedOrder);
//       console.log("Order updated successfully");
//       setSelectedItems([]);
//       setEditedOrderItems([]);
//       setSelectedEditedItemId(null);
//       toggleEditOrder();
//     } catch (err) {
//       console.error("Failed to update order:", err);
//     }
//   };

//   const handleCheckout = async (isEditOrder: boolean) => {
//     if (!isEditOrder && selectedItems.length === 0) return;
//     if (isEditOrder && !selectedEditedItemId) return;

//     let orderToPrint: Order;

//     if (isEditOrder) {
//       const allItems = [
//         ...editedOrderItems.map((item) => `${item.name} (x${item.quantity})`),
//         ...selectedItems.map((item) => `${item.name} (x${item.quantity || 1})`),
//       ].join(", ");

//       const total = [
//         ...editedOrderItems.map((item) => {
//           const menuItem = menu.find((m) => m.name === item.name);
//           return menuItem ? menuItem.price * item.quantity : 0;
//         }),
//         selectedItems.reduce(
//           (sum, item) => sum + item.price * (item.quantity || 1),
//           0
//         ),
//       ].reduce((sum, val) => sum + val, 0) + serviceFee;

//       const updatedOrder = {
//         items: allItems,
//         total,
//         status: "completed",
//         customer_name: selectedEditedItemId.customer_name,
//         table_number: selectedEditedItemId.table_number,
//         action: "completed",
//       };

//       try {
//         await updateOrder(selectedEditedItemId.id!, updatedOrder);
//         orderToPrint = { ...selectedEditedItemId, ...updatedOrder };
//         console.log("Order checked out successfully");
//       } catch (err) {
//         console.error("Failed to checkout order:", err);
//         return;
//       }
//     } else {
//       const order = {
//         order_id: Date.now(),
//         customer_name: "Guest",
//         table_number: null,
//         item: selectedItems
//           .map((i) => `${i.name} (x${i.quantity || 1})`)
//           .join(", "),
//         total,
//         status: "completed",
//         action: "completed",
//       };

//       try {
//         await createOrder(order);
//         orderToPrint = order;
//         console.log("Order checked out successfully");
//       } catch (err) {
//         console.error("Failed to checkout order:", err);
//         return;
//       }
//     }

//     // Trigger print
//     const printWindow = window.open("", "_blank");
//     if (printWindow) {
//       printWindow.document.write(`
//         <html>
//           <head>
//             <title>Order Receipt</title>
//             <style>
//               body { font-family: Arial, sans-serif; padding: 20px; }
//               h1 { text-align: center; }
//               .receipt { max-width: 300px; margin: 0 auto; }
//               .items { width: 100%; border-collapse: collapse; }
//               .items th, .items td { padding: 5px; border-bottom: 1px solid #ddd; }
//               .total { font-weight: bold; margin-top: 10px; }
//             </style>
//           </head>
//           <body>
//             <div class="receipt">
//               <h1>Jasglynn Bar</h1>
//               <p>Order #${orderToPrint.order_id}</p>
//               <p>Customer: ${orderToPrint.customer_name}</p>
//               <p>Date: ${new Date().toLocaleDateString()}</p>
//               <table class="items">
//                 <tr>
//                   <th>Item</th>
//                   <th>Qty</th>
//                   <th>Price</th>
//                 </tr>
//                 ${parseOrderItems(orderToPrint.items)
//                   .map(
//                     (item) => `
//                   <tr>
//                     <td>${item.name}</td>
//                     <td>${item.quantity}</td>
//                     <td>GHC ${(getItemPrice(item.name) * item.quantity).toFixed(2)}</td>
//                   </tr>
//                 `
//                   )
//                   .join("")}
//               </table>
//               <div class="total">
//                 <p>Service Fee: GHC ${serviceFee.toFixed(2)}</p>
//                 <p>Total: GHC ${orderToPrint.total.toFixed(2)}</p>
//               </div>
//             </div>
//             <script>
//               window.onload = () => {
//                 window.print();
//                 setTimeout(() => window.close(), 100);
//               };
//             </script>
//           </body>
//         </html>
//       `);
//       printWindow.document.close();
//     }

//     setSelectedItems([]);
//     setEditedOrderItems([]);
//     setSelectedEditedItemId(null);
//     if (isEditOrder) {
//       toggleEditOrder();
//     } else {
//       toggleOrder();
//     }
//   };

//   const handleCancelOrder = () => {
//     setSelectedItems([]);
//     toggleOrder();
//   };

//   return (
//     <div className="flex space-y-8 w-full">
//       <div className="px-4 space-y-4 w-full">
//         <div className="flex space-x-4">
//           <Button onClick={toggleOrder}>New Order</Button>
//           <Dialog>
//             <DialogTrigger asChild>
//               <Button variant="default">Existing Orders</Button>
//             </DialogTrigger>
//             <DialogContent>
//               <DialogHeader>
//                 <DialogTitle>Existing Orders</DialogTitle>
//                 <DialogDescription>
//                   View all existing orders in the system
//                 </DialogDescription>
//               </DialogHeader>
//               <Table>
//                 <TableHeader>
//                   <TableRow>
//                     <TableHead className="w-[100px]">Order ID</TableHead>
//                     <TableHead>Name</TableHead>
//                     <TableHead>Status</TableHead>
//                     <TableHead className=".text-right">Amount</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {orders.map((order: Order) => (
//                     <TableRow
//                       key={order.id}
//                       onClick={() => handleExistingOrders(order.id!)}
//                     >
//                       <TableCell className="font-medium">{order.order_id}</TableCell>
//                       <TableCell>{order.customer_name}</TableCell>
//                       <TableCell>{order.status}</TableCell>
//                       <TableCell className=".text-right">GHC {order.total}</TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </DialogContent>
//           </Dialog>
//         </div>
//         <Tabs defaultValue="menu" className="space-y-4">
//           <TabsList className="grid grid-cols-4 w-full md:w-1/2">
//             <TabsTrigger value="menu" className="font-bold">Full menu</TabsTrigger>
//             <TabsTrigger value="appetizers" className="font-bold">Starters</TabsTrigger>
//             <TabsTrigger value="password" className="font-bold">Main Dishes</TabsTrigger>
//             <TabsTrigger value="beverages" className="font-bold">Beverages</TabsTrigger>
//           </TabsList>
//           <TabsContent value="menu">
//             <Menulist menu={menu} onItemClick={handleItemClick} />
//           </TabsContent>
//           <TabsContent value="appetizers">
//             <Card>
//               <CardContent className="space-y-2">
//                 <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
//                   {menu
//                     .filter((item) => item.category === "Drinks")
//                     .map((item) => (
//                       <Card key={item.id} onClick={() => handleItemClick(item)}>
//                         <CardContent className="p-1 space-y-2">
//                           <Image
//                             src={cleardrink}
//                             alt="drinks"
//                             width={500}
//                             height={200}
//                             className="h-60"
//                           />
//                         </CardContent>
//                         <CardHeader>
//                           <CardTitle>{item.name}</CardTitle>
//                           <CardDescription>
//                             Change your password here. After saving, you'll be logged out.
//                           </CardDescription>
//                         </CardHeader>
//                         <CardFooter className="space-y-2 flex flex-col">
//                           <CardDescription>GHC {item.price}</CardDescription>
//                         </CardFooter>
//                       </Card>
//                     ))}
//                 </div>
//               </CardContent>
//             </Card>
//           </TabsContent>
//           <TabsContent value="password">
//             <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
//               {menu
//                 .filter((item) => item.category !== "Drinks")
//                 .map((item) => (
//                   <Card key={item.id} onClick={() => handleItemClick(item)}>
//                     <CardContent className="p-1 space-y-2">
//                       <Image
//                         src={food}
//                         alt="food"
//                         width={500}
//                         height={200}
//                         className="h-60"
//                       />
//                     </CardContent>
//                     <CardHeader>
//                       <CardTitle>{item.name}</CardTitle>
//                     </CardHeader>
//                     <CardFooter className="space-y-2 flex flex-col">
//                       <CardDescription>GHC {item.price}</CardDescription>
//                     </CardFooter>
//                   </Card>
//                 ))}
//             </div>
//           </TabsContent>
//           <TabsContent value="beverages">
//             <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
//               {menu
//                 .filter((item) => item.category === "Drinks")
//                 .map((item) => (
//                   <Card key={item.id} onClick={() => handleItemClick(item)}>
//                     <CardContent className="p-1 space-y-2">
//                       <Image
//                         src={cleardrink}
//                         alt="drinks"
//                         width={500}
//                         height={200}
//                         className="h-60"
//                       />
//                     </CardContent>
//                     <CardHeader>
//                       <CardTitle>{item.name}</CardTitle>
//                       <CardDescription>
//                         Change your password here. After saving, you'll be logged out.
//                       </CardDescription>
//                     </CardHeader>
//                     <CardFooter className="space-y-2 flex flex-col">
//                       <CardDescription>GHC {item.price}</CardDescription>
//                     </CardFooter>
//                   </Card>
//                 ))}
//             </div>
//           </TabsContent>
//         </Tabs>
//       </div>
//       {open && (
//         <div className="pt-16">
//           <Card className="border w-[400px] p-4">
//             <div className="flex justify-end">
//               <IoMdClose onClick={handleCancelOrder} />
//             </div>
//             <h2 className="text-lg flex justify-center font-bold">Jasglynn Bar</h2>
//             {selectedItems.length === 0 ? (
//               <p>No items selected</p>
//             ) : (
//               <>
//                 <div className="py-4 flex justify-center">#orderId</div>
//                 <div className="text-xs font-semibold flex justify-between">
//                   <p>Item</p>
//                   <p>Qty</p>
//                   <p>Amt</p>
//                 </div>
//                 <ul className="mb-2">
//                   {selectedItems.map((item, index) => (
//                     <li key={index} className="flex justify-between">
//                       <div className="flex items-center">{item.name}</div>
//                       <div className="flex space-x-2">
//                         <Button
//                           variant="outline"
//                           size="sm"
//                           onClick={() => handleDecreaseQuantity(item.id)}
//                         >
//                           -
//                         </Button>
//                         <div className="flex items-center">x{item.quantity || 1}</div>
//                         <Button
//                           variant="outline"
//                           size="sm"
//                           onClick={() => handleIncreaseQuantity(item.id)}
//                         >
//                           +
//                         </Button>
//                       </div>
//                       <div className="flex items-center">
//                         GHC {(item.price * (item.quantity || 1)).toFixed(2)}
//                       </div>
//                     </li>
//                   ))}
//                 </ul>
//                 <div className="flex justify-between font-semibold border-t pt-2">
//                   <span>Service Fee</span>
//                   <span>GHC {serviceFee.toFixed(2)}</span>
//                 </div>
//                 <div className="flex justify-between font-bold border-t pt-2">
//                   <span>Total</span>
//                   <span>GHC {total.toFixed(2)}</span>
//                 </div>
//                 <div className="flex justify-between w-full">
//                   <Button onClick={handleSubmitOrder} className="mt-4">
//                     Save Order
//                   </Button>
//                   <Button onClick={() => handleCheckout(false)} className="mt-4">
//                     Proceed to CheckOut
//                   </Button>
//                 </div>
//               </>
//             )}
//           </Card>
//         </div>
//       )}
//       {openEditOrder && (
//         <div className="pt-16">
//           <Card className="border w-[400px] p-4">
//             <div className="flex justify-end">
//               <IoMdClose onClick={toggleEditOrder} />
//             </div>
//             <h2 className="text-lg flex justify-center font-bold">Jasglynn Bar</h2>
//             {selectedEditedItemId ? (
//               <>
//                 <div className="py-4 flex justify-center">#{selectedEditedItemId.order_id}</div>
//                 <div className="py-4 flex justify-start">
//                   <span className="text-xs font-semibold capitalize flex space-x-2 items-center pr-3">
//                     name:
//                   </span>
//                   <span className="flex item-center font-bold">
//                     {selectedEditedItemId.customer_name}
//                   </span>
//                 </div>
//                 <div className="text-xs font-semibold flex justify-between">
//                   <p>Item</p>
//                   <p>Qty</p>
//                   <p>Amt</p>
//                 </div>
//                 <ul>
//                   {parseOrderItems(selectedEditedItemId.items || "").map((item, index) => (
//                     <li key={`existing-${index}`} className="flex justify-between">
//                       <div className="flex items-center">{item.name}</div>
//                       <div className="flex space-x-2">
//                         <Button
//                           variant="outline"
//                           size="sm"
//                           onClick={() => handleDecreaseQuantityExisting(index)}
//                         >
//                           -
//                         </Button>
//                         <div className="flex items-center">x{item.quantity}</div>
//                         <Button
//                           variant="outline"
//                           size="sm"
//                           onClick={() => handleIncreaseQuantityExisting(index)}
//                         >
//                           +
//                         </Button>
//                       </div>
//                       <div className="flex items-center">
//                         GHC {(getItemPrice(item.name) * item.quantity).toFixed(2)}
//                       </div>
//                     </li>
//                   ))}
//                   {selectedItems.map((item, index) => (
//                     <li key={`new-${index}`} className="flex justify-between">
//                       <div className="flex items-center">{item.name}</div>
//                       <div className="flex space-x-2">
//                         <Button
//                           variant="outline"
//                           size="sm"
//                           onClick={() => handleDecreaseQuantity(item.id)}
//                         >
//                           -
//                         </Button>
//                         <div className="flex items-center">x{item.quantity || 1}</div>
//                         <Button
//                           variant="outline"
//                           size="sm"
//                           onClick={() => handleIncreaseQuantity(item.id)}
//                         >
//                           +
//                         </Button>
//                       </div>
//                       <div className="flex items-center">
//                         GHC {(item.price * (item.quantity || 1)).toFixed(2)}
//                       </div>
//                     </li>
//                   ))}
//                 </ul>
//                 <div className="flex justify-between font-semibold border-t pt-2">
//                   <span>Service Fee</span>
//                   <span>GHC {serviceFee.toFixed(2)}</span>
//                 </div>
//                 <div className="flex justify-between font-bold border-t pt-2">
//                   <span>Total</span>
//                   <span>
//                     GHC{" "}
//                     {[
//                       ...parseOrderItems(selectedEditedItemId.items || "").map(
//                         (item) => getItemPrice(item.name) * item.quantity
//                       ),
//                       selectedItems.reduce(
//                         (sum, item) => sum + item.price * (item.quantity || 1),
//                         0
//                       ),
//                     ]
//                       .reduce((sum, val) => sum + val, 0)
//                       .toFixed(2)}
//                   </span>
//                 </div>
//                 <div className="flex justify-between w-full">
//                   <Button onClick={handleUpdateOrder} className="mt-4">
//                     Save Order
//                   </Button>
//                   <Button onClick={() => handleCheckout(true)} className="mt-4">
//                     Proceed to CheckOut
//                   </Button>
//                 </div>
//               </>
//             ) : (
//               <p>No order selected</p>
//             )}
//           </Card>
//         </div>
//       )}
//     </div>
//   );
// }