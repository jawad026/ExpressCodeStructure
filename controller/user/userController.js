// controllers/authController.js

const UserModel = require("../../model/UserModel");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const {
  authenticateUser,
  registerUser,
  checkEmailExistence,
  loginUser,
  logoutUser,
} = require("../../services/user.services");

class userController {
  async loginUser(req, res, next) {
    loginUser(req, res, next);
  }

  async logoutUser(req, res, next) {
    try {
      // Call the logoutUser function from the AuthService
      const isLoggedOut = logoutUser(req);

      if (isLoggedOut) {
        return res.json({ message: 'Logout successful' });
      } else {
        return res.status(500).json({ message: 'Logout failed' });
      }
    } catch (error) {
      next(error);
    }
  }
  async signupUser(req, res, next) {
    try {
      const { email, password, phone, name } = req.body;

      // Check if the email is already registered
      const existingUser = await checkEmailExistence(email);
      console.log(existingUser);
      if (existingUser) {
        return res.status(409).json({ message: "Email already registered" });
      }
      // Hash the password before saving it to the database
      // Create a new user record
      const newUser = { email, password, phone, name };
      await registerUser(newUser);

      res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
      next(err);
    }
  }

  // Additional authentication-related controller functions (e.g., registerUser, forgotPassword, etc.)
}

module.exports = new userController();
