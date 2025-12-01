"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import Breadcrumb from "@/components/ui/breadcrumb.component";
import Section from "@/components/atoms/section.component";
import QuestionDisplay from "@/components/exam/QuestionDisplay";
import useExamTimer from "@/hooks/useExamTimer";
import { useRoleProtectedRoute } from "@/hooks/useProtectedRoute";
import api from "@/lib/api";
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";

export default function ExamPage() {
  const { loading } = useRoleProtectedRoute(["student"]);
  const params = useParams();
  const router = useRouter();
  const examId = params.id;

  // States
  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [doubtful, setDoubtful] = useState(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState(null);
  const [autosaveStatus, setAutosaveStatus] = useState("saved");
  const autosaveIntervalRef = useRef(null);

  // Timer
  const { formatTime, isRunning, toggleTimer, timeProgress, getTimeColor } =
    useExamTimer(exam?.timer || 60, handleTimeUp);

  // Fetch exam and questions
  useEffect(() => {
    const fetchExamData = async () => {
      try {
        setPageLoading(true);
        const examData = await api.get(`/api/exams/${examId}`);
        setExam(examData?.data || examData);

        // Fetch questions for this exam
        const questionsData = await api.get(`/api/questions?examId=${examId}`);
        setQuestions(questionsData?.data || questionsData || []);
      } catch (err) {
        setError(err?.data?.message || err.message || "Failed to load exam");
      } finally {
        setPageLoading(false);
      }
    };

    if (examId) {
      fetchExamData();
    }
  }, [examId]);

  // Autosave answers every 3 seconds
  useEffect(() => {
    if (Object.keys(answers).length === 0 || !examId) return;

    const autosave = async () => {
      try {
        setAutosaveStatus("saving");
        const studentAnswers = questions.map((question) => ({
          questionId: question._id,
          selectedOption: answers[question._id] || null,
        }));

        await api.post(`/api/studentAnswers/${examId}/autosave`, {
          answers: studentAnswers,
        });

        setAutosaveStatus("saved");
      } catch (err) {
        console.error("Autosave failed:", err);
        setAutosaveStatus("error");
        // Retry after 1 second on error
        setTimeout(() => setAutosaveStatus("saved"), 1000);
      }
    };

    // Set initial autosave interval
    autosaveIntervalRef.current = setInterval(autosave, 3000);

    // Cleanup interval on unmount
    return () => {
      if (autosaveIntervalRef.current) {
        clearInterval(autosaveIntervalRef.current);
      }
    };
  }, [answers, examId, questions]);

  // Handle time up
  async function handleTimeUp() {
    // Auto submit exam when time is up
    await submitExam();
  }

  // Select answer
  const handleSelectAnswer = (option) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion._id]: option,
    }));
  };

  // Toggle doubtful
  const handleToggleDoubtful = () => {
    setDoubtful((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(currentQuestion._id)) {
        newSet.delete(currentQuestion._id);
      } else {
        newSet.add(currentQuestion._id);
      }
      return newSet;
    });
  };

  // Navigate questions
  const goToPrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const goToNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const goToQuestion = (index) => {
    setCurrentQuestionIndex(index);
  };

  // Submit exam
  const submitExam = async () => {
    setIsSubmitting(true);
    try {
      const studentAnswers = questions.map((question) => ({
        questionId: question._id,
        selectedOption: answers[question._id] || null,
      }));

      const response = await api.post(`/api/studentAnswers/${examId}/submit`, {
        answers: studentAnswers,
      });

      const score = response?.data?.score || 0;
      router.push(`/dashboard/student/results?score=${score}&success=true`);
    } catch (err) {
      setError(err?.data?.message || err.message || "Failed to submit exam");
    } finally {
      setIsSubmitting(false);
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

  if (error || !exam || questions.length === 0) {
    return (
      <DashboardLayout>
        <Section className="flex flex-col pt-8">
          <Breadcrumb
            items={[
              { label: "Student", href: "/dashboard/student" },
              { label: "Exams", href: "/dashboard/student/exams" },
              { label: "Take Exam" },
            ]}
          />
          <div className="alert alert-error mt-4">
            <span>{error || "Failed to load exam data"}</span>
          </div>
        </Section>
      </DashboardLayout>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const answeredCount = Object.keys(answers).length;
  const doubtfulCount = doubtful.size;

  return (
    <DashboardLayout>
      <Section className="flex flex-col pt-8 gap-6">
        {/* Header with Timer */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 bg-base-100 p-4 rounded-lg shadow">
          <div>
            <h1 className="text-2xl font-bold">{exam.examTitle}</h1>
            <p className="text-sm text-base-content/60">{exam.category}</p>
          </div>

          {/* Timer Card */}
          <div className="flex flex-col items-end gap-2 min-w-max">
            <div className="text-center">
              <p className="text-xs font-semibold text-base-content/70 mb-1">
                Time Remaining
              </p>
              <p
                className={`text-3xl font-bold font-mono text-${getTimeColor()}`}
              >
                {formatTime}
              </p>
            </div>
            <progress
              className={`progress progress-${getTimeColor()} w-24 h-2`}
              value={timeProgress}
              max="100"
            ></progress>
            <button onClick={toggleTimer} className="btn btn-xs btn-ghost">
              {isRunning ? "⏸ Pause" : "▶ Resume"}
            </button>
            <div className="text-xs mt-2">
              {autosaveStatus === "saving" && (
                <span className="text-warning flex items-center gap-1">
                  <span className="loading loading-spinner loading-xs"></span>
                  Saving...
                </span>
              )}
              {autosaveStatus === "saved" && (
                <span className="text-success">✓ Saved</span>
              )}
              {autosaveStatus === "error" && (
                <span className="text-error">✗ Save failed</span>
              )}
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-4 gap-4">
          <div className="stat bg-base-100 rounded-lg">
            <div className="stat-title text-xs">Total Questions</div>
            <div className="stat-value text-2xl">{questions.length}</div>
          </div>
          <div className="stat bg-base-100 rounded-lg">
            <div className="stat-title text-xs">Answered</div>
            <div className="stat-value text-2xl text-success">
              {answeredCount}
            </div>
          </div>
          <div className="stat bg-base-100 rounded-lg">
            <div className="stat-title text-xs">Marked for Review</div>
            <div className="stat-value text-2xl text-warning">
              {doubtfulCount}
            </div>
          </div>
          <div className="stat bg-base-100 rounded-lg">
            <div className="stat-title text-xs">Remaining</div>
            <div className="stat-value text-2xl text-error">
              {questions.length - answeredCount}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Question Display */}
          <div className="lg:col-span-3">
            <QuestionDisplay
              question={currentQuestion}
              questionNumber={currentQuestionIndex + 1}
              totalQuestions={questions.length}
              selectedAnswer={answers[currentQuestion._id] || null}
              onSelectAnswer={handleSelectAnswer}
              isDoubtful={doubtful.has(currentQuestion._id)}
              onToggleDoubtful={handleToggleDoubtful}
            />

            {/* Navigation Buttons */}
            <div className="flex gap-2 mt-6">
              <button
                onClick={goToPrevious}
                disabled={currentQuestionIndex === 0}
                className="btn btn-outline gap-2 flex-1"
              >
                <IconArrowLeft size={18} />
                Previous
              </button>
              <button
                onClick={goToNext}
                disabled={currentQuestionIndex === questions.length - 1}
                className="btn btn-outline gap-2 flex-1"
              >
                Next
                <IconArrowRight size={18} />
              </button>
            </div>

            {/* Submit Button */}
            <button
              onClick={submitExam}
              disabled={isSubmitting || answeredCount === 0}
              className="btn btn-primary w-full mt-4 gap-2"
            >
              {isSubmitting ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Submitting...
                </>
              ) : (
                "Submit Exam"
              )}
            </button>
          </div>

          {/* Question Navigator */}
          <div className="lg:col-span-1">
            <div className="card bg-base-100 shadow-lg sticky top-32">
              <div className="card-body p-4">
                <h3 className="card-title text-lg mb-4">Questions</h3>
                <div className="grid grid-cols-4 gap-2 max-h-96 overflow-y-auto">
                  {questions.map((question, index) => (
                    <button
                      key={question._id}
                      onClick={() => goToQuestion(index)}
                      className={`btn btn-sm font-bold ${
                        currentQuestionIndex === index
                          ? "btn-primary"
                          : answers[question._id]
                          ? "btn-success"
                          : "btn-outline"
                      } ${
                        doubtful.has(question._id) ? "ring-2 ring-warning" : ""
                      }`}
                      title={`Question ${index + 1}${
                        doubtful.has(question._id) ? " (Marked)" : ""
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>

                {/* Legend */}
                <div className="divider my-2"></div>
                <div className="text-xs space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-primary rounded"></div>
                    <span>Current</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-success rounded"></div>
                    <span>Answered</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-warning rounded"></div>
                    <span>Marked</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-base-300 rounded"></div>
                    <span>Not Attempted</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </DashboardLayout>
  );
}
