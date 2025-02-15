
const express = require("express");
const router = express.Router();
const { addSensor, getAllSensors, processSensorData } = require("../controllers/sensorController");

// POST route to add a sensor
router.post("/add", addSensor);

// GET route to retrieve all sensors
router.get("/", getAllSensors);

// POST route to process sensor data and get AI suggestions
router.post("/process", processSensorData);

module.exports = router;


