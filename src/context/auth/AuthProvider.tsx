"use client";
import { MeApi, SessionT } from "@/lib/auth";
import { ReactNode, useCallback, useState } from "react";
import { AuthContext } from "./AuthContext";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<MeApi | null>(null);
  const [session, setSession] = useState<SessionT | null>(null);

  const setUserAuth = useCallback((user: MeApi | null) => {
    setUser(user);
  }, []);

  const setSessionAuth = useCallback((session: SessionT | null) => {
    setSession(session);
  }, []);

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
