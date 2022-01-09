var key = '30d8714bc17bbf67d0fd08cb69785152';
var cityInputEl = document.querySelector(".form-input");

// Displays all the weather data
var getWeatherData = function(city) {
    var apiUrl = `http://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${key}&units=imperial`;

    fetch(apiUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                var temp = data.list[0].main.temp;
                var cityName = data.city.name;
                var date = data.list[0].dt_txt;
                var wind = data.list[0].wind.speed;
                var humidity = data.list[0].main.humidity;
                var lat = data.city.coord.lat;
                var lon = data.city.coord.lon;
                console.log(data);
                getCurrentWeather(lat, lon);
                fiveDayForecast();
            });
        }
        else {
            alert(`Error ${city} not found!`);
        }
    })
    .catch(function(error) {
        alert("Unable to connect to Open Weather");
    });
}

// Get weather for current day
var getCurrentWeather = function(lat, lon) {
    var apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&units=imperial&appid=${key}`;

    fetch(apiUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                console.log(data);
                var uvi = data.current.uvi;
                var currentTemp = data.current.temp;
                var humidity = data.current.humidity;
                var windSpeed = data.current.wind_speed;
                var timezone = data.timezone;
                var city = timezone.split('/')[1];
                var date = data.current.dt;
                todaysForecast(city, date, currentTemp, windSpeed, humidity, uvi);
            });
        }
        else {
            console.log("La")
        }
    })
    .catch(function(error) {
        alert("Unable to connect to Open Weather");
    });
}

// enter city name to display weather info
var formSubmitHandler = function(event) {
    event.preventDefault();
    // get value from input element
    var city = cityInputEl.value.trim();

    if (city) {
        getWeatherData(city);
        cityInputEl.value = "";
    } else {
        alert("Please enter a city");
    }
 
}

$(".btn").on("click", formSubmitHandler);
// save searched cities

// for saved cities display button with city name that can be clicked to display that cities weather info

// display todays forecast
var todaysForecast = function(cityName, date, temp, wind, humidity, uvIndex) {
    $("#todays-forecast").append(`<h3>${cityName} ${date}</h3>`);
    $("#todays-forecast").append(`<ul class="weather-data"><li>Temp: ${temp} F</li><li>Wind: ${wind}</li><li>Humidity: ${humidity}</li></ul>`).css("border", "2px solid #40C3E0");
    $(".weather-data").append(`<li>UV Index: ${uvIndex}`);
}

// // display UV Index
// var uvIndex = function(uvIndex) {
//     $(".weather-data").append(`<li>UV Index: ${uvIndex}`);
// }

// display 5 day forecast
var fiveDayForecast = function() {
    $("#five-day-forecast").append(`<h3>5-Day Forecast:</h3>`);
}