import { Question } from "../models/question.model.js";
import { Exam } from "../models/exam.model.js";

export const addQuestion = async (req, res) => {
    try {
        const { examId } = req.params;
        const { questionText, options, answerKey, points, shuffleOptions } =
            req.body;

        const exam = await Exam.findById(examId);
        if (!exam) return res.status(404).json({ message: "Exam not found" });

        if (
            req.user._id.toString() !== exam.createdBy.toString() &&
            req.user.role !== "admin"
        ) {
            return res
                .status(403)
                .json({
                    message: "Only owner teacher or admin can add questions",
                });
        }

        const question = await Question.create({
            examId,
            questionText,
            options,
            answerKey,
            points,
            shuffleOptions,
        });

        return res.status(201).json({ message: "Question added", question });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

export const getQuestionsForExam = async (req, res) => {
    try {
        const { examId } = req.params;
        const questions = await Question.find({ examId }).select(
            "-answerKey -isCorrect"
        );
        return res.json({ count: questions.length, questions });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};
