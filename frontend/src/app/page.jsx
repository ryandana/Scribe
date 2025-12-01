"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth.context";
import Section from "@/components/atoms/section.component";

export default function Page() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      // Redirect authenticated users to their dashboard
      if (user.role === "student") {
        router.push("/dashboard/student");
      } else if (user.role === "teacher") {
        router.push("/dashboard/teacher");
      } else if (user.role === "admin") {
        router.push("/dashboard/admin");
      }
    } else if (!loading && !user) {
      // Redirect unauthenticated users to login
      router.push("/login");
    }
  }, [user, loading, router]);

  return (
    <Section className="flex items-center justify-center">
      <div className="loading loading-spinner loading-lg"></div>
    </Section>
  );
}
