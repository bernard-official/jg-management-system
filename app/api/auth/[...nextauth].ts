import type { NextApiRequest, NextApiResponse } from "next";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
    return await NextAuth(req, res, {
        providers: [
            CredentialsProvider({
              name: "Credentials",
              credentials: {
                username: { label: "Username", type: "text", placeholder: "jsmith" },
                password: { label: "Password", type: "password" }
              },
            //   async authorize(credentials, ) {
              async authorize(credentials, req) {
                // Add logic here to look up the user from the credentials supplied
                const user = { id: "1", name: "J Smith", email: "jsmith@example.com" }
          
                if (user) {
                  // Any object returned will be saved in `user` property of the JWT
                  return user
                } else {
                  // If you return null then an error will be displayed advising the user to check their details.
                  return null
          
                  // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
                }
              }
            })
          ]
    })
}