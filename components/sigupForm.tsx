"use client";
import React, { useActionState } from "react";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { signup } from "@/actions/actions";

export const SignUpForm = () => {
  const [state, action, pending] = useActionState(signup, null);

  return (
    <>
      <Card className="p-8  w-[400px] md:w-1/4 .h-[60vh] border border-red-500 flex flex-col justify-center">
        <form className="space-y-8" action={action}>
          <span>JASGLYNN</span>
          {state?.errorMessage && (
            <p className="mt-2 text-sm text-red-400">{state.errorMessage}</p>
          )}
          <Input placeholder="name" type="name" />
          {/* {state?.errors?.name._error && <span>{state.errors.name._error}</span>} */}
          {state?.errors?.name && <span>{state.errors.name._error}</span>}
          <Input placeholder="example@email.com" type="email" />
          {state?.errors?.email && <span>{state.errors.email._error}</span>}
          <Input placeholder="password" type="password" />
          {state?.errors?.password && <span>{state.errors.password._error}</span>}
         

          <div>
            <Button disabled={pending}>
              {pending ? "Submitting" : "Sign up"}
            </Button>
          </div>
        </form>
      </Card>
    </>
  );
};
