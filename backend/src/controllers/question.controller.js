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
            return res.status(403).json({
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

        return res
            .status(201)
            .json({ message: "Question added", data: question });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

export const getQuestionsForExam = async (req, res) => {
    try {
        const { examId } = req.params;
        const questions = await Question.find({ examId }).select("-answerKey");
        return res.json({
            message: "Success",
            data: questions,
            meta: { count: questions.length },
        });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

export const getQuestionsByExamQuery = async (req, res) => {
    try {
        const { examId } = req.query;
        if (!examId) {
            return res
                .status(400)
                .json({ message: "examId query parameter is required" });
        }

        const questions = await Question.find({ examId }).select("-answerKey");
        return res.json({
            message: "Success",
            data: questions,
            meta: { count: questions.length },
        });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

export const getQuestionById = async (req, res) => {
    try {
        const { questionId } = req.params;
        const question = await Question.findById(questionId).select(
            "-answerKey"
        );

        if (!question) {
            return res.status(404).json({ message: "Question not found" });
        }

        return res.json({ message: "Success", data: question });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

export const updateQuestion = async (req, res) => {
    try {
        const { questionId } = req.params;
        const { questionText, options, answerKey, points } = req.body;

        const question = await Question.findById(questionId);
        if (!question) {
            return res.status(404).json({ message: "Question not found" });
        }

        const exam = await Exam.findById(question.examId);
        if (
            req.user._id.toString() !== exam.createdBy.toString() &&
            req.user.role !== "admin"
        ) {
            return res
                .status(403)
                .json({ message: "Only owner or admin can update question" });
        }

        if (questionText) question.questionText = questionText;
        if (options) question.options = options;
        if (answerKey) question.answerKey = answerKey;
        if (points) question.points = points;

        await question.save();
        return res.json({ message: "Question updated", data: question });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

export const deleteQuestion = async (req, res) => {
    try {
        const { questionId } = req.params;
        const question = await Question.findById(questionId);

        if (!question) {
            return res.status(404).json({ message: "Question not found" });
        }

        const exam = await Exam.findById(question.examId);
        if (
            req.user._id.toString() !== exam.createdBy.toString() &&
            req.user.role !== "admin"
        ) {
            return res
                .status(403)
                .json({ message: "Only owner or admin can delete question" });
        }

        await Question.findByIdAndDelete(questionId);
        return res.json({ message: "Question deleted" });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};
