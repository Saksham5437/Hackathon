import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { AUTH_STORAGE_KEY, SESSION_STORAGE_KEY } from "../utils/constants.js";
import { makeSessionId } from "../utils/formatters.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(sessionStorage.getItem(AUTH_STORAGE_KEY));
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (user) sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    else sessionStorage.removeItem(AUTH_STORAGE_KEY);
  }, [user]);

  const value = useMemo(
    () => ({
      user,
      signIn: ({ username }) => {
        const nextUser = { username: username.trim(), signedInAt: new Date().toISOString() };
        setUser(nextUser);
        if (!sessionStorage.getItem(SESSION_STORAGE_KEY)) {
          sessionStorage.setItem(SESSION_STORAGE_KEY, makeSessionId(nextUser.username));
        }
      },
      register: ({ username }) => {
        const nextUser = { username: username.trim(), createdAt: new Date().toISOString() };
        setUser(nextUser);
        sessionStorage.setItem(SESSION_STORAGE_KEY, makeSessionId(nextUser.username));
      },
      signOut: () => setUser(null),
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
