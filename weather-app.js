const showWeatherReport = document.getElementById("showWeatherReport");
const weatherDatesContainer = document.getElementById("weatherDatesContainer");
let dateContainerArray = [];

const apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=21.146633&lon=79.088860&units=metric&exclude=current,hourly,minutely,alerts&appid="
const apiId = "b12e1bdef4f0a278f9f418ae4f1c778c"
const request = new XMLHttpRequest();
request.open(
  "GET",
  `${apiUrl}${apiId}`
);
request.send();
request.onload = () => {
  if (request.status == 200) {
    const weatherData = JSON.parse(request.response);
    getWeatherData(weatherData);
  } else {
    document.body.innerHTML = `<h1>Error ${request.status} ${request.statusText}</h1>`
  }
};

function getWeatherData(weatherData) {
  const eightDayData = weatherData.daily;

  for (let i = 0; i < eightDayData.length; i++) {
    const dateContainer = document.createElement("p");
    dateContainer.classList.add("weather-dates");
    weatherDatesContainer.appendChild(dateContainer);
    dateContainerArray.push(dateContainer);
  }
  dateContainerArray[0].classList.add("active");

  function defaultClick() {
    dateContainerArray[0].click();
  }

  dateContainerArray.forEach((item, index) => {
    const clickedDayWeather = eightDayData[index];
    const weatherDay = new Date(clickedDayWeather.dt * 1000);
    item.innerHTML = `${weatherDay.toLocaleString("default", { weekday: "short", month: "short", day: "2-digit" })}`;

    item.addEventListener("click", getCurrentDayWeather);
    function getCurrentDayWeather() {
      const active = document.querySelector(".active");
      if (active) {
        active.classList.remove("active");
      }
      item.classList.add("active");
      mapWeatherData(clickedDayWeather);
    }
  });
  defaultClick();
}

function mapWeatherData(clickedDayWeather) {
  const iconUrl = `http://openweathermap.org/img/wn/${(clickedDayWeather.weather[0].icon ? clickedDayWeather.weather[0].icon : "02d")}@2x.png`;

  const compassSector = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW", "N"];

  const windDirection =
    compassSector[Math.round(clickedDayWeather.wind_deg / 22.5)];

  const weatherReportHtml = `<div class="weather-description">
         <img src="${iconUrl}" alt="icon expressing weather condition">
        <div>
          <p>
          ${clickedDayWeather.weather[0].main ? clickedDayWeather.weather[0].main : "NA"}. 
          ${clickedDayWeather.weather[0].description ? clickedDayWeather.weather[0].description : "NA"}
          </p>
          <p>
          The high will be <span class="temperature">${!clickedDayWeather.temp.max ? "NA" : Math.floor(clickedDayWeather.temp.max) + "°C"}</span>, 
          the low will be <span class="temperature">${!clickedDayWeather.temp.min ? "NA" : Math.floor(clickedDayWeather.temp.min) + "°C"}</span>.
          </p>
        </div>
      </div>
      <div class="weather-data-daily">
        <div class="upper-row-data">
          <div>
          <i class="fa-solid fa-cloud-showers-heavy"></i>
          <span>${!clickedDayWeather.rain ? "NA" : clickedDayWeather.rain + "%"}</span>
          </div>
          <div>
          <i class="fa-solid fa-location-arrow"></i>
          <span>${!clickedDayWeather.wind_speed ? "NA" : clickedDayWeather.wind_speed + "m/s"} ${windDirection && true ? windDirection : ""}</span>
          </div>
          <div>
          <i class="fa-solid fa-compass"></i>
          <span>${!clickedDayWeather.pressure ? "NA" : clickedDayWeather.pressure + "hPa"}</span>
          </div>
        </div>
        <div class="lower-row-data">
          <span>Humidity: ${!clickedDayWeather.humidity ? "NA" : Math.floor(clickedDayWeather.humidity) + "%"}</span>
          <span>UV: ${!clickedDayWeather.uvi ? "NA" : Math.floor(clickedDayWeather.uvi)}</span>
          <span>Dew point: ${!clickedDayWeather.dew_point ? "NA" : Math.floor(clickedDayWeather.dew_point) + "°C"}</span>
        </div>
      </div>
      <table class="temperature-table-data">
        <tr>
          <th>&nbsp;</th>
          <th>Morning</th>
          <th>Afternoon</th>
          <th>Evening</th>
          <th>Night</th>
        </tr>
        <tr>
          <td>TEMPERATURE</th>
          <td class="temperature">${!clickedDayWeather.temp.morn ? "NA" : Math.floor(clickedDayWeather.temp.morn) + "°C"}</td>
          <td class="temperature">${!clickedDayWeather.temp.day ? "NA" : Math.floor(clickedDayWeather.temp.day) + "°C"}</td>
          <td class="temperature">${!clickedDayWeather.temp.eve ? "NA" : Math.floor(clickedDayWeather.temp.eve) + "°C"}</td>
          <td class="temperature">${!clickedDayWeather.temp.night ? "NA" : Math.floor(clickedDayWeather.temp.night) + "°C"}</td>
        </tr>
        <tr>
          <td>FEELS LIKE</td>
          <td class="temperature">${!clickedDayWeather.feels_like.morn ? "NA" : Math.floor(clickedDayWeather.feels_like.morn) + "°C"}</td>
          <td class="temperature">${!clickedDayWeather.feels_like.day ? "NA" : Math.floor(clickedDayWeather.feels_like.day) + "°C"}</td>
          <td class="temperature">${!clickedDayWeather.feels_like.eve ? "NA" : Math.floor(clickedDayWeather.feels_like.eve) + "°C"}</td>
          <td class="temperature">${!clickedDayWeather.feels_like.night ? "NA" : Math.floor(clickedDayWeather.feels_like.night) + "°C"}</td>
        </tr>
      </table>
      <table class="sun-timing-table">
        <tr>
          <th>SUNRISE</th>
          <th>SUNSET</th>
        </tr>
        <tr>
          <td>${extractSunTime(clickedDayWeather.sunrise)}</td>
          <td>${extractSunTime(clickedDayWeather.sunset)}</td>
        </tr>
      </table>`;

  function extractSunTime(timeInSec) {
    if (!timeInSec) {
      return "NA";
    } else {
      return new Date(timeInSec * 1000).toLocaleString("default", { hour: "2-digit", minute: "2-digit", hour12: true });
    }
  }

  return (showWeatherReport.innerHTML = weatherReportHtml);
}

document.body.addEventListener("click", convertTemperature);

function convertTemperature(e) {
  if (e.target.classList.contains("temperature")) {
    const temperatureValue = e.target.innerText.slice(0, -2);
    if (e.target.innerText.includes("°C")) {
      e.target.innerHTML = `${Math.round((temperatureValue * 9) / 5 + 32)}°F`;
    } else if (e.target.innerText.includes("°F")) {
      e.target.innerHTML = `${Math.round((temperatureValue - 32) / 1.8)}°C`;
    }
  }
}