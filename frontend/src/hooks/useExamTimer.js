"use client";

import { useState, useEffect, useCallback } from "react";

export default function useExamTimer(initialMinutes, onTimeUp) {
  const [timeLeft, setTimeLeft] = useState(initialMinutes * 60); // Convert to seconds
  const [isRunning, setIsRunning] = useState(true);

  // Format time as MM:SS
  const formatTime = useCallback((seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(
      2,
      "0"
    )}`;
  }, []);

  // Calculate time progress percentage
  const timeProgress = useCallback(() => {
    const totalSeconds = initialMinutes * 60;
    return (timeLeft / totalSeconds) * 100;
  }, [timeLeft, initialMinutes]);

  // Timer countdown effect
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = prev <= 1 ? 0 : prev - 1;
        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning]);

  // Handle time up
  useEffect(() => {
    if (timeLeft <= 0 && isRunning && onTimeUp) {
      onTimeUp();
    }
  }, [timeLeft, isRunning, onTimeUp]);

  // Pause/Resume timer
  const toggleTimer = useCallback(() => {
    setIsRunning((prev) => !prev);
  }, []);

  // Get time status color
  const getTimeColor = useCallback(() => {
    const percentage = timeProgress();
    if (percentage > 50) return "success"; // Green
    if (percentage > 25) return "warning"; // Orange
    return "error"; // Red
  }, [timeProgress]);

  return {
    timeLeft,
    isRunning,
    toggleTimer,
    formatTime: formatTime(timeLeft),
    timeProgress: timeProgress(),
    getTimeColor: getTimeColor(),
    isTimeUp: timeLeft <= 0,
  };
}
