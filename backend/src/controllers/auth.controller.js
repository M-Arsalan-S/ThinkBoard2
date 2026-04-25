import {
  CognitoIdentityProviderClient,
  SignUpCommand,
  AdminConfirmSignUpCommand,
  InitiateAuthCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

const cognitoClient = new CognitoIdentityProviderClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const COGNITO_CLIENT_ID = process.env.COGNITO_CLIENT_ID;
const COGNITO_USER_POOL_ID = process.env.COGNITO_USER_POOL_ID;

// Helper: issue our own JWT and set it as an httpOnly cookie
const setJwtCookie = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });

  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV !== "development",
  });
};

// ─── SIGNUP ──────────────────────────────────────────────
export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters" });
    }

    // 1. Register the user in Cognito (credentials stored in AWS)
    const signUpRes = await cognitoClient.send(
      new SignUpCommand({
        ClientId: COGNITO_CLIENT_ID,
        Username: email,
        Password: password,
        UserAttributes: [
          { Name: "email", Value: email },
          { Name: "name", Value: name },
        ],
      })
    );

    const cognitoSub = signUpRes.UserSub;

    // 2. Auto-confirm the user (skips email verification for dev)
    await cognitoClient.send(
      new AdminConfirmSignUpCommand({
        UserPoolId: COGNITO_USER_POOL_ID,
        Username: email,
      })
    );

    // 3. Save a lightweight user record in MongoDB (NO password stored)
    const newUser = new User({ cognitoSub, name, email });
    await newUser.save();

    // 4. Issue our own session JWT
    setJwtCookie(res, newUser._id);

    res.status(201).json({
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
    });
  } catch (error) {
    console.log("Error in signup controller:", error.name, error.message);

    if (error.name === "UsernameExistsException") {
      return res.status(400).json({ message: "User already exists" });
    }
    if (error.name === "InvalidPasswordException") {
      return res.status(400).json({
        message: "Password must have uppercase, lowercase, number, and special character",
      });
    }
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ─── LOGIN ───────────────────────────────────────────────
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Authenticate against Cognito (password verified by AWS)
    await cognitoClient.send(
      new InitiateAuthCommand({
        AuthFlow: "USER_PASSWORD_AUTH",
        ClientId: COGNITO_CLIENT_ID,
        AuthParameters: {
          USERNAME: email,
          PASSWORD: password,
        },
      })
    );

    // 2. If Cognito didn't throw, credentials are valid — find MongoDB user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found in database" });
    }

    // 3. Issue our own session JWT
    setJwtCookie(res, user._id);

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    console.log("Error in login controller:", error.name, error.message);

    if (
      error.name === "NotAuthorizedException" ||
      error.name === "UserNotFoundException"
    ) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ─── LOGOUT ──────────────────────────────────────────────
export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ─── CHECK AUTH ──────────────────────────────────────────
export const checkAuth = (req, res) => {
  try {
    // req.user is set by protectRoute middleware (unchanged)
    res.status(200).json(req.user);
  } catch (error) {
    console.log("Error in checkAuth controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
