import { headers } from "next/headers";
import { auth } from "./auth";

// get session using SSR
export const getServerSession = async () => {
  return await auth.api.getSession({ headers: await headers() });
};

// NOTE: If you want to get the session using clientSide. check the better-auth docs
