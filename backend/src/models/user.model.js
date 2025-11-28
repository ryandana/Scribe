import mongoose from "mongoose";
import validator from "validator";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Username is required"],
        unique: true,
        trim: true,
        minLength: 3,
        maxLength: 60
    },
    nickname: {
        type: String,
        required: [true, "Nickname is required"],
        unique: false,
        minLength: 3,
        maxLength: 60
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
        }
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minLength: 6,
    },
    avatar_url: {
        type: String,
        required: false,
        default: null
    }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
export default User;