import axios from "axios";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";
import { setAuthHeaderProvider } from "../api.js";
import type { Role } from "../types.js";

type AuthState = {
  username: string;
  role: Role;
  token: string;
} | null;

type AuthContextValue = {
  user: AuthState;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (username: string, password: string, roleHint?: Role) => Promise<void>;
  logout: () => void;
};

const STORAGE_KEY = "online-bookstore-auth";

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const AuthProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<AuthState>(() => {
    if (typeof window === "undefined") {
      return null;
    }
    const cached = window.localStorage.getItem(STORAGE_KEY);
    return cached ? (JSON.parse(cached) as AuthState) : null;
  });

  useEffect(() => {
    if (user) {
      setAuthHeaderProvider(() => user.token);
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      setAuthHeaderProvider(undefined);
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  const login = useCallback(
    async (username: string, password: string, roleHint?: Role) => {
      const encoded = btoa(`${username}:${password}`);
      const authHeader = `Basic ${encoded}`;

      await axios.get("http://localhost:8081/books", {
        headers: {
          Authorization: authHeader,
        },
      });

      const inferredRole =
        roleHint ??
        (username.toLowerCase().includes("admin") ? "ADMIN" : "SHOPPER");

      setUser({
        username,
        role: inferredRole,
        token: authHeader,
      });
    },
    [],
  );

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isAdmin: user?.role === "ADMIN",
      login,
      logout,
    }),
    [login, logout, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
};

export { AuthProvider, useAuth };
