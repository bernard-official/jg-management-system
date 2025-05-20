// 'use client'
import { signOut } from "@/actions/actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { createClient } from "@/utils/supabase/server";
import { ProfileSignOut } from "./profileSignOut";
// import { supabase } from "@/utils/supabase/clients";

export async function Profile() {
  const supabase = await createClient();

  const user = (await supabase.auth.getUser()).data.user;
  // const {
  //     data: { user },
  // } = await supabase.auth.getUser();

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>JG</AvatarFallback>
        </Avatar>
      </HoverCardTrigger>
      <HoverCardContent className=" w-80">
        <div className=" flex flex-col justify-center mt-4 space-x-4">
          <div className="flex justify-center">
            <Avatar className="h-20 w-20 ">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>JG</AvatarFallback>
            </Avatar>
          </div>
          <div className="flex flex-col justify-center">
            <h3 className="text-lg font-semibold">{user?.user_metadata.display_name}</h3>
            <h3 className=" text-muted-foreground text-sm font-semibold">{user?.email}</h3>
          </div>
            <hr className="border-t my-1 " />
          <div className="space-y-3">
            <h5 className=" cursor-pointer">Settings</h5>
            <h5 className=" cursor-pointer" onClick={signOut}>
              Sign out
            </h5>
            <ProfileSignOut />
            <hr className="border-t my-1 " />
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
