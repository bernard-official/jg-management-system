import React from "react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { signOut } from "@/actions/actions";

export const ProfileSignOut = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <span className=" cursor-pointer">logout</span>
        {/* <Button variant="outline">Edit Profile</Button> */}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Are you sure you want to log out?
          </DialogDescription>
        </DialogHeader>
      
        <DialogFooter>
          <Button onClick={signOut}>Sign Out</Button>
          <Button >Cancel</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
