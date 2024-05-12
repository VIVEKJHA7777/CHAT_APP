// This function generates a JWT token containing the userId and sets it as a cookie in the response.
// It takes the userId and the response object (res) as parameters.
// The generated JWT token is signed using the JWT_SECRET environment variable with a 15-day expiration.
// The cookie "jwt" is set with the generated token, ensuring it is HTTP-only to prevent XSS attacks.
// Additionally, it sets the sameSite attribute to "strict" to mitigate CSRF attacks.
// In production mode, it sets the secure attribute to true to ensure the cookie is only sent over HTTPS.

import jwt from "jsonwebtoken";

const generateTokenAndSetCookie = (userId, res) => {
	const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
		expiresIn: "15d",
	});

	res.cookie("jwt", token, {
		maxAge: 15 * 24 * 60 * 60 * 1000, // MS
		httpOnly: true, // prevent XSS attacks cross-site scripting attacks
		sameSite: "strict", // CSRF attacks cross-site request forgery attacks
		secure: process.env.NODE_ENV !== "development",
	});
};

export default generateTokenAndSetCookie;
