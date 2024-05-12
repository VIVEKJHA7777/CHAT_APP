import User from "../models/user.model.js";


//...........................user controllers........................................................
// getUsersForSidebar controller: Retrieves a list of users who are currently online, excluding the authenticated 
//                                user. It queries the database for users with the is_online flag set to '1' and 
//                                filters out the logged-in user. The controller returns the list of filtered users 
//                                in the response.

export const getUsersForSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;

        const filteredUsers = await User.find({ _id: { $ne: loggedInUserId }, is_online: '1' }).select("-password");

        res.status(200).json(filteredUsers);
    } catch (error) {
        console.error("Error in getUsersForSidebar: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

//....................................***....................................................................

