const express = require("express");
const morgan = require("morgan");
const got = require("got");
require("dotenv").config();
const app = express();
const { router } = require("./router");

const PORT = process.env.PORT || 8081;
const thirdPartyBaseUrl = "http://api.weatherbit.io/v2.0/current";
const thirdPartyApiKey = process.env.WEATHER_API_KEY;
app.use(morgan("tiny"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));

app.get("/api/weather", async (req, res) => {
  try {
    const { latitude, longtitude } = req.query;
    const response = await got(thirdPartyBaseUrl, {
      searchParams: {
        key: thirdPartyApiKey,
        lat: latitude,
        lon: longtitude,
      },
      responseType: "json",
    });

    const [weatherData] = response.body.data;
    const {
      city_name,
      weather: { description },
      temp,
    } = weatherData;

    res.json({ city_name, description, temp });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
