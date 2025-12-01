import mongoose from "mongoose";

const studentAnswerSchema = new mongoose.Schema(
    {
        examId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Exam",
            required: true,
            index: true,
        },
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        answers: [
            {
                questionId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Question",
                    required: true,
                },
                selectedOption: { type: String, required: true },
                isCorrect: { type: Boolean, default: false },
            },
        ],
        submittedAt: { type: Date, default: Date.now, index: true },
        score: { type: Number, default: 0 },
        gradedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },
        gradingStatus: {
            type: String,
            enum: ["pending", "graded"],
            default: "pending",
            index: true,
        },
    },
    { timestamps: true }
);

export const StudentAnswer = mongoose.model(
    "StudentAnswer",
    studentAnswerSchema
);
