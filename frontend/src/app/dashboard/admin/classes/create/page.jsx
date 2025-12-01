"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Section from "@/components/atoms/section.component";
import Breadcrumb from "@/components/ui/breadcrumb.component";
import Button from "@/components/ui/button.component";
import api from "@/lib/api";

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
    <Section className="flex flex-col pt-8 pb-12">
      <Breadcrumb
        items={[
          { label: "Admin", href: "/dashboard/admin" },
          { label: "Classes", href: "/dashboard/admin/classes" },
          { label: "Create Class" },
        ]}
      />

      <div className="flex flex-col items-center justify-center">
        <h1 className="mb-8 font-semibold text-2xl text-center">
          Create New Class
        </h1>

        <fieldset className="fieldset w-full max-w-md px-4 md:px-0 space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="text-red-600 text-sm text-center">{error}</div>
            )}

            {/* Class Name */}
            <div className="column-gap">
              <legend className="legend">Class Name *</legend>
              <input
                type="text"
                name="className"
                value={formData.className}
                onChange={handleChange}
                placeholder="e.g., XI RPL A"
                className="input input-bordered w-full"
                required
              />
            </div>

            {/* Grade Level */}
            <div className="column-gap">
              <legend className="legend">Grade Level *</legend>
              <select
                name="gradeLevel"
                value={formData.gradeLevel}
                onChange={handleChange}
                className="select select-bordered w-full"
                required
              >
                <option value="X">Grade 10</option>
                <option value="XI">Grade 11</option>
                <option value="XII">Grade 12</option>
              </select>
            </div>

            {/* Major */}
            <div className="column-gap">
              <legend className="legend">Major *</legend>
              <input
                type="text"
                name="major"
                value={formData.major}
                onChange={handleChange}
                placeholder="e.g., Software Development"
                className="input input-bordered w-full"
                required
              />
            </div>

            {/* Submit Button */}
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Class"}
            </Button>
          </form>
        </fieldset>
      </div>
    </Section>
  );
}
