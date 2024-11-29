'use server';

import { createClient } from "@/lib/supabase/server";
// import { FormState, SignupFormSchema } from "@/lib/zodSchema";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function signIn(formData: FormData) {
    const supabase = await createClient()
  
    // type-casting here for convenience
    // in practice, you should validate your inputs
    const data = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    }
  
    const { error } = await supabase.auth.signInWithPassword(data)
  
    if (error) {
      redirect('/error')
    }
  
    revalidatePath('/', 'layout')
    redirect('/protected')
  }
  



  export async function signUp(formData: FormData) {
    const supabase = await createClient()
  
    // type-casting here for convenience
    // in practice, you should validate your inputs
    const data = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    }
  
    const { error } = await supabase.auth.signUp(data)
  
    if (error) {
      redirect('/error')
    }
  
    revalidatePath('/', 'layout')
    redirect('/protected')
  }


  export const signOut = async () => {
    'use server'

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




