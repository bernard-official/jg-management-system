import { z } from "zod"

export const loginSchema = z.object({
    
    email: z.string().email(),
    password: z.string().min(8),
})

export const SignUpFormSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    email: z.string().min(1, 'Email is required').email('Invalid email address'),
    password: z.string().min(8, 'Invalid password'),
})