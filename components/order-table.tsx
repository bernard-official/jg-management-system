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
import { HiOutlineCalendarDateRange } from "react-icons/hi2";
import { LuCircleDotDashed } from "react-icons/lu";
import { AiOutlineTable } from "react-icons/ai";
import { Order } from "@/context/order-context";
import { CiCalendarDate } from "react-icons/ci";
import { GoStack } from "react-icons/go";
// import { useContext } from "react";

export function OrderTable({ orders }: { orders: Order }) {
  // const { orders } = useContext(OrderContext)

  return (
    <>
      <Table className="border">
        <TableHeader>
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
                <h4>Table number</h4>
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
        <TableBody>
          {orders.map((order: Order) => (
            <TableRow
              key={order.id}
              //   onClick={() => handleExistingOrders(order.id!)}
            >
              <TableCell className=".font-medium">{order.order_id}</TableCell>
              <TableCell>{order.customer_name}</TableCell>
              <TableCell>{order.table_number}</TableCell>
              <TableCell className=".text-right">GHC {order.total}</TableCell>
              <TableCell>{order.status}</TableCell>
              <TableCell className=".text-right">{order.item}</TableCell>
              <TableCell>{order.created_at}</TableCell>
              {/* <TableCell>Payment</TableCell>
              <TableCell>fulfillment</TableCell> */}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
