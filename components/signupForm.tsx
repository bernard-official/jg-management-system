"use client";
import React, { useActionState } from "react";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { signup } from "@/actions/actions";

export const SignUpForm = () => {
  const [state, action, pending] = useActionState(signup, undefined);

  return (
    <>
      <Card className="p-8  w-[400px] md:w-1/4 .h-[60vh] border border-red-500 flex flex-col justify-center">
        <form className="space-y-8" action={action}>
          <span>JASGLYNN</span>
          {/* {state?.errors && (
            <p className="mt-2 text-sm text-red-400">{state.errorsMessage}</p>
          )} */}

          <div>
          <Input placeholder="name" type="name" />
          {state?.errors?.name && (
            <p className="text-sm text-red-500">{state.errors.name}</p>
          )}
          </div>
          <div>

          <Input placeholder="example@email.com" />
          {state?.errors?.email && (
            <p className="text-sm text-red-500">{state.errors.email}</p>
          )}
          </div>
          <div>

          <Input placeholder="password" type="password" />
          {state?.errors?.password && (
            <div className="text-sm text-red-500">
              <p>Password must:</p>
              <ul>
                {state.errors.password.map((error) => (
                  <li key={error}>- {error}</li>
                ))}
              </ul>
            </div>
          )}
          </div>

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
