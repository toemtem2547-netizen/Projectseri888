import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.sub = user.id;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string;
        if (token.sub) {
          session.user.id = token.sub;
        }
      }
      return session;
    },
  },
  providers: [], // Add providers with Edge compatibility here if needed, else leave empty for middleware
} satisfies NextAuthConfig;
