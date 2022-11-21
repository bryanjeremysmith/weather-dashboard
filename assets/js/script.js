$(function () {
    var APIKey = "9c53ae9c6aa68485786246f0493f1097";
    var previousCities = JSON.parse(localStorage.getItem("cities")) || [];

    var cityName = "Portland";
    var limit = 1;

    var currentWeatherQueryBaseURL = "http://api.openweathermap.org/data/2.5/weather?q=";// + city + "&appid=" + APIKey;
    //var geoCodingQueryBaseURL = "http://api.openweathermap.org/geo/1.0/direct?q=";// + cityName + "," + stateCode + "," + countryCode + "&limit=" + limit + "&appid=" + APIKey;
    var geoCodingQueryBaseURL = "http://api.openweathermap.org/geo/1.0/direct?q=";// + cityName + "&limit=" + limit + "&appid=" + APIKey;
    
    var fiveDayForecastQueryBaseURL = "http://api.openweathermap.org/data/2.5/forecast?lat=";// + lat + "&lon=" + lon + "&appid=" + APIKey;

    function loadCityButtons(){
        $("#history")[0].innerHTML = "";
        for(var i = previousCities.length - 1; i >= 0; i--)
        {
            var historyCity = $('<button type="button" class="list-group-item list-group-item-secondary m-1">' + previousCities[i].name + '</button>');
            $("#history").append(historyCity);
        }
    }

    function getData(url) {
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
        })
        .catch(function(error){
            console.log(error);
        })
    }


    var now = dayjs();
    $("#currentCity").text("Portland, OR " + dayjs().format("M/D/YYYY"));
    $("#day1Date").text(dayjs().add(1, 'day').format("M/D/YYYY"));
    $("#day2Date").text(dayjs().add(2, 'day').format("M/D/YYYY"));
    $("#day3Date").text(dayjs().add(3, 'day').format("M/D/YYYY"));
    $("#day4Date").text(dayjs().add(4, 'day').format("M/D/YYYY"));
    $("#day5Date").text(dayjs().add(5, 'day').format("M/D/YYYY"));

    loadCityButtons();
  
    //Listens for the on click of a button
    $("[class^='btn btn-primary']").on("click", function (){
        cityName = $("#cityInput")[0].value;
        getData(geoCodingQueryBaseURL + cityName + "&limit=" + limit + "&appid=" + APIKey);
    });
});