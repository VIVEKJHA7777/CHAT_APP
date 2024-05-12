// This file defines the authentication routes for the application.
// It utilizes the Express Router to handle HTTP requests related to user authentication.
// - POST /signup: Route for user registration, invoking the signup controller function.
// - POST /login: Route for user login, invoking the login controller function.
// - POST /logout: Route for user logout, protected by the protectRoute middleware to ensure authentication,
//                 invoking the logout controller function.
// These routes are exported as an Express Router instance for use in the main application.

import express from "express";
import { login, logout, signup } from "../controllers/auth.controller.js";
import protectRoute from "../middleware/protectRoute.js";


const router = express.Router();

router.post("/signup", signup);

router.post("/login", login);

router.post("/logout",protectRoute, logout);

export default router;
