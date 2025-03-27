import { createClient } from "@/lib/supabase/server";
import React from "react";

const menu = async() => {
  const supabase = await createClient();
  const { data: menu, error } = await supabase.from("menu").select("*");

  if (error) {
    console.error("Error fetching menu:", error);
    return <div>Failed to load menu.</div>;
  }

  return <div>
    {menu.filter((item)=> item.category!== "Drinks").map((item) => (
      <div key={item.id}>
        <h2>{item.name}</h2>
        <p>{item.description}</p>
        <p>${item.price}</p>
      </div>
    ))}
    </div>;
};

export default menu;
