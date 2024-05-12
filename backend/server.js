import path from "path";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";
import userRoutes from "./routes/user.routes.js";  
import connectToMongoDB from "./db/connectToMongoDB.js";
import { app, server } from "./socket/socket.js";



dotenv.config();

const PORT = process.env.PORT || 5000;

//middleware for parsing json data and cookies................................

app.use(express.json()); // to parse the incoming requests with JSON payloads (from req.body)
app.use(cookieParser());




//...................Routes for api endpoints ..........................................

app.use("/api/auth", authRoutes); // Routes for authentication
app.use("/api/messages", messageRoutes); //Routes for handling messages
app.use("/api/users", userRoutes);   // Routes for user-related operations


//.......................................................................................

// app.listen(PORT, () => {
// 	connectToMongoDB();
// 	console.log(`Server Running on port ${PORT}`);
// });

server.listen(PORT, () => {
	connectToMongoDB();
	console.log(`Server Running on port ${PORT}`);
});
