"use client";

import DashboardLayout from "@/components/layouts/DashboardLayout";
import { useProtectedRoute } from "@/hooks/useProtectedRoute";
import Link from "next/link";
import {
  IconArrowLeft,
  IconPlus,
  IconEdit,
  IconTrash,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import api from "@/lib/api";

export default function AdminClassesPage() {
  const { loading } = useProtectedRoute();
  const [classes, setClasses] = useState([]);
  const [classesLoading, setClassesLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setClassesLoading(true);
        const response = await api.get("/api/classes");
        setClasses(response.data || []);
      } catch (err) {
        setError(err?.message || "Failed to load classes");
        setClasses([]);
      } finally {
        setClassesLoading(false);
      }
    };

    fetchClasses();
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
            <h1 className="text-3xl font-bold">Class Management</h1>
          </div>
          <Link
            href="/dashboard/admin/classes/create"
            className="btn btn-primary gap-2"
          >
            <IconPlus size={18} />
            Create Class
          </Link>
        </div>

        {error && (
          <div className="alert alert-error">
            <span>{error}</span>
          </div>
        )}

        <div className="card bg-base-100 shadow">
          <div className="card-body">
            {classesLoading ? (
              <div className="flex justify-center py-8">
                <span className="loading loading-spinner loading-lg"></span>
              </div>
            ) : classes.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-base-content/60 mb-4">No classes yet</p>
                <Link
                  href="/dashboard/admin/classes/create"
                  className="btn btn-primary"
                >
                  Create Class
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Class Name</th>
                      <th>Grade Level</th>
                      <th>Major</th>
                      <th>Students</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {classes.map((cls) => (
                      <tr key={cls._id} className="hover">
                        <td className="font-semibold">{cls.className}</td>
                        <td>{cls.gradeLevel}</td>
                        <td>{cls.major}</td>
                        <td>0</td>
                        <td>
                          <div className="flex gap-2">
                            <Link
                              href={`/dashboard/admin/classes/${cls._id}/edit`}
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
