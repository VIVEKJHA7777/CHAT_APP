// This file defines the message routes for the application.
// It utilizes the Express Router to handle HTTP requests related to messaging functionality.
// - GET /:id: Route to fetch messages between the authenticated user and the specified user ID,
//            protected by the protectRoute middleware to ensure authentication,
//            invoking the getMessages controller function.
// - POST /send/:id: Route to send a message to the specified user ID,
//                   protected by the protectRoute middleware to ensure authentication,
//                   invoking the sendMessage controller function.
// These routes are exported as an Express Router instance for use in the main application.


import express from "express";
import { getMessages, sendMessage } from "../controllers/message.controller.js";
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

router.get("/:id", protectRoute, getMessages);  
router.post("/send/:id", protectRoute, sendMessage);  //send message if the user is online only or status is available

export default router;
