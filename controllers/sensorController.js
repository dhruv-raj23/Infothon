


const axios = require("axios");
const Sensor = require("../models/Sensor");
const { updateSuggestion } = require("./suggestionsController");

// Add a new sensor
const addSensor = async (req, res) => {
  try {
    const { Light1, Fan, Intensity, Temp, Presence } = req.body;

    // Validate request body
    if (Light1 === undefined || Fan === undefined || Intensity === undefined || Temp === undefined || Presence === undefined) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newSensor = new Sensor({
      Light1,
      Fan,
      Intensity,
      Temp,
      Presence
    });

    await newSensor.save();

    res.status(201).json({
      message: "Sensor added successfully",
      sensor: newSensor,
    });
  } catch (err) {
    console.error("Error adding sensor:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get all sensors
const getAllSensors = async (req, res) => {
  try {
    const sensors = await Sensor.find();
    res.status(200).json(sensors);
  } catch (err) {
    console.error("Error fetching sensors:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Process sensor data and get AI suggestions
const processSensorData = async (req, res) => {
  try {
    const sensorData = req.body;
    console.log("Received Sensor Data:", sensorData);

    // Validate incoming data
    if (!sensorData || typeof sensorData !== 'object') {
      return res.status(400).json({ error: "Invalid sensor data" });
    }

    // Ensure all required fields are present
    const requiredFields = ['Light1','Fan', 'Intensity', 'Temp', 'Presence'];
    const missingFields = requiredFields.filter(field => 
      sensorData[field] === undefined
    );

    if (missingFields.length > 0) {
      return res.status(400).json({ 
        error: "Missing required fields", 
        missingFields 
      });
    }

    // Save sensor data
    const newSensor = {
      Light1: sensorData.Light1,
      Fan: sensorData.Fan,
      Temp: sensorData.Temp,
      Presence: sensorData.Presence
    };

    try {
      // Communicate with AI model
      const aiResponse = await axios.post("http://127.0.0.1:5000/predict", newSensor);

      // Handle AI suggestion
      const suggestion = aiResponse.data.suggestion || 
        "No specific recommendation at this time";

      // Update suggestion in the database and notify clients
      await updateSuggestion(suggestion);

      res.status(200).json({
        message: "AI Suggestion Generated",
        suggestion: suggestion,
        timestamp: new Date().toISOString()
      });
    } catch (aiError) {
      console.error("AI Model Communication Error:", aiError);
      res.status(500).json({ 
        error: "Could not retrieve AI suggestion", 
        details: aiError.message 
      });
    }
  } catch (err) {
    console.error("Sensor Data Processing Error:", err);
    res.status(500).json({ 
      error: "Internal Server Error", 
      details: err.message 
    });
  }
};

module.exports = {
  addSensor,
  getAllSensors,
  processSensorData,
};
