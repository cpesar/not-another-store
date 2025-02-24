import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { prisma } from "@/db/prisma";
import { cookies } from "next/headers";
import { compare } from "./lib/encrypt";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
  throw new Error("Missing Google OAuth Credentials");
}

export const config = {
  providers: [
    GoogleProvider({
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "select_account",
        },
      },
    }),
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
  secret: process.env.NEXTAUTH_SECRET,

  pages: {
    signIn: "/sign-in",
    error: "/sign-in",
  },
  session: {
    strategy: "jwt" as const,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  callbacks: {
    ...authConfig.callbacks,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async session({ session, user, trigger, token }: any) {
      // Set the user ID from the token
      session.user.id = token.sub;
      session.user.role = token.role;
      session.user.name = token.name;

      // If there is an update, set the user name
      if (trigger === "update") {
        session.user.name = user.name;
      }
      return session;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async signIn({ account, profile }: any) {
      if (account?.provider === "google") {
        if (!profile?.email) {
          throw new Error("No profile");
        }

        // Create or update user in your database
        await prisma.user.upsert({
          where: { email: profile.email },
          create: {
            email: profile.email,
            name: profile.name || "NO_NAME",
          },
          update: {
            name: profile.name || "NO_NAME",
          },
        });
        return true;
      }
      return true; // Do different verification for other providers that don't have `email_verified`
    },

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async redirect({ url, baseUrl }: any) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async jwt({ token, user, session, trigger }: any) {
      // Assign user fields to token
      if (user) {
        token.id = user.id;
        token.role = user.role;

        // If user has no name, then use email
        if (user.name === "NO_NAME") {
          token.name = user.email!.split("@")[0];

          // Update the db to reflect the token name
          await prisma.user.update({
            where: { id: user.id },
            data: { name: token.name },
          });
        }
        if (trigger === "signIn" || trigger === "signUp") {
          const cookiesObject = await cookies();
          const sessionCartId = cookiesObject.get("sessionCartId")?.value;

          if (sessionCartId) {
            const sessionCart = await prisma.cart.findFirst({
              where: { sessionCartId },
            });
            if (sessionCart) {
              //Delete current user cart
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
      // Handle session updates
      if (session?.user.name && trigger === "update") {
        token.name = session.user.name;
      }
      return token;
    },
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(config);
