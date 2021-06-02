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


// // ELISONS PORTION
// ELEMENT SELECTORS
var locInputEl = document.querySelector('#locInput');
// var dateInEl = document.querySelector('#[CHECK-IN-DATE-ID]');
// var dateOutEl = document.querySelector('#[CHECK-OUT-DATE-ID');
// var roomNumEl = document.querySelector('#[ROOM-ID]')
// var resultEl = document.querySelector('#[RESULTS-ID]')
var buttonEl = document.querySelector('#submitBtn');
// VARIABLES
var locInput;
var checkInDate = "2021-01-27";
var checkOutDate = "2021-01-28";
var roomNum = "1";


// EVENT HANDLER
function formSubmitHandler(event) {
    event.preventDefault();

    locInput = locInputEl.value.trim();
    // populate datein
    // populate dateout
    // populate roomnum
    
    geocodeApiFunc(locInput);


}


// // FETCH APIS
// Geocoder Portion

function geocodeApiFunc (loc) {
    var geocodeUrl = "https://geocode.search.hereapi.com/v1/geocode?q="+locInput+"&apiKey=D1Hv_zXz0JAD-U38n3BNT1zWKGjjPAFX9gsbKb2EwFw";
    fetch(geocodeUrl)
        .then(function (response){
            response.json().then(function (data){
                var latVal = data.items[0].position.lat;
                var lngVal = data.items[0].position.lng;
                console.log(lngVal,latVal);
                hotelApiFunc(latVal, lngVal, checkInDate, checkOutDate, roomNum);
            })        
            .catch(function(error){
                console.log(error);
            })
        })
    
}

function hotelApiFunc (lat, lon, checkin, checkout, rooms){
    fetch("https://hotels-com-free.p.rapidapi.com/srle/listing/v1/brands/hotels.com?lat="+lat+"&lon="+lon+"&checkIn="+checkin+"&checkOut="+checkout+"&rooms="+rooms+"&locale=en_US&currency=CAD&pageNumber=1", {
        "method": "GET",
        "headers": {
            "x-rapidapi-key": "475606eb04msh3305527aef63460p1ea2ccjsn5d20c76f0ac9",
            "x-rapidapi-host": "hotels-com-free.p.rapidapi.com"
        }
    })
    .then(function (response) {
        response.json().then(function (responsejson){
            var hotelList = responsejson.data.body.searchResults.results;
            console.log(hotelList);
            for (var i = 0; i < hotelList.length; i++){
                createHotelCard(hotelList[i])
            }
            // USING THIS LIST, POPULATE WITH A CARD MAKER
        })
    })
    .catch(function(error){
        console.error(err);
    });
}

function createHotelCard(hotel){
    var address = hotel.address.streetAddress
    if (!address){
        address = "NO ADDRESS"
    }
    var name = hotel.name
    if (!name){
        name = "NO NAME"
    }
    var ratings = hotel.guestReviews
    if (!ratings){
        ratings = "NO REVIEWS"
    } else {
        ratings = hotel.guestReviews.rating
        if (!ratings){
            ratings = "NO RATINGS"
        }
    }
    var price = hotel.ratePlan
    if (!price){
        price = "NO PRICE"
    } else {
        price = hotel.ratePlan.price.current
        if (!price){
            price="NO PRICE"
        }
    }

    console.log(address, name, ratings, price)
    // populate with name, address, price, and ratings if possible
    // var hotelEl = document.createElement("div");
    // resultEl.appendChild(hotelEl);
    // var hNameEl = document.createElement("p")
    

}

// // Hotel Portion
// // Search for hotel by geocode


// // get hotel image
// // NOTE: TRY PUTTING IN A TIMER TO DELAY BY A FEW SECONDS
// fetch("https://hotels-com-free.p.rapidapi.com/nice/image-catalog/v2/hotels/106346", {
// 	"method": "GET",
// 	"headers": {
// 		"x-rapidapi-key": "475606eb04msh3305527aef63460p1ea2ccjsn5d20c76f0ac9",
// 		"x-rapidapi-host": "hotels-com-free.p.rapidapi.com"
// 	}
// })
// .then(function (response) {
//     response.json().then(function (responsejson){
//         console.log(responsejson.data);
//     })
// })
// .catch(err => {
// 	console.error(err);
// });


// CREATE CARDS FOR RESULTS

buttonEl.addEventListener('click', formSubmitHandler);

// FROM INPUT VALUE
// GO TO GEOCODE API TO GET LONG/LAT
// USING LONG/LAT, SEARCH FOR HOTELS USING HOTEL API
// IF POSSIBLE USE HOTEL API TO ALSO GET PICTURES
// WHEN A HOTEL IS CHOSEN, CREATE A MAP USING GOOGLE MAPS API

// GOOGLE MAPS USES HOTEL CHOSEN AS ITS CENTER AND LOOKS FOR TOURIST DESTINATIONS NEARBY


// GOOGLE MAPS USES HOTEL CHOSEN AS ITS CENTER AND LOOKS FOR TOURIST DESTINATIONS NEARBY

