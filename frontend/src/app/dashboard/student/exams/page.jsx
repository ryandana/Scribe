"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import Breadcrumb from "@/components/ui/breadcrumb.component";
import Section from "@/components/atoms/section.component";
import { useRoleProtectedRoute } from "@/hooks/useProtectedRoute";
import { useAuth } from "@/context/auth.context";
import Link from "next/link";
import api from "@/lib/api";

export default function StudentExamsPage() {
  const { loading } = useRoleProtectedRoute(["student"]);
  const { user } = useAuth();
  const [exams, setExams] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        setPageLoading(true);
        if (user?.classId) {
          const response = await api.get(`/api/exams/class/${user.classId}`);
          setExams(response.data || response || []);
        }
      } catch (err) {
        setError(err?.data?.message || err.message || "Failed to load exams");
        setExams([]);
      } finally {
        setPageLoading(false);
      }
    };

    if (!loading) {
      fetchExams();
    }
  }, [user, loading]);

  if (loading || pageLoading) {
    return (
      <DashboardLayout>
        <Section className="flex items-center justify-center min-h-screen">
          <div className="loading loading-spinner loading-lg"></div>
        </Section>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Section className="flex flex-col pt-8">
        <Breadcrumb
          items={[
            { label: "Student", href: "/dashboard/student" },
            { label: "My Exams" },
          ]}
        />

        <h1 className="text-3xl font-bold mb-6">My Exams</h1>

        {error && (
          <div className="alert alert-error mb-4">
            <span>{error}</span>
          </div>
        )}

        {exams.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {exams.map((exam) => (
              <div
                key={exam._id}
                className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="card-body">
                  <h2 className="card-title text-xl">{exam.examTitle}</h2>
                  <div className="space-y-2 text-sm text-base-content/70">
                    <div className="flex justify-between">
                      <span>Category:</span>
                      <span className="font-semibold">{exam.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Duration:</span>
                      <span className="font-semibold">
                        {exam.timer} minutes
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <span
                        className={`badge ${
                          exam.status === "active"
                            ? "badge-success"
                            : "badge-warning"
                        }`}
                      >
                        {exam.status}
                      </span>
                    </div>
                  </div>
                  <div className="card-actions justify-end mt-4">
                    <Link
                      href={`/dashboard/student/exams/${exam._id}`}
                      className="btn btn-primary btn-sm"
                    >
                      Start Exam
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body text-center">
              <p className="text-base-content/60">No exams available yet</p>
            </div>
          </div>
        )}
      </Section>
    </DashboardLayout>
  );
}
