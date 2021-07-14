const mongoose = require("mongoose"),
  uniqueValidator = require("mongoose-unique-validator"),
  passportLocalMongoose = require("passport-local-mongoose");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
    trim: true,
  },
  password: String,
  name: String,
  avatar: String,
  email: {
    type: String,
    unique: true,
    required: true,
    uniqueCaseInsensitive: true,
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  isAdmin: { type: Boolean, default: false },
});

UserSchema.plugin(uniqueValidator);

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);
