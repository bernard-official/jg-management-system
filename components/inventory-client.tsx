"use client";

import React, { useContext, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { InventoryContext } from "@/context/inventory-context";

export const InventoryClient = () => {
  const { inventory, restockHistory, addProduct, restockItem } =
    useContext(InventoryContext)!;
  const [restockQuantities, setRestockQuantities] = useState<{
    [key: number]: number;
  }>({});
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    category: "",
    description: "",
    initial_stock: "",
  });
  const [error, setError] = useState<string | null>(null);

  const handleRestock = async (menu_item_id: number) => {
    const quantity = restockQuantities[menu_item_id] || 0;
    if (quantity <= 0) {
      setError("Restock quantity must be greater than 0");
      return;
    }
    try {
      await restockItem(menu_item_id, quantity);
      setRestockQuantities((prev) => ({ ...prev, [menu_item_id]: 0 }));
      console.log(`Restocked item ${menu_item_id} successfully`);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to restock item");
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addProduct({
        name: newProduct.name,
        price: Number(newProduct.price),
        category: newProduct.category,
        description: newProduct.description || undefined,
        initial_stock: Number(newProduct.initial_stock),
      });
      console.log("Product added successfully");
      setNewProduct({
        name: "",
        price: "",
        category: "",
        description: "",
        initial_stock: "",
      });
      setError(null);
    } catch (err: any) {
      setError(err.message || "Error adding product");
    }
  };

  return (
    <div className="flex space-y-8 w-full">
      <div className="px-4 space-y-4 w-full">
        {error && <p className="text-red-500">{error}</p>}
        <div className="flex space-x-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="default">+ Add Stock</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Inventory Management</DialogTitle>
                <DialogDescription>
                  Add new products or manage stock levels for menu items
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddProduct} className="space-y-4 mb-4">
                <Input
                  placeholder="Product Name"
                  value={newProduct.name}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, name: e.target.value })
                  }
                  required
                />
                <Input
                  type="number"
                  placeholder="Price"
                  value={newProduct.price}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, price: e.target.value })
                  }
                  required
                />
                <Input
                  placeholder="Category"
                  value={newProduct.category}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, category: e.target.value })
                  }
                  required
                />
                <Input
                  placeholder="Description (optional)"
                  value={newProduct.description}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      description: e.target.value,
                    })
                  }
                />
                <Input
                  type="number"
                  placeholder="Initial Stock"
                  value={newProduct.initial_stock}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      initial_stock: e.target.value,
                    })
                  }
                  required
                />
                <Button type="submit">Add New Product</Button>
              </form>
            </DialogContent>
          </Dialog>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">View Restock History</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Restock History</DialogTitle>
                <DialogDescription>
                  View past restock events for menu items
                </DialogDescription>
              </DialogHeader>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Staff</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {restockHistory.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>
                        {inventory.find(
                          (i) => i.menu_item_id === record.menu_item_id
                        )?.menu_item_name || "Unknown"}
                      </TableCell>
                      <TableCell>{record.quantity}</TableCell>
                      <TableCell>
                        {new Date(record.restocked_at).toLocaleString()}
                      </TableCell>
                      {/* <TableCell>{record.created_by || "System"}</TableCell> */}
                      <TableCell>{record.created_by}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </DialogContent>
          </Dialog>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Stock</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Low Stock Threshold</TableHead>
              <TableHead>Restock</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inventory.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.menu_item_name}</TableCell>
                <TableCell>
                  {item.stock_quantity}
                  {item.stock_quantity <= item.low_stock_threshold && (
                    <span className="text-red-500 ml-2">(Low Stock)</span>
                  )}
                </TableCell>
                <TableCell>{item.low_stock_threshold}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Input
                      type="number"
                      min="0"
                      value={restockQuantities[item.menu_item_id] || ""}
                      onChange={(e) =>
                        setRestockQuantities((prev) => ({
                          ...prev,
                          [item.menu_item_id]: Number(e.target.value),
                        }))
                      }
                      placeholder="Qty"
                      className="w-20"
                    />
                    <Button
                      onClick={() => handleRestock(item.menu_item_id)}
                      size="sm"
                    >
                      Restock
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
