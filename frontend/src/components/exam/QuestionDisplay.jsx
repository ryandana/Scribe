"use client";

import Image from "next/image";

export default function QuestionDisplay({
  question,
  questionNumber,
  totalQuestions,
  selectedAnswer,
  onSelectAnswer,
  isDoubtful,
  onToggleDoubtful,
}) {
  if (!question) {
    return (
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body text-center">
          <p className="text-error">Question not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card bg-base-100 shadow-lg">
      <div className="card-body space-y-6">
        {/* Question Header */}
        <div className="flex items-start justify-between border-b pb-4">
          <div className="flex-1">
            <div className="badge badge-lg mb-2">
              Question {questionNumber} of {totalQuestions}
            </div>
            <h2 className="text-2xl font-bold">{question.questionText}</h2>
          </div>
          <button
            onClick={onToggleDoubtful}
            className={`btn btn-sm ${isDoubtful ? "btn-warning" : "btn-ghost"}`}
          >
            {isDoubtful ? "⭐ Marked" : "☆ Mark"}
          </button>
        </div>

        {/* Question Image (if exists) */}
        {question.imageUrl && (
          <div className="flex justify-center">
            <Image
              src={question.imageUrl}
              alt="Question"
              width={500}
              height={300}
              className="max-h-64 rounded-lg"
            />
          </div>
        )}

        {/* Answer Options */}
        <div className="space-y-3">
          <p className="text-sm font-semibold text-base-content/70">
            Select your answer:
          </p>
          {question.options && question.options.length > 0 ? (
            <div className="space-y-2">
              {question.options.map((option, index) => {
                const optionKey = String.fromCharCode(65 + index); // A, B, C, D
                const isSelected = selectedAnswer === optionKey;

                return (
                  <button
                    key={index}
                    onClick={() => onSelectAnswer(optionKey)}
                    className={`card cursor-pointer transition-all w-full text-left ${
                      isSelected
                        ? "bg-primary text-primary-content ring-2 ring-primary"
                        : "bg-base-200 hover:bg-base-300"
                    }`}
                  >
                    <div className="card-body p-4 flex-row items-center gap-4">
                      <div
                        className={`badge badge-lg font-bold ${
                          isSelected ? "badge-primary" : "badge-ghost"
                        }`}
                      >
                        {optionKey}
                      </div>
                      <p
                        className={`flex-1 ${
                          isSelected ? "font-semibold" : ""
                        }`}
                      >
                        {option}
                      </p>
                      {isSelected && (
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <p className="text-error">No options available for this question</p>
          )}
        </div>

        {/* Question Info */}
        <div className="bg-base-200 rounded-lg p-4 text-sm space-y-2">
          <div className="flex justify-between">
            <span className="text-base-content/70">Points:</span>
            <span className="font-semibold">{question.points || 0} pts</span>
          </div>
          {question.category && (
            <div className="flex justify-between">
              <span className="text-base-content/70">Category:</span>
              <span className="font-semibold">{question.category}</span>
            </div>
          )}
        </div>

        {/* Status Message */}
        {selectedAnswer ? (
          <div className="alert alert-success">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>
              Answer selected: <strong>{selectedAnswer}</strong>
            </span>
          </div>
        ) : (
          <div className="alert alert-info">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="stroke-current shrink-0 w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Please select an answer</span>
          </div>
        )}
      </div>
    </div>
  );
}
