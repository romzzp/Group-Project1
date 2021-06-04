//JQuery Date Picker
//Date picker 1
$(function () {
    $("#datepicker").datepicker({
        dateFormat: "yy-mm-dd"
    });
}
);

//Date picker 2
$(function () {
    $("#datepicker2").datepicker({
        dateFormat: "yy-mm-dd"
    });
}
);


// ELEMENT SELECTORS
var locInputEl = document.querySelector('#locInput');
var dateInEl = document.querySelector('#datepicker');
var dateOutEl = document.querySelector('#datepicker2');
var resultEl = document.querySelector('#cardContainer')
var buttonEl = document.querySelector('#submitBtn');
var mapDivEl = document.getElementById("map")
var dynaEl = document.querySelector("#dynamicCard")
var choiceEl

// VARIABLES
var locInput;
var checkInDate;
var checkOutDate;
var roomNum = "1";
var map;
var service;
var infowindow;
var hotelList = []
var hotelListSave = []




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
                hotelList = responsejson.data.body.searchResults.results;
                console.log(hotelList);
                for (var i = 0; i < hotelList.length; i++) {
                    createHotelCard(hotelList[i], i)
                }
            })
        })
        .catch(function (error) {
            console.error(err);
        });
}

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

// function to create the hotel cards
function createHotelCard(hotel, hotelNum) {
    var hotelId = hotel.id;
    var hLat = hotel.coordinate.lat
    var hLon = hotel.coordinate.lon
    var pstl = hotel.address.postalCode
    // ignore cases
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

    // card creation portion


    var cardDiv = document.createElement('div');
    cardDiv.setAttribute('class', 'card');
    cardDiv.setAttribute("data-hotel-id", hotelId);
    cardDiv.setAttribute("data-lat", hLat);
    cardDiv.setAttribute("data-lon", hLon)
    cardDiv.setAttribute("data-pstl", pstl)
    cardDiv.setAttribute("data-objNum", hotelNum)

    var cardHeader = document.createElement('div');
    cardHeader.setAttribute('class', 'card-header');

    var cardContent = document.createElement('div');
    cardContent.setAttribute('class', 'card-content p-2');

    var cardFooter = document.createElement('div');
    cardFooter.setAttribute('class', 'card-footer');

    var cardBtn = document.createElement('button')
    cardBtn.setAttribute('class', 'choice-btn');

    dynaEl.append(cardDiv);
    cardDiv.append(cardHeader);
    cardDiv.append(cardBtn)
    cardHeader.insertAdjacentElement('afterend', cardContent);
    cardContent.insertAdjacentElement('afterend', cardFooter);

    cardHeader.textContent = name;
    cardContent.textContent = `${address} | ${price}`;
    cardFooter.textContent = `${ratings} ⭐`;
    cardBtn.textContent = "CHOOSE"
}


// function to render the google maps api
function displayMap(lat, lng, pstl) {
    var hotelArea = new google.maps.LatLng(lat, lng);
    infowindow = new google.maps.InfoWindow();
    map = new google.maps.Map(mapDivEl, {
        center: hotelArea,
        zoom: 15
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
    }, function (results, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
            for (let i = 0; i < results.length; i++) {
                createMarker(results[i]);
            }
        }
    })
    console.log('done');
}


//  Function to create markers on map
function createMarker(place) {
    if (!place.geometry || !place.geometry.location) {
        return;
    }
    var marker = new google.maps.Marker({
        map,
        position: place.geometry.location,
    });
}

// EVENT HANDLER
function formSubmitHandler(event) {
    event.preventDefault();

    locInput = locInputEl.value.trim();
    checkInDate = dateInEl.value.trim();
    checkOutDate = dateInEl.value.trim();


    if (!locInput || !checkInDate || !checkOutDate) {
        return;
    }

    dynaEl.remove();
    dynaEl = document.createElement('div');
    dynaEl.setAttribute("id", "dynamicCard")
    resultEl.append(dynaEl)

    geocodeApiFunc(locInput);
    choiceEl = document.querySelectorAll(".choice-btn");

}

// event handler for when hotel card button is clicked
function chooseHotelClick(event) {
    var targetClass = event.target.getAttribute("class");
    if (targetClass !== "choice-btn") {
        return;
    }
    hotelListSave = hotelList
    var cardContainer = event.target.parentElement;
    console.log(cardContainer);
    var hotelId = cardContainer.getAttribute("data-hotel-id");
    var lat = cardContainer.getAttribute("data-lat");
    var lon = cardContainer.getAttribute("data-lon");
    var pstl = cardContainer.getAttribute("data-pstl");
    var hotelNum = cardContainer.getAttribute("data-objNum");
    saveData(hotelNum);
    displayMap(lat, lon, pstl);
}

// function to save last clicked hotel to local storage
function saveData(hotelNum) {
    localStorage.setItem("lastInput", JSON.stringify(hotelListSave[hotelNum]));
}

function getData() {
    var lastInputStr = localStorage.getItem("lastInput");

    if (!lastInputStr) {
        return;
    }

    var lastInput = JSON.parse(lastInputStr);
    hotelList.push(lastInput)
    createHotelCard(lastInput, 0);
}

// EVENT LISTENERS
buttonEl.addEventListener('click', formSubmitHandler);
resultEl.addEventListener("click", chooseHotelClick);
getData();