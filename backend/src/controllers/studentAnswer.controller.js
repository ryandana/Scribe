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

        return res.status(201).json({ message: "Submitted", score, result });
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
            classId,
            count: filtered.length,
            scores: filtered,
        });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};
