import { signIn, signUp } from "@/actions/actions";
// import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import React from "react";
import { SubmitButton } from "./submit-button";

// const Login = ({ searchParams }: { searchParams: { message: string } }) => {
const Login = () => {
  return (
    <div className="flex min-h-screen justify-center items-center  ">
      {/* <LoginForm /> */}
      {/* <SignUpForm /> */}
      <Card className="p-8  w-[400px] md:w-1/4 .h-[60vh] border  flex flex-col justify-center">
        <form className="space-y-8">
          <div className="flex justify-center">

          <span className="text-2xl font-bold"> JASGLYNN</span>
          </div>
          <div>
            <Input placeholder="example@email.com" name="email" />
          </div>

          <div>
            <Input placeholder="password" type="password" name="password" />
          </div>

          <div className="flex flex-col space-y-4">
            {/* <Button formAction={signIn} >Log in</Button>
          
          <Button formAction={signUp}>Sign up</Button> */}

            <SubmitButton
              formAction={signIn}
              // className="bg-green-700 rounded-md px-4 py-2 text-foreground mb-2"
              pendingText="Signing In..."
            >
              Sign In
            </SubmitButton>
            <SubmitButton
              formAction={signUp}
              // className="border border-foreground/20 rounded-md px-4 py-2 text-foreground mb-2"
              pendingText="Signing Up..."
            >
              Sign Up
            </SubmitButton>
            {/* {searchParams?.message && (
          <p className="mt-4 p-4 bg-foreground/10 text-foreground text-center">
            {searchParams.message}
            </p>
        )} */}
          </div>
        </form>
        <div>
          <span className="font-thin underline text-sm">forgot Password?</span>
          </div>
      </Card>
    </div>
  );
};

export default Login;
