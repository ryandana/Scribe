"use client";

import Header from "@/components/ui/header.component";
import { navLinks } from "@/constants/navLinks";
import { useAuth } from "@/context/auth.context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function FeedLayout({ children }) {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  useEffect(() => {
    if (authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);
  return (
    <>
      <Header navLinks={navLinks} />
      {children}
    </>
  );
}
