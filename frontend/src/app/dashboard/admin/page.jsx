"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { useRoleProtectedRoute } from "@/hooks/useProtectedRoute";
import api from "@/lib/api";
import Link from "next/link";
import {
  IconUsers,
  IconFileText,
  IconClipboard,
  IconSchool,
  IconPlus,
} from "@tabler/icons-react";

export default function AdminDashboard() {
  const { isAuthenticated, loading } = useRoleProtectedRoute(["admin"]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalClasses: 0,
    totalExams: 0,
    totalQuestions: 0,
  });
  const [statsLoading, setStatsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchStats = async () => {
      try {
        setStatsLoading(true);

        // Fetch all users
        const usersResponse = await api.get("/api/auth");
        const users = usersResponse.data || [];

        // Fetch all classes
        const classesResponse = await api.get("/api/classes");
        const classes = classesResponse.data || [];

        // Count exams - would need to implement getAllExams in backend
        // For now, we can estimate or fetch from each class
        let totalExams = 0;
        for (const cls of classes) {
          try {
            const examsResponse = await api.get(`/api/exams/class/${cls._id}`);
            totalExams += (examsResponse.data || []).length;
          } catch (err) {
            // Continue on error
          }
        }

        setStats({
          totalUsers: users.length,
          totalClasses: classes.length,
          totalExams: totalExams,
          totalQuestions: 0, // This would need endpoint to aggregate
        });
      } catch (err) {
        setError(err?.message || "Failed to load stats");
      } finally {
        setStatsLoading(false);
      }
    };

    fetchStats();
  }, [isAuthenticated]);

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
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-base-content/60 mt-2">
            Manage users, classes, exams, and system settings
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="card bg-base-100 shadow">
            <div className="card-body gap-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-base-content/60">Total Users</p>
                  <p className="text-2xl font-bold">{stats.totalUsers}</p>
                </div>
                <IconUsers className="text-primary" size={32} />
              </div>
            </div>
          </div>
          <div className="card bg-base-100 shadow">
            <div className="card-body gap-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-base-content/60">Classes</p>
                  <p className="text-2xl font-bold">{stats.totalClasses}</p>
                </div>
                <IconSchool className="text-secondary" size={32} />
              </div>
            </div>
          </div>
          <div className="card bg-base-100 shadow">
            <div className="card-body gap-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-base-content/60">Exams</p>
                  <p className="text-2xl font-bold">{stats.totalExams}</p>
                </div>
                <IconClipboard className="text-success" size={32} />
              </div>
            </div>
          </div>
          <div className="card bg-base-100 shadow">
            <div className="card-body gap-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-base-content/60">Questions</p>
                  <p className="text-2xl font-bold">{stats.totalQuestions}</p>
                </div>
                <IconFileText className="text-warning" size={32} />
              </div>
            </div>
          </div>
        </div>

        {/* Management Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/dashboard/admin/users/create"
            className="card bg-base-100 shadow hover:shadow-lg transition"
          >
            <div className="card-body gap-2">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <IconUsers className="text-primary" size={32} />
                </div>
                <div>
                  <h3 className="font-semibold">Create User</h3>
                  <p className="text-sm text-base-content/60">
                    Add new teachers or students
                  </p>
                </div>
                <IconPlus className="ml-auto text-primary" size={24} />
              </div>
            </div>
          </Link>

          <Link
            href="/dashboard/admin/classes/create"
            className="card bg-base-100 shadow hover:shadow-lg transition"
          >
            <div className="card-body gap-2">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-secondary/10 rounded-lg">
                  <IconSchool className="text-secondary" size={32} />
                </div>
                <div>
                  <h3 className="font-semibold">Create Class</h3>
                  <p className="text-sm text-base-content/60">
                    Create a new class
                  </p>
                </div>
                <IconPlus className="ml-auto text-secondary" size={24} />
              </div>
            </div>
          </Link>
        </div>

        {/* Quick Links */}
        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <h2 className="card-title">Management Tools</h2>
            {error && (
              <div className="alert alert-error">
                <span>{error}</span>
              </div>
            )}
            <div className="divider my-2"></div>
            <div className="space-y-2">
              <Link
                href="/dashboard/admin/users"
                className="btn btn-ghost btn-sm justify-start"
              >
                Manage Users
              </Link>
              <Link
                href="/dashboard/admin/classes"
                className="btn btn-ghost btn-sm justify-start"
              >
                Manage Classes
              </Link>
              <Link
                href="/dashboard/admin/exams"
                className="btn btn-ghost btn-sm justify-start"
              >
                Manage Exams
              </Link>
              <Link
                href="/dashboard/admin/questions"
                className="btn btn-ghost btn-sm justify-start"
              >
                Manage Questions
              </Link>
              <Link
                href="/dashboard/admin/results"
                className="btn btn-ghost btn-sm justify-start"
              >
                View Results
              </Link>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
