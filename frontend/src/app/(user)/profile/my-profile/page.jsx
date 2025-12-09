"use client";

import { useEffect, useState } from "react";
import Button from "@/components/ui/button.component";
import EmailInput from "@/components/ui/email-input.component";
import UsernameInput from "@/components/ui/username-input.component";
import { useAuth } from "@/context/auth.context";
import api from "@/lib/api";
import ProfileFormSkeleton from "@/components/skeletons/profile-form.skeleton";

export default function Profile() {
  const { user, loading: authLoading, refreshUser } = useAuth();

  // Profile Form State
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [bio, setBio] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  // Populate form with user data
  useEffect(() => {
    if (user) {
      setUsername(user.username || "");
      setEmail(user.email || "");
      setNickname(user.nickname || "");
      setBio(user.bio || "");
    }
  }, [user]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const updateData = { username, email, nickname, bio };
      await api.put("/api/auth/me", updateData);
      setSuccess("Profile updated successfully");
      refreshUser();
    } catch (err) {
      setError(err?.data?.message || err.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return <ProfileFormSkeleton />;
  }

  if (!user) return null;

  return (
    <div className="space-y-6">
      <h2 className="card-title text-2xl">Edit Profile</h2>
      {error && <div className="alert alert-error text-sm">{error}</div>}
      {success && <div className="alert alert-success text-sm">{success}</div>}

      <form onSubmit={handleProfileUpdate} className="space-y-4">
        <div className="column-gap w-full">
          <label className="label"><span className="label-text">Username</span></label>
          <UsernameInput value={username} onChange={(e) => setUsername(e.target.value)} name="username" />
        </div>
        <div className="column-gap w-full">
          <label className="label"><span className="label-text">Email</span></label>
          <EmailInput value={email} onChange={(e) => setEmail(e.target.value)} name="email" />
        </div>
        <div className="column-gap w-full">
          <label className="label"><span className="label-text">Nickname</span></label>
          <input type="text" className="input input-bordered w-full" value={nickname} onChange={(e) => setNickname(e.target.value)} name="nickname" />
        </div>
        <div className="column-gap w-full">
          <label className="label">
            <span className="label-text">Bio</span>
            <span className="label-text-alt text-base-content/60">{bio.length}/50</span>
          </label>
          <textarea
            className="textarea textarea-bordered w-full h-32 resize-none"
            value={bio}
            onChange={(e) => {
              if (e.target.value.length <= 50) {
                setBio(e.target.value);
              }
            }}
            name="bio"
            placeholder="Tell us about yourself..."
            maxLength={50}
          />
          <label className="label">
            <span className="label-text-alt text-base-content/60">
              Write a short bio to let others know more about you
            </span>
          </label>
        </div>
        <Button className="w-full mt-4" type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </div>
  );
}
