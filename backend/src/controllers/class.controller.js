import { Class, User } from "../models/user.model.js";

export const createClass = async (req, res) => {
    try {
        const { className, gradeLevel, major } = req.body;

        const existingClass = await Class.findOne({ className });
        if (existingClass) {
            return res.status(400).json({
                message: "Class already exists",
            });
        }

        const newClass = await Class.create({ className, gradeLevel, major });

        return res.status(201).json({
            message: "Class created successfully",
            data: newClass,
        });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

export const getAllClasses = async (req, res) => {
    try {
        const classes = await Class.find();

        return res.status(200).json({
            message: "Classes fetched successfully",
            data: classes,
            meta: {
                count: classes.length,
            },
        });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

export const getClassById = async (req, res) => {
    try {
        const { id } = req.params;
        const classData = await Class.findById(id);

        if (!classData) {
            return res.status(404).json({
                message: "Class not found",
            });
        }

        return res.status(200).json({
            message: "Class fetched successfully",
            data: classData,
        });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

export const updateClass = async (req, res) => {
    try {
        const { id } = req.params;
        const { className, gradeLevel, major } = req.body;

        const classData = await Class.findById(id);
        if (!classData) {
            return res.status(404).json({
                message: "Class not found",
            });
        }

        if (className) classData.className = className;
        if (gradeLevel) classData.gradeLevel = gradeLevel;
        if (major) classData.major = major;

        await classData.save();

        return res.status(200).json({
            message: "Class updated successfully",
            data: classData,
        });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

export const deleteClass = async (req, res) => {
    try {
        const { id } = req.params;

        const classData = await Class.findById(id);
        if (!classData) {
            return res.status(404).json({
                message: "Class not found",
            });
        }

        await User.updateMany({ classId: id }, { $set: { classId: null } });

        await classData.deleteOne();

        return res.status(200).json({
            message: "Class deleted successfully",
        });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

export const getStudentsByClass = async (req, res) => {
    try {
        const { id } = req.params;

        const classData = await Class.findById(id);
        if (!classData) {
            return res.status(404).json({
                message: "Class not found",
            });
        }

        const students = await User.find({
            role: "student",
            classId: id,
        }).select("-password");

        return res.status(200).json({
            message: "Students fetched successfully",
            data: students,
            meta: {
                className: classData.className,
                totalStudents: students.length,
            },
        });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
};
