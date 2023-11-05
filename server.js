import express from 'express';
import { graphqlHTTP } from "express-graphql";
import { buildSchema } from "graphql";
import axios from "axios";

const PORT = 8100;
const app = express();

// Define a schema
const schema = buildSchema(`
  type WeatherData {
    latitude: Float
    longitude: Float
    generationtime_ms: Float
    utc_offset_seconds: Int
    timezone: String
    timezone_abbreviation: String
    elevation: Int
    daily_units: DailyUnits
    daily: Daily
  }

  type DailyUnits {
    time: String
    temperature_2m_max: String
  }

  type Daily {
    time: [String]
    temperature_2m_max: [Float]
  }

  type Location {
    latitude: Float
    longitude: Float
  }

  type Restaurant {
    name: String
    location: Location
  }

  type Query {
    getWeatherAndNearby(place: String): WeatherAndNearby
  }

  type WeatherAndNearby {
    weather: WeatherData
    nearby: [Restaurant]
  }
`);

// Root resolver
const root = {
  getWeatherAndNearby: async ({ place }) => {
    try {
      const URI_LOCATION = "https://nominatim.openstreetmap.org/search";
      const URI_WEATHER = "https://api.open-meteo.com/v1/forecast";
      const URI_NEAR = "https://api.openstreetmap.org/api/0.6/map";

      const locationParams = { q: place, format: 'json' };
      const locationResponse = await axios.get(URI_LOCATION, { params: locationParams });
      const { lat, lon } = locationResponse.data[0];

      const weatherParams = {
        latitude: lat,
        longitude: lon,
        daily: 'temperature_2m_max',
        forecast_days: 3,
        timezone: 'PST'
      };
      const weatherResponse = await axios.get(URI_WEATHER, { params: weatherParams });

      const nearbyParams = { bbox: `${lon - 0.01},${lat - 0.01},${lon + 0.01},${lat + 0.01}` };
      const nearbyResponse = await axios.get(URI_NEAR, { params: nearbyParams });
      const restaurants = nearbyResponse.data.elements
        .filter(element => element.tags && element.tags.amenity === 'restaurant')
        .map(element => ({
          name: element.tags.name,
          location: { latitude: element.lat, longitude: element.lon }
        }));

      return { weather: weatherResponse.data, nearby: restaurants };
    } catch (error) {
      console.error(error);
      throw new Error('Internal Server Error');
    }
  },
};

// Middleware to set Access-Control-Allow-Origin header
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});

// GraphQL endpoint
app.use(
  '/graphql',
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  })
);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
