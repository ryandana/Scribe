"use client";

import DashboardLayout from "@/components/layouts/DashboardLayout";
import { useRoleProtectedRoute } from "@/hooks/useProtectedRoute";
import { useAuth } from "@/context/auth.context";
import Link from "next/link";
import { IconArrowLeft } from "@tabler/icons-react";

export default function StudentProfilePage() {
  const { loading } = useRoleProtectedRoute(["student"]);
  const { user } = useAuth();

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/student" className="btn btn-ghost btn-sm">
            <IconArrowLeft size={18} />
            Back
          </Link>
          <h1 className="text-3xl font-bold">My Profile</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="card bg-base-100 shadow md:col-span-1">
            <div className="card-body items-center text-center">
              <div className="avatar placeholder">
                <div className="bg-primary text-primary-content rounded-full w-24 flex items-center justify-center">
                  <span className="text-4xl font-bold">
                    {user?.nickname?.charAt(0).toUpperCase() || "?"}
                  </span>
                </div>
              </div>
              <h2 className="card-title">{user?.nickname}</h2>
              <p className="text-base-content/60">{user?.role}</p>
            </div>
          </div>

          {/* Information Card */}
          <div className="card bg-base-100 shadow md:col-span-2">
            <div className="card-body">
              <h2 className="card-title mb-4">Profile Information</h2>

              <div className="space-y-4">
                <div>
                  <label className="label">
                    <span className="label-text font-semibold">Username</span>
                  </label>
                  <input
                    type="text"
                    value={user?.username || ""}
                    readOnly
                    className="input input-bordered w-full"
                  />
                </div>

                <div>
                  <label className="label">
                    <span className="label-text font-semibold">Email</span>
                  </label>
                  <input
                    type="email"
                    value={user?.email || ""}
                    readOnly
                    className="input input-bordered w-full"
                  />
                </div>

                <div>
                  <label className="label">
                    <span className="label-text font-semibold">NIS</span>
                  </label>
                  <input
                    type="text"
                    value={user?.nis || "-"}
                    readOnly
                    className="input input-bordered w-full"
                  />
                </div>

                <div>
                  <label className="label">
                    <span className="label-text font-semibold">Role</span>
                  </label>
                  <input
                    type="text"
                    value={user?.role || ""}
                    readOnly
                    className="input input-bordered w-full capitalize"
                  />
                </div>

                <div className="divider"></div>

                <button className="btn btn-primary w-full">Edit Profile</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
