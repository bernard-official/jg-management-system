import Link from "next/link";
import React from "react";
import { UsersClient } from "@/components/usersClient";
// import { users } from "./actions";
// import { handleRoleUpdate } from "./actions";

export default function page() {
   
  return (
    <div className="flex flex-col space-y-8 p-4">
      {/* <span className="text-red-500 ">Dashboard Coming Soon !!!</span>
       <Link href={"/restaurant"}>menu</Link> */}
      <h1 className="text-xl font-bold">Admin Dashboard</h1>
      <Link href="/restaurant" className="text-blue-500 hover:underline">
        Back to Restaurant
      </Link>
      <UsersClient />

    </div>
  );
}
