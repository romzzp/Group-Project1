//JQuery Date Picker
//Date picker 1
$(function () {
    $("#datepicker").datepicker();
}
);

//Date picker 2
$(function () {
    $("#datepicker2").datepicker();
}
);


// // ELISONS PORTION
// ELEMENT SELECTORS
var locInputEl = document.querySelector('#locInput');
// var dateInEl = document.querySelector('#[CHECK-IN-DATE-ID]');
// var dateOutEl = document.querySelector('#[CHECK-OUT-DATE-ID');
var resultEl = document.querySelector('#cardContainer')
var buttonEl = document.querySelector('#submitBtn');
var mapDivEl = document.getElementById("map")
var choiceEl 

// VARIABLES
var locInput;
var checkInDate = "2021-01-27"; // change so not hardcoded
var checkOutDate = "2021-01-28"; // change so not hardcodded
var roomNum = "1";
var map;
var service;
var infowindow;


// EVENT HANDLER
function formSubmitHandler(event) {
    event.preventDefault();

    locInput = locInputEl.value.trim();
    // populate datein
    // populate dateout
    // populate roomnum

    geocodeApiFunc(locInput);
    choiceEl = document.querySelectorAll(".choice-btn");
    resultEl.addEventListener("click", chooseHotelClick);


}


// // FETCH APIS

// function to translate city names to geocode
function geocodeApiFunc(loc) {
    var geocodeUrl = "https://geocode.search.hereapi.com/v1/geocode?q=" + locInput + "&apiKey=D1Hv_zXz0JAD-U38n3BNT1zWKGjjPAFX9gsbKb2EwFw";
    fetch(geocodeUrl)
        .then(function (response) {
            response.json().then(function (data) {
                var latVal = data.items[0].position.lat;
                var lngVal = data.items[0].position.lng;
                console.log(lngVal, latVal);
                hotelApiFunc(latVal, lngVal, checkInDate, checkOutDate, roomNum);
            })
                .catch(function (error) {
                    console.log(error);
                })
        })

}

// function to get results from hotel api
function hotelApiFunc(lat, lon, checkin, checkout, rooms) {
    fetch("https://hotels-com-free.p.rapidapi.com/srle/listing/v1/brands/hotels.com?lat=" + lat + "&lon=" + lon + "&checkIn=" + checkin + "&checkOut=" + checkout + "&rooms=" + rooms + "&locale=en_US&currency=CAD&pageNumber=1", {
        "method": "GET",
        "headers": {
            "x-rapidapi-key": "8d865802b7msh2e691d434973416p1b41cejsnb0d8a7dd6a50",
            "x-rapidapi-host": "hotels-com-free.p.rapidapi.com"
        }
    })
        .then(function (response) {
            response.json().then(function (responsejson) {
                var hotelList = responsejson.data.body.searchResults.results;
                console.log(hotelList);
                for (var i = 0; i < hotelList.length; i++) {
                    createHotelCard(hotelList[i])
                }
                // USING THIS LIST, POPULATE WITH A CARD MAKER
            })
        })
        .catch(function (error) {
            console.error(err);
        });
}

//Variable to test hotel cards
// var dummyHotel = {
//     address: {
//         streetAddress: '123 Somewhere St.'
//     },
//     name: 'Dummy Hotel',
//     ratePlan: {
//         price: {
//             current: "$1,000"
//         }
//     },
//     guestReviews: {
//         rating: "1 Star"
//     }
// }
// function to create card for results gotten back from hotel api
// need to stick hotelid somewhere
function createHotelCard(hotel) {
    var hotelId = hotel.id;
    var hLat = hotel.coordinate.lat
    var hLon = hotel.coordinate.lon
    var pstl = hotel.address.postalCode
    if (!pstl) {
        return;    
    }

    var address = hotel.address.streetAddress;
    if (!address) {
        address = "NO ADDRESS"
    }
    var name = hotel.name;
    if (!name) {
        name = "NO NAME";
    }
    var ratings = hotel.guestReviews
    if (!ratings) {
        ratings = "NO REVIEWS";
    } else {
        ratings = hotel.guestReviews.rating
        if (!ratings) {
            ratings = "NO RATINGS";
        }
    }
    var price = hotel.ratePlan
    if (!price) {
        price = "NO PRICE";
    } else {
        price = hotel.ratePlan.price.current
        if (!price) {
            price = "NO PRICE";
        }
    }

    console.log(address, name, ratings, price)
    // populate with name, address, price, and ratings if possible

    var cardDiv = document.createElement('div');
    cardDiv.setAttribute('class', 'card');
    cardDiv.setAttribute("data-hotel-id", hotelId);
    cardDiv.setAttribute("data-lat", hLat);
    cardDiv.setAttribute("data-lon", hLon)
    cardDiv.setAttribute("data-pstl", pstl)

    var cardHeader = document.createElement('div');
    cardHeader.setAttribute('class', 'card-header');

    var cardContent = document.createElement('div');
    cardContent.setAttribute('class', 'card-content p-2');

    var cardFooter = document.createElement('div');
    cardFooter.setAttribute('class', 'card-footer d-grid gap-2');

    var cardBtn = document.createElement('button')
    cardBtn.setAttribute('class', 'choice-btn btn btn-outline-primary btn-sm m-1');

    resultEl.append(cardDiv);
    cardDiv.append(cardHeader);
    cardDiv.append(cardBtn)
    cardHeader.insertAdjacentElement('afterend', cardContent);
    cardContent.insertAdjacentElement('afterend', cardFooter);

    cardHeader.textContent = name;
    cardContent.textContent = `${address} | ${price}`;
    cardFooter.textContent = `${ratings} ⭐`;
    cardBtn.textContent = "CHOOSE"

    // var hCardEl = document.createElement("div");
    // hCardEl.setAttribute("data-hotel-id", hotelId)
    // hCardEl.setAttribute("data-lat", hLat)
    // hCardEl.setAttribute("data-lon", hLon)
    // resultsEl.appendChild(hCardEl);
    // var hNameEl = document.createElement("h3");
    // hNameEl.textContent = name;
    // hCardEl.appendChild(hNameEl);
    // var hParaEl = document.createElement("p");
    // hParaEl.textContent = address + " | " + ratings + "⭐ | " + "price" ;
    // hCardEl.appendChild(hParaEl);
}

