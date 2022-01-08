var key = '30d8714bc17bbf67d0fd08cb69785152';
var cityInputEl = document.querySelector(".form-input");

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
                console.log(data);
                todaysForecast(cityName, date, temp, wind, humidity);
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

var getUVIndex = function(lat, lon) {
    var apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude={part}&appid={API key}`
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
var todaysForecast = function(cityName, date, temp, wind, humidity) {
    $("#todays-forecast").append(`<h3>${cityName} ${date}</h3>`);
    $("#todays-forecast").append(`<ul><li>Temp: ${temp} F</li><li>Wind: ${wind}</li><li>Humidity: ${humidity}</li></ul>`).css("border", "2px solid #40C3E0");
}

// display 5 day forecast
var fiveDayForecast = function() {
    $("#five-day-forecast").append(`<h3>5-Day Forecast:</h3>`);
}