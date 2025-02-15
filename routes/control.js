const express = require("express");
const axios = require("axios");
const router = express.Router();

// Raspberry Pi's endpoint
const raspberryPiUrl = "http://192.168.137.204:5000/control";

// API to forward the toggle request
router.post("/toggle", async (req, res) => {
  const data = req.body; // Read the request body

  // Validate that the request body matches the required format
  const requiredKeys = ["Light1", "Light2", "Fan"];
  const isValidFormat = requiredKeys.every(key => key in data && (data[key] === 0 || data[key] === 1));

  if (!isValidFormat) {
    return res.status(400).json({
      success: false,
      message: `Request body must include ${requiredKeys.join(", ")} with values of 0 or 1.`,
    });
  }

  try {
    // Forward the request to the Raspberry Pi
    const response = await axios.post(raspberryPiUrl, data);

    // Respond with the result from the Raspberry Pi
    res.status(response.status).json(response.data);
  } catch (error) {
    // Handle errors from the Raspberry Pi or network issues
    if (error.response) {
      res.status(error.response.status).json({
        success: false,
        message: `Error from Raspberry Pi: ${error.response.data.message || "Unknown error"}`,
      });
    } else {
      res.status(500).json({
        success: false,
        message: "Failed to communicate with Raspberry Pi.",
      });
    }
  }
});

module.exports = router;