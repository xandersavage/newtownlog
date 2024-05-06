const mongoose = require("mongoose");
const uuid = require("uuid-v4");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  age: {
    type: String,
    default: 25
  },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    lowercase: true
  },
  phonenum: {
    type: Number
  },
  yearsofexp: {
    type: Number
  },
  wage: {
    type: Number
  },
  title: {
    type: String
  },
  nextofkin: {
    type: String,
    trim: true
  },
  lenofcontract: {
    type: Number
  },
  avatar: {
    type: String
  },
  userId: {
    type: String,
    required: true,
    unique: true
  }
});

userSchema.pre("save", function(next) {
  if (!this.userId) {
    this.userId = `NTL${uuid()
      .slice(-6)
      .toUpperCase()}`; //Generate unique id with NTL prefix
  }
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
