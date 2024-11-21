import LoginForm from "@/components/loginForm";
import { SignUpForm } from "@/components/sigupForm";
import React from "react";

const Page = () => {
  return (
    <div className="flex min-h-screen justify-center items-center border border-red-500  ">
      {/* <LoginForm /> */}
      <SignUpForm />
    </div>
  );
};

export default Page;
