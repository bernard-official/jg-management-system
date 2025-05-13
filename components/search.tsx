// components/Search.tsx
"use client";
import { useState, useCallback, useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useContext } from "react";
import { OrderContext } from "@/context/order-context";
import { InventoryContext } from "@/context/inventory-context";
import { Command, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { debounce } from "lodash";

export default function Search({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const { orders } = useContext(OrderContext)!;
  const { restockHistory, menu } = useContext(InventoryContext)!;
  const [query, setQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  
  //Debounced  search
  const debouncedSetQuery = useCallback(
    debounce((value: string)=> {
      setQuery(value)
    }, 300),
    []
  );
  

  // Focus input when modal opens
  useEffect(() => {
    if (open && searchRef.current) {
      searchRef.current.focus();
    }
  }, [open]);

  // Filter orders and restock history
  const filteredOrders = orders
    .filter((order) => order.status !== "completed")
    .filter(
      (order) =>
        query &&
        (order.order_id.toString().includes(query) ||
          order.customer_name.toLowerCase().includes(query.toLowerCase()) ||
          order.status.toLowerCase().includes(query.toLowerCase()))
    );

  const filteredRestock = restockHistory.filter(
    (record) =>
      query &&
      (record.staff_name.toLowerCase().includes(query.toLowerCase()) ||
        menu
          .find((m) => m.id === record.menu_item_id)
          ?.name.toLowerCase()
          .includes(query.toLowerCase()))
  );

  // Handle keyboard shortcut (Cmd + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        onOpenChange(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Search</DialogTitle>
        </DialogHeader>
        <Command>
          <Input
            ref={searchRef}
            placeholder="What are you searching for? 👀"
            value={query}
            onChange={(e) => debouncedSetQuery(e.target.value)}
            className="w-full"
          />
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Orders">
            {filteredOrders.map((order) => (
              <CommandItem
                key={order.id}
                onSelect={() => {
                  // Handle order selection (e.g., navigate or open dialog)
                  console.log("Selected order:", order);
                  onOpenChange(false);
                  setQuery("");
                }}
              >
                Order #{order.order_id} - {order.customer_name} ({order.status})
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandGroup heading="Restock History">
            {filteredRestock.map((record) => (
              <CommandItem
                key={record.id}
                onSelect={() => {
                  console.log("Selected restock:", record);
                  onOpenChange(false);
                  setQuery("");
                }}
              >
                {menu.find((m) => m.id === record.menu_item_id)?.name} - {record.quantity} by {record.staff_name}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </DialogContent>
    </Dialog>
  );
}