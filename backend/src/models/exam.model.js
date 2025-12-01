import mongoose from "mongoose";

const examSchema = new mongoose.Schema(
    {
        examTitle: { type: String, required: true, trim: true },
        classId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Class",
            required: true,
            index: true,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        category: {
            type: String,
            enum: ["PTS", "PAS", "Daily", "Practice"],
            default: "Practice",
        },
        timer: { type: Number, required: true },
        startTime: { type: Date, required: false, default: null },
        endTime: { type: Date, required: false, default: null },
        status: {
            type: String,
            enum: ["draft", "ongoing", "finished"],
            default: "draft",
            index: true,
        },
        shuffleQuestions: { type: Boolean, default: true },
    },
    { timestamps: true }
);

export const Exam = mongoose.model("Exam", examSchema);
