import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { authService } from "@/services";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    authService
      .me()
      .then((data) => setAuthed(!!data?.email))
      .catch(() => setAuthed(false))
      .finally(() => setChecking(false));

    const onUnauthorized = () => setAuthed(false);
    window.addEventListener("unauthorized", onUnauthorized);
    return () => window.removeEventListener("unauthorized", onUnauthorized);
  }, []);

  const login = useCallback(async (email, password) => {
    await authService.login(email, password);
    setAuthed(true);
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      /* already signed out */
    }
    setAuthed(false);
  }, []);

  return (
    <AuthContext.Provider value={{ authed, checking, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside an AuthProvider");
  return context;
}
