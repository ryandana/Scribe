import { StudentAnswer } from "../models/studentAnswer.model.js";
import { Question } from "../models/question.model.js";

export const submitAnswers = async (req, res) => {
    try {
        const { examId } = req.params;
        const { answers } = req.body;

        if (req.user.role !== "student") {
            return res
                .status(403)
                .json({ message: "Only students can submit answers" });
        }

        let score = 0;
        const detailedAnswers = [];

        for (const ans of answers) {
            const question = await Question.findById(ans.questionId).select(
                "answerKey points"
            );
            if (!question)
                return res
                    .status(404)
                    .json({ message: "Question not found during submit" });

            const isCorrect = ans.selectedOption === question.answerKey;
            if (isCorrect) score += question.points;

            detailedAnswers.push({
                questionId: ans.questionId,
                selectedOption: ans.selectedOption,
                isCorrect,
            });
        }

        const result = await StudentAnswer.create({
            examId,
            studentId: req.user._id,
            answers: detailedAnswers,
            score,
            gradingStatus: "graded",
        });

        return res
            .status(201)
            .json({ message: "Submitted", data: { score, result } });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

export const autosaveAnswers = async (req, res) => {
    try {
        const { examId } = req.params;
        const { answers } = req.body;

        if (req.user.role !== "student") {
            return res
                .status(403)
                .json({ message: "Only students can autosave answers" });
        }

        // Find existing submission or create new one
        let submission = await StudentAnswer.findOne({
            examId,
            studentId: req.user._id,
        });

        if (!submission) {
            // Create new submission
            submission = await StudentAnswer.create({
                examId,
                studentId: req.user._id,
                answers: answers || [],
                score: 0,
                gradingStatus: "pending",
            });
        } else {
            // Update existing submission
            submission.answers = answers || [];
            await submission.save();
        }

        return res.json({ message: "Autosaved", data: submission });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

export const getStudentExamSubmission = async (req, res) => {
    try {
        const { examId } = req.params;

        const submission = await StudentAnswer.findOne({
            examId,
            studentId: req.user._id,
        }).populate("answers.questionId");

        if (!submission) {
            return res.status(404).json({ message: "No submission found" });
        }

        return res.json({ message: "Success", data: submission });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

export const getScoresByClass = async (req, res) => {
    try {
        const { classId } = req.params;
        if (req.user.role !== "teacher" && req.user.role !== "admin") {
            return res.status(403).json({ message: "Forbidden" });
        }

        const scores = await StudentAnswer.find().populate(
            "studentId",
            "username nickname classId"
        );
        const filtered = scores.filter(
            (s) => s.studentId.classId?.toString() === classId
        );

        return res.json({
            message: "Success",
            data: filtered,
            meta: { classId, count: filtered.length },
        });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

export const getExamResults = async (req, res) => {
    try {
        const { examId } = req.params;

        if (req.user.role !== "teacher" && req.user.role !== "admin") {
            return res.status(403).json({ message: "Forbidden" });
        }

        const results = await StudentAnswer.find({ examId })
            .populate("studentId", "username nickname")
            .populate("examId", "examTitle");

        return res.json({
            message: "Success",
            data: results,
            meta: { count: results.length },
        });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};
