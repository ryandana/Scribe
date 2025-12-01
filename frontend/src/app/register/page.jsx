"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Section from "@/components/atoms/section.component";
import Button from "@/components/ui/button.component";
import EmailInput from "@/components/ui/email-input.component";
import PasswordInput from "@/components/ui/password-input.component";
import UsernameInput from "@/components/ui/username-input.component";
import Image from "next/image";
import Link from "next/link";
import api from "@/lib/api";
import { useAuth } from "@/context/auth.context";

export default function Register() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (!authLoading && user) {
      if (user.role === "student") {
        router.push("/dashboard/student");
      } else if (user.role === "teacher") {
        router.push("/dashboard/teacher");
      } else if (user.role === "admin") {
        router.push("/dashboard/admin");
      }
    }
  }, [user, authLoading, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const data = await api.post("/api/auth/register", {
        email,
        username,
        password,
      });

      // If backend returns created user, navigate to login or home
      router.push("/login");
    } catch (err) {
      setError(err?.data?.message || err.message || "Failed to register");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <Section className="flex items-center justify-center pt-24 min-h-screen">
        <div className="loading loading-spinner loading-lg"></div>
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
          Create an account
        </h1>
        <fieldset className="fieldset w-full max-w-md px-4 md:px-0 space-y-3">
          {error && (
            <div className="text-red-600 text-sm text-center">{error}</div>
          )}
          <div className="column-gap">
            <legend className="legend">Username</legend>
            <UsernameInput
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              name="username"
            />
          </div>
          <div className="column-gap">
            <legend className="legend">Email</legend>
            <EmailInput
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              name="email"
            />
          </div>
          <div className="column-gap">
            <legend className="legend">Password</legend>
            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              name="password"
            />
          </div>
          <div className="column-gap">
            <legend className="legend">Confirm Password</legend>
            <PasswordInput
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              name="confirmPassword"
            />
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </Button>
          <Link className="link block text-center" href={"/login"}>
            Already have an account?
          </Link>
        </fieldset>
      </form>
    </Section>
  );
}
