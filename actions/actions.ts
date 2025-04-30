'use server';

import { createClient } from "@/lib/supabase/server";
import { encodedRedirect } from "@/utils/utils";
// import { FormState, SignupFormSchema } from "@/lib/zodSchema";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

// export interface User {  
//   id : number; 
//       role: string;
//       createdAt: Date; 
//   }

  export async function updateUserRole(userId: string, newRole: "waiter" | "manager") {
    const supabase = await createClient();
  
    // Verify the current user is a manager
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      throw new Error("Unauthorized: Please log in");
    }
  
    const { data: currentUser, error: userError } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();
  
    if (userError || currentUser?.role !== "manager") {
      throw new Error("Unauthorized: Only managers can update roles");
    }
  
    // Update the user's role
    const { error } = await supabase
      .from("users")
      .update({ role: newRole })
      .eq("id", userId);
  
    if (error) {
      throw new Error(error.message || "Failed to update user role");
    }
  
    return { success: true };
  }

export async function signIn(formData: FormData) {
    const supabase = await createClient()
  
    // type-casting here for convenience
    // in practice, you should validate your inputs
   
    // const data = {
    //   email: formData.get('email') as string,
    //   password: formData.get('password') as string,
    // }
    // console.log({data})
    const email = formData.get('email') as string
    const password = formData.get('password') as string  
    
    const { data,error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    console.log({data})
    if (error) {
      redirect('/error')
    }
  
    revalidatePath('/', 'layout')
    redirect('/dashboard')
  }
  


  export async function signUp(formData: FormData) {
    const supabase = await createClient()
  
    
    const   email = formData.get('email') as string;
    const password =  formData.get('password') as string;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      // options: {
      //   data: { role: "waiter" }, // Default role
      // },
    });

    if (error) {
      redirect('/login')
    }

    // Insert user role (default: waiter)
    await supabase
    .from("users")
    .insert({ id: data.user?.id, role: "waiter" });

    return { success: true };
  
    // revalidatePath('/', 'layout')
    redirect('/dashboard')
  }

  export const forgotPasswordAction = async (formData: FormData) => {
    const email = formData.get('email')?.toString();
    // console.log(email)
    const supabase = await createClient();
    const origin = (await headers()).get('origin')
    
    if (!email){
      return encodedRedirect("error","/forgot-password", "Email is required")
    }

    const {error} = await supabase.auth.resetPasswordForEmail(email, { redirectTo:`${origin}/reset-password?email=${email}` })
    
    
  }

  export const resetPasswordAction = async (formData: FormData) => {
    const supabase = await createClient();  
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;
  
    if (!password || !confirmPassword) {
      encodedRedirect(
        "error",
        "/protected/reset-password",
        "Password and confirm password are required",
      );
    }
  
    if (password !== confirmPassword) {
      encodedRedirect(
        "error",
        "/reset-password",
        "Passwords do not match",
      );
    }
  }

  export const signOut = async () => {
    const supabase = await createClient()
    await supabase.auth.signOut()
    return redirect('/login')
  }








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




