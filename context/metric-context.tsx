"use client";
import { useToast } from "@/hooks/use-toast";
import React, { createContext, useEffect, useState } from "react";
import { Order } from "./order-context";
import { supabase } from "@/utils/supabase/clients";
import { startOfDay, endOfDay, format } from "date-fns";
import { Loader2 } from "lucide-react";

export interface DashboardMetricsContextType {
  metrics: DashboardMetrics | null;
  isLoading: boolean;
}

interface DashboardMetrics {
  totalOrdersToday: number;
  revenueToday: number;
  pendingOrders: number;
  activeEmployees: number;
  recentOrders: Order[];
  // topEmployees: { display_name: string; order_count: number }[];
}

export const DashboardMetricsContext =
  createContext<DashboardMetricsContextType | null>(null);

export const DashboardMetricsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  // const [metrics, setMetrics] = useState<DashboardMetricsContextType | null>(null);
  const { toast } = useToast();
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchMetrics() {
      try {
        const today = new Date();
        const startOfDayUTC = format(
          startOfDay(today),
          "yyyy-MM-dd'T'HH:mm:ss.SSSSSS'Z'"
        );
        const endOfDayUTC = format(
          endOfDay(today),
          "yyyy-MM-dd'T'HH:mm:ss.SSSSSS'Z'"
        );

        const { data: ordersToday, error: ordersError } = await supabase
          .from("orders")
          .select("*")
          .gte("created_at", startOfDayUTC)
          .lte("created_at", endOfDayUTC);

        if (ordersError) {
          console.error("Supabase orders error:", ordersError);
          throw ordersError;
        }
        console.log("ordersToday", ordersToday);

        // Get today's date range

        // Calculate metrics ---- data fetch produces result
        const totalOrdersToday = ordersToday.length;
        // console.log("totalOrdersToday", totalOrdersToday);
        const revenueToday = ordersToday.reduce(
          (sum, order) => sum + order.total,
          0
        );
        const pendingOrders = ordersToday.filter((order) =>
          ["pending"].includes(order.status)
        ).length;

        // Fetch active employees (users with manager or waiter role)
        const { data: profiles, error: profilesError } = await supabase
          .from("users") // Adjust to "auth.users" if not using a profiles table
          .select("id, full_name, role")
          .in("role", ["manager", "waiter"]);

        if (profilesError) throw profilesError;

        const activeEmployees = profiles.length;

        // Fetch recent orders (last 5)
        // .select("id, total, status, customer_name, created_at,staff_name")
        const { data: recentOrders, error: recentError } = await supabase
          .from("orders")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(5);

        if (recentError) {
          console.error("Supabase recent orders error:", recentError);
          throw recentError;
        } else {
          console.log("recentOrders", recentOrders);
        }

        // if (recentError) throw recentError;

        // Fetch top employees by order count
        // start_date: startOfDay,
        // end_date: endOfDay,
        const { data: topEmployeesData, error: topEmployeesError } =
          await supabase.rpc("get_top_employees", {
            start_date: startOfDayUTC,
            end_date: endOfDayUTC,
          });

        // if (topEmployeesError) throw topEmployeesError;
        if (!topEmployeesData || topEmployeesError) {
          console.error("Top employees error:", topEmployeesError);
          // throw new Error(`RPC failed: ${topEmployeesError.message}`);
        }

        // topEmployees: topEmployeesData || [],

        setMetrics({
          totalOrdersToday,
          revenueToday,
          pendingOrders,
          activeEmployees,
          recentOrders,
        });
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Failed to load dashboard data.";
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchMetrics();
  }, [toast]);

//   if (isLoading) {
//     return (
//       <div className="flex min-h-screen items-center justify-center">
//         <Loader2 className="h-8 w-8 animate-spin" />
//       </div>
//     );
//   }

  return (
    <DashboardMetricsContext.Provider
      value={{
        metrics,
        isLoading,
      }}
    >
      {children}
    </DashboardMetricsContext.Provider>
  );
};
