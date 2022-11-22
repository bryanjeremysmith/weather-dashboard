$(function () {
    var APIKey = "9c53ae9c6aa68485786246f0493f1097";
    var previousCities = JSON.parse(localStorage.getItem("cities")) || [];

    var cityName = "Portland";
    var limit = 1;

    var geoCodingQueryBaseURL = "http://api.openweathermap.org/geo/1.0/direct?q=";
    var currentWeatherQueryBaseURL = "https://api.openweathermap.org/data/2.5/weather?lat=";
    var weatherIconBaseURL = "http://openweathermap.org/img/wn/";//10d@2x.png";
    
    var fiveDayForecastQueryBaseURL = "http://api.openweathermap.org/data/2.5/forecast?lat=";

    function loadCityButtons(){
        $("#history")[0].innerHTML = "";
        for(var i = previousCities.length - 1; i >= 0; i--)
        {
            var historyCity = $('<button class="btn btn-secondary m-1">' + previousCities[i].name + '</button>');
            $("#history").append(historyCity);
            historyCity.on("click", function (){
                console.log("clicked " + this.textContent);

                for(let i = 0; i < previousCities.length; i++)
                {
                    if(previousCities[i].name == this.textContent)
                    {
                        getTodaysWeatherFromLatLon(previousCities[i].name, previousCities[i].lat, previousCities[i].lon);

                        get5DayForecastFromLatLon(previousCities[i].lat, previousCities[i].lon);
                        return;
                    }
                }
            });
        }
    }

    function getLatLonFromCity(url) {
        fetch(url)
        .then(function (response) {
            return response.json();
        })
        .then(function (data){

            console.log(data);

            var city = {
                name: data[0].name,
                lat: data[0].lat,
                lon: data[0].lon,
                state: data[0].state,
            }

            previousCities = JSON.parse(localStorage.getItem("cities")) || [];

            var cityIsAlreadyInLocalStorage = false;
            for(var i = 0; i < previousCities.length && cityIsAlreadyInLocalStorage == false; i++)
            {
                if(previousCities[i].name == city.name){
                    cityIsAlreadyInLocalStorage = true;
                }
            }

            if(cityIsAlreadyInLocalStorage == false){
                previousCities.push(city);
                localStorage.setItem("cities", JSON.stringify(previousCities));
                loadCityButtons();
            }
            getTodaysWeatherFromLatLon(city.name, city.lat, city.lon);

            get5DayForecastFromLatLon(city.lat, city.lon);
        })
        .catch(function(error){
            console.log(error);
        })
    }

    function getTodaysWeatherFromLatLon(name, lat, lon){
        
        let url = currentWeatherQueryBaseURL + lat + "&lon=" + lon + "&appid=" + APIKey + "&units=imperial";
        fetch(url)
        .then(function (response){
            return response.json();
        })
        .then(function(data){
            console.log(data);

            $("#currentCityTemp").text("Temp: " + data.main.temp + " °F");
            $("#currentCityWind").text("Wind: " + data.wind.speed + " MPH");
            $("#currentCityHumidity").text("Humidity: " + data.main.humidity + " %");

            let currentDayIcon = $("<img>").attr("src", weatherIconBaseURL + data.weather[0].icon + "@2x.png")

            $("#currentCity").text(name + " (" + dayjs().format("M/D/YYYY") + ")").append(currentDayIcon);

            getWeatherIconById(weatherIconBaseURL + data.weather[0].icon + "@2x.png");
        })
        .catch(function (error){
            console.log(error);
        })
    }

    function get5DayForecastFromLatLon(lat, lon){
        let url = fiveDayForecastQueryBaseURL + lat + "&lon=" + lon + "&appid=" + APIKey + "&units=imperial";
        fetch(url)
        .then(function (response){
            return response.json();
        })
        .then(function(data){
            console.log(data);

            var j = 1;
            for(var i = 0; i < data.list.length; i+=8)
            {
                var dayTemp = '#day' + j + 'Temp';
                $(dayTemp).text("Temp: " + data.list[i].main.temp + " °F");
                var dayWind = '#day' + j + 'Wind';
                $(dayWind).text("Wind: " + data.list[i].wind.speed + " MPH");
                var dayHumidity = '#day' + j + 'Humidity';
                $(dayHumidity).text("Humidity: " + data.list[i].main.humidity + " %");
                var dayIcon = '#day' + j + 'Icon';
                $(dayIcon).attr("src", weatherIconBaseURL + data.list[i].weather[0].icon + "@2x.png")
                $(dayIcon).attr("alt", data.list[i].weather[0].description)
                
                j++;
            }
            $("#dashboardData").removeClass("invisible").addClass("visible");
        })
        .catch(function (error){
            console.log(error);
        })

    }

    var now = dayjs();
    $("#day1Date").text(dayjs().add(1, 'day').format("M/D/YYYY"));
    $("#day2Date").text(dayjs().add(2, 'day').format("M/D/YYYY"));
    $("#day3Date").text(dayjs().add(3, 'day').format("M/D/YYYY"));
    $("#day4Date").text(dayjs().add(4, 'day').format("M/D/YYYY"));
    $("#day5Date").text(dayjs().add(5, 'day').format("M/D/YYYY"));
    $("#dashboardData").addClass("invisible");

    loadCityButtons();
  
    //Listens for the on click of the Search button
    $("[class^='btn btn-primary']").on("click", function (){
        cityName = $("#cityInput")[0].value;
        getLatLonFromCity(geoCodingQueryBaseURL + cityName + "&limit=1&appid=" + APIKey);
    });
});