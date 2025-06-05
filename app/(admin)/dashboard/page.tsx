"use client";

import { useState, useEffect, useContext } from "react";
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
import { DashboardMetricsContext } from "@/context/metric-context";



export default function AdminDashboard() {
   const { metrics, isLoading } = useContext(DashboardMetricsContext)!;

  return (
    <div className="flex flex-col space-y-8 p-4 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <Button variant="outline" asChild>
          <Link href="/restaurant">Back to Restaurant</Link>
        </Button>
      </div>

      {/* Metrics Grid */}
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

      {/* Recent orders */}
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
              {metrics?.recentOrders.map((order) => ( 
              <TableRow key={order.id}> 
             <TableCell>#{order.order_id}</TableCell> 
               <TableCell>{order.customer_name || "N/A"}</TableCell> 
               <TableCell>{`GHC ${order.total.toFixed(2)}`}</TableCell> 
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
