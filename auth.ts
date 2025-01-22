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
        token.id = user.id;
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
        // Persist sessionCartId
        if (trigger === "signIn" || trigger === "signUp") {
          const cookiesObject = await cookies();
          const sessionCartId = cookiesObject.get("sessionCartId")?.value;

          if (sessionCartId) {
            const sessionCart = await prisma.cart.findFirst({
              where: { sessionCartId },
            });
            if (sessionCart) {
              // Delete current user car
              await prisma.cart.deleteMany({
                where: { userId: user.id },
              });
              // Assign new cart
              await prisma.cart.update({
                where: { id: sessionCart.id },
                data: { userId: user.id },
              });
            }
          }
        }
      }
      return token;
    },
    authorized({ request, auth }: any) {
      // Array of regex patterns to protect
      const protectPaths = [
        /\/shipping-address/,
        /\/payment-method/,
        /\/place-order/,
        /\/profile/,
        /\/user\/(.*)/,
        /\/order\/(.*)/,
        /\/admin/,
      ];

      // Get the pathname from the request URL object (the page currently being accessed)
      const { pathname } = request.nextUrl;
      // Check if user is not authenticated and is accessing a protected path
      if (!auth && protectPaths.some((p) => p.test(pathname))) {
        return false;
      }

      if (!request.cookies.get("sessionCartId")) {
        // check for session cart cookie
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
        //set newly generated sessionCartId cookie in the response cookies
        response.cookies.set("sessionCartId", sessionCartId);

        return response;
      } else {
        return true;
      }
    },
  },
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(config);
