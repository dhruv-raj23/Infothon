const mongoose = require("mongoose");

const sensorSchema = new mongoose.Schema(
  {
    Light1: {
      type: Number,
      required: [true, "Current consumption value for light1 is required"],
    },
    
    Fan: {
      type: Number,
      required: [true, "Current consumption value for fan is required"],
    },
    Intensity: {
      type: Number,
      required: [true, "Intensity of sunlight is required"],
    },
    Temp: {
      type: Number,
      required: [true, "Temperature value is required"],
    },
    Presence: {
      type: Boolean,
      required: [true, "Human presence status is required"],
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

const Sensor = mongoose.model("Sensor", sensorSchema);

module.exports = Sensor;
