"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { useRoleProtectedRoute } from "@/hooks/useProtectedRoute";
import { useAuth } from "@/context/auth.context";
import api from "@/lib/api";
import Link from "next/link";
import { IconBook, IconClipboardList, IconTrophy } from "@tabler/icons-react";

export default function StudentDashboard() {
  const { isAuthenticated, loading } = useRoleProtectedRoute(["student"]);
  const { user } = useAuth();
  const [exams, setExams] = useState([]);
  const [examsLoading, setExamsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated || !user) return;

    const fetchExams = async () => {
      try {
        setExamsLoading(true);
        const response = await api.get(`/api/exams/class/${user.classId}`);
        setExams(response.data || []);
      } catch (err) {
        setError(err?.message || "Failed to load exams");
        setExams([]);
      } finally {
        setExamsLoading(false);
      }
    };

    if (user.classId) {
      fetchExams();
    }
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
          <h1 className="text-3xl font-bold">My Exams</h1>
          <p className="text-base-content/60 mt-2">
            View and take exams assigned to your class
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card bg-base-100 shadow">
            <div className="card-body gap-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-base-content/60">Total Exams</p>
                  <p className="text-2xl font-bold">0</p>
                </div>
                <IconBook className="text-primary" size={32} />
              </div>
            </div>
          </div>
          <div className="card bg-base-100 shadow">
            <div className="card-body gap-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-base-content/60">Completed</p>
                  <p className="text-2xl font-bold">0</p>
                </div>
                <IconClipboardList className="text-success" size={32} />
              </div>
            </div>
          </div>
          <div className="card bg-base-100 shadow">
            <div className="card-body gap-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-base-content/60">Average Score</p>
                  <p className="text-2xl font-bold">-</p>
                </div>
                <IconTrophy className="text-warning" size={32} />
              </div>
            </div>
          </div>
        </div>

        {/* Exams List */}
        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <h2 className="card-title">Available Exams</h2>

            {error && (
              <div className="alert alert-error">
                <span>{error}</span>
              </div>
            )}

            {examsLoading ? (
              <div className="flex justify-center py-8">
                <span className="loading loading-spinner loading-lg"></span>
              </div>
            ) : exams.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-base-content/60 mb-4">No exams available</p>
                <p className="text-sm text-base-content/40">
                  Check back later for assigned exams
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Duration</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {exams.map((exam) => (
                      <tr key={exam._id} className="hover">
                        <td className="font-semibold">{exam.examTitle}</td>
                        <td>{exam.timer} minutes</td>
                        <td>
                          <div className="badge badge-primary capitalize">
                            {exam.status}
                          </div>
                        </td>
                        <td>
                          <Link
                            href={`/dashboard/student/exams/${exam._id}`}
                            className="btn btn-sm btn-primary"
                          >
                            Start Exam
                          </Link>
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
