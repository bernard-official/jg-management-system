"use client";
import React, { useContext} from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "./ui/button";
import { UserContext } from "@/context/user-context";
import { SubmitButton } from "@/app/login/submit-button";
import { signUp } from "@/actions/actions";
import { Label } from "./ui/label";
// import { Switch } from "./ui/switch";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";

export const UsersClient = () => {
  const { error, loading, users, handleRoleUpdate } = useContext(UserContext)!;
  // const [sign, setSign] = useState(false);
  // const toggleButton = () => {
  //   setSign(!sign);
  // };

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
                <TableHead>Full Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.full_name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phone}</TableCell>
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
      {/* <div className="flex min-h-screen justify-center items-center  "> */}
      <Card className="p-8 space-y-8 border  .flex .flex-col .justify-center">
        <CardTitle className=" "> User Signup</CardTitle>
        <CardContent className="p-0">
          <form className=" space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="first_name">First Name</Label>
                <Input placeholder="First Name" name="first_name" />
              </div>

              <div>
                <Label htmlFor="last_name">Last Name</Label>
                <Input placeholder="Last Name" name="last_name" />
              </div>
              <div>
                <Label htmlFor="phone ">Phone Number</Label>
                <Input
                  placeholder="Phone Number"
                  name="phone"
                  type="telephone"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input placeholder="example@email.com" name="email" />
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <Input placeholder="password" type="password" name="password" />
              </div>
              <div>
              <Label htmlFor="role">Role</Label>
              <RadioGroup name="role" defaultValue="waiter" required>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="waiter" id="waiter" />
                  <Label htmlFor="waiter">Waiter</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="manager" id="manager" />
                  <Label htmlFor="manager">Manager</Label>
                </div>
              </RadioGroup>
            </div>
              {/* <div>
                <Label htmlFor="Role">Role</Label>
                <div className="flex items-center space-x-2">
                  Waiter <Switch id="manager" name="manager" /> Manager
                  <span>{formData.get("role") === "on" ? "Manager" : "Waiter"}</span>
                </div>
              </div> */}
            </div>

            <div className="flex  space-x-2 justify-between items-center ">
              <SubmitButton
                className="w-1/2"
                formAction={signUp}
                pendingText="Signing Up..."
              >
                Sign Up
              </SubmitButton>
              <Button
                className="w-1/2"
                // onClick={}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </>
  );
};
