
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { SubmitButton } from "../login/submit-button";
import { forgotPasswordAction } from "@/actions/actions";
import { FormMessage, Message } from "@/components/form-message";

export default async function ForgotPassword(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;
  return (
    <main className=" flex justify-center h-screen ">

      <form className="flex-1 flex flex-col  gap-2 text-foreground .h-auto [&>input]:mb-6 min-w-64 max-w-64 mx-auto my-auto space-y-8">
        <div>
          <h1 className="text-2xl font-medium">Reset Password</h1>
          <p className="text-sm text-secondary-foreground">
            Already have an account?{" "}
            <Link className="text-primary underline" href="/login">
              Sign in
            </Link>
          </p>
        </div>
        <div className="flex flex-col gap-2 [&>input]:mb-3 .mt-8  space-y-4">
          <div className="flex flex-col space-y-2">

          <Label htmlFor="email">Email</Label>
          <Input name="email" placeholder="you@example.com" required />
          </div>
          <SubmitButton formAction={forgotPasswordAction}>
            Reset Password
          </SubmitButton>
          <FormMessage message={searchParams} />
        </div>
      </form>

    </main>
  );
}
