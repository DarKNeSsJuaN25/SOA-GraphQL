# softwareII-lab-SOA

Integrantes:

+ Santiago Madariaga Collado
+ Juan Diego Laredo
+ Miguel Angel Alvarado
+ Jean Paul Melendez Cabezas

Tenemos que crear el *buildSchema* en el codigo:
```javascript
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
```

Para acceder al *GraphQL*, tenemos que ir a la ruta: *localhost:8100/graphql*.
Ahi, formulamos la query de salida, la cual es la siguiente:
![image](https://github.com/DarKNeSsJuaN25/SOA-GraphQL/assets/68095284/83191236-21f1-46ec-9dc5-d030af6492a9)
Luego, inicializamos una *petition query*, la cual se muestra a continuacion:
![image](https://github.com/DarKNeSsJuaN25/SOA-GraphQL/assets/68095284/5e4207a1-0c8d-4415-8b31-aabe8fcfead8)

Corremos el codigo, y obtenemos el resultado esperado:

![image](https://github.com/DarKNeSsJuaN25/SOA-GraphQL/assets/68095284/bee50164-ec84-4e00-be24-b4b6040e216f)
