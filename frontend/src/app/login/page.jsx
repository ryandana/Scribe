"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Section from "@/components/atoms/section.component";
import Button from "@/components/ui/button.component";
import EmailInput from "@/components/ui/email-input.component";
import PasswordInput from "@/components/ui/password-input.component";
import Image from "next/image";
import Link from "next/link";
import api from "@/lib/api";
import { useAuth } from "@/context/auth.context";
import { useToast } from "@/context/toast.context";
import AuthFormSkeleton from "@/components/skeletons/auth-form.skeleton";

export default function Login() {
  const router = useRouter();
  const { user, loading: authLoading, refreshUser } = useAuth();
  const { addToast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [validations, setValidations] = useState({
    email: "",
    password: ""
  });

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  useEffect(() => {
    // Realtime validation
    setValidations(prev => ({
      ...prev,
      email: email.length > 0 && !validateEmail(email) ? "Invalid email address" : "",
      password: password.length > 0 && password.length < 6 ? "Password must be at least 6 characters" : ""
    }));
  }, [email, password]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (Object.values(validations).some(msg => msg) || !email || !password) {
      addToast("Please fix the errors in the form", "error");
      return;
    }

    setLoading(true);
    try {
      await api.post("/api/auth/login", { email, password });

      // Refresh user context to populate avatar immediately
      await refreshUser();
      addToast("Login successful!", "success");
      router.push("/feed");
    } catch (err) {
      addToast(err?.data?.message || err.message || "Login failed", "error");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <Section className="flex items-center justify-center pt-24 min-h-screen">
        <AuthFormSkeleton />
      </Section>
    );
  }

  return (
    <Section className="flex md:flex-row-reverse flex-col pt-24">
      <div className="min-h-[400px] md:min-h-full w-full md:w-1/2 md:block hidden relative md:self-auto self-stretch">
        <Image
          src="/dev/test.jpg"
          alt="Placeholder"
          fill
          className="object-cover rounded-lg"
        />
      </div>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col w-full md:w-1/2 items-center justify-center md:py-0 py-8"
      >
        <h1 className="mb-8 md:mb-12 font-semibold text-xl text-center">
          Login to your existing account
        </h1>
        <fieldset className="fieldset w-full max-w-md px-4 md:px-0 space-y-3">
          <div className="column-gap">
            <legend className="legend">Email</legend>
            <EmailInput
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              name="email"
            />
            {validations.email && <span className="text-xs text-error mt-1">{validations.email}</span>}
          </div>
          <div className="column-gap">
            <legend className="legend">Password</legend>
            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              name="password"
            />
            {validations.password && <span className="text-xs text-error mt-1">{validations.password}</span>}
          </div>
          <Button type="submit" disabled={loading || Object.values(validations).some(msg => msg)}>
            {loading ? "Logging in..." : "Login"}
          </Button>
          <Link className="link block text-center" href={"/register"}>
            Don&apos;t have an account?
          </Link>
        </fieldset>
      </form>
    </Section>
  );
}
