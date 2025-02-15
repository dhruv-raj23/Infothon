const express = require("express");
const { register, login } = require("../controllers/authController");

const router = express.Router();

// Route to render the sign-in page
router.get('/', (req, res) => {
  res.render('signin'); // Ensure the 'signin.ejs' file exists in the views folder
});

// API routes for register and login
router.post("/register", register);
router.post("/login", login);

module.exports = router;