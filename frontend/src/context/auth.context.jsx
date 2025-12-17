"use client";

import { createContext, useContext, useEffect, useState } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Hydrate user from API on mount
  const fetchUser = async () => {
    try {
      const data = await api.get("/api/auth/me");
      setUser(data);
      localStorage.setItem("user", JSON.stringify(data));
    } catch (err) {
      // If unauthorized (401), token is invalid/expired
      if (err.response?.status === 401 || err.status === 401) {
        // Clear localStorage and cookies, then show unauthorized
        localStorage.removeItem("user");
        setUser(null);
        // Middleware will handle the redirect on next page refresh
        return;
      }

      // For other errors, try localStorage fallback
      try {
        const stored = localStorage.getItem("user");
        if (stored) setUser(JSON.parse(stored));
      } catch {}
      setUser(null);
    }
  };

  useEffect(() => {
    const hydrate = async () => {
      await fetchUser();
      setLoading(false);
    };

    hydrate();
  }, []);

  const logout = async () => {
    try {
      await api.post("/api/auth/logout", {});
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setUser(null);
      localStorage.removeItem("user");
      // Clear the token cookie by the backend, then redirect to public page
      router.push("/");
    }
  };

  const refreshUser = async () => {
    await fetchUser();
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
