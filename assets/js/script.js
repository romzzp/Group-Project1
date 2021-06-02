<<<<<<< HEAD
// Date Picker //
var autoupdate = false;

function date1(){
$('.date-picker').daterangepicker({
  singleDatePicker: true,
  showDropdowns: true,
  minDate: 'today',
  autoApply: true,
  autoUpdateInput: autoupdate,
  locale: {
    format: 'YYYY-MM-DD'
  }
}, function(chosen_date) {
  $('.date-picker').val(chosen_date.format('YYYY-MM-DD'));
});
  };
date1();

$('.date-picker-2').daterangepicker({
  singleDatePicker: true,
  showDropdowns: true,
  minDate: 'today',
  autoApply: true,
  autoUpdateInput: false,
  locale: {
    format: 'YYYY-MM-DD'
  }
}, function(chosen_date) {
  $('.date-picker-2').val(chosen_date.format('YYYY-MM-DD'));
});

$('.date-picker').on('apply.daterangepicker', function(ev, picker) {
    if ($('.date-picker').val().length == 0 ){
    autoupdate = true;
    console.log('true');
    date1();
  };
  var departpicker = $('.date-picker').val();
  $('.date-picker-2').daterangepicker({
    minDate: departpicker,
    singleDatePicker: true,
    showDropdowns: true,
    autoApply: true,
    locale: {
      format: 'YYYY-MM-DD'
    }
  });
  
  var drp = $('.date-picker-2').data('daterangepicker');
  drp.setStartDate(departpicker);
  drp.setEndDate(departpicker);
});


$('#clear').click(function(){
 $('input.form-control').val('');
});
=======
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
>>>>>>> 5cd8c9d6374f9c727d79ac03dc45996583ca0b12
