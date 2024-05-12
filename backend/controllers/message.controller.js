import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";
import User from "../models/user.model.js";
import getResponse from "../utils/response.js";


//...........................send message controllers......................................................
// sendMessage controller: Handles sending messages between users. It first checks if the receiver is online and 
//                         their status. If the receiver is busy, it uses a language model API to generate an 
//                         appropriate response. If the receiver is available, it saves the message to the 
//                          database and emits a newMessage event using Socket.IO to notify the receiver.

export const sendMessage = async (req, res) => {
    try {
        const { message } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        // Check if receiver is online and get their status
        const receiver = await User.findById(receiverId);

        // If receiver is not found or is not online, send an error response
        // if (!receiver || receiver.is_online !== '1') {
        //     return res.status(400).json({ error: "Receiver is not online" });
        // }

        // If receiver is BUSY, generate appropriate response using language model API
        if (receiver.status === 'Busy') {
            try {
                const responseData = await Promise.race([
                    getResponse(message), // Call the LLM API
                    new Promise((resolve, reject) => {
                        setTimeout(() => {
                            reject(new Error("API response timed out"));
                        }, 10000); // Set a timeout of 10 seconds
                    })
                ]);
                // Send the response back to the sender
                return res.status(200).json({ message: responseData });
            } catch (error) {
                // If the API response timed out, send a standard message indicating unavailability
                return res.status(200).json({ message: "The user is currently unavailable" });
            }
        }

        // Proceed with sending the message if the receiver is AVAILABLE
        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] },
        });

        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, receiverId],
            });
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            message,
        });

        await Promise.all([conversation.save(), newMessage.save()]);

        // SOCKET IO FUNCTIONALITY
        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            // io.to(<socket_id>).emit() used to send events to specific client
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        res.status(201).json(newMessage);
    } catch (error) {
        console.log("Error in sendMessage controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};
//................................................*****.............................................................


//.....................................get message controller...................................................................
// getMessages controller: Retrieves the messages exchanged between the authenticated user and another user 
//                         specified by the userToChatId parameter. It retrieves the conversation from the 
//                         database based on the participants' IDs, populates the actual messages, and returns 
//                         them in the response.

export const getMessages = async (req, res) => {
	try {
		const { id: userToChatId } = req.params;
		const senderId = req.user._id;

		const conversation = await Conversation.findOne({
			participants: { $all: [senderId, userToChatId] },
		}).populate("messages"); // NOT REFERENCE BUT ACTUAL MESSAGES

		if (!conversation) return res.status(200).json([]);

		const messages = conversation.messages;

		res.status(200).json(messages);
	} catch (error) {
		console.log("Error in getMessages controller: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};
//.................................................***..............................................................
