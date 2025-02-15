const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  name: { type: String, required: [true, "Name is required"] },
  email: { 
    type: String, 
    required: [true, "Email is required"], 
    unique: true, 
    trim: true 
  },
  password: { type: String, required: [true, "Password is required"] },
});
    
// Error handling for duplicate keys
userSchema.post("save", function (error, doc, next) {
  if (error.code === 11000) {
    if (error.keyPattern.email) {
      next(new Error("Email already exists"));
    } else if (error.keyPattern.username) {
      next(new Error("Username already exists"));
    }
  } else {
    next(error);
  }
});

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password
userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);
module.exports = User;