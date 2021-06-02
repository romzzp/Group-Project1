// ELEMENT SELECTORS
var userInputEl = document.querySelector('[INPUT-ID]');

// VARIABLES
var userInput


// EVENT HANDLER
function formSubmitHandler(event) {
    userInput = userInputEl.value.trim();
}


// // FETCH APIS
// Geocoder Portion
var geoLocUrl = "https://geocode.search.hereapi.com/v1/geocode?q="+userInputEl+"&apiKey=D1Hv_zXz0JAD-U38n3BNT1zWKGjjPAFX9gsbKb2EwFw"
fetch(geoLocUrl)
    .then(function (response){
        response.json().then(function (data){
            console.log(data);
        })
    })
    .catch(function(error){
        console.log(error);
    })

// Hotel Portion
// Search for hotel by geocode
fetch("https://hotels-com-free.p.rapidapi.com/srle/listing/v1/brands/hotels.com?lat=37.788719679657554&lon=-122.40057774847898&checkIn=2021-01-27&checkOut=2021-01-28&rooms=1&locale=en_US&currency=USD&pageNumber=1", {
	"method": "GET",
	"headers": {
		"x-rapidapi-key": "475606eb04msh3305527aef63460p1ea2ccjsn5d20c76f0ac9",
		"x-rapidapi-host": "hotels-com-free.p.rapidapi.com"
	}
})
.then(function (response) {
    response.json().then(function (responsejson){
        console.log(responsejson.data);
    })
})
.catch(err => {
	console.error(err);
});

// get hotel image
// NOTE: TRY PUTTING IN A TIMER TO DELAY BY A FEW SECONDS
fetch("https://hotels-com-free.p.rapidapi.com/nice/image-catalog/v2/hotels/106346", {
	"method": "GET",
	"headers": {
		"x-rapidapi-key": "475606eb04msh3305527aef63460p1ea2ccjsn5d20c76f0ac9",
		"x-rapidapi-host": "hotels-com-free.p.rapidapi.com"
	}
})
.then(function (response) {
    response.json().then(function (responsejson){
        console.log(responsejson.data);
    })
})
.catch(err => {
	console.error(err);
});


// CREATE CARDS FOR RESULTS


// FROM INPUT VALUE
// GO TO GEOCODE API TO GET LONG/LAT
// USING LONG/LAT, SEARCH FOR HOTELS USING HOTEL API
// IF POSSIBLE USE HOTEL API TO ALSO GET PICTURES
// WHEN A HOTEL IS CHOSEN, CREATE A MAP USING GOOGLE MAPS API
// GOOGLE MAPS USES HOTEL CHOSEN AS ITS CENTER AND LOOKS FOR TOURIST DESTINATIONS NEARBY