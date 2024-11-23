"use server";

import db from "@/db/mongodb";
import { FormState, SignupFormSchema } from "@/lib/zodSchema";

// export const login = async (state, formData) => {

// }

export async function signup(
  state: FormState,
  formData: FormData
): Promise<FormState> {
  // 1. Validate form fields
  
  const validatedFields = SignupFormSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  // 2. Prepare data for insertion into database
  const { name, email, password } = validatedFields.data;

  //3. Check if email exist in the database
  const existingUser = await db.collection("users").findOne({ email });

  if (existingUser) {
    return {
      message: 'Email already exists, please use a different email or login.',
    };
  }
}
