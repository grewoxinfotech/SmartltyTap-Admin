import type { NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "admin@smartlytap.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // TODO: Replace with actual Express API call
        // const res = await fetch("http://localhost:5000/api/v1/auth/login", { ... })
        // const user = await res.json()
        
        // Mock hardcoded admin for frontend development
        if (credentials.email === "admin@smartlytap.com" && credentials.password === "admin") {
          return {
            id: "1",
            email: "admin@smartlytap.com",
            name: "Super Admin",
            role: "ADMIN",
          };
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as User).role;
      }
      return token;
    },
  },
};
