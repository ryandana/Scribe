"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Section from "@/components/atoms/section.component";
import Breadcrumb from "@/components/ui/breadcrumb.component";
import Button from "@/components/ui/button.component";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { useRoleProtectedRoute } from "@/hooks/useProtectedRoute";
import api from "@/lib/api";

export default function CreateExamPage() {
  const { loading } = useRoleProtectedRoute(["teacher", "admin"]);
  const router = useRouter();
  const [classes, setClasses] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    examTitle: "",
    classId: "",
    timer: 60,
    category: "Practice",
    shuffleQuestions: true,
  });

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setPageLoading(true);
        const response = await api.get("/api/classes");
        setClasses(response.data || []);
      } catch (err) {
        setError(err?.data?.message || "Failed to load classes");
      } finally {
        setPageLoading(false);
      }
    };

    if (!loading) {
      fetchClasses();
    }
  }, [loading]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.examTitle || !formData.classId) {
      setError("Please fill all required fields");
      return;
    }

    setFormLoading(true);
    try {
      const response = await api.post("/api/exams", {
        examTitle: formData.examTitle,
        classId: formData.classId,
        timer: parseInt(formData.timer),
        category: formData.category,
        shuffleQuestions: formData.shuffleQuestions,
      });

      router.push(`/dashboard/teacher/exams/${response.data._id}?created=true`);
    } catch (err) {
      setError(err?.data?.message || "Failed to create exam");
    } finally {
      setFormLoading(false);
    }
  };

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
      <Section className="flex flex-col pt-8 pb-12">
        <Breadcrumb
          items={[
            { label: "Teacher", href: "/dashboard/teacher" },
            { label: "Exams", href: "/dashboard/teacher/exams" },
            { label: "Create Exam" },
          ]}
        />

        <div className="flex flex-col items-center justify-center">
          <h1 className="mb-8 font-semibold text-2xl text-center">
            Create New Exam
          </h1>

          <fieldset className="fieldset w-full max-w-md px-4 md:px-0 space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="text-red-600 text-sm text-center">{error}</div>
              )}

              {/* Exam Title */}
              <div className="column-gap">
                <legend className="legend">Exam Title *</legend>
                <input
                  type="text"
                  name="examTitle"
                  value={formData.examTitle}
                  onChange={handleChange}
                  placeholder="e.g., Mathematics Final Exam"
                  className="input input-bordered w-full"
                  required
                />
              </div>

              {/* Class Selection */}
              <div className="column-gap">
                <legend className="legend">Class *</legend>
                <select
                  name="classId"
                  value={formData.classId}
                  onChange={handleChange}
                  className="select select-bordered w-full"
                  required
                >
                  <option value="">Select a class</option>
                  {classes.map((cls) => (
                    <option key={cls._id} value={cls._id}>
                      {cls.className}
                    </option>
                  ))}
                </select>
              </div>

              {/* Timer */}
              <div className="column-gap">
                <legend className="legend">Duration (minutes) *</legend>
                <input
                  type="number"
                  name="timer"
                  value={formData.timer}
                  onChange={handleChange}
                  min="5"
                  max="300"
                  placeholder="60"
                  className="input input-bordered w-full"
                  required
                />
              </div>

              {/* Category */}
              <div className="column-gap">
                <legend className="legend">Category</legend>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="select select-bordered w-full"
                >
                  <option value="Practice">Practice</option>
                  <option value="PTS">PTS</option>
                  <option value="PAS">PAS</option>
                  <option value="Daily">Daily Quiz</option>
                </select>
              </div>

              {/* Shuffle Questions */}
              <div className="form-control">
                <label className="label cursor-pointer">
                  <span className="label-text">Shuffle Questions</span>
                  <input
                    type="checkbox"
                    name="shuffleQuestions"
                    checked={formData.shuffleQuestions}
                    onChange={handleChange}
                    className="checkbox"
                  />
                </label>
              </div>

              {/* Submit Button */}
              <Button type="submit" disabled={formLoading}>
                {formLoading ? "Creating..." : "Create Exam"}
              </Button>
            </form>
          </fieldset>
        </div>
      </Section>
    </DashboardLayout>
  );
}
