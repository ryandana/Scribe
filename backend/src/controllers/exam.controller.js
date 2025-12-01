import { Exam } from "../models/exam.model.js";

export const createExam = async (req, res) => {
    try {
        const { examTitle, classId, timer, category, shuffleQuestions } =
            req.body;

        if (req.user.role !== "teacher" && req.user.role !== "admin") {
            return res
                .status(403)
                .json({ message: "Only teachers or admins can create exams" });
        }

        const exam = await Exam.create({
            examTitle,
            classId,
            timer,
            category,
            shuffleQuestions,
            createdBy: req.user._id,
        });

        return res.status(201).json({ message: "Exam created", exam });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

export const getExamsByClass = async (req, res) => {
    try {
        const { classId } = req.params;
        const exams = await Exam.find({ classId }).populate(
            "createdBy",
            "username nickname"
        );
        return res.json({ count: exams.length, exams });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};
