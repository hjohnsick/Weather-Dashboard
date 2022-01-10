var key = '30d8714bc17bbf67d0fd08cb69785152';
var cityInputEl = document.querySelector(".form-input");
var todaysForecastContainer = document.querySelector("#todays-forecast");
var fiveDayForecastContainer = document.querySelector("#five-day-forecast");
var cities = [];
// $("#forecast").hide();

// enter city name to display weather info
var formSubmitHandler = function(event) {
    event.preventDefault();
    // get value from input element
    var city = cityInputEl.value.trim();

    if (city) {
        getWeatherDataByCity(city);
        saveSeachHistory(city);
        cityInputEl.value = "";
    } else {
        alert("Please enter a city");
    }
 
}

// Display current days weather
var displayCurrentWeather = function(data, cityName) {
    todaysForecastContainer.textContent = '';
    var uvi = data.current.uvi;
    var currentTemp = data.current.temp;
    var humidity = data.current.humidity;
    var windSpeed = data.current.wind_speed;
    var timestamp = data.current.dt;
    var dateTime = new Date(timestamp*1000).toLocaleString();
    var date = moment(new Date(dateTime)).format('L');
    var icon = data.current.weather[0].icon;
    $("#todays-forecast").append(`<h3>${cityName} ${date} <img src="http://openweathermap.org/img/w/${icon}.png" alt="current weather"></h3>`);
    $("#todays-forecast").append(`<ul class="weather-data"><li>Temp: ${currentTemp} &#8457</li><li>Wind: ${windSpeed} MPH</li><li>Humidity: ${humidity}%</li></ul>`).css("border", "2px solid #40C3E0");
    $(".weather-data").append(`<li id="uv-index">UV Index: <span>${uvi}</span>`);
    changeColorOfUVIndex(uvi);
}

// Display 5 day forecast
var displayFiveDayForecast = function(data) {
    fiveDayForecastContainer.textContent = '';
    $(fiveDayForecastContainer).append(`<h3 id="forecast">5-Day Forecast:</h3> 
    <div class="col-12 col-md-2 day" id="day-1"></div>
    <div class="col-12 col-md-2 day" id="day-2"></div>
    <div class="col-12 col-md-2 day" id="day-3"></div>
    <div class="col-12 col-md-2 day" id="day-4"></div>
    <div class="col-12 col-md-2 day" id="day-5"></div>`);
                for (var i = 0; i < 6; i++) {
                    var fTimestamp = data.daily[i].dt;
                    var fDateTime = new Date(fTimestamp*1000).toLocaleString();
                    var date = moment(new Date(fDateTime)).format('L');
                    var temp = data.daily[i].temp.day;
                    var wind = data.daily[i].wind_speed;
                    var humidity = data.daily[i].humidity;
                    var icon = data.daily[i].weather[0].icon;
                    $(`#day-${i}`).append(`<ul class="day"><li>${date}</li><li><img src="http://openweathermap.org/img/w/${icon}.png" alt="current weather"></li><li>Temp: ${temp} &#8457</li><li>Wind: ${wind} MPH</li><li>Humidity: ${humidity}%</li></ul>`);
                    $('.day').css({ 'background-color': '#40C3E0', 'padding': '4px'});
                }
}

// Displays all the weather data
var getWeatherDataByCity = function(city) {
    var apiUrl = `http://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${key}&units=imperial`;

    fetch(apiUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                var lat = data.city.coord.lat;
                var lon = data.city.coord.lon;
                var city = data.city.name;
                console.log(data);
                getForecastByLatLon(lat, lon, city);
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
var getForecastByLatLon = function(lat, lon, city) {
    var apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&units=imperial&appid=${key}`;

    fetch(apiUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                console.log(data);
                displayCurrentWeather(data, city);
                displayFiveDayForecast(data);
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


$(".btn").on("click", formSubmitHandler);

// save searched cities
var saveSeachHistory = function (city) {
    if (!cities.includes(city)) {
        cities.push(city);
        console.log(cities);
        localStorage.setItem("cities", JSON.stringify(cities));
    }
}


// for saved cities display button with city name that can be clicked to display that cities weather info
var getSavedCities = function () {
    var savedCities = JSON.parse(localStorage.getItem("cities"));

    if (!savedCities) {
        return;
    }
    
    for (var i = 0; i < savedCities.length; i++) {
        $(".cities").append(`<button id="saved-city${i}" class="city-button" data-index="${i}">${savedCities[i]}</button>`);
    $(`#saved-city${[i]}`).css({ 'background-color': '#8972C8', 'color': '#FFFFFF', 'margin-top': '7px', 'width': '100%'});
    }
    
    console.log(savedCities);
}

// display todays forecast
var todaysForecast = function(cityName, date, icon, temp, wind, humidity, uvIndex) {
    $("#todays-forecast").append(`<h3>${cityName} ${date} <img src="http://openweathermap.org/img/w/${icon}.png" alt="current weather"></h3>`);
    $("#todays-forecast").append(`<ul class="weather-data"><li>Temp: ${temp} &#8457</li><li>Wind: ${wind} MPH</li><li>Humidity: ${humidity}%</li></ul>`).css("border", "2px solid #40C3E0");
    $(".weather-data").append(`<li id="uv-index">UV Index: <span>${uvIndex}</span>`);
    changeColorOfUVIndex(uvIndex);
}

// display 5 day forecast
var fiveDayForecast = function(index, date, icon, temp, wind, humidity) {
    $(`#day-${index}`).append(`<ul class="day"><li>${date}</li><li><img src="http://openweathermap.org/img/w/${icon}.png" alt="current weather"></li><li>Temp: ${temp} &#8457</li><li>Wind: ${wind} MPH</li><li>Humidity: ${humidity}%</li></ul>`);
    $('.day').css({ 'background-color': '#40C3E0', 'padding': '4px'});
}

var changeColorOfUVIndex = function (uvIndex) {
    if (uvIndex <= 2) {
        // change background color to green
        $("span").css({ 'background-color': '#228C22', 'color': '#FFFFFF', 'padding-left': '5px', 'padding-right': '5px' });
        console.log("green");
    } else if (uvIndex <= 6) {
        // change background color to yellow
        $("span").css({ 'background-color': '#FFFF00', 'color': '#000000', 'padding-left': '5px', 'padding-right': '5px' });
        console.log("yellow");
    } else if (uvIndex <= 7) {
        // change background color to orange
        $("span").css({ 'background-color': '#FF6700', 'color': '#FFFFFF', 'padding-left': '5px', 'padding-right': '5px' });
        console.log("orange");
    } else if (uvIndex <= 10 ) {
        // change background color to red
        $("span").css({ 'background-color': '#FF0000', 'color': '#FFFFFF', 'padding-left': '5px', 'padding-right': '5px' });
        console.log("red");
    } else {
        // change background color to purple
        $("span").css({ 'background-color': '#551A8B', 'color': '#FFFFFF', 'padding-left': '5px', 'padding-right': '5px' });
        console.log("purple");
    }
}

var displayClickedData = function (event) {
    var index = $(event.target).attr("data-index");
    var cityButton = document.getElementById(`saved-city${index}`);
    var city = $(cityButton).text();
    // console.log(cityButton);
    getWeatherDataByCity(city);
    console.log(city);
}

getSavedCities();
$(`.city-button`).on("click", displayClickedData);
