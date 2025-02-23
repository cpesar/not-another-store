// import NextAuth from "next-auth";
// import GitHub from "next-auth/providers/github";
// import { PrismaAdapter } from "@auth/prisma-adapter";
// import { prisma } from "@/db/prisma";

// const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
// const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

// if (!GITHUB_CLIENT_ID || !GITHUB_CLIENT_SECRET) {
//   throw new Error("Missing github oauth credentials");
// }

// const isDevelopment = process.env.NODE_ENV === "development";

// export const {
//   handlers: { GET, POST },
//   auth,
//   signOut,
//   signIn,
// } = NextAuth({
//   adapter: PrismaAdapter(prisma),
//   providers: [
//     GitHub({
//       clientId: GITHUB_CLIENT_ID,
//       clientSecret: GITHUB_CLIENT_SECRET,
//       authorization: {
//         params: {
//           redirect_uri: isDevelopment
//             ? "http://localhost:3000/api/auth/callback/github"
//             : "https://not-another-store-alpha.vercel.app/api/auth/callback/github",
//         },
//       },
//     }),
//   ],
//   callbacks: {
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     async session({ session, user }: any) {
//       if (session && user) {
//         session.user.id = user.id;
//       }
//       return session;
//     },
//   },
//   debug: isDevelopment,
//   trustHost: true,
//   secret: process.env.NEXTAUTH_SECRET,
// });
