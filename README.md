# softwareII-lab-SOA

Integrantes:

+ Santiago Madariaga Collado
+ Juan Diego Laredo
+ Miguel Angel Alvarado
+ Diego Enciso
+ Jean Paul Melendez Cabezas

## Github repo: https://github.com/loaspra/softwareII-lab-SOA

## Repo del front end: https://github.com/loaspra/weather-julisa.git

## Servidor: (API gateway)

Se hace el filtrado de las ubicaciones por tags de restaurantes, y se extraen los dias de forecasting:

```javascript
app.get('/weather/:place', async (req, res) => {
    try {
        const place = req.params.place;
        const locationParams = {
            q: place,
            format: 'json'
        };
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
        const nearbyParams = {
            bbox: `${lon - 0.01},${lat - 0.01},${lon + 0.01},${lat + 0.01}`
        };
        const nearbyResponse = await axios.get(URI_NEAR, { params: nearbyParams });
        const restaurants = nearbyResponse.data.elements
            .filter(element => element.tags && element.tags.amenity === 'restaurant')
            .map(element => ({
                name: element.tags.name,
                location: {
                    latitude: element.lat,
                    longitude: element.lon
                }
            }));
        res.json({
            weather: weatherResponse.data,
            nearby: restaurants
        });
        console.log(`Weather and nearby restaurants for ${place} sent`);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});
```

## Front end:

El cliente realiza una peticion al servidor principal con un unico parametro (string de locacion):
'use client'

const InputSearch = ({onData}) => {
  const handleKeyPress = async (event) => {
    if (event.key === 'Enter') {
      console.log('Enter key pressed', event.target.value);
      const response = await fetch(`http://localhost:8100/weather/${event.target.value}`, {
        method: 'GET',
      });
      console.log(response); // Response {type: 'cors', url: 'http://localhost:8100/weather/Sosa%20Ruiz', redirected: false, status: 200, ok: true, …}
      const data = await response.json();

      console.log(data); // {location: {…}, current: {…}, forecast: {…}
      onData(data);
    }
  };

  return (
    <div className="input input-search-container">
      <input
        className="input-search"
        type="text"
        name="location"
        id="location-input"
        placeholder="Enter a location"
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            handleKeyPress(event);
          }
        }}
      /> 
      <img src="/lupa.png" alt="Search icon" />
    </div>
  );
};

export default InputSearch;


![image](https://github.com/loaspra/softwareII-lab-SOA/assets/40249960/e291e96a-e364-476d-bc2b-320f2bb6fa3b)


## Funcionamiento:

![image](https://github.com/loaspra/softwareII-lab-SOA/assets/40249960/bbbe6d55-e149-4795-97b6-8e806fedeb08)

## Front end con query resultante:

![image](https://github.com/loaspra/softwareII-lab-SOA/assets/40249960/60421b51-d56a-4f0e-8018-fb8c06b05090)

## Logs:

![image](https://github.com/loaspra/softwareII-lab-SOA/assets/40249960/92942cd5-32b3-4b36-a4b6-5965f762e4a3)

