import { addUser, getAUser, getUserId, removeUser } from "../models/user.model.js";
import { generateToken } from "../utils/token.utils.js";
import { OAuth2Client } from 'google-auth-library';

// In a real app, this should be in .env. We'll verify without it for now if not present, but it's less secure.
const client = new OAuth2Client(process.env.VITE_FIREBASE_CLIENT_ID || 'dummy');

export const googleAuth = async (req, res) => {
     const { idToken } = req.body;
     try {
          // Verify the token
          const ticket = await client.verifyIdToken({
               idToken: idToken,
               // audience: process.env.VITE_FIREBASE_CLIENT_ID,  // Uncomment and set this in production
          });
          const payload = ticket.getPayload();
          const email = payload['email'];
          const fullname = payload['name'] || email;
          const photoUrl = payload['picture'] || '';

          // Check if user exists
          let user = await getAUser(email);
          let isNewUser = false;

          if (user.length === 0) {
               // Register user
               await addUser(fullname, email, photoUrl);
               user = await getAUser(email);
               isNewUser = true;
          }

          if (user.length === 0) {
               return res.status(500).json({ message: "Failed to create or retrieve user." });
          }

          const token = generateToken(user[0].id);

          res.cookie("token", token, {
               httpOnly: true,
               secure: process.env.NODE_ENV === "production",
               sameSite: "strict",
               maxAge: 3600000,
          });

          return res.status(200).json({
               message: isNewUser ? "Registration successful." : "Login successful.",
               token: token,
               data: user[0]
          });

     } catch (error) {
          console.error("Google Auth Error:", error);
          return res.status(401).json({ message: "Invalid Google token", error: error.message });
     }
};

export const register = async (req, res) => {
     const { fullname, email, photoUrl } = req.body;
     if (!fullname || !email || !photoUrl) {
          return res.status(404).json({ message: "Please provide all details" });
     }

     try {
          const user = await getAUser(email);
          if (user.length > 0) {
               return res.status(409).json({ message: "User already existed." });
          }

          const result = await addUser(fullname, email, photoUrl);
          const userCreated = await getAUser(email)
          if (userCreated.length === 0) {
               return res.json({ message: "Email not registered. Please register with us." });
          }

          const token = generateToken(userCreated[0].id);

          res.cookie("token", token, {
               httpOnly: true,
               secure: process.env.NODE_ENV === "production",
               sameSite: "strict",
               maxAge: 3600000,
          });
          if (result.affectedRows === 0) {
               return res.status(402).json({ message: "User not created." });
          } else {
               return res.status(200).json({
                    message: "User created successfully.",
                    token: token,
                    data: userCreated[0]
               });
          }
     } catch (error) {
          console.error(error);
          return res.status(500).json({ message: 'Server error', error: error.message });
     }
};

export const checkUser = async (req, res) => {
     const { email } = req.query;
     if (!email) {
          return res.status(400).json({ message: "Email is required." });
     }

     try {
          const user = await getAUser(email);
          return res.status(200).json({ exists: user.length > 0 });
     } catch (error) {
          console.error(error);
          return res.status(500).json({ message: "Internal Server Error" });
     }
};



export const login = async (req, res, next) => {
     const { email } = req.body;

     try {
          const user = await getAUser(email);
          if (user.length === 0) {
               return res.json({ message: "Email not registered. Please register with us." });
          }

          const token = generateToken(user[0].id);

          res.cookie("token", token, {
               httpOnly: true,
               secure: process.env.NODE_ENV === "production",
               sameSite: "strict",
               maxAge: 3600000,
          });

          res.status(200).json({
               message: "User logged in successfully.",
               token: token,
               data: user[0]
          });
     } catch (error) {
          console.error(error)
          return res.status(500).json({ message: 'Server error', error: error.message });
     }
};

export const detailsUser = async (req, res, next) => {
     const id = req.user.id;
     try {
          const user = await getUserId(id);
          if (user.length === 0) {
               return res.json({ message: "User not found." });
          }
          res.status(200).json({
               message: "User found successfully.",
               data: user[0]
          });
     } catch (error) {
          console.error(error)
          return res.status(500).json({ message: 'Server error', error: error.message });
     }
};

export const deleteAUser = async (req, res, next) => {
     const id = req.user.id;

     try {
          const deletedUser = await removeUser(id);
          if (deletedUser.affectedRows === 0) {
               return res.status(402).json({ message: "User not found." });
          } else {
               return res.status(200).json({
                    message: "User deleted successfully."
               });
          }
     } catch (error) {
          console.error(error)
          return res.status(500).json({ message: 'Server error', error: error.message });
     }
};