// createHotelCard(dummyHotel);

// HOTEL IMAGE API MAY NOT USE
// returns an url for an image of the room
// NOTE: TRY PUTTING IN A TIMER TO DELAY BY A FEW SECONDS
// NOTE: TRY USING the data-hotel-id attribute to get the hId
// function fetchHotelImage(hId) {
//     fetch("https://hotels-com-free.p.rapidapi.com/nice/image-catalog/v2/hotels/" + hId, {
//         "method": "GET",
//         "headers": {
//             "x-rapidapi-key": "475606eb04msh3305527aef63460p1ea2ccjsn5d20c76f0ac9",
//             "x-rapidapi-host": "hotels-com-free.p.rapidapi.com"
//         }
//     })
//         .then(function (response) {
//             response.json().then(function (responsejson) {
//                 var imgsrc = responsejson.hotelImages[0].baseUrl;
//                 newImgsrc = imgsrc.replace("_{size}", "")
//                 return (newImgsrc)
//             })
//         })
//         .catch(function (error) {
//             console.log(error);
//         })
// }

// CREATE CARDS FOR RESULTS

function displayMap(lat, lng, pstl){
    var hotelArea = new google.maps.LatLng(lat, lng);
    infowindow = new google.maps.InfoWindow();
    map = new google.maps.Map(mapDivEl, {
        center: hotelArea,
        zoom:15
    })
    var request = {
        query: pstl,
        fields: ["formatted_address", "geometry"],
    }

    service = new google.maps.places.PlacesService(map);
    service.findPlaceFromQuery(request, function (results, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
            loc = results[0].geometry.location
            map.setCenter(loc);
            createMarker(results[0])
        }
    });
    service.nearbySearch({
        location: hotelArea,
        radius: 1500,
        keyword: "POI",
    }, function(results, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
            for (let i = 0; i < results.length; i++) {
                createMarker(results[i]);
            }
        }
    }) 
    console.log('done');
}


//  NOTE: TO CREATE MARKERS
function createMarker(place) {
    if (!place.geometry || !place.geometry.location){
          return;
    }
    var marker = new google.maps.Marker({
        map,
        position: place.geometry.location,
    });
    google.maps.event.addListener(marker, "click", () => {
        infowindow.setContent(place.name || "");
        infowindow.open(map);
    });
}

function chooseHotelClick(event){
    var targetClass = event.target.getAttribute("class");
    if (targetClass !== "choice-btn"){
        return;
    }
    var cardContainer = event.target.parentElement;
    console.log(cardContainer);
    var hotelId = cardContainer.getAttribute("data-hotel-id");
    var lat = cardContainer.getAttribute("data-lat");
    var lon = cardContainer.getAttribute("data-lon");
    var pstl = cardContainer.getAttribute("data-pstl");
    displayMap(lat, lon, pstl);
}

buttonEl.addEventListener('click', formSubmitHandler);


// FROM INPUT VALUE
// GO TO GEOCODE API TO GET LONG/LAT
// USING LONG/LAT, SEARCH FOR HOTELS USING HOTEL API
// IF POSSIBLE USE HOTEL API TO ALSO GET PICTURES
// WHEN A HOTEL IS CHOSEN, CREATE A MAP USING GOOGLE MAPS API

// GOOGLE MAPS USES HOTEL CHOSEN AS ITS CENTER AND LOOKS FOR TOURIST DESTINATIONS NEARBY


// GOOGLE MAPS USES HOTEL CHOSEN AS ITS CENTER AND LOOKS FOR TOURIST DESTINATIONS NEARBY
