"use client";
import { updateUserRole } from "@/actions/actions";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/utils/supabase/clients";
import React, { createContext, useContext, useEffect, useState } from "react";

//the user table from the database has id which is foreign key from the auth table and role. look into adding the name and email as foregn keys from the supabase Auth user table as well
export interface Users {
  id: string;
  name?: string;
  full_name: string;
  email?: string;
  role: string;
  phone: string;
  created_at?: string;
}

export interface UsersContextType {
  users: Users[];
  loading: boolean;
  error: string | null;
  fetchUsers: () => Promise<void>;
  handleRoleUpdate: (userId: string, newRole: "waiter" | "manager") => void;
}
export const UserContext = createContext<UsersContextType | null>(null);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [users, setUsers] = useState<Users[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Handle role update
  // const handleRoleUpdate = async (userId: string, newRole: "waiter" | "manager") => {
  //   try {
  //     await updateUserRole(userId, newRole);
  //     setUsers((prev) =>
  //       prev.map((user) =>
  //         user.id === userId ? { ...user, role: newRole } : user
  //       )
  //     );
  //     toast({
  //       title: "Success",
  //       description: `User role updated to ${newRole}`,
  //     });
  //   } catch (err: any) {
  //     toast({
  //       title: "Error",
  //       description: err.message || "Failed to update role",
  //       variant: "destructive",
  //     });
  //   }
  // };
  const handleRoleUpdate = async (
    userId: string,
    newRole: "waiter" | "manager"
  ) => {
    try {
      const response = await updateUserRole(userId, newRole);
      if (response.success) {
        setUsers((prev) =>
          prev.map((user) =>
            user.id === userId ? { ...user, role: newRole } : user
          )
        );
        toast({
          title: "Success",
          description: `User role updated to ${newRole}`,
        });
      }
    } catch (err: any) {
      console.error("Role update error:", err.message);
      toast({
        title: "Error",
        description: err.message || "Failed to update role",
        variant: "destructive",
      });
    }
  };

  const fetchUsers = async () => {
    // try {
    //   const { data, error } = await supabase.from("users").select("*");
    //   if (error) {
    //     console.log("Error fetching users", error);
    //   } else {
    //     const formattedUsers = data.map((user) => ({
    //       id: user.id,
    //       role: user.role,
    //       created_at: user.created_at,
    //       // email: user.email,
    //       // name: user.name
    //     }));
    //     setUsers(formattedUsers);
    //   }
    // } catch (error) {
    //   console.log("Error fetching users", error);
    // }

    try {
      // .select("*")
      const { data, error } = await supabase
        .from("users")
        .select("id, role, created_at, full_name, phone, email") //works now or i can just use * to get all
        .order("created_at", { ascending: false });
      if (error) {
        console.log("Error fetching users", error);
      } else {
        const formattedUsers = data.map((user) => ({
          id: user.id,
          email: user.email || "Unknown",
          role: user.role,
          full_name: user.full_name || "Unknown",
          phone: user.phone || "Unknown",
          created_at: new Date(user.created_at).toDateString(),
        }));

        setUsers(formattedUsers);
        setLoading(false);
      }
    } catch (err: any) {
      //   console.log("Error fetching users", error);
      setError(err.message || "Failed to fetch users");
      setLoading(false);
      toast({
        title: "Error",
        description: err.message || "Failed to fetch users",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchUsers();

    const usersChannel = supabase
      .channel("users")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "users" },
        () => fetchUsers()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(usersChannel);
    };
  }, []);

  return (
    <UserContext.Provider
      value={{
        users,
        loading,
        error,
        fetchUsers,
        handleRoleUpdate,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

// "use client";
// import { updateUserRole } from "@/actions/actions";
// import { useToast } from "@/hooks/use-toast";
// import { supabase } from "@/lib/supabase/clients";
// import React, {
//   createContext,
//   useContext,
//   useEffect,
//   useState,
// } from "react";

// //the user table from the database has id which is foreign key from the auth table and role. look into adding the name and email as foregn keys from the supabase Auth user table as well
// export interface Users {
//   id: string;
//   name?: string;
//   email?: string;
//   role: string;
//   created_at?: string;
// }

// export interface UsersContextType {
//   users: Users[];
//   loading: boolean;
//   error: string | null;
//   fetchUsers: () => Promise<void>;
//   handleRoleUpdate: (userId: string, newRole: "waiter" | "manager") => void;
// }
// export const UserContext = createContext<UsersContextType | null>(null);

// export const UserProvider = ({ children }: { children: React.ReactNode }) => {
//   const [users, setUsers] = useState<Users[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const { toast } = useToast();

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

//   const fetchUsers = async () => {
//     // try {
//     //   const { data, error } = await supabase.from("users").select("*");
//     //   if (error) {
//     //     console.log("Error fetching users", error);
//     //   } else {
//     //     const formattedUsers = data.map((user) => ({
//     //       id: user.id,
//     //       role: user.role,
//     //       created_at: user.created_at,
//     //       // email: user.email,
//     //       // name: user.name
//     //     }));
//     //     setUsers(formattedUsers);
//     //   }
//     // } catch (error) {
//     //   console.log("Error fetching users", error);
//     // }

//     try {
//     //   .select("id, role, created_at, auth.users(email)")
//       const { data, error } = await supabase
//       .from("users")
//       .select("*")
//       .order("created_at", { ascending: false });
//       if (error) {
//         console.log("Error fetching users", error);
//       } else {
//         const formattedUsers = data.map((user) => ({
//           id: user.id,
//           email: user.auth?.users?.email || "Unknown",
//           role: user.role,
//           created_at: new Date ( user.created_at).toDateString(),
//           // email: user.email,
//           // name: user.name
//         }));

//         setUsers(formattedUsers);
//         setLoading(false);
//       }
//     } catch (err: any) {
//     //   console.log("Error fetching users", error);
//       setError(err.message || "Failed to fetch users");
//       setLoading(false);
//       toast({
//        title: "Error",
//        description: err.message || "Failed to fetch users",
//        variant: "destructive",
//       });
//     }
//   };

//   useEffect(() => {
//     fetchUsers();

//     const usersChannel = supabase
//       .channel("users")
//       .on(
//         "postgres_changes",
//         { event: "INSERT", schema: "public", table: "users" },
//         () => fetchUsers()
//       )
//       .subscribe();

//     return () => {
//       supabase.removeChannel(usersChannel);
//     };
//   }, []);

//   return (
//     <UserContext.Provider
//       value={{
//         users,
//         loading,
//         error,
//         fetchUsers,
//         handleRoleUpdate,
//       }}
//     >
//       {children}
//     </UserContext.Provider>
//   );
// };
