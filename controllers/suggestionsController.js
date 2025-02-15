const Suggestion = require("../models/Suggestion");

// SSE Clients
let clients = [];

const subscribeToSuggestions = (req, res) => {
  // Set headers for SSE
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  // Send a comment to keep the connection alive
  res.write("data: Connected to suggestion updates\n\n");

  // Add the client to the list
  clients.push(res);

  // Remove the client when the connection is closed
  req.on("close", () => {
    clients = clients.filter((client) => client !== res);
  });
};

const notifyClients = async () => {
  try {
    // Fetch the latest suggestion
    const suggestion = await Suggestion.findOne();

    if (suggestion) {
      // Broadcast the suggestion to all connected clients
      const data = JSON.stringify({
        suggestion: suggestion.suggestion,
        timestamp: suggestion.timestamp,
      });

      clients.forEach((client) => client.write(`data: ${data}\n\n`));
    }
  } catch (error) {
    console.error("Error notifying clients:", error.message);
  }
};

// Call this function whenever the suggestion changes
const updateSuggestion = async (newSuggestion) => {
  try {
    let existingSuggestion = await Suggestion.findOne();
    if (existingSuggestion) {
      existingSuggestion.suggestion = newSuggestion;
      existingSuggestion.timestamp = new Date();
      await existingSuggestion.save();
    } else {
      const suggestion = new Suggestion({ suggestion: newSuggestion });
      await suggestion.save();
    }

    // Notify connected clients about the change
    notifyClients();
  } catch (error) {
    console.error("Error updating suggestion:", error.message);
  }
};

module.exports = {
  subscribeToSuggestions,
  updateSuggestion,
};
