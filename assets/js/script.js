// jquery ready fuction
$(document).ready(function() {

    var imperialUnits = "&units=imperial"; // used for metric conversion
    var weatherAPIKey = "&appid=4699b7ecaf8c25b174642d7412e9b428" // assign open weather API key to variable

    // capture the text input when search button is clicked
    $("#search-button").on("click", function () {
        event.preventDefault(); // stops the URL from opening up
        var cityName = $("#city-name").val(); // set the value of text input to new variable
        $("#city-name").val(""); // clear search box after search
        $("input:text").click(function () { // clear search box when user clicks inside the box
            $(this).val("");
            $("#todays-weather").empty(); // clear todays-weather
            $("#forecast").empty(); // clear forecast
        });
        getWeather(cityName);
    });

    // search history
    $(".history").on("click", "li", function() {
        getWeather($(this).text());
    });

    // search history list
    function listCity(text) {
        var listCityName = $("<li>")
        .addClass("list-group-item list-group-item-action") // add class and name
        .text(text); // add text
        $(".history").append(listCityName);// merge and add to HTML
    }

    // get weather function
    function getWeather(cityName) {
        $.ajax ({ // start AJAX to communicate with weather server
            type: "GET",
            url: "api.openweathermap.org/data/2.5/weather?q=" +
            cityName +
            imperialUnits +
            weatherAPIKey,
        dataType: "json",
        success: function(data) {
            if (history.indexOf(cityName) === -1) { // start creating history link for search
                history.push(cityName);
                window.localStorage.setItem("history", JSON.stringify(history));
                listCity(cityName);
            }
            $("#todays-weather").empty(); // clear content in todays-weather
            $("forecast").empty();// clear content in five day forecast

            // time conversion
            var sec = data.dt;
            var forecastDate = new Date(sec * 1000);
            var timeStr = forecastDate.toLocaleTimeString();
            var dateStr = forecastDate.toLocaleTimeString();
            var dayStr = forecastDate.getUTCDay(); // weekday conversion
            var weekday = new Array(7);
            weekday[0] = "Sunday";
            weekday[1] = "Monday";
            weekday[2] = "Tuesday";
            weekday[3] = "Wednesday";
            weekday[4] = "Thursday";
            weekday[5] = "Friday";
            weekday[6] = "Saturday";
            var weekdayStr = weekday[dayStr];

            var forecastUl = $("<div>", { id: "forecast-container" }); // creating div element html content for current weather

            var listName = $("<div>", { id: "name-div" });
            listName.text(data.name + " (" + dateStr + ") ");

            var listImg = $("<div>", { id: "img-div" });
            var iconImg = $("<img>");
            iconImg.attr("src", "https://openweathermap.org/img/w/" + data.weather[0].icon + ".png",);
            listImg.append(iconImg);

            var listTemp = $("<div>", { id: "temp-div" });
			listTemp.text("Temperature: " + data.main.temp + " °F");

            var listHumidity = $("<div>", { id: "humid-div" });
			listHumidity.text("Humidity: " + data.main.humidity + "%");

            var listWindSpeed = $("<div>", { id: "speed-div" });
			listWindSpeed.text("Wind Speed: " + data.wind.speed + " MPH");

            var listUVIndex = $("<div>", { id: "index-div" });

            forecastUl.append(
                listName,
                listImg,
                listTemp,
                listHumidity,
                listWindSpeed,
                listUVIndex,
            );

            $("#todays-weather").append(forecastUl); // merge and add to HTML

            getFiveDayForecast(cityName);
            getUVIndexWarning(data.coord.lat, data.coord.lon);
        }
      });
    }


})