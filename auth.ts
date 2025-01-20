import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/db/prisma";
import { adapter } from "next/dist/server/web/adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthConfig } from "next-auth";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { compare } from "./lib/encrypt";

export const config = {
  pages: {
    signIn: "/sign-in",
    error: '"sign-in',
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  adapter: PrismaAdapter(prisma),

  // is this where i could use GoogleProvider?
  providers: [
    CredentialsProvider({
      credentials: {
        email: { type: "email" },
        password: { type: "password" },
      },
      async authorize(credentials) {
        if (credentials == null) return null;

        //Find user in db
        const user = await prisma.user.findFirst({
          where: {
            email: credentials.email as string,
          },
        });
        //check if user exists and password matches
        if (user && user.password) {
          const isMatch = await compare(
            credentials.password as string,
            user.password
          );
          //if password matches return user
          if (isMatch) {
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
            };
          }
        }
        // if user does not exist or password does not match return null
        return null;
      },
    }),
  ],
  callbacks: {
    async session({ session, user, trigger, token }: any) {
      //set the user ID from the token
      session.user.id = token.sub;
      //set the user role from the token
      session.user.role = token.role;
      // set the user name from the token
      session.user.name = token.name;

      //if there is an update, set the user name
      if (trigger === "update") {
        session.user.name = user.name;
      }
      return session;
    },
    async jwt({ token, user, session, trigger }: any) {
      // Assign user fields to token
      if (user) {
        token.role = user.role;
        // if user has no name, then use email
        if (user.name === "NO_NAME") {
          token.name = user.email!.split("@")[0];
          // update the db to reflect the token name
          await prisma.user.update({
            where: { id: user.id },
            data: { name: token.name },
          });
        }
      }
      return token;
    },
    authorized({ request, auth }: any) {
      // check for session cart cookie
      if (!request.cookies.get("sessionCartId")) {
        //generate new session id cart cookie
        const sessionCartId = crypto.randomUUID();
        //clone new request headers
        const newRequestHeaders = new Headers(request.headers);
        //create new response and add the new headers
        const response = NextResponse.next({
          request: {
            headers: newRequestHeaders,
          },
        });
        //set newly generated session cart id cookie in the response cookies
        response.cookies.set("sessionCartId", sessionCartId);

        return response;
      } else {
        return true;
      }
    },
  },
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(config);
