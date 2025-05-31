"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Loader2, ShoppingCart, DollarSign, Clock, Users } from "lucide-react";
import { supabase } from "@/utils/supabase/clients";
import { startOfDay, endOfDay, format } from "date-fns";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { SectionCards } from "@/components/section-cards";
// import { sum } from "lodash";
import { Order } from "@/context/order-context";

// Define types for data
// interface Order {
//   id: number;
//   customer_name: string;
//   total: number;
//   status: string;
//   created_at: string;
//   staff_id: string;
// }

// interface UserProfile {
//   id: string;
//   display_name: string;
//   role: string;
// }

interface DashboardMetrics {
  totalOrdersToday: number;
  revenueToday: number;
  pendingOrders: number;
  activeEmployees: number;
  recentOrders: Order[];
  // topEmployees: { display_name: string; order_count: number }[];
}

export default function AdminDashboard() {
  const { toast } = useToast();
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch dashboard metrics from Supabase
  useEffect(() => {
    async function fetchMetrics() {
      try {
        
        const today = new Date();
        const startOfDayUTC = format(startOfDay(today), "yyyy-MM-dd'T'HH:mm:ss.SSSSSS'Z'");
        const endOfDayUTC = format(endOfDay(today), "yyyy-MM-dd'T'HH:mm:ss.SSSSSS'Z'");

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
        }else{
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

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Failed to load dashboard data.</p>
            <Button asChild className="mt-4">
              <Link href="/restaurant">Back to Restaurant</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-8 p-4 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <Button variant="outline" asChild>
          <Link href="/restaurant">Back to Restaurant</Link>
        </Button>
      </div>

      {/* Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orders Today</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {/* <div className="text-2xl font-bold">{metrics.totalOrdersToday}</div> */}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue Today</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {/* <div className="text-2xl font-bold">${metrics.revenueToday.toFixed(2)}</div> */}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Orders
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {/* <div className="text-2xl font-bold">{metrics.pendingOrders}</div> */}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Employees
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {/* <div className="text-2xl font-bold">{metrics.activeEmployees}</div> */}
          </CardContent>
        </Card>
      </div>
      <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 .py-4 md:gap-6 .md:py-6 ">
              <SectionCards />
              {/* <div className=".px-4 .lg:px-6"> */}
              <div className="">
                <ChartAreaInteractive />
              </div>
              {/* <DataTable data={data} /> */}
            </div>
          </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {metrics.recentOrders.map((order) => ( 
              <TableRow key={order.id}> 
             <TableCell>#{order.order_id}</TableCell> 
               <TableCell>{order.customer_name || "N/A"}</TableCell> 
               <TableCell>${order.total.toFixed(2)}</TableCell> 
               <TableCell className="capitalize">{order.status}</TableCell> 
               <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell> 
              </TableRow> 
               ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Top Employees Table */}
      <Card>
        <CardHeader>
          <CardTitle>Top Employees (Orders Today)</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Orders Processed</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* {metrics.topEmployees.length > 0 ? (
                metrics.topEmployees.map((employee, index) => (
                  <TableRow key={index}>
                    <TableCell>{employee full_name}</TableCell>
                    <TableCell>{employee.order_count}</TableCell>
                  </TableRow>
                ))
              ) : ( */}
              <TableRow>
                <TableCell colSpan={2} className="text-center">
                  No employee data available
                </TableCell>
              </TableRow>
              {/* )} */}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
