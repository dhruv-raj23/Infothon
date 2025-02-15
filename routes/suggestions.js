const express = require("express");
const { subscribeToSuggestions } = require("../controllers/suggestionsController");

const router = express.Router();

// SSE route for subscribing to suggestion updates
router.get("/subscribe", subscribeToSuggestions);

module.exports = router;
