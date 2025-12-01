"use client";

import DashboardLayout from "@/components/layouts/DashboardLayout";
import Breadcrumb from "@/components/ui/breadcrumb.component";
import { useRoleProtectedRoute } from "@/hooks/useProtectedRoute";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { IconArrowLeft, IconCheck } from "@tabler/icons-react";

export default function StudentResultsPage() {
  const { loading } = useRoleProtectedRoute(["student"]);
  const searchParams = useSearchParams();
  const score = searchParams.get("score");
  const success = searchParams.get("success");

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
        <Breadcrumb
          items={[
            { label: "Student", href: "/dashboard/student" },
            { label: "Results" },
          ]}
        />

        <div className="flex items-center justify-center min-h-screen -mt-32">
          <div className="space-y-6 w-full max-w-md">
            {/* Success Icon */}
            {success === "true" && (
              <div className="flex justify-center">
                <div className="w-24 h-24 bg-success rounded-full flex items-center justify-center animate-bounce">
                  <IconCheck size={56} className="text-success-content" />
                </div>
              </div>
            )}

            {/* Result Card */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body text-center space-y-4">
                <h1 className="text-2xl font-bold">Exam Completed!</h1>
                <p className="text-base-content/60">
                  Congratulations, you have successfully completed the exam.
                </p>

                {score !== null && <div className="divider"></div>}

                {score !== null && (
                  <div className="space-y-2">
                    <p className="text-sm text-base-content/60">Your Score</p>
                    <p className="text-5xl font-bold text-primary">
                      {score} Points
                    </p>
                  </div>
                )}

                <div className="divider"></div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-2">
                  <Link
                    href="/dashboard/student"
                    className="btn btn-primary gap-2"
                  >
                    <IconArrowLeft size={18} />
                    Back to Dashboard
                  </Link>
                  <Link
                    href="/dashboard/student/exams"
                    className="btn btn-outline gap-2"
                  >
                    Take Another Exam
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
