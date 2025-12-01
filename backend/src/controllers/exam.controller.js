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

        return res.status(201).json({ message: "Exam created", data: exam });
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
        return res.json({
            message: "Success",
            data: exams,
            meta: { count: exams.length },
        });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

export const getExamById = async (req, res) => {
    try {
        const { examId } = req.params;
        const exam = await Exam.findById(examId).populate(
            "createdBy",
            "username nickname"
        );

        if (!exam) {
            return res.status(404).json({ message: "Exam not found" });
        }

        return res.json({ message: "Success", data: exam });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

export const updateExam = async (req, res) => {
    try {
        const { examId } = req.params;
        const { examTitle, timer, category, status, shuffleQuestions } =
            req.body;

        const exam = await Exam.findById(examId);
        if (!exam) {
            return res.status(404).json({ message: "Exam not found" });
        }

        if (
            req.user._id.toString() !== exam.createdBy.toString() &&
            req.user.role !== "admin"
        ) {
            return res
                .status(403)
                .json({ message: "Only owner or admin can update exam" });
        }

        if (examTitle) exam.examTitle = examTitle;
        if (timer) exam.timer = timer;
        if (category) exam.category = category;
        if (status) exam.status = status;
        if (shuffleQuestions !== undefined)
            exam.shuffleQuestions = shuffleQuestions;

        await exam.save();
        return res.json({ message: "Exam updated", data: exam });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

export const deleteExam = async (req, res) => {
    try {
        const { examId } = req.params;
        const exam = await Exam.findById(examId);

        if (!exam) {
            return res.status(404).json({ message: "Exam not found" });
        }

        if (
            req.user._id.toString() !== exam.createdBy.toString() &&
            req.user.role !== "admin"
        ) {
            return res
                .status(403)
                .json({ message: "Only owner or admin can delete exam" });
        }

        await Exam.findByIdAndDelete(examId);
        return res.json({ message: "Exam deleted" });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};
