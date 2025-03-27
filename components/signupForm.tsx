"use client";
import React from "react";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { signIn, signUp} from "@/actions/actions";

export const SignUpForm = () => {
  // const [state, action, pending] = useActionState(signup, undefined);

  return (
    <>
      <Card className="p-8  w-[400px] md:w-1/4 .h-[60vh] border  flex flex-col justify-center">

        <form className="space-y-8">
          <span>JASGLYNN</span>
         
         
          <div>
          <Input placeholder="example@email.com" /> 
          </div>
         
          <div>
          <Input placeholder="password" type="password" />   
          </div>
          

          <div className="flex flex-col space-y-4">
          <Button formAction={signIn}>Log in</Button>
          <Button formAction={signUp}>Sign up</Button>
          </div>
        </form>
      </Card>
    </>
  );
};



// export const SignUpForm = () => {
//   const [state, action, pending] = useActionState(signup, undefined);

//   return (
//     <>
//       <Card className="p-8  w-[400px] md:w-1/4 .h-[60vh] border border-red-500 flex flex-col justify-center">
//         <form className="space-y-8" action={action}> */}
//          <span>JASGLYNN</span>
//           {state?.errors && (
//             <p className="mt-2 text-sm text-red-400">{state.errorsMessage}</p>
//           )}

//           <div>
//           <Input placeholder="name" type="name" name="name" />
//           {state?.errors?.name && (
//             <p className="text-sm text-red-500">{state.errors.name}</p>
//           )}
//           </div>
//           <div>

//           <Input placeholder="example@email.com" name="email" />
//           {state?.errors?.email && (
//             <p className="text-sm text-red-500">{state.errors.email}</p>
//           )}
//           </div>
//           <div>

//           <Input placeholder="password" type="password" name="password" />
//           {state?.errors?.password && (
//             <div className="text-sm text-red-500">
//               <p>Password must:</p>
//               <ul>
//                 {state.errors.password.map((error) => (
//                   <li key={error}>- {error}</li>
//                 ))}
//               </ul>
//             </div>
//           )}
//           </div>

//           <div>
//             <Button disabled={pending}>
//               {pending ? "Submitting" : "Sign up"}
//             </Button>
//           </div>
//         </form>
//       </Card>
//     </>
//   );
// };
