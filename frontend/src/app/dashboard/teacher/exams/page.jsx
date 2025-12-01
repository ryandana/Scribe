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

export default function TeacherExamsPage() {
  const { loading } = useRoleProtectedRoute(["teacher", "admin"]);
  const [exams, setExams] = useState([]);
  const [examsLoading, setExamsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        setExamsLoading(true);
        // Fetch all classes first to get their exams
        const classesResponse = await api.get("/api/classes");
        const classes = classesResponse.data || [];

        // Fetch exams from all classes
        const allExams = [];
        for (const cls of classes) {
          try {
            const examsResponse = await api.get(`/api/exams/class/${cls._id}`);
            allExams.push(...(examsResponse.data || []));
          } catch (err) {
            // Continue on error
          }
        }

        // Filter exams created by current user (will be implemented in backend)
        setExams(allExams);
      } catch (err) {
        setError(err?.message || "Failed to load exams");
        setExams([]);
      } finally {
        setExamsLoading(false);
      }
    };

    fetchExams();
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
            <Link href="/dashboard/teacher" className="btn btn-ghost btn-sm">
              <IconArrowLeft size={18} />
              Back
            </Link>
            <h1 className="text-3xl font-bold">My Exams</h1>
          </div>
          <Link
            href="/dashboard/teacher/exams/create"
            className="btn btn-primary gap-2"
          >
            <IconPlus size={18} />
            Create Exam
          </Link>
        </div>

        {error && (
          <div className="alert alert-error">
            <span>{error}</span>
          </div>
        )}

        <div className="card bg-base-100 shadow">
          <div className="card-body">
            {examsLoading ? (
              <div className="flex justify-center py-8">
                <span className="loading loading-spinner loading-lg"></span>
              </div>
            ) : exams.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-base-content/60 mb-4">No exams yet</p>
                <Link
                  href="/dashboard/teacher/exams/create"
                  className="btn btn-primary"
                >
                  Create Your First Exam
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Class</th>
                      <th>Duration</th>
                      <th>Questions</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {exams.map((exam) => (
                      <tr key={exam._id} className="hover">
                        <td className="font-semibold">{exam.examTitle}</td>
                        <td>{exam.classId?.className || "-"}</td>
                        <td>{exam.timer} min</td>
                        <td>0</td>
                        <td>
                          <div className="badge badge-primary capitalize">
                            {exam.status}
                          </div>
                        </td>
                        <td>
                          <div className="flex gap-2">
                            <Link
                              href={`/dashboard/teacher/exams/${exam._id}/edit`}
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
