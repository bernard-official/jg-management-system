import Link from "next/link";
import React from "react";



const page = () => {
  return (
    <div className="flex flex-col">
      <span>Dashboard</span>
      <Link href={"/restaurant"}>menu</Link>
    </div>
  );
};

export default page;
