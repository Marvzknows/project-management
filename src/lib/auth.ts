import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();
export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  // session: {
  //   expiresIn: 10, // 10 seconds
  //   updateAge: 5, // Update after 5 seconds (half of expiration)
  //   cookieCache: {
  //     enabled: true,
  //     maxAge: 5, // 5 seconds cache
  //   },
  // },
  emailAndPassword: {
    enabled: true,
    autoSignIn: false, // defaults to true
  },
  socialProviders: {
    google: {
      prompt: "select_account", // to ask the user to select an account
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
    github: {
      prompt: "select_account",
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
  },
});

export type SessionT = typeof auth.$Infer.Session.session;
export type UserT = typeof auth.$Infer.Session.user;
export type MeApi = {
  id: string;
  createdAt: Date;
  email: string;
  name: string;
  image: string | null;
  activeBoardId: string | null;
  activeBoard: {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    title: string;
    ownerId: string;
  } | null;
};
