'use server'

import { SignUpFormSchema } from "@/lib/zodSchema"
import { error } from "console"
import { Sign } from "crypto"

// export const login = async (state, formData) => {
    
// }

export const signup = async (prevState: null, formData : FormData) => {

    //1. validate fields
    const validateSignUp = SignUpFormSchema.safeParse({
        name: formData.get('name'),
        email: formData.get('email'),
        password: formData.get('password')
    })
    
    // if (!validateSignUp.success){
    //     return {
    //         errors: validateSignUp.error.flatten().fieldErrors
    //     }
    // }
    if (!validateSignUp.success){
        const errors:{ [key: string]: { _error: string } } = {}

      
        validateSignUp.error.issues.forEach(issue => {
            errors[issue.path[0]] = {
                _error: issue.message
            }
        })
        
        return {
            errors,
            errorMessage: "Check sign up credentials again",
            
        }
    }
}