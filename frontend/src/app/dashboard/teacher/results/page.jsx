"use client";

import DashboardLayout from "@/components/layouts/DashboardLayout";
import { useRoleProtectedRoute } from "@/hooks/useProtectedRoute";
import Link from "next/link";
import { IconArrowLeft } from "@tabler/icons-react";

export default function TeacherResultsPage() {
  const { loading } = useRoleProtectedRoute(["teacher", "admin"]);

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
          <Link href="/dashboard/teacher" className="btn btn-ghost btn-sm">
            <IconArrowLeft size={18} />
            Back
          </Link>
          <h1 className="text-3xl font-bold">Student Results</h1>
        </div>

        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <p className="text-base-content/60">
              Student results will be displayed here
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
