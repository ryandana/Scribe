"use client";

import { useEffect, useState, useRef } from "react";
import Section from "@/components/atoms/section.component";
import Button from "@/components/ui/button.component";
import EmailInput from "@/components/ui/email-input.component";
import UsernameInput from "@/components/ui/username-input.component";
import { useAuth } from "@/context/auth.context";
import api from "@/lib/api";
import { IconPencil } from "@tabler/icons-react";
import Avatar from "@/components/ui/avatar.component";
import { getImageUrl } from "@/lib/imageUrl";
import MyPostsTab from "@/components/ui/profile-tabs/my-posts.tab";
import LikedPostsTab from "@/components/ui/profile-tabs/liked-posts.tab";
import SecurityTab from "@/components/ui/profile-tabs/security.tab";

export default function Profile() {
  const { user, loading: authLoading, refreshUser } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");

  // Profile Form State
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const fileInputRef = useRef(null);

  // Populate form with user data
  useEffect(() => {
    if (user) {
      setUsername(user.username || "");
      setEmail(user.email || "");
      setNickname(user.nickname || "");
    }
  }, [user]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const updateData = { username, email, nickname };
      await api.put("/api/auth/me", updateData);
      setSuccess("Profile updated successfully");
      refreshUser();
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
      await api.put("/api/auth/avatar", formData);
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
      <div className="flex h-screen w-full items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!user) return null;

  const avatarUrl = getImageUrl(user.avatar_url);

  return (
    <Section className="py-24 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar / Tabs Navigation */}
        <div className="w-full md:w-1/4 flex flex-col gap-6">
          {/* User Info Card */}
          <div className="card bg-base-100 border border-base-200 p-6 flex flex-col items-center text-center">
            <div className="relative group mb-4">
              <div className="w-24 h-24 rounded-full bg-base-200 overflow-hidden flex items-center justify-center border-2 border-base-200">
                <Avatar
                  src={avatarUrl}
                  alt="Profile"
                  size={96}
                  className="object-cover"
                />
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingAvatar}
                className="absolute bottom-0 right-0 bg-neutral text-neutral-content p-1.5 rounded-full shadow-lg hover:bg-neutral-focus transition-colors cursor-pointer"
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
            <h2 className="font-bold text-lg">{user.nickname}</h2>
            <p className="text-sm text-base-content/60">@{user.username}</p>
          </div>

          {/* Navigation */}
          <ul className="menu bg-base-100 w-full rounded-box border border-base-200">
            <li>
              <a className={activeTab === "profile" ? "active" : ""} onClick={() => setActiveTab("profile")}>
                My Profile
              </a>
            </li>
            <li>
              <a className={activeTab === "my-posts" ? "active" : ""} onClick={() => setActiveTab("my-posts")}>
                My Posts
              </a>
            </li>
            <li>
              <a className={activeTab === "liked-posts" ? "active" : ""} onClick={() => setActiveTab("liked-posts")}>
                Liked Posts
              </a>
            </li>
            <li>
              <a className={activeTab === "security" ? "active" : ""} onClick={() => setActiveTab("security")}>
                Security
              </a>
            </li>
          </ul>
        </div>

        {/* Content Area */}
        <div className="flex-1">
          <div className="card bg-base-100 border border-base-200">
            <div className="card-body">
              {/* Render Content Based on Active Tab */}
              {activeTab === "profile" && (
                <div className="space-y-6">
                  <h2 className="card-title text-2xl">Edit Profile</h2>
                  {error && <div className="alert alert-error text-sm">{error}</div>}
                  {success && <div className="alert alert-success text-sm">{success}</div>}

                  <form onSubmit={handleProfileUpdate} className="space-y-4">
                    <div className="form-control w-full">
                      <label className="label"><span className="label-text">Username</span></label>
                      <UsernameInput value={username} onChange={(e) => setUsername(e.target.value)} name="username" />
                    </div>
                    <div className="form-control w-full">
                      <label className="label"><span className="label-text">Email</span></label>
                      <EmailInput value={email} onChange={(e) => setEmail(e.target.value)} name="email" />
                    </div>
                    <div className="form-control w-full">
                      <label className="label"><span className="label-text">Nickname</span></label>
                      <input type="text" className="input input-bordered w-full" value={nickname} onChange={(e) => setNickname(e.target.value)} name="nickname" />
                    </div>
                    <Button className="w-full mt-4" type="submit" disabled={loading}>
                      {loading ? "Saving..." : "Save Changes"}
                    </Button>
                  </form>
                </div>
              )}

              {activeTab === "my-posts" && (
                <div className="space-y-6">
                  <h2 className="card-title text-2xl">My Posts</h2>
                  <MyPostsTab />
                </div>
              )}

              {activeTab === "liked-posts" && (
                <div className="space-y-6">
                  <h2 className="card-title text-2xl">Liked Posts</h2>
                  <LikedPostsTab />
                </div>
              )}

              {activeTab === "security" && (
                <div className="space-y-6">
                  <h2 className="card-title text-2xl">Security</h2>
                  <SecurityTab />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
