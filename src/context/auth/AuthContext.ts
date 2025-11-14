import { MeApi, SessionT } from "@/lib/auth";
import { createContext } from "react";

export type AuthContextType = {
  user: MeApi | null;
  session: SessionT | null;
  setUserAuth: (user: MeApi | null) => void;
  setSessionAuth: (user: SessionT | null) => void;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  setUserAuth: () => {},
  setSessionAuth: () => {},
});
