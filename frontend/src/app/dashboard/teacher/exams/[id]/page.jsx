"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Section from "@/components/atoms/section.component";
import Breadcrumb from "@/components/ui/breadcrumb.component";
import Button from "@/components/ui/button.component";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { useRoleProtectedRoute } from "@/hooks/useProtectedRoute";
import api from "@/lib/api";
import { IconTrash, IconPlus } from "@tabler/icons-react";

export default function ExamDetailPage() {
  const { loading } = useRoleProtectedRoute(["teacher", "admin"]);
  const params = useParams();
  const router = useRouter();
  const examId = params.id;

  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formData, setFormData] = useState({
    questionText: "",
    options: ["", "", "", ""],
    answerKey: "",
    points: 1,
  });

  useEffect(() => {
    const fetchExamData = async () => {
      try {
        setPageLoading(true);
        const examData = await api.get(`/api/exams/${examId}`);
        setExam(examData.data || examData);

        const questionsData = await api.get(`/api/questions/exam/${examId}`);
        setQuestions(questionsData.data || []);
      } catch (err) {
        setError(err?.data?.message || "Failed to load exam");
      } finally {
        setPageLoading(false);
      }
    };

    if (examId) {
      fetchExamData();
    }
  }, [examId]);

  const handleOptionChange = (index, value) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData((prev) => ({
      ...prev,
      options: newOptions,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.questionText || !formData.answerKey) {
      setError("Please fill all required fields");
      return;
    }

    if (formData.options.some((opt) => !opt)) {
      setError("All options must be filled");
      return;
    }

    setFormLoading(true);
    try {
      const response = await api.post(`/api/questions/exam/${examId}`, {
        questionText: formData.questionText,
        options: formData.options,
        answerKey: formData.answerKey,
        points: parseInt(formData.points),
      });

      setQuestions((prev) => [...prev, response.data]);
      setFormData({
        questionText: "",
        options: ["", "", "", ""],
        answerKey: "",
        points: 1,
      });
      setShowForm(false);
    } catch (err) {
      setError(err?.data?.message || "Failed to add question");
    } finally {
      setFormLoading(false);
    }
  };

  const deleteQuestion = async (questionId) => {
    if (!confirm("Are you sure you want to delete this question?")) return;

    try {
      await api.delete(`/api/questions/${questionId}`);
      setQuestions((prev) => prev.filter((q) => q._id !== questionId));
    } catch (err) {
      setError(err?.data?.message || "Failed to delete question");
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

  if (!exam) {
    return (
      <DashboardLayout>
        <Section className="flex flex-col pt-8">
          <div className="alert alert-error">
            <span>{error || "Exam not found"}</span>
          </div>
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
            { label: exam.examTitle },
          ]}
        />

        {error && <div className="alert alert-error mb-4">{error}</div>}

        {/* Exam Header */}
        <div className="card bg-base-100 shadow-lg mb-6">
          <div className="card-body">
            <h1 className="card-title text-3xl mb-2">{exam.examTitle}</h1>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <span className="text-sm text-base-content/60">Category</span>
                <p className="font-semibold">{exam.category}</p>
              </div>
              <div>
                <span className="text-sm text-base-content/60">Duration</span>
                <p className="font-semibold">{exam.timer} minutes</p>
              </div>
              <div>
                <span className="text-sm text-base-content/60">Questions</span>
                <p className="font-semibold">{questions.length}</p>
              </div>
              <div>
                <span className="text-sm text-base-content/60">Status</span>
                <p
                  className={`font-semibold badge ${
                    exam.status === "draft" ? "badge-warning" : "badge-success"
                  }`}
                >
                  {exam.status}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Add Question Form */}
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="btn btn-primary mb-6 gap-2"
          >
            <IconPlus size={18} />
            Add Question
          </button>
        )}

        {showForm && (
          <div className="card bg-base-100 shadow-lg mb-6">
            <div className="card-body">
              <h2 className="card-title">Add New Question</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Question Text */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Question *</span>
                  </label>
                  <textarea
                    name="questionText"
                    value={formData.questionText}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        questionText: e.target.value,
                      }))
                    }
                    placeholder="Enter question text"
                    className="textarea textarea-bordered h-24"
                    required
                  ></textarea>
                </div>

                {/* Options */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Options *</span>
                  </label>
                  <div className="space-y-2">
                    {formData.options.map((option, index) => (
                      <input
                        key={index}
                        type="text"
                        value={option}
                        onChange={(e) =>
                          handleOptionChange(index, e.target.value)
                        }
                        placeholder={`Option ${String.fromCharCode(
                          65 + index
                        )}`}
                        className="input input-bordered w-full"
                        required
                      />
                    ))}
                  </div>
                </div>

                {/* Answer Key */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">
                      Correct Answer *
                    </span>
                  </label>
                  <select
                    name="answerKey"
                    value={formData.answerKey}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        answerKey: e.target.value,
                      }))
                    }
                    className="select select-bordered"
                    required
                  >
                    <option value="">Select correct answer</option>
                    {formData.options.map((_, index) => (
                      <option
                        key={index}
                        value={String.fromCharCode(65 + index)}
                      >
                        {String.fromCharCode(65 + index)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Points */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Points</span>
                  </label>
                  <input
                    type="number"
                    name="points"
                    value={formData.points}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        points: parseInt(e.target.value),
                      }))
                    }
                    min="1"
                    className="input input-bordered"
                  />
                </div>

                {/* Buttons */}
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={formLoading}
                    className="btn btn-primary flex-1"
                  >
                    {formLoading ? "Adding..." : "Add Question"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="btn btn-ghost flex-1"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Questions List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Questions ({questions.length})</h2>
          {questions.length > 0 ? (
            questions.map((question, index) => (
              <div key={question._id} className="card bg-base-100 shadow">
                <div className="card-body">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="badge badge-lg mb-2">
                        Question {index + 1}
                      </p>
                      <h3 className="card-title text-lg">
                        {question.questionText}
                      </h3>
                      <div className="mt-4 space-y-2">
                        {question.options.map((option, idx) => (
                          <div
                            key={idx}
                            className={`p-3 rounded ${
                              String.fromCharCode(65 + idx) ===
                              question.answerKey
                                ? "bg-success text-success-content"
                                : "bg-base-200"
                            }`}
                          >
                            <strong>{String.fromCharCode(65 + idx)}.</strong>{" "}
                            {option}
                            {String.fromCharCode(65 + idx) ===
                              question.answerKey && (
                              <span className="ml-2">✓ Correct</span>
                            )}
                          </div>
                        ))}
                      </div>
                      <p className="mt-4 text-sm text-base-content/60">
                        Points: <strong>{question.points}</strong>
                      </p>
                    </div>
                    <button
                      onClick={() => deleteQuestion(question._id)}
                      className="btn btn-ghost btn-sm text-error"
                    >
                      <IconTrash size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="card bg-base-100">
              <div className="card-body text-center">
                <p className="text-base-content/60">No questions added yet</p>
              </div>
            </div>
          )}
        </div>
      </Section>
    </DashboardLayout>
  );
}
