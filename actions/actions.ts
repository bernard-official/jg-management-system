"use server";

import { createClient } from "@/utils/supabase/server";
import { encodedRedirect } from "@/utils/utils";
// import { FormState, SignupFormSchema } from "@/lib/zodSchema";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

// export async function updateUserRole(userId: string, newRole: "waiter" | "manager") {
//   const supabase = await createClient();

//   // Verify the current user is a manager
//   const { data: { user }, error: authError } = await supabase.auth.getUser();
//   if (authError || !user) {
//     throw new Error("Unauthorized: Please log in");
//   }

//   const { data: currentUser, error: userError } = await supabase
//     .from("users")
//     .select("role")
//     .eq("id", user.id)
//     .single();

//   if (userError || currentUser?.role !== "manager") {
//     throw new Error("Unauthorized: Only managers can update roles");
//   }

//   // Update the user's role
//   const { error } = await supabase
//     .from("users")
//     .update({ role: newRole })
//     .eq("id", userId);

//   if (error) {
//     throw new Error(error.message || "Failed to update user role");
//   }

//   return { success: true };
// }
export async function updateUserRole(
  userId: string,
  newRole: "waiter" | "manager"
) {
  const supabase = await createClient();

  // Verify the current user is authenticated
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    console.error("Auth error:", authError?.message);
    return encodedRedirect("error", "/login", "Please log in to update roles");
  }

  // Verify the current user is a manager
  const { data: currentUser, error: userError } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  if (userError || currentUser?.role !== "manager") {
    console.error("User error:", userError?.message || "Not a manager");
    return encodedRedirect(
      "error",
      "/dashboard",
      "Only managers can update roles"
    );
  }

  // Update the user's role
  const { error } = await supabase
    .from("users")
    .update({ role: newRole })
    .eq("id", userId);

  if (error) {
    console.error("Update error:", error.message);
    throw new Error(error.message || "Failed to update user role");
  }

  revalidatePath("/dashboard"); // Refresh dashboard data
  return { success: true };
}

export async function signIn(formData: FormData) {
  const supabase = await createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  console.log({ data });
  if (error) {
    redirect("/error");
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}


export async function signUp(formData: FormData) {
  const supabase = await createClient();
  //extract formadata
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const first_name = formData.get("first_name") as string;
  const last_name = formData.get("last_name") as string;
  const phone = formData.get("phone") as string;
  const role = formData.get("role") as string;

  // Validate role
  if (!["waiter", "manager"].includes(role)) {
    return encodedRedirect("error", "/login", "Invalid role selected");
  }

  // Create display_name
  const display_name = `${first_name} ${last_name}`.trim();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        display_name,
        phone,
      },
    },
  });
  if (error) {
    console.error("Auth signup error:", error.message);
    return encodedRedirect("error", "/login", error.message);
  }

  // Insert into users table
  const { error: userError } = await supabase
    .from("users")
    .insert({ id: data.user?.id, role, email, phone, full_name: display_name });

  if (userError) {
    console.error("User insert error:", userError.message);
    return encodedRedirect("error", "/login", userError.message);
  }

  revalidatePath("/dashboard");
  return redirect("/dashboard");
}

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  // console.log(email)
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  if (!email) {
    return encodedRedirect("error", "/forgot-password", "Email is required");
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/reset-password?email=${email}`,
  });
};

export const resetPasswordAction = async (formData: FormData) => {
  const supabase = await createClient();
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password and confirm password are required"
    );
  }

  if (password !== confirmPassword) {
    encodedRedirect("error", "/reset-password", "Passwords do not match");
  }
};

export const signOut = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/login");
};

// export async function signup(
//   state: FormState,
//   formData: FormData
// ): Promise<FormState> {

//   const supabase = await createClient();

//   // 1. Validate form fields

//   const data = SignupFormSchema.safeParse({
//     name: formData.get("name"),
//     email: formData.get("email"),
//     password: formData.get("password"),
//   });

//   const { error } = await supabase.auth.signUp(data)

//   if (error) {
//     redirect('/error')
//   }

//   revalidatePath('/', 'layout')
//   redirect('/')

// }

// export async function signup(
//   state: FormState,
//   formData: FormData
// ): Promise<FormState> {

// const supabase = await createClient();

//   // 1. Validate form fields

//   const validatedFields = SignupFormSchema.safeParse({
//     name: formData.get("name"),
//     email: formData.get("email"),
//     password: formData.get("password"),
//   });

//   // If any form fields are invalid, return early
//   if (!validatedFields.success) {
//     return {
//       errors: validatedFields.error.flatten().fieldErrors,
//     };
//   }

//   // 2. Prepare data for insertion into database
// //   const { name, email, password } = validatedFields.data;

//   const data = validatedFields.data;

// const { error } = await supabase.auth.signUp(data)

// if (error) {
//   redirect('/error')
// }

// revalidatePath('/', 'layout')
// redirect('/')
// }
