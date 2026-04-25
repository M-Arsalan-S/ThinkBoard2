import { CognitoJwtVerifier } from "aws-jwt-verify";
import User from "../models/User.js";

// Verifies the Cognito access token sent as a Bearer header
const verifier = CognitoJwtVerifier.create({
  userPoolId: "ap-south-1_HopcJLw7m",
  tokenUse: "access",
  clientId: "5gj3npeacpkv7a1fomc2ddgqbr",
});

export const protectRoute = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized - No Token Provided" });
    }

    const token = authHeader.split(" ")[1];
    const payload = await verifier.verify(token);

    // Find existing user or auto-create on first request
    let user = await User.findOne({ cognitoSub: payload.sub });

    if (!user) {
      // First time this Cognito user hits our API — create a MongoDB record
      // 'username' in the access token is the email (since that's our Cognito sign-in alias)
      user = await User.create({
        cognitoSub: payload.sub,
        name: payload.username?.split("@")[0] || "User",
        email: payload.username || "",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log("Error in protectRoute middleware:", error.message);
    res.status(401).json({ message: "Unauthorized - Invalid Token" });
  }
};
