"use client";

import { MeApi, SessionT } from "@/lib/auth";
import { ReactNode, useCallback, useState } from "react";
import { AuthContext } from "./AuthContext";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<MeApi | null>(null);
  const [session, setSession] = useState<SessionT | null>(null);

  const setUserAuth = useCallback(
    (value: MeApi | null | ((prev: MeApi | null) => MeApi | null)) => {
      setUser((prev) => (typeof value === "function" ? value(prev) : value));
    },
    []
  );

  const setSessionAuth = useCallback(
    (value: SessionT | null | ((prev: SessionT | null) => SessionT | null)) => {
      setSession((prev) => (typeof value === "function" ? value(prev) : value));
    },
    []
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        setUserAuth,
        setSessionAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
