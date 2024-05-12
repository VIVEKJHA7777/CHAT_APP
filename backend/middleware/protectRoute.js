// This middleware function protects routes by verifying the authenticity of JSON Web Tokens (JWT).
// It extracts the JWT from the request cookies and verifies its validity using the JWT_SECRET from environment variables.
// If the token is missing or invalid, it returns a 401 Unauthorized error.
// If the token is valid, it decodes the user ID from the token and retrieves the corresponding user from the database.
// If the user is found, it attaches the user object to the request object for use in subsequent middleware or route handlers.
// If the user is not found, it returns a 404 User Not Found error.
// If an error occurs during token verification or user retrieval, it returns a 500 Internal Server Error.
// This middleware is intended to be used to protect routes that require authentication.
// It is exported for use in the application's route handlers.


import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const protectRoute = async (req, res, next) => {
	try {
		const token = req.cookies.jwt;

		if (!token) {
			return res.status(401).json({ error: "Unauthorized - No Token Provided" });
		}

		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		if (!decoded) {
			return res.status(401).json({ error: "Unauthorized - Invalid Token" });
		}

		const user = await User.findById(decoded.userId).select("-password");

		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		req.user = user;

		next();
	} catch (error) {
		console.log("Error in protectRoute middleware: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

export default protectRoute;
