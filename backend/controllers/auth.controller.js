// This controller handles user authentication related operations including signup, login, and logout.

import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import generateTokenAndSetCookie from "../utils/generateToken.js";
import { io } from "../socket/socket.js";


//......................................sign up controller............................................................
// Signup controller: Handles user signup by validating input, hashing the password, creating a new user instance,
//                   saving it to the database, generating a JWT token, and setting the token as a cookie in the 
//                    response.

export const signup = async (req, res) => {
    try {
        const { fullName, email, password, confirmPassword } = req.body;

        if (password !== confirmPassword) {
            return res.status(400).json({ error: "Passwords don't match" });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ error: "Username already exists" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user instance
        const newUser = new User({
            fullName,
            email,
            password: hashedPassword,
            is_online: '1', // Set is_online to '1' for signup
            status: 'available' // Set status to 'available' for signup
        });

        // Save new user
        await newUser.save();

        // Generate JWT token and set cookie
        generateTokenAndSetCookie(newUser._id, res);

         io.emit("userSignup", { userId: newUser._id, fullName: newUser.fullName });


        res.status(201).json({
            _id: newUser._id,
            fullName: newUser.fullName,
            email: newUser.email,
        });
    } catch (error) {
        console.log("Error in signup controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
//...........................................****.....................................................................


//..................................login controller.....................................................................
// Login controller: Manages user login by finding the user with the provided email, validating the password, 
//                   updating the user's status to online, generating a JWT token, and setting the token as a 
//                  cookie in the response.

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ error: "Invalid username or password" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            return res.status(400).json({ error: "Invalid username or password" });
        }

        // Update user status
        user.is_online = '1';
        user.status = 'available';
        await user.save();

        // Generate token and set cookie
        generateTokenAndSetCookie(user._id, res);

        io.emit("userLogin", { userId: user._id, fullName: user.fullName });

        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email
        });
    } catch (error) {
        console.log("Error in login controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
//..............................................******............................................................................


//..........................................logout controller functionality...............................................................
// Logout controller: Handles user logout by finding the user with the authenticated user ID, updating the user's 
//                    status to offline and busy, clearing the JWT cookie from the response to invalidate the session.


export const logout = async (req, res) => {
    try {
        const userId = req.user._id;; // Assuming userId is available in req object after authentication
        const user = await User.findById(userId);

        if (!user) {
            return res.status(400).json({ error: "User not found" });
        }

        // Update user status
        user.is_online = '0';
        user.status = 'Busy';
        await user.save();

        // Clear JWT cookie
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.log("Error in logout controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
