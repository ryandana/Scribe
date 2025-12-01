"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import Link from "next/link";
import { IconArrowLeft } from "@tabler/icons-react";

export default function CreateClassPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    className: "",
    gradeLevel: "X",
    major: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.className || !formData.major) {
      setError("Please fill all required fields");
      return;
    }

    setLoading(true);
    try {
      await api.post("/api/classes", {
        className: formData.className,
        gradeLevel: formData.gradeLevel,
        major: formData.major,
      });

      // Show success and redirect
      router.push("/dashboard/admin/classes?created=true");
    } catch (err) {
      setError(err?.data?.message || err.message || "Failed to create class");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Link
            href="/dashboard/admin/classes"
            className="btn btn-ghost btn-sm"
          >
            <IconArrowLeft size={18} />
            Back
          </Link>
          <h1 className="text-3xl font-bold">Create Class</h1>
        </div>

        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="alert alert-error">
                  <span>{error}</span>
                </div>
              )}

              {/* Class Name */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Class Name *</span>
                </label>
                <input
                  type="text"
                  name="className"
                  value={formData.className}
                  onChange={handleChange}
                  placeholder="e.g., XI RPL A"
                  className="input input-bordered"
                  required
                />
              </div>

              {/* Grade Level */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">
                    Grade Level *
                  </span>
                </label>
                <select
                  name="gradeLevel"
                  value={formData.gradeLevel}
                  onChange={handleChange}
                  className="select select-bordered"
                  required
                >
                  <option value="X">Grade 10</option>
                  <option value="XI">Grade 11</option>
                  <option value="XII">Grade 12</option>
                </select>
              </div>

              {/* Major */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Major *</span>
                </label>
                <input
                  type="text"
                  name="major"
                  value={formData.major}
                  onChange={handleChange}
                  placeholder="e.g., Software Development"
                  className="input input-bordered"
                  required
                />
              </div>

              {/* Submit and Cancel Buttons */}
              <div className="form-control mt-6 flex flex-row gap-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary flex-1"
                >
                  {loading ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      Creating...
                    </>
                  ) : (
                    "Create Class"
                  )}
                </button>
                <Link
                  href="/dashboard/admin/classes"
                  className="btn btn-ghost flex-1"
                >
                  Cancel
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
