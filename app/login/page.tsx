"use client";
import { signIn, signUp } from "@/actions/actions";
// import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import { SubmitButton } from "./submit-button";
import Link from "next/link";

// const Login = ({ searchParams }: { searchParams: { message: string } }) => {

const Login = () => {
  const [sign, setSign] = useState(false);
  const toggleButton = () => {
    setSign(!sign);
  };

  return (
    <div className="flex min-h-screen justify-center items-center  ">
      {/* <LoginForm /> */}
      {/* <SignUpForm /> */}
      <Card className="p-8  w-[400px] md:w-1/4 .h-[60vh] border  flex flex-col justify-center">
        <form className="space-y-8">
          <div className="flex justify-center">
            <span className="text-2xl font-bold"> JASGLYNN</span>
          </div>
          {!sign ? (
            <span className=" text-sm ml-8">
              Don&apos;t have an account?{" "}
              <span onClick={toggleButton} className="underline hover:cursor-pointer hover:-translate-y-2">
                Sign Up
              </span>
            </span>
          ) : (
            <span className=" text-sm ml-8">
              Already have an account?{" "}
              <span onClick={toggleButton} className="underline  hover:cursor-pointer hover:-translate-y-2">
                Sign In
              </span>{" "}
            </span>
          )}

          <div>
            <Input placeholder="example@email.com" name="email" />
          </div>

          <div>
            <Input placeholder="password" type="password" name="password" />
          </div>

          <div className="flex flex-col space-y-4">
            {/* <Button formAction={signIn} >Log in</Button>
          
          <Button formAction={signUp}>Sign up</Button> */}

            {!sign ? (
              <SubmitButton formAction={signIn} pendingText="Signing In...">
                Sign In
              </SubmitButton>
            ) : (
              <SubmitButton formAction={signUp} pendingText="Signing Up...">
                Sign Up
              </SubmitButton>
            )}

            {/* {searchParams?.message && (
          <p className="mt-4 p-4 bg-foreground/10 text-foreground text-center">
            {searchParams.message}
            </p>
        )} */}
          </div>
        </form>
        <div>
          {!sign ?
          <Link href={"/forgot-password"}>
          <span className="font-thin underline text-sm">forgot Password?</span>
          </Link>:
          ''
          }
        </div>
      </Card>
    </div>
  );
};

export default Login;
