// userSchema: Defines the schema for users in the application. It includes fields for the user's full name, 
//             email (which must be unique), password, online status (defaulting to '0' for offline), 
//             and status (which can be either 'available' or 'Busy', defaulting to 'Busy'). The schema also 
//             generates timestamps for createdAt and updatedAt.

import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    is_online: {
        type: String,
        default: '0',
    },
    status: {
        type: String,
        enum: ['available', 'Busy'],
        default: 'Busy', 
    }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

export default User;
