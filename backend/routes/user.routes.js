// This file defines the route for fetching users to display in the user who is online 
// - GET /: Route to fetch users for the sidebar,
//          protected by the protectRoute middleware to ensure authentication,
//          invoking the getUsersForSidebar controller function.
// This route is exported as an Express Router instance for use in the main application.

import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import { getUsersForSidebar } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/", protectRoute, getUsersForSidebar);  // get user only who is online 

export default router;
