
// "use client";
// import React, { useState, useEffect } from "react";
// import { createClient } from "@/lib/supabase/server";
// import { Button } from "@/components/ui/button";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";

// import Link from "next/link";
// import { updateUserRole } from "@/app/actions";
// import { useToast } from "@/hooks/use-toast";

// interface User {
//   id: string;
//   email: string | null;
//   role: "waiter" | "manager";
//   created_at: string;
// }

// export default function Dashboard() {
//   const [users, setUsers] = useState<User[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const { toast } = useToast();

//   // Fetch users on mount
//   useEffect(() => {
//     async function fetchUsers() {
//       try {
//         const supabase = await createClient();
//         const { data, error } = await supabase
//           .from("users")
//           .select("id, role, created_at, auth.users(email)")
//           .order("created_at", { ascending: false });

//         if (error) throw error;

//         const formattedUsers = data.map((user) => ({
//           id: user.id,
//           email: user.auth?.users?.email || "Unknown",
//           role: user.role,
//           created_at: new Date(user.created_at).toLocaleDateString(),
//         }));

//         setUsers(formattedUsers);
//         setLoading(false);
//       } catch (err: any) {
//         setError(err.message || "Failed to fetch users");
//         setLoading(false);
//         toast({
//           title: "Error",
//           description: err.message || "Failed to fetch users",
//           variant: "destructive",
//         });
//       }
//     }
//     fetchUsers();
//   }, [toast]);

//   // Handle role update
//   const handleRoleUpdate = async (userId: string, newRole: "waiter" | "manager") => {
//     try {
//       await updateUserRole(userId, newRole);
//       setUsers((prev) =>
//         prev.map((user) =>
//           user.id === userId ? { ...user, role: newRole } : user
//         )
//       );
//       toast({
//         title: "Success",
//         description: `User role updated to ${newRole}`,
//       });
//     } catch (err: any) {
//       toast({
//         title: "Error",
//         description: err.message || "Failed to update role",
//         variant: "destructive",
//       });
//     }
//   };

//   return (
//     <div className="flex flex-col space-y-8 p-4">
//       <h1 className="text-xl font-bold">Admin Dashboard</h1>
//       <Link href="/restaurant" className="text-blue-500 hover:underline">
//         Back to Restaurant
//       </Link>
//       {error && <p className="text-red-500">{error}</p>}
//       {loading ? (
//         <p>Loading users...</p>
//       ) : users.length === 0 ? (
//         <p>No users found.</p>
//       ) : (
//         <div className="overflow-x-auto">
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead>Email</TableHead>
//                 <TableHead>Role</TableHead>
//                 <TableHead>Joined</TableHead>
//                 <TableHead>Actions</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {users.map((user) => (
//                 <TableRow key={user.id}>
//                   <TableCell>{user.email}</TableCell>
//                   <TableCell>{user.role}</TableCell>
//                   <TableCell>{user.created_at}</TableCell>
//                   <TableCell>
//                     {user.role === "waiter" ? (
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         onClick={() => handleRoleUpdate(user.id, "manager")}
//                       >
//                         Promote to Manager
//                       </Button>
//                     ) : (
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         onClick={() => handleRoleUpdate(user.id, "waiter")}
//                       >
//                         Demote to Waiter
//                       </Button>
//                     )}
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </div>
//       )}
//     </div>
//   );
// }




// "use client";
// import { User } from "@/actions/actions";
// import { UsersClient } from "@/components/usersClient";
// import { toast, useToast } from "@/hooks/use-toast";
// import { supabase } from "@/lib/supabase/clients";
// import { Users } from "lucide-react";
// import Link from "next/link";
// import React, { useEffect, useState } from "react";

// const page = () => {
  // const [users, setUsers] = useState<User[] | null>([]);
  // const [error, setError] = useState<string | null>(null);
  // const { toast } = useToast();

  // useEffect(() => {
  //   const fetchUsers = async () => {
  //     try {
  //       const { data, error } = await supabase
  //         .from("users")
  //         .select("*")
  //         .order("created_at", { ascending: false });

  //         if (error) throw error;
  //         console.log(data)

  //         const formattedUsers = data.map((user)=>(
  //           {
  //             id: user.id,
  //             role: user.role
  //           }  
  //         ))
  //     } catch (error) {}
  //   };
  // }, [toast]);

//   return (
//     <div className="flex flex-col space-y-8 p-4">
//       {/* <span className="text-red-500 ">Dashboard Coming Soon !!!</span>
//       <Link href={"/restaurant"}>menu</Link> */}
//       <h1 className="text-xl font-bold">Dashboard</h1>
//       <Link href="/restaurant" className="text-blue-500 hover:underline">
//         Back to Restaurant
//       </Link>
//       {/* <UsersClient /> */}
//     </div>
//   );
// };

// export default page;






// import { User } from "@/actions/actions";
// import { UsersClient } from "@/components/usersClient";
// import { toast, useToast } from "@/hooks/use-toast";
// import { supabase } from "@/lib/supabase/clients";
// import { Users } from "lucide-react";
// import Link from "next/link";
// import React, { useEffect, useState } from "react";

// const page = () => {
//   const [users, setUsers] = useState<User[] | null>([]);
//   const [error, setError] = useState<string | null>(null);
//   const { toast } = useToast();

//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const { data, error } = await supabase
//           .from("users")
//           .select("*")
//           .order("created_at", { ascending: false });

//           if (error) throw error;
//           console.log(data)

//           const formattedUsers = data.map((user)=>(
//             {
//               id: user.id,
//               role: user.role
//             }  
//           ))
//       } catch (error) {}
//     };
//   }, [toast]);

//   return (
//     <div className="flex flex-col space-y-8 p-4">
//       {/* <span className="text-red-500 ">Dashboard Coming Soon !!!</span>
//       <Link href={"/restaurant"}>menu</Link> */}
//       <h1 className="text-xl font-bold">Dashboard</h1>
//       <Link href="/restaurant" className="text-blue-500 hover:underline">
//         Back to Restaurant
//       </Link>
//       <UsersClient />
//     </div>
//   );
// };

// export default page;
