// conversationSchema: Defines the schema for conversations between users. Each conversation includes an array of 
//                     participants, where each participant is referenced by their user ID. It also includes an 
//                     array of message IDs, referencing the messages exchanged within the conversation. 
//                     The schema automatically generates timestamps for createdAt and updatedAt.

import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
	{
		participants: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
		],
		messages: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Message",
				default: [],
			},
		],
	},
	{ timestamps: true }
);

const Conversation = mongoose.model("Conversation", conversationSchema);

export default Conversation;
