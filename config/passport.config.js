const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const UserModel = require('../model/UserModel');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const config = require('../config/config'); // Replace 'secretKey' with your actual secret key
var jwt = require("jsonwebtoken");
// Local Strategy for email/password login
passport.use(
  new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
    try {
      const user = await UserModel.findOne({ email });

      if (!user || !user.validPassword(password)) {
        return done(null, false, { message: 'Incorrect email or password' });
      }

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  })
);

// JWT Strategy for token-based authentication
const jwtOptions = {
  secretOrKey: config.secretKey,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Assuming JWT is sent via the Authorization header as a Bearer token
};

passport.use(
  'jwt',
  new JwtStrategy(jwtOptions, async (payload, done) => {
    try {
      const user = await UserModel.findById(payload.sub);

      if (!user) {
        return done(null, false, { message: 'User not found' });
      }

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  })
);

// Helper function to sign a JWT
function signToken(userId) {
  return jwt.sign({ sub: userId }, config.secretKey, { expiresIn: '1d' });
}
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await UserModel.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

const verifyUser = passport.authenticate("jwt", { session: false });

module.exports = {
  passport,
  signToken,
  verifyUser
};
