const getWindSpeed = async (req, res) => {
    console.log("Fetching wind speed...");
    // const speed = await fetch(${api.base}weather?q=Mysore&units=metric&APPID=${api.key})
    const speed = await fetch("https://api.openweathermap.org/data/2.5/weather?q=Mysore&units=metric&APPID=86c3e953f5e68161ea42ffad0b1d8815")
    .then(weather => {
        console.log(weather)
        return weather.json();
    })
    .then(weather => {
        console.log(weather.wind.speed)
        return weather.wind.speed
    })
    .catch(error => {
        console.log("Error fetching wind speed:", error.message);
    })

    res.json({ speed: speed });
}

module.exports = getWindSpeed;