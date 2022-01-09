var key = '30d8714bc17bbf67d0fd08cb69785152';
var cityInputEl = document.querySelector(".form-input");
$("#forecast").hide();
// Displays all the weather data
var getWeatherDataByCity = function(city) {
    var apiUrl = `http://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${key}&units=imperial`;

    fetch(apiUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                var lat = data.city.coord.lat;
                var lon = data.city.coord.lon;
                console.log(data);
                getForecastByLatLon(lat, lon);
                
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
var getForecastByLatLon = function(lat, lon) {
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
                var timestamp = data.current.dt;
                var dateTime = new Date(timestamp*1000).toLocaleString();
                var date = moment(new Date(dateTime)).format('L');
                var icon = data.current.weather[0].icon;
                todaysForecast(city, date, icon, currentTemp, windSpeed, humidity, uvi);
                // Display 5 day forecast
                $("#forecast").show();
                for (var i = 0; i < 6; i++) {
                    var fTimestamp = data.daily[i].dt;
                    var fDateTime = new Date(fTimestamp*1000).toLocaleString();
                    var fDate = moment(new Date(fDateTime)).format('L');
                    var fTemp = data.daily[i].temp.day;
                    var fWind = data.daily[i].wind_speed;
                    var fHumidity = data.daily[i].humidity;
                    var fIcon = data.daily[i].weather[0].icon;
                    fiveDayForecast(i, fDate, fIcon, fTemp, fWind, fHumidity);
                }
                
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
        getWeatherDataByCity(city);
        cityInputEl.value = "";
    } else {
        alert("Please enter a city");
    }
 
}

$(".btn").on("click", formSubmitHandler);
// save searched cities

// for saved cities display button with city name that can be clicked to display that cities weather info

// display todays forecast
var todaysForecast = function(cityName, date, icon, temp, wind, humidity, uvIndex) {
    $("#todays-forecast").append(`<h3>${cityName} ${date} <img src="http://openweathermap.org/img/w/${icon}.png" alt="current weather"></h3>`);
    $("#todays-forecast").append(`<ul class="weather-data"><li>Temp: ${temp} &#8457</li><li>Wind: ${wind} MPH</li><li>Humidity: ${humidity}%</li></ul>`).css("border", "2px solid #40C3E0");
    $(".weather-data").append(`<li>UV Index: ${uvIndex}`);
}

// display 5 day forecast
var fiveDayForecast = function(index, date, icon, temp, wind, humidity) {
    $(`#day-${index}`).append(`<ul class="day"><li>${date}</li><li><img src="http://openweathermap.org/img/w/${icon}.png" alt="current weather"></li><li>Temp: ${temp} &#8457</li><li>Wind: ${wind} MPH</li><li>Humidity: ${humidity}%</li></ul>`);
    $('.day').css({ 'background-color': '#40C3E0', 'padding': '4px'});
}