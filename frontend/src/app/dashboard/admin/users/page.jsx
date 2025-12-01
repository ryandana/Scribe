"use client";

import DashboardLayout from "@/components/layouts/DashboardLayout";
import { useRoleProtectedRoute } from "@/hooks/useProtectedRoute";
import Link from "next/link";
import {
  IconArrowLeft,
  IconPlus,
  IconEdit,
  IconTrash,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import api from "@/lib/api";

export default function AdminUsersPage() {
  const { loading } = useRoleProtectedRoute(["admin"]);
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setUsersLoading(true);
        const response = await api.get("/api/auth");
        setUsers(response.data || []);
      } catch (err) {
        setError(err?.message || "Failed to load users");
        setUsers([]);
      } finally {
        setUsersLoading(false);
      }
    };

    fetchUsers();
  }, []);

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
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard/admin" className="btn btn-ghost btn-sm">
              <IconArrowLeft size={18} />
              Back
            </Link>
            <h1 className="text-3xl font-bold">User Management</h1>
          </div>
          <Link
            href="/dashboard/admin/users/create"
            className="btn btn-primary gap-2"
          >
            <IconPlus size={18} />
            Create User
          </Link>
        </div>

        {error && (
          <div className="alert alert-error">
            <span>{error}</span>
          </div>
        )}

        <div className="card bg-base-100 shadow">
          <div className="card-body">
            {usersLoading ? (
              <div className="flex justify-center py-8">
                <span className="loading loading-spinner loading-lg"></span>
              </div>
            ) : users.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-base-content/60 mb-4">No users yet</p>
                <Link
                  href="/dashboard/admin/users/create"
                  className="btn btn-primary"
                >
                  Create User
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Username</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>NIS</th>
                      <th>Class</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user._id} className="hover">
                        <td className="font-semibold">{user.username}</td>
                        <td>{user.email}</td>
                        <td>
                          <div className="badge badge-primary capitalize">
                            {user.role}
                          </div>
                        </td>
                        <td>{user.nis || "-"}</td>
                        <td>{user.classId?.className || "-"}</td>
                        <td>
                          <div className="flex gap-2">
                            <Link
                              href={`/dashboard/admin/users/${user._id}/edit`}
                              className="btn btn-sm btn-ghost"
                            >
                              <IconEdit size={16} />
                            </Link>
                            <button className="btn btn-sm btn-ghost text-error">
                              <IconTrash size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
