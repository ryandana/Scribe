"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Section from "@/components/atoms/section.component";
import Button from "@/components/ui/button.component";
import EmailInput from "@/components/ui/email-input.component";
import UsernameInput from "@/components/ui/username-input.component";
import { useAuth } from "@/context/auth.context";
import api from "@/lib/api";
import { IconPencil, IconUser } from "@tabler/icons-react";
import Image from "next/image";

import { getImageUrl } from "@/lib/imageUrl";

export default function Profile() {
  const router = useRouter();
  const { user, loading: authLoading, refreshUser } = useAuth(); // Assuming verifyUser re-fetches user
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const fileInputRef = useRef(null);

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

      await api.put("/api/auth/me", updateData);
      setSuccess("Profile updated successfully");
      setPassword("");
      refreshUser(); // Refresh user context
    } catch (err) {
      setError(err?.data?.message || err.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setError(null);
    setSuccess(null);
    setUploadingAvatar(true);

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      await api.put("/api/auth/avatar", formData); // Ensure api.js handles content-type automatically
      setSuccess("Avatar updated successfully");
      refreshUser();
    } catch (err) {
      setError(err?.data?.message || err.message || "Failed to upload avatar");
    } finally {
      setUploadingAvatar(false);
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
    <Section className="flex flex-col items-center justify-center min-h-screen py-24">
      {error && (
        <div className="alert fixed top-24 left-1/2 -translate-x-1/2 alert-error text-sm w-auto z-50 shadow-lg">
          {error}
        </div>
      )}
      {success && (
        <div className="alert fixed top-24 left-1/2 -translate-x-1/2 alert-success text-sm w-auto z-50 shadow-lg">
          {success}
        </div>
      )}
      <div className="card bg-base-100 max-w-lg w-full">
        <div className="card-body">
          <h2 className="card-title justify-center text-2xl mb-6">Your Profile</h2>

          {/* Avatar Upload */}
          <div className="flex justify-center mb-6 relative">
            <div className="relative group">
              <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center border-2 border-base-200">
                {user.avatar_url ? (
                  <Image src={getImageUrl(user.avatar_url)} alt="Profile" fill className="object-cover rounded-full" unoptimized/>
                ) : (
                  <IconUser size={48} className="text-gray-400" />
                )}
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingAvatar}
                className="absolute bottom-0 right-0 bg-primary text-primary-content p-1.5 rounded-full shadow-lg hover:bg-primary-focus transition-colors"
              >
                {uploadingAvatar ? <span className="loading loading-spinner loading-xs"></span> : <IconPencil size={16} />}
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleAvatarChange}
                className="hidden"
                accept="image/*"
              />
            </div>
          </div>

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

            <Button className="w-full mt-4" type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </div>
      </div>
    </Section>
  );
}
