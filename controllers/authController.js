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
      // const token = generateToken(user._id);
      res.status(201)
      .redirect('/signin')
      // .json({ message: "User registered successfully", data: user });
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

      const token = generateToken(user._id);
      const options = {
        httpOnly: true,
        secure: true
      }
      res
      .status(200)
      .cookie("token", token, options)
      .cookie("user", user)
      .redirect('/loginRedirect'); // Redirect to the loginRedirect page
      // .json({
      //   data: user,
      //   message: "Login Successfull",
      //   redirect: "loginRedirect"
      // })
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };