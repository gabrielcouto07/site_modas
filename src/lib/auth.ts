import { PrismaAdapter } from "@auth/prisma-adapter";
import { Role } from "@prisma/client";
import { compare } from "bcryptjs";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Resend from "next-auth/providers/resend";
import { z } from "zod";
import { env } from "./env";
import { prisma } from "./prisma";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  trustHost: env.authTrustHost,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/checkout/identificacao",
  },
  providers: [
    Credentials({
      name: "Credenciais",
      credentials: {
        email: {},
        password: {},
      },
      async authorize(rawCredentials) {
        const parsed = credentialsSchema.safeParse(rawCredentials);
        if (!parsed.success) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: parsed.data.email },
        });

        if (!user?.passwordHash) {
          return null;
        }

        const passwordMatches = await compare(parsed.data.password, user.passwordHash);
        if (!passwordMatches) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
    Resend({
      from: env.RESEND_FROM_EMAIL,
      apiKey: env.RESEND_API_KEY,
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token["role"] = "role" in user ? user["role"] : Role.USER;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? "";
        session.user.role = (token["role"] as Role | undefined) ?? Role.USER;
      }
      return session;
    },
    async authorized({ auth, request }) {
      const path = request.nextUrl.pathname;

      if (path.startsWith("/admin")) {
        return auth?.user?.role === Role.ADMIN;
      }

      // Require authentication for /conta pages (redirects to signIn page if false)
      if (path.startsWith("/conta")) {
        return !!auth?.user;
      }

      return true;
    },
  },
});

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      role: Role;
    };
  }

  interface User {
    role: Role;
  }
}
