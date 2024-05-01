const mongoose = require("mongoose");

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
  }
});

const User = mongoose.model("User", userSchema);

module.exports = User;
