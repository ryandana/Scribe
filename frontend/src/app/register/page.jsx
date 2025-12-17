"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Section from "@/components/atoms/section.component";
import Button from "@/components/ui/button.component";
import EmailInput from "@/components/ui/email-input.component";
import PasswordInput from "@/components/ui/password-input.component";
import UsernameInput from "@/components/ui/username-input.component";

import Link from "next/link";
import api from "@/lib/api";
import { useAuth } from "@/context/auth.context";
import { useToast } from "@/context/toast.context";
import AuthFormSkeleton from "@/components/skeletons/auth-form.skeleton";

export default function Register() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { addToast } = useToast();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [validations, setValidations] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  useEffect(() => {
    // Realtime validation
    setValidations(prev => ({
      ...prev,
      username: username.length > 0 && username.length < 3 ? "Username must be at least 3 characters" : "",
      email: email.length > 0 && !validateEmail(email) ? "Invalid email address" : "",
      password: password.length > 0 && password.length < 6 ? "Password must be at least 6 characters" : "",
      confirmPassword: confirmPassword.length > 0 && password !== confirmPassword ? "Passwords do not match" : ""
    }));
  }, [username, email, password, confirmPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Final check
    if (Object.values(validations).some(msg => msg) || !username || !email || !password || !confirmPassword) {
      addToast("Please fix the errors in the form", "error");
      return;
    }

    setLoading(true);
    try {
      await api.post("/api/auth/register", {
        email,
        username,
        password,
      });

      addToast("Registration successful! redirecting...", "success");
      setTimeout(() => router.push("/login"), 1500);
    } catch (err) {
      addToast(err?.data?.message || err.message || "Failed to register", "error");
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
      <div className="min-h-[150px] md:min-h-full w-full md:w-1/2 flex items-center justify-center relative md:self-auto self-stretch bg-base-100 rounded-2xl overflow-hidden mb-6 md:mb-0">
        <span className="text-6xl md:text-[10vw] font-black tracking-tighter text-neutral select-none">
          Scribe
        </span>
      </div>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col w-full md:w-1/2 items-center justify-center md:py-0 py-8"
      >
        <h1 className="mb-8 md:mb-12 font-semibold text-xl text-center">
          Create an account
        </h1>
        <fieldset className="fieldset w-full max-w-md px-4 md:px-0 space-y-3">
          <div className="column-gap">
            <legend className="legend">Username</legend>
            <UsernameInput
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              name="username"
            />
            {validations.username && <span className="text-xs text-error mt-1">{validations.username}</span>}
          </div>
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
          <div className="column-gap">
            <legend className="legend">Confirm Password</legend>
            <PasswordInput
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              name="confirmPassword"
            />
            {validations.confirmPassword && <span className="text-xs text-error mt-1">{validations.confirmPassword}</span>}
          </div>
          <Button type="submit" disabled={loading || Object.values(validations).some(msg => msg)}>
            {loading ? "Registering..." : "Register"}
          </Button>
          <Link className="link block text-center" href={"/login"}>
            Already have an account?
          </Link>

          <p className="text-xs text-center text-neutral/50 mt-6 max-w-xs mx-auto leading-relaxed">
            By creating an account, you agree to our <Link href="/terms" className="underline hover:text-neutral transition-colors">Terms of Service</Link> and <Link href="/privacy" className="underline hover:text-neutral transition-colors">Privacy Policy</Link>.
          </p>
        </fieldset>
      </form>
    </Section>
  );
}
