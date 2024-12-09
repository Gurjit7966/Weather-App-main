const timeEl = document.getElementById("time");
const dateEl = document.getElementById("date");
const currentWeatherItemsEl = document.getElementById("current-weather-items");
const timezone = document.getElementById("time-zone");
const countryEl = document.getElementById("country");
const currentTempEl = document.getElementById("current-temp");

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

// Use your WeatherStack API key here
const API_KEY = "6eb20c3be73c4be26475ed30d0d36da4";

// Display Current Date and Time
setInterval(() => {
  const time = new Date();
  const month = time.getMonth();
  const date = time.getDate();
  const day = time.getDay();
  const hour = time.getHours();
  const hoursIn12HrFormat = hour >= 13 ? hour % 12 : hour;
  const minutes = time.getMinutes();
  const ampm = hour >= 12 ? "PM" : "AM";

  timeEl.innerHTML =
    (hoursIn12HrFormat < 10 ? "0" + hoursIn12HrFormat : hoursIn12HrFormat) +
    ":" +
    (minutes < 10 ? "0" + minutes : minutes) +
    " " +
    `<span id="am-pm">${ampm}</span>`;

  dateEl.innerHTML = days[day] + ", " + date + " " + months[month];
}, 1000);

// Get User Location
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        getWeatherData(latitude, longitude);
      },
      (error) => {
        console.error("Error getting location:", error);
        alert("Unable to retrieve your location. Please enable location services and reload the page.");
        // Fallback to a default location (optional)
        getWeatherData(27.4886, 95.3558); // Example fallback: Digboi, Assam
      }
    );
  } else {
    alert("Geolocation is not supported by your browser.");
  }
}

// Fetch Weather Data
function getWeatherData(lat, lon) {
  fetch(
    `http://api.weatherstack.com/current?access_key=${API_KEY}&query=${lat},${lon}`
  )
    .then((res) => {
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      return res.json();
    })
    .then((data) => {
      console.log(data); // Check if data is fetched correctly
      showWeatherData(data);
    })
    .catch((err) => {
      console.error("Error fetching weather data:", err);
      alert("Failed to fetch weather data. Please check your API key or network connection.");
    });
}

function showWeatherData(data) {
  const { temperature, feelslike, humidity, pressure, wind_speed, wind_degree, observation_time } = data.current;
  const weather = data.current.weather_descriptions[0];
  const icon = data.current.weather_icons[0];

  // Update location dynamically
  timezone.innerHTML = `Location: ${data.location.name}, ${data.location.region}`;
  countryEl.innerHTML = `${data.location.country}`;

  currentWeatherItemsEl.innerHTML = `
    <div class="weather-item">
      <div>Temperature</div>
      <div>${temperature}°C</div>
    </div>
    <div class="weather-item">
      <div>Feels Like</div>
      <div>${feelslike}°C</div>
    </div>
    <div class="weather-item">
      <div>Humidity</div>
      <div>${humidity}%</div>
    </div>
    <div class="weather-item">
      <div>Pressure</div>
      <div>${pressure} hPa</div>
    </div>
    <div class="weather-item">
      <div>Wind Speed</div>
      <div>${wind_speed} km/h</div>
    </div>
    <div class="weather-item">
      <div>Wind Direction</div>
      <div>${wind_degree}°</div>
    </div>
    <div class="weather-item">
      <div>Observation Time</div>
      <div>${observation_time}</div>
    </div>
  `;

  // Display current weather with icon
  currentTempEl.innerHTML = `
    <div class="weather-forecast-item">
      <div>${weather}</div>
      <img src="${icon}" alt="weather icon" />
    </div>
  `;
}

// Initialize
getLocation();
