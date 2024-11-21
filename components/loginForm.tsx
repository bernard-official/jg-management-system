import React, { useActionState } from "react";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { login } from "@/actions/actions";

const LoginForm = () => {
 const [state, action] = useActionState(login, null);

  return (
    <>
      <Card className="p-8  w-[400px] md:w-1/4 .h-[60vh] border border-red-500 flex flex-col justify-center">
        <form className="space-y-8" action={action}>
          <span>JASGLYNN</span>
          <Input placeholder="name" type="name" />
          {state?.errors?.name && <span>{state.errors.name}</span>}
          <Input placeholder="example@email.com" type="email" />
          {state?.errors?.email && <span>{state.errors.email}</span>}
          <Input placeholder="password" type="password" />
          {state?.errors?.password && <span>{state.errors.password}</span>}

          <Button>Login</Button>
        </form>
      </Card>
    </>
  );
};

export default LoginForm;
