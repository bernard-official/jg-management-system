import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category?: string; // Optional field
}

// types/order.ts
export type OrderItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

export type Order = {
  id: string;
  customer_name: string;
  table_number?: number;
  items: OrderItem[];
  status: "pending" | "preparing" | "completed" | "cancelled";
  created_at: string;
  total: number;
};