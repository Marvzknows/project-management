import { SessionT, UserT } from "@/lib/auth";
import { createContext } from "react";

export type AuthContextType = {
  user: UserT | null;
  session: SessionT | null;
  setUserAuth: (user: UserT | null) => void;
  setSessionAuth: (user: SessionT | null) => void;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  setUserAuth: () => {},
  setSessionAuth: () => {},
});
