// messageSchema: Defines the schema for messages exchanged between users. Each message contains the sender's ID, 
//                 receiver's ID, and the message content. The schema also includes timestamps for createdAt and 
//                  updatedAt.

import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
	{
		senderId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		receiverId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		message: {
			type: String,
			required: true,
		},
		// createdAt, updatedAt
	},
	{ timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);

export default Message;
