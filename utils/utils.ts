import { redirect } from "next/navigation"


export const encodedRedirect = (
 type: "error" | "success",
 path: string ,
 message: string 
) => {
    return redirect(`${path}?${type}=${encodeURIComponent(message)}`)
}


