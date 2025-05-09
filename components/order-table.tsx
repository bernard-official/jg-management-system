import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RiAccountCircleLine } from "react-icons/ri";
import { GiTakeMyMoney } from "react-icons/gi";
import { PiContactlessPaymentThin } from "react-icons/pi";
import { LuCircleDotDashed } from "react-icons/lu";
import { AiOutlineTable } from "react-icons/ai";
import {  OrderContext } from "@/context/order-context";
import { CiCalendarDate } from "react-icons/ci";
import { GoStack } from "react-icons/go";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";
import { useContext } from "react";
// import { useContext } from "react";

// export function OrderTable({ orders }: { orders: Order }) {
export function OrderTable() {
  const { orders } = useContext(OrderContext)!;

  return (
    <>
    <div className="border rounded-md  max-h-[500px] overflow-auto ">
      <Table >
        <TableHeader className="sticky top-0 bg-background">
          <TableRow>
            <TableHead className="w-[100px]"># Order ID</TableHead>
            <TableHead>
              <div className="flex  flex-row items-center space-x-2">
                <RiAccountCircleLine />
                <h4>Name</h4>
              </div>
            </TableHead>
            <TableHead>
              <div className="flex  flex-row items-center space-x-2">
                <AiOutlineTable />
                <h4>Table No.</h4>
              </div>
            </TableHead>
            <TableHead>
              <div className="flex  flex-row items-center space-x-2">
                <GiTakeMyMoney />
                Amount
              </div>
            </TableHead>

            <TableHead>
              <div className="flex  flex-row items-center space-x-2">
                <LuCircleDotDashed />
                <h4>Status</h4>
              </div>
            </TableHead>
            <TableHead>
              <div className="flex  flex-row items-center space-x-2">
                <GoStack />
                <h4>Items</h4>
              </div>
            </TableHead>
            <TableHead>
              <div className="flex  flex-row items-center space-x-2">
                <CiCalendarDate />
                <h4>Order date</h4>
              </div>
            </TableHead>
            <TableHead>
              <div className="flex  flex-row items-center space-x-2">
                <PiContactlessPaymentThin />
                <h4>Payment</h4>
              </div>
            </TableHead>
            {/* <TableHead className="flex items-center space-x-2 "><HiOutlineCalendarDateRange />fulfilment</TableHead> */}
          </TableRow>
        </TableHeader>
        <TableBody className="overflow-auto">
          {orders.map((order) => {
            const statusColor = () => {
              switch (order.status) {
                case "pending":
                  return "orange";
                case "preparing":
                  return "blue";
                case "completed":
                  return "green";
                default:
                  return "red";
              }
            };
            return (
              <TableRow
                key={order.id}
                //   onClick={() => handleExistingOrders(order.id!)}
              >
                <TableCell className=".font-medium">{order.order_id}</TableCell>
                <TableCell>{order.customer_name}</TableCell>
                <TableCell>{order.table_number}</TableCell>
                <TableCell className=".text-right">GHC {order.total}</TableCell>
                <TableCell>
                  <p
                    className={`border rounded-md flex justify-center p-0 items-center border-${statusColor()}-500 text-${statusColor()}-500`}
                  >
                    {order.status}
                  </p>
                </TableCell>
                <TableCell className=".text-orange-500 .text-right">
                  <HoverCard>
                    <HoverCardTrigger>
                      {/* {order.items} */}
                      {/* {order.items.slice(0, order.items.length - 1).concat('...')}  */}
                      {order.items.slice(0, 20).concat("...")}
                    </HoverCardTrigger>
                    <HoverCardContent>{order.items}</HoverCardContent>
                  </HoverCard>
                </TableCell>
                <TableCell>{order.created_at}</TableCell>
                {/* <TableCell>Payment</TableCell>
              <TableCell>fulfillment</TableCell> */}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      </div>
    </>
  );
}
