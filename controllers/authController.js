const User = require("../models/User");
const { generateToken } = require("../utils/jwtUtils");

exports.register = async (req, res) => {
    try {
      const { name, email, password } = req.body;
  
      // Validate required fields
      if (!name || !email || !password) {
        return res.status(400).json({ error: "Name, email, and password are required" });
      }
  
      // Create new user
      const user = new User({ name, email, password });
      await user.save();
  
      // Generate token
      const token = generateToken(user._id);
      res.status(201).json({ message: "User registered successfully", token });
    } catch (error) {
      console.error(error); // Log error for debugging
      if (error.code === 11000) {
        if (error.keyPattern.email) {
          return res.status(400).json({ error: "Email already exists" });
        } else if (error.keyPattern.username) {
          return res.status(400).json({ error: "Username already exists" });
        }
      }
      res.status(400).json({ error: error.message });
    }
  };
  

  

  exports.login = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
      }
  
      const user = await User.findOne({ email });
      if (!user || !(await user.comparePassword(password))) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
  
      res.redirect('/loginRedirect'); // Redirect to the loginRedirect page
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };