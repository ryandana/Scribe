"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import Link from "next/link";
import { IconArrowLeft } from "@tabler/icons-react";

export default function CreateUserPage() {
  const router = useRouter();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    nickname: "",
    role: "student",
    classId: "",
    nis: "",
  });

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await api.get("/api/classes");
        setClasses(response.data || []);
      } catch (err) {
        console.error("Failed to load classes:", err);
        setClasses([]);
      }
    };

    fetchClasses();
  }, []);

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
    if (!formData.username || !formData.email || !formData.password) {
      setError("Please fill all required fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.role === "student" && !formData.nis) {
      setError("NIS is required for student accounts");
      return;
    }

    if (formData.role === "student" && !formData.classId) {
      setError("Class is required for student accounts");
      return;
    }

    setLoading(true);
    try {
      await api.post("/api/auth/register", {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        nickname: formData.nickname || formData.username,
        role: formData.role,
        classId: formData.classId || null,
        nis: formData.role === "student" ? formData.nis : null,
      });

      // Show success and redirect
      router.push("/dashboard/admin/users?created=true");
    } catch (err) {
      setError(err?.data?.message || err.message || "Failed to create user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/dashboard/admin/users" className="btn btn-ghost btn-sm">
            <IconArrowLeft size={18} />
            Back
          </Link>
          <h1 className="text-3xl font-bold">Create User</h1>
        </div>

        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="alert alert-error">
                  <span>{error}</span>
                </div>
              )}

              {/* Role Selection */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Role *</span>
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="select select-bordered"
                >
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              {/* Username */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Username *</span>
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="e.g., johndoe"
                  className="input input-bordered"
                  required
                />
              </div>

              {/* Nickname */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Nickname</span>
                </label>
                <input
                  type="text"
                  name="nickname"
                  value={formData.nickname}
                  onChange={handleChange}
                  placeholder="e.g., John Doe"
                  className="input input-bordered"
                />
              </div>

              {/* Email */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Email *</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  className="input input-bordered"
                  required
                />
              </div>

              {/* NIS - Only for Students */}
              {formData.role === "student" && (
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">NIS *</span>
                  </label>
                  <input
                    type="number"
                    name="nis"
                    value={formData.nis}
                    onChange={handleChange}
                    placeholder="Student ID"
                    className="input input-bordered"
                    required={formData.role === "student"}
                  />
                </div>
              )}

              {/* Class - Only for Students */}
              {formData.role === "student" && (
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Class *</span>
                  </label>
                  <select
                    name="classId"
                    value={formData.classId}
                    onChange={handleChange}
                    className="select select-bordered"
                    required={formData.role === "student"}
                  >
                    <option value="">Select a class</option>
                    {classes.map((cls) => (
                      <option key={cls._id} value={cls._id}>
                        {cls.className}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Password */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Password *</span>
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="input input-bordered"
                  required
                />
              </div>

              {/* Confirm Password */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">
                    Confirm Password *
                  </span>
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
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
                    "Create User"
                  )}
                </button>
                <Link
                  href="/dashboard/admin/users"
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
