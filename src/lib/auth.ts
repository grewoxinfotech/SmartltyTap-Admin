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
        const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
        const res = await fetch(`${base}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: credentials.email, password: credentials.password }),
        });
        const payload = await res.json();
        if (!res.ok || !payload?.ok || !payload?.data?.token || !payload?.data?.user) {
          return null;
        }
        return {
          id: payload.data.user.id,
          email: payload.data.user.email,
          name: payload.data.user.name,
          role: payload.data.user.role,
          accessToken: payload.data.token,
        } as User;
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.accessToken = token.accessToken as string;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as User).role;
        token.accessToken = (user as User & { accessToken?: string }).accessToken;
      }
      return token;
    },
  },
};
