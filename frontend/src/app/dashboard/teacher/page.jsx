"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { useRoleProtectedRoute } from "@/hooks/useProtectedRoute";
import { useAuth } from "@/context/auth.context";
import api from "@/lib/api";
import Link from "next/link";
import {
  IconUsers,
  IconFileText,
  IconClipboard,
  IconPlus,
} from "@tabler/icons-react";

export default function TeacherDashboard() {
  const { isAuthenticated, loading } = useRoleProtectedRoute([
    "teacher",
    "admin",
  ]);
  const { user } = useAuth();
  const [stats, setStats] = useState({
    classes: 0,
    exams: 0,
    questions: 0,
  });
  const [statsLoading, setStatsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated || !user) return;

    const fetchStats = async () => {
      try {
        setStatsLoading(true);
        // Fetch classes for this teacher
        const classesResponse = await api.get("/api/classes");
        const classes = classesResponse.data || [];

        // Fetch exams created by this teacher
        const allExams = [];
        for (const cls of classes) {
          try {
            const examsResponse = await api.get(`/api/exams/class/${cls._id}`);
            allExams.push(...(examsResponse.data || []));
          } catch (err) {
            // Continue on error
          }
        }

        const teacherExams = allExams.filter((e) => e.createdBy === user._id);

        setStats({
          classes: classes.length,
          exams: teacherExams.length,
          questions: teacherExams.reduce(
            (sum, e) => sum + (e.questionsCount || 0),
            0
          ),
        });
      } catch (err) {
        setError(err?.message || "Failed to load stats");
      } finally {
        setStatsLoading(false);
      }
    };

    fetchStats();
  }, [isAuthenticated, user]);

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
          <h1 className="text-3xl font-bold">Teacher Dashboard</h1>
          <p className="text-base-content/60 mt-2">
            Manage your classes, exams, and questions
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card bg-base-100 shadow">
            <div className="card-body gap-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-base-content/60">Classes</p>
                  <p className="text-2xl font-bold">{stats.classes}</p>
                </div>
                <IconUsers className="text-primary" size={32} />
              </div>
            </div>
          </div>
          <div className="card bg-base-100 shadow">
            <div className="card-body gap-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-base-content/60">Exams</p>
                  <p className="text-2xl font-bold">{stats.exams}</p>
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
                  <p className="text-2xl font-bold">{stats.questions}</p>
                </div>
                <IconFileText className="text-warning" size={32} />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/dashboard/teacher/exams/create"
            className="card bg-base-100 shadow hover:shadow-lg transition"
          >
            <div className="card-body gap-2">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <IconClipboard className="text-primary" size={32} />
                </div>
                <div>
                  <h3 className="font-semibold">Create Exam</h3>
                  <p className="text-sm text-base-content/60">
                    Create a new exam for your class
                  </p>
                </div>
                <IconPlus className="ml-auto text-primary" size={24} />
              </div>
            </div>
          </Link>

          <Link
            href="/dashboard/teacher/classes"
            className="card bg-base-100 shadow hover:shadow-lg transition"
          >
            <div className="card-body gap-2">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-secondary/10 rounded-lg">
                  <IconUsers className="text-secondary" size={32} />
                </div>
                <div>
                  <h3 className="font-semibold">Manage Classes</h3>
                  <p className="text-sm text-base-content/60">
                    View and manage your classes
                  </p>
                </div>
                <IconPlus className="ml-auto text-secondary" size={24} />
              </div>
            </div>
          </Link>
        </div>

        {/* Recent Activity */}
        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <h2 className="card-title">Quick Links</h2>
            {error && (
              <div className="alert alert-error">
                <span>{error}</span>
              </div>
            )}
            <div className="divider my-2"></div>
            <div className="space-y-2">
              <Link
                href="/dashboard/teacher/exams"
                className="btn btn-ghost btn-sm justify-start"
              >
                View All Exams
              </Link>
              <Link
                href="/dashboard/teacher/questions"
                className="btn btn-ghost btn-sm justify-start"
              >
                Manage Questions
              </Link>
              <Link
                href="/dashboard/teacher/results"
                className="btn btn-ghost btn-sm justify-start"
              >
                View Student Results
              </Link>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
