import { MeApi, SessionT } from "@/lib/auth";
import { createContext } from "react";

export type AuthContextType = {
  user: MeApi | null;
  session: SessionT | null;
  setUserAuth: (
    value: MeApi | ((prev: MeApi | null) => MeApi | null) | null
  ) => void;
  setSessionAuth: (user: SessionT | null) => void;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  setUserAuth: () => {},
  setSessionAuth: () => {},
});
