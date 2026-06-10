import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { authApi } from "@/lib/api"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }
        try {
          const res = await authApi.login(
            credentials.email as string,
            credentials.password as string
          )
          if (res && res.token) {
            // Return user object matching the next-auth User interface
            return {
              id: res.tenantId,
              email: res.email,
              role: res.role,
              token: res.token,
              tenantId: res.tenantId
            }
          }
          return null
        } catch (error: any) {
          // Pass the specific backend error message back to the client
          throw new Error(error.message || "Invalid email or password.")
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = (user as any).token
        token.role = (user as any).role
        token.tenantId = (user as any).tenantId
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).token = token.accessToken as string;
        (session.user as any).role = token.role as string;
        (session.user as any).tenantId = token.tenantId as string;
      }
      return session
    }
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
})
