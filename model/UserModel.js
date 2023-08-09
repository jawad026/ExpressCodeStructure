const mongoose = require('mongoose');
const bcrypt= require('bcrypt');
const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            min: 3,
            max: 45
        },
        email: {
            type: String,
            required: true,
            trim: true,
            unique: true,
            lowercase: true
        },
        phone: {
            type: String,
            required: true,
            trim: true,
        },
        hash_password: {
            type: String,
            required: true
        },

    }, { timestamps: true });

    userSchema.methods.validPassword = function (password) {
        return bcrypt.compareSync(password, this.hash_password);
      };

module.exports = mongoose.model("User", userSchema)