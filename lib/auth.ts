import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { db } from "./db";
import { compare } from "bcrypt";
import { getUserFromDatabase } from "./ActionUsers";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/sign-in",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "john@mail.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        const existingUser = await db.user.findUnique({
          where: { email: credentials?.email },
        });
        if (!existingUser) {
          return null;
        }

        const passwordMatch = await compare(
          credentials.password,
          existingUser.password,
        );
        if (!passwordMatch && existingUser.password !== credentials.password) {
          return null;
        }

        if (existingUser.emailVerified === false) {
          throw new Error("verify-code");
        }

        return {
          id: existingUser.id + "",
          email: existingUser.email,
          name: existingUser.name,
          first_name: existingUser.first_name,
          phone_number: existingUser.phone_number,
          role: existingUser.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        return {
          ...token,
          name: user.name,
          id: user.id,
          first_name: user.first_name,
          phone_number: user.phone_number,
          email: user.email,
          role: user.role,
        };
      }
      return token;
    },
    async session({ session, user, token }) {
      const userId = user?.id ?? token?.id;

      const updatedUser = await getUserFromDatabase(userId);

      if (
        updatedUser?.id !== undefined &&
        updatedUser?.name !== undefined &&
        updatedUser?.first_name !== undefined &&
        updatedUser?.phone_number !== undefined &&
        updatedUser?.role !== undefined
      ) {
        return {
          ...session,
          user: {
            ...session.user,
            name: updatedUser?.name,
            id: updatedUser?.id,
            first_name: updatedUser?.first_name,
            phone_number: updatedUser?.phone_number,
            email: updatedUser?.email,
            role: updatedUser?.role,
          },
        };
      } else {
        return {
          ...session,
          user: {
            ...session.user,
            name: user?.name ?? token?.name,
            id: user?.id ?? token?.id,
            first_name: user?.first_name ?? token?.first_name,
            phone_number: user?.phone_number ?? token?.phone_number,
            email: user?.email ?? token?.email,
            role: user?.role ?? token?.role,
          },
        };
      }
    },
  },
};
