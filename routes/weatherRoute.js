const { Router } = require("express");
const getWeatherSpeed = require("../controllers/weatherspeed");

const router = Router();

router.get("/speed", getWeatherSpeed);

module.exports = router;