"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Section from "@/components/atoms/section.component";
import Button from "@/components/ui/button.component";
import EmailInput from "@/components/ui/email-input.component";
import UsernameInput from "@/components/ui/username-input.component";
import { useAuth } from "@/context/auth.context";
import api from "@/lib/api";

export default function Profile() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  // Populate form with user data
  useEffect(() => {
    if (user) {
      setUsername(user.username || "");
      setEmail(user.email || "");
      setNickname(user.nickname || "");
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const updateData = { username, email, nickname };
      if (password) updateData.password = password;

      const data = await api.put("/api/auth/me", updateData);
      setSuccess("Profile updated successfully");
      setPassword("");
    } catch (err) {
      setError(err?.data?.message || err.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <Section className="flex items-center justify-center min-h-screen">
        <div className="loading loading-spinner loading-lg"></div>
      </Section>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <Section className="flex flex-col items-center justify-center min-h-screen">
      {error && (
        <div className="alert absolute top-4 left-1/2 -translate-x-1/2 alert-error text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="alert absolute top-4 left-1/2 -translate-x-1/2 alert-success text-sm">
          {success}
        </div>
      )}
      <div className="card bg-base-100 max-w-lg w-full">
        <div className="card-body">
          <h2 className="card-title">Your Profile</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control column-gap w-full">
              <label className="label">
                <span className="label-text">Username</span>
              </label>
              <UsernameInput
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                name="username"
              />
            </div>

            <div className="form-control column-gap w-full">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <EmailInput
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                name="email"
              />
            </div>

            <div className="form-control column-gap w-full">
              <label className="label">
                <span className="label-text">Nickname (Display Name)</span>
              </label>
              <input
                type="text"
                placeholder="Your nickname"
                className="input input-bordered w-full"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                name="nickname"
              />
            </div>

            <div className="form-control column-gap w-full">
              <label className="label">
                <span className="label-text">Change Password</span>
              </label>
              <input
                type="password"
                placeholder="Leave blank to keep current password"
                className="input input-bordered w-full"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                name="password"
                minLength="8"
              />
            </div>

            <Button className="w-full" type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </div>
      </div>
    </Section>
  );
}
