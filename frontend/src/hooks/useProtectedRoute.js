import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth.context";

/**
 * Hook to protect routes that require authentication
 * Redirects unauthenticated users to login page
 */
export function useProtectedRoute() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  return { isAuthenticated: !!user, loading };
}

/**
 * Hook to protect routes by role
 * Redirects users without proper role to home page
 */
export function useRoleProtectedRoute(allowedRoles = []) {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login");
      } else if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        router.push("/");
      }
    }
  }, [user, loading, router, allowedRoles]);

  return {
    isAuthenticated: !!user,
    isAuthorized: !allowedRoles.length || allowedRoles.includes(user?.role),
    loading,
  };
}

/**
 * Hook to redirect authenticated users by role
 * Returns the user's role if authenticated, null otherwise
 */
export function useRedirectByRole() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      if (user.role === "student") {
        router.push("/dashboard/student");
      } else if (user.role === "teacher") {
        router.push("/dashboard/teacher");
      } else if (user.role === "admin") {
        router.push("/dashboard/admin");
      }
    }
  }, [user, loading, router]);

  return { user, loading };
}
