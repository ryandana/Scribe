"use client";

import { createContext, useContext, useEffect, useState } from "react";
import api from "@/lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Hydrate user from API on mount
  const fetchUser = async () => {
    try {
      const data = await api.get("/api/auth/me");
      setUser(data);
      localStorage.setItem("user", JSON.stringify(data));
    } catch (err) {
      // If unauthorized (401), force logout to clear invalid cookies
      if (err.status === 401) {
        try {
          await api.post("/api/auth/logout");
        } catch (e) {
          console.error("Force logout failed:", e);
        }
      }

      // Try localStorage fallback if API fails
      try {
        const stored = localStorage.getItem("user");
        if (stored) setUser(JSON.parse(stored));
      } catch { }
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
