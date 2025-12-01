"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Section from "@/components/atoms/section.component";
import Breadcrumb from "@/components/ui/breadcrumb.component";
import Button from "@/components/ui/button.component";
import api from "@/lib/api";

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
    <Section className="flex flex-col pt-8 pb-12">
      <Breadcrumb
        items={[
          { label: "Admin", href: "/dashboard/admin" },
          { label: "Users", href: "/dashboard/admin/users" },
          { label: "Create User" },
        ]}
      />

      <div className="flex flex-col items-center justify-center">
        <h1 className="mb-8 font-semibold text-2xl text-center">
          Create New User Account
        </h1>

        <fieldset className="fieldset w-full max-w-md px-4 md:px-0 space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="text-red-600 text-sm text-center">{error}</div>
            )}

            {/* Role Selection */}
            <div className="column-gap">
              <legend className="legend">Role *</legend>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="select select-bordered w-full"
              >
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {/* Username */}
            <div className="column-gap">
              <legend className="legend">Username *</legend>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="e.g., johndoe"
                className="input input-bordered w-full"
                required
              />
            </div>

            {/* Nickname */}
            <div className="column-gap">
              <legend className="legend">Nickname</legend>
              <input
                type="text"
                name="nickname"
                value={formData.nickname}
                onChange={handleChange}
                placeholder="e.g., John Doe"
                className="input input-bordered w-full"
              />
            </div>

            {/* Email */}
            <div className="column-gap">
              <legend className="legend">Email *</legend>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                className="input input-bordered w-full"
                required
              />
            </div>

            {/* NIS - Only for Students */}
            {formData.role === "student" && (
              <div className="column-gap">
                <legend className="legend">NIS *</legend>
                <input
                  type="number"
                  name="nis"
                  value={formData.nis}
                  onChange={handleChange}
                  placeholder="Student ID"
                  className="input input-bordered w-full"
                  required={formData.role === "student"}
                />
              </div>
            )}

            {/* Class - Only for Students */}
            {formData.role === "student" && (
              <div className="column-gap">
                <legend className="legend">Class *</legend>
                <select
                  name="classId"
                  value={formData.classId}
                  onChange={handleChange}
                  className="select select-bordered w-full"
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
            <div className="column-gap">
              <legend className="legend">Password *</legend>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="input input-bordered w-full"
                required
              />
            </div>

            {/* Confirm Password */}
            <div className="column-gap">
              <legend className="legend">Confirm Password *</legend>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className="input input-bordered w-full"
                required
              />
            </div>

            {/* Submit Button */}
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create User"}
            </Button>
          </form>
        </fieldset>
      </div>
    </Section>
  );
}
