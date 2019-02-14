$(document).ready(function() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(weather);
  } else {
    alert("Geolocation isn't supported!");
  }
});

function weather(position) {
  var lat = position.coords.latitude;
  var lon = position.coords.longitude;
  var apiKey = "7f6d8b71ad38c642460cb7f29f6c204b";
  url =
    "https://api.darksky.net/forecast/" +
    apiKey +
    "/" +
    lat +
    "," +
    lon +
    "?lang=en&&units=ca&exclude=minutely,flags?";
  //Call DarkSky and pull current weather
  $.ajax({
    url: url,
    dataType: "jsonp",
    success: function(forecast) {
      
      var currentTemp = Math.round(forecast.currently.temperature);
      var apparentTemp = Math.round(forecast.currently.apparentTemperature);
      var avgTemp = Math.round((forecast.daily.data[0].temperatureMax + forecast.daily.data[0].temperatureMin)/2);
      var pressure = Math.round(forecast.currently.pressure / 1.3333);
      
      $("#currentTemp").append('<p class="currTemp">'+ currentTemp + '°C' + '<p>');
      $("#dailyInfo").append('<p>' + 'Feels like ' +  apparentTemp + '°C' + '<p>');
      $("#dailyInfo").append('<p>' + 'Average per day ' +  avgTemp + '°C' + '<p>');
      $("#dailyInfo").append('<p>' + 'Pressure ' +  pressure + 'mm' + '<p>');
      console.log(forecast);
      forecast.hourly.data.forEach(function(item,index) {
          if (index >= 1 && index <= 4) {
            var dt=eval(forecast.hourly.data[index].time*1000);
            var myDate = new Date(dt);
            
            $('#forecast').append(
                '<div class="forecast-item">' +

                  '<p class="time">' + myDate.getHours()+ ':00' +'</p>' +
                  '<p class="temp">' + Math.round(item.temperature) + '°C' +'</p>'+  

                '</div>'
              );
          }
        })
      
      //Skycons
      var iconRequest = forecast.currently.icon;
      
      var icons = new Skycons({'color' : '#eeeeee'});
      
      var iconList = [
        "clear-day",
        "clear-night",
        "partly-cloudy-day",
        "partly-cloudy-night",
        "cloudy",
        "rain",
        "sleet",
        "snow",
        "wind",
        "fog"
      ];    
      console.log(icons);
      for (i = 0; i < iconList.length; i++) {
        if (iconRequest == iconList[i]) {
            icons.set('icon', iconList[i]);
        }
      }
      icons.play();
    }
  });
  GoogleMaps(lat, lon);
}

function GoogleMaps(latitude, longitude) {
  $.get(
    "https://maps.googleapis.com/maps/api/geocode/json?latlng=" +
      latitude +
      "," +
      longitude +
      "&key=AIzaSyAW0tnVQ4-ezK2M9Lq-CDhFWJFn8-JuyCQ&result_type=locality|administrative_area_level_1",
    function(json) {
      var address_comp = json.results[0].address_components;
      var city = "";
      var state = "";

      address_comp.forEach(function(loc) {
        var type = loc.types;
        if (type.indexOf("locality") != -1) {
          city = loc.long_name;
        } else if (type.indexOf("administrative_area_level_1") != -1) {
          state = loc.short_name;
        }
      });
      address = city + ", " + state;
      $("#address").html('<h3>' + address + '</h3>');
    }
  );
}

