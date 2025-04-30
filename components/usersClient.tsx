'use client';
import React, { useContext } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from './ui/button';
import { UserContext } from '@/context/user-context';


export const UsersClient = () => {
    const { error, loading, users, handleRoleUpdate, } = useContext(UserContext)!;
  return (
    <>
    {error && <p className="text-red-500">{error}</p>}
    {loading ? (
        <p>Loading users...</p>
      ) : users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>{user.created_at}</TableCell>
                  <TableCell>
                    {user.role === "waiter" ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRoleUpdate(user.id, "manager")}
                      >
                        Promote to Manager
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRoleUpdate(user.id, "waiter")}
                      >
                        Demote to Waiter
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    
    {/* <div className="overflow-x-auto">
    <Table>
             <TableHeader>
               <TableRow>
                 <TableHead>Email</TableHead>
                 <TableHead>Role</TableHead>
                 <TableHead>Joined</TableHead>
                 <TableHead>Actions</TableHead>
               </TableRow>
             </TableHeader>
             <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>{user.created_at}</TableCell>
                  <TableCell>
                    {user.role === "waiter" ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRoleUpdate(user.id, "manager")}
                      >
                        Promote to Manager
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRoleUpdate(user.id, "waiter")}
                      >
                        Demote to Waiter
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
      </div> */}
    </>
  )
}
