import mongoose from "mongoose";
import validator from "validator";

const userSchema = new mongoose.Schema(
    {
        nis: {
            type: Number,
            required: false,
            unique: true,
            sparse: true,
            trim: true,
            minLength: 3,
        },
        username: {
            type: String,
            required: [true, "Username is required"],
            unique: true,
            trim: true,
            minLength: 3,
            maxLength: 60,
        },
        nickname: {
            type: String,
            required: [true, "Nickname is required"],
            unique: false,
            minLength: 3,
            maxLength: 255,
        },
        email: {
            type: String,
            required: [true, "Username is required"],
            unique: true,
            trim: true,
            lowercase: true,
            validate: {
                validator: (v) => validator.isEmail(v),
                message: (props) => `${props.value} is not a valid email`,
            },
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minLength: 6,
            maxLength: 255,
        },
        avatar_url: {
            type: String,
            required: false,
            default: null,
        },
        classId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Class",
            required: false,
        },
        role: {
            type: String,
            required: true,
            enum: ["student", "teacher", "admin"],
            default: "user",
        },
    },
    { timestamps: true }
);

const classSchema = new mongoose.Schema(
    {
        className: { type: String, required: true, unique: true },
        gradeLevel: { type: String, enum: ["X", "XI", "XII"], required: true },
        major: { type: String, required: true },
    },
    { timestamps: true }
);

export const Class = mongoose.model("Class", classSchema);
export const User = mongoose.model("User", userSchema);
