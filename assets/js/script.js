var APIKey = "9c53ae9c6aa68485786246f0493f1097";

var city = "Portland";

var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey;

fetch(queryURL)