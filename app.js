const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const connectDB = require("./config/db");
const sensorRoutes = require("./routes/sensorRoutes");
const authRoutes = require("./routes/authRoutes");
const suggestionsRouter = require("./routes/suggestions");
const controlRoute = require("./routes/control"); // Adjust path if neces

const router = express.Router();
const Sensor = require('./models/Sensor'); // Ensure this path is correct based on your project structure


dotenv.config();
connectDB();

const app = express();

const cors = require('cors');
app.use(cors());

app.set("view engine","ejs");
app.set("views",path.resolve("./views"));

// Middleware
app.use(express.json()); // Parse incoming JSON
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data
app.use(express.static(path.join(__dirname, 'public')));
app.use(controlRoute);

///
// Mock state storage for devices
let deviceStates = {
  Light1: 0, // 0 for off, 1 for on
  Light2: 0,
  Fan: 0,
};

const weatherRoute = require('./routes/weatherRoute');
app.use('/weather', weatherRoute);

// Routes
app.use('/signin', authRoutes);

app.use("/api/suggestions", suggestionsRouter);
app.use("/api/sensors", sensorRoutes);

app.get('/loginRedirect', (req, res) => {
  res.render('loginRedirect')
});

// // Views
app.get('/', (req, res) => res.render('home'))
app.get('/signin', (req, res) => {
  res.render('signin');
});
app.get('/signup', (req, res) => {
  res.render('signup');
});


// GET route to retrieve the 20 most recent sensors
router.get("/", async (req, res) => {
  try {
    const sensors = await Sensor.find()
      .sort({ createdAt: -1 })  // Sort by creation date in descending order (most recent first)
      .limit(20);  // Limit the results to 20

    res.status(200).json(sensors);  // Send the sensor data as JSON response
  } catch (err) {
    console.error("Error fetching sensors:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;



const PORT = process.env.PORT || 3000;
const HOST = '10.60.229.30'; // Bind to your IPv4 address

app.listen(PORT, HOST, () => {
  console.log(`Server running at http://${HOST}:${PORT}`);
});
