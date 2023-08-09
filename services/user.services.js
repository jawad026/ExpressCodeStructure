// services/authService.js
const passport = require("passport");
const bcrypt = require("bcrypt");
const UserModel = require("../model/UserModel");
var authenticate = require("../config/passport.config");
class AuthService {
  
  async loginUser(req, res, next) {
    passport.authenticate("local", async (err, user, info) => {
      try {
        if (err) {
          return next(err);
        }
        if (!user) {
          return res.status(401).json({ message: info.message });
        }

        // If authentication is successful, manually log in the user using Passport.js
        req.login(user, (err) => {
          if (err) {
            return next(err);
          }
          const { _id, name, email, phone } = user;
          var token = authenticate.signToken({ _id: user._id });
          res.cookie('user_token', token, { maxAge: 2000, httpOnly: true , redirectTo: '/text' });
          return res.json({
            message: "Login successful",
            user: { _id, name, email, phone,token },
          });
        });
      } catch (err) {
        return next(err);
      }
    })(req, res, next);
  }

  async checkEmailExistence(email) {
    try {
      const existingUser = await UserModel.findOne({ email });
      return !!existingUser; // Return true if the email exists, false otherwise
    } catch (error) {
      throw error;
    }
  }

  async hashPassword(password) {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  async authenticateUser(email, password) {
    const user = await UserModel.findOne({ email });
    if (!user || !user.validPassword(password)) {
      throw new Error("Incorrect email or password");
    }
    return user;
  }

  async registerUser({ email, password, phone, name }) {
    try {
      // Hash the password before saving it to the database
      const hashedPassword = await bcrypt.hash(password, 10);
      // Create a new user record
      const newUser = new UserModel({
        email,
        hash_password: hashedPassword,
        name,
        phone,
      });
      await newUser.save();

      return newUser;
    } catch (error) {
      throw error;
    }
  }

  async updateUser(userId, updates) {
    try {
      // Find the user by userId and update their information
      const user = await UserModel.findByIdAndUpdate(userId, updates, {
        new: true,
      });

      return user;
    } catch (error) {
      throw error;
    }
  }

  async changePassword(userId, currentPassword, newPassword) {
    try {
      // Find the user by userId
      const user = await UserModel.findById(userId);

      // Check if the provided current password matches the stored password
      if (!user.validPassword(currentPassword)) {
        throw new Error("Incorrect current password");
      }

      // Hash the new password before updating it
      const hashedPassword = await this.hashPassword(newPassword);

      // Update the password
      user.password = hashedPassword;
      await user.save();

      return user;
    } catch (error) {
      throw error;
    }
  }

  async logoutUser(req) {
    try {
      // Use Passport.js req.logout() to log the user out and clear the session
      req.logout();
      return true; // Indicate that logout was successful
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new AuthService();
