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
import { Command, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { debounce } from "lodash";
import { supabase } from "@/utils/supabase/clients";
import { MenuItem } from "@/lib/utils";
import { Order } from "@/context/order-context";
import { InventoryItem, RestockHistory } from "@/context/inventory-context";

export default function Search({
  open,
  onOpenChange,
  handleItemClick, // Must match the prop name passed
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  handleItemClick: (item: MenuItem) => void;
}) {
  const [orderResults, setOrderResults] = useState<Order[]>([]);
  const [restockResults, setRestockResults] = useState<RestockHistory[]>([]);
  const [inventoryResults, setInventoryResults] = useState<InventoryItem[]>([]);
  const [menuResults, setMenuResults] = useState<MenuItem[]>([]);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  // Debounced search
  const search = useCallback(
    debounce(async (value: string) => {
      if (!value.trim()) {
        setOrderResults([]);
        setRestockResults([]);
        setInventoryResults([]);
        setMenuResults([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      // Verify authentication
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        console.error("Auth error: No user logged in", authError);
        setIsLoading(false);
        return;
      }
      console.log("Authenticated user:", user.id, user.email);

      // Search orders
      // .or(
      //   `order_id::bigint.ilike.%${value}%,customer_name.ilike.%${value}%,status::text.ilike.%${value}%,items.ilike.%${value}%`
      // );
      // .or(
      //   `customer_name.ilike.%${value}%,order_id::text.ilike.%${value}%,status.ilike.%${value}%`
      // );
      const { data: orders, error: orderError } = await supabase
      .from("orders")
      .select("*")
      .ilike("customer_name", `%${value}%`)
      if (orderError) {
        console.error("Order search error:", orderError.message || orderError);
      } else {
        setOrderResults(orders || []);
      }
      
      // Search restock history
      // .or(`staff_name.ilike.%${value}%,menu.name.ilike.%${value}%`);
      const { data: restock, error: restockError } = await supabase
      .from("restock_history")
      .select("*, menu!inner(name)")
      .ilike("staff_name", `%${value}%`)
      if (restockError) {
        console.error("Restock search error:", restockError.message || restockError);
      } else {
        setRestockResults(restock || []);
      }


      const { data: inventory, error: inventoryError } = await supabase
      .from("inventory")
      .select("*, menu!inner(name)")
      .ilike("", `%${value}%`)
      if (inventoryError) {
        console.error("Restock search error:", inventoryError.message || inventoryError);
      } else {
        setRestockResults(inventory || []);
      }

      // Search menu
      const { data: menu, error: menuError } = await supabase
        .from("menu")
        .select("*")
        .ilike("name", `%${value}%`);
      if (menuError) {
        console.error("Menu search error:", menuError.message || menuError);
      } else {
        setMenuResults(menu || []);
      }

      setIsLoading(false);
    }, 300),
    []
  );

  // Update query and trigger search
  const handleChange = (value: string) => {
    setQuery(value);
    search(value);
  };

  // Focus input when modal opens
  useEffect(() => {
    if (open && searchRef.current) {
      searchRef.current.focus();
    }
  }, [open]);

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

  // Dispatch event to add menu item to order
  const handleMenuSelect = (item: MenuItem) => {
    handleItemClick(item);
    onOpenChange(false);
    setQuery("");
  };

  // Dispatch event to open existing order
  const handleOrderSelect = (order: Order) => {
    console.log("Selected order:", order);
    window.dispatchEvent(
      new CustomEvent("openExistingOrder", { detail: order.id })
    );
    onOpenChange(false);
    setQuery("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] ">
        <DialogHeader>
          <DialogTitle>Search</DialogTitle>
        </DialogHeader>
        <Command>
          <Input
            ref={searchRef}
            placeholder="Search orders, restock history, or menu items 👀"
            value={query}
            onChange={(e) => handleChange(e.target.value)}
            className=" w-full"
            aria-label="Search orders, restock history, or menu items"
            />           
            <div className="max-h-[60vh]  overflow-y-auto">
          <CommandEmpty>{isLoading ? "Searching..." : "No results found."}</CommandEmpty>
          <CommandGroup heading="Menu Items">
            {menuResults.map((item) => (
              <CommandItem
              key={item.id}
                onSelect={() => handleMenuSelect(item)}
                >
                {item.name} - GHC {item.price.toFixed(2)} ({item.category})
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandGroup heading="Orders">
            {orderResults.map((order) => (
              <CommandItem
              key={order.id}
              onSelect={() => handleOrderSelect(order)}
              >
                Order #{order.order_id} - {order.customer_name} ({order.status})
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandGroup heading="Restock History">
            {restockResults.map((record) => (
              <CommandItem
                key={record.id}
                onSelect={() => {
                  console.log("Selected restock:", record);
                  onOpenChange(false);
                  setQuery("");
                }}
              >
                {record.menu_item_id} - {record.quantity} by {record.staff_name}
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandGroup heading="inventory list">
            {inventoryResults.map((stock) => (
              <CommandItem
              key={stock.id}
              onSelect={() => {
                console.log("Selected restock:", stock);
                onOpenChange(false);
                setQuery("");
              }}
              >
                {stock.menu_item_name} - {stock.stock_quantity} in stock
              </CommandItem>
            ))}
          </CommandGroup>
        </div>
        </Command>
      </DialogContent>
    </Dialog>
  );
}