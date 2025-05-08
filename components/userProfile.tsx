import { signOut } from "@/actions/actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { createClient } from "@/utils/supabase/server";

export async function Profile() {
  const supabase = await createClient();

  const user = (await supabase.auth.getUser()).data.user;
  // const {
  //     data: { user },
  // } = supabase.auth.getUser();

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>JG</AvatarFallback>
        </Avatar>
      </HoverCardTrigger>
      <HoverCardContent className=" w-80">
        <div className=" flex flex-col justify-center space-x-4">
          <div className="flex justify-center">
            <Avatar className="h-20 w-20 ">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>JG</AvatarFallback>
            </Avatar>
          </div>
          <div className="flex justify-center">
            {/* {user?.email } */}
            <h3 className="text-lg font-semibold">{user?.email}</h3>
            {/* <h3 className="text-lg font-semibold">Jasglynn</h3> */}
          </div>
          <div className="space-y-3.">
            <h5>Settings</h5>
            <hr className="border-t my-1 " />
            <h5 className=" cursor-pointer" onClick={signOut}>
              Sign out
            </h5>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
