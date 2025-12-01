import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
    {
        examId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Exam",
            required: true,
            index: true,
        },
        questionText: { type: String, required: true, trim: true },
        options: { type: [String], required: true },
        answerKey: { type: String, required: true },
        points: { type: Number, default: 1 },
        shuffleOptions: { type: Boolean, default: true },
    },
    { timestamps: true }
);

export const Question = mongoose.model("Question", questionSchema);
