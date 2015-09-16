/*
 * The app.js file defines the neighborhood map. It contains interested
 * location coordinates. Google map is initialized and markers are set
 * to the coordinates. There is search functionality on the added
 * markers. Yelp and Wiki apis are to be linked to information windows
 * that appear when a marker is clicked.
 *
 * Frontend Web Developer Nanodegee, Udacity
 * Project 5
 * @date May Aug31st, 2015
 * @author Samata Bulusu
*/

// constant for hotel type
var HOTEL_TYPE = 'hotel';
// constant for mall type
var MALL_TYPE = 'mall';
// constant for landmark tyoe
var LANDMARK_TYPE = 'landmark';
// constant for retail type
var RETAIL_TYPE = 'retail';
// constant for bank type
var BANK_TYPE = 'bank';
// constant for restaurant type
var RESTAURANT_TYPE = 'food';
// an array to contain all markers
var markers = [];
// handle to the google map
var map;

// center the map at the middle(ish) if Magnificent Mile
var centerMapCoordinates = {lat: 41.888810, lng: -87.624048};
// for outline of the neighborhood
var neighborhoodCoordinates = [{lat: 41.888878, lng: -87.624786},
								{lat: 41.889249, lng: -87.624695},
								{lat: 41.889317, lng: -87.624854},
								{lat: 41.900783, lng: -87.624485},
								{lat: 41.900821, lng: -87.623740},
								{lat: 41.889709, lng: -87.623765},
								{lat: 41.889307, lng: -87.623586},
								{lat: 41.889230, lng: -87.623868},
								{lat: 41.888810, lng: -87.624048},
								{lat: 41.888878, lng: -87.624786}];

// initialize the google map
function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
		zoom: 14,
		center: centerMapCoordinates

	});
	// all interested locations markers to be dropped when map is initiated
	//drop(ALL_TYPE);
	// draw a polyline for magnificent mile in google maps
	var path = new google.maps.Polyline({
	    path: neighborhoodCoordinates,
	    geodesic: true,
	    strokeColor: '#FF69B4',
	    strokeOpacity: 1.0,
	    strokeWeight: 2
	});
  	path.setMap(map);
}

function displayMarker(markersArray, popOpen) {
	// TODO: check for fail alert and send it via infowindow to the user
	var yelpArray = markersArray;
	var lat = yelpArray.latitude;
	var lng = yelpArray.longitude;
	var marker = new google.maps.Marker({
							position: new google.maps.LatLng(lat, lng),
							map: map,
							animation: google.maps.Animation.DROP,
							title: yelpArray.name
							});
	marker.setVisible(yelpArray.visible);
	markers.push(marker);
	var displayElement = '<div class="info-window"><h6>' +
							yelpArray.name + '</h6>' +
							yelpArray.address + '<p>' + yelpArray.displayPhone  +
							'<p><img src="' + yelpArray.stars +
							'" height=20 width=100 alt="Yelp Rating">' +
							'</p>' +
							'<p><img src="' + yelpArray.imageUrl +
							'" height=100 width=150 class="img-thumbnail">' + '</p>' +
							yelpArray.snippetText + '<br>' +
							'<a class="btn btn-default btn-small" href="' + yelpArray.mobileUrl +
							 '" target="_blank">More Yelp!</a></p></div>';

	var infoWindow = new google.maps.InfoWindow({
							content: displayElement
						});
	if(popOpen === true) {
		infoWindow.open(map, marker);
	}
	// anonymous function to help tag proper content window to each marker
	google.maps.event.addListener(marker, 'mouseover', function(handle, pop) {
		return function() {
			pop.open(map, handle);
		};
	}(marker, infoWindow));

		// anonymous function to help tag proper content window to each marker
	google.maps.event.addListener(marker, 'mouseout', function(handle, pop) {
		return function() {
			pop.close();
		};
	}(marker, infoWindow));

}

//display asked for markers on the google map
function displayMarkers(markersArray) {
	// this clears the google map array of markers
	clearMarkers();
	for (var j = 0; j < markersArray.length; j++) {
		displayMarker(markersArray[j], false);
	}
}

// clear all markers on the google map by setting them to null
function clearMarkers() {
	for (var i = 0; i < markers.length; i++) {
		markers[i].setMap(null);
	}
	markers = [];
}

// get an array of markers of the requested type
// from the allMarkers array populated by our yelp call
function getVisibleMarkers() {
	var visibleMarkers = [];
	var len = allMarkers.length;
	for (var i = 0; i < len; i++) {
		var marker = allMarkers[i];
		if (marker.visible) {
			visibleMarkers.push(marker);
		}
	}
	return visibleMarkers;
}

// get the array of markers with the requested name and type
// from allMarkers array populated by our yelp call
function getVisibleMarkersByPOI(name) {
	var poiMarkers = [];
	var len = allMarkers.length;
	for (var i = 0; i < len; i++) {
		var marker = allMarkers[i];
		if (marker.name == name) {
			marker.visible = true;
			poiMarkers.push(marker);
		} else {
			marker.visible = false;
		}
	}
	return poiMarkers;
}

// consumer key for yelp
var consumerKey = "DnQn7xnOmHlQHpd80U2bEw";
// consumer secret for yelp
var consumerSecret = "PSGT6NZ978aecOU5Y6ElrEbKZMc";
// consumer token for yelp
var token = "aEKlZtLMH0rapH_-K7O4U6A5tGFW6fXT";
// consumer token secret for yelp
var tokenSecret = "bt64O7Xwt2qJvWACoC3UMOuqIDg";

// array for our consumer secret and token secret
var accessor = {
  consumerSecret: consumerSecret,
  tokenSecret: tokenSecret
};

// yelp api call
function callYelp(business) {
	var parameters = [];
	parameters.push(['term', business]);
	parameters.push(['location', "Chicago"]);
	parameters.push(['callback', 'cb']);
	parameters.push(['oauth_consumer_key', consumerKey]);
	parameters.push(['oauth_consumer_secret', consumerSecret]);
	parameters.push(['oauth_token', token]);
	parameters.push(['oauth_signature_method', 'HMAC-SHA1']);
	var message = {
	  'action': 'http://api.yelp.com/v2/search',
	  'method': 'GET',
	  'parameters': parameters
	};
	OAuth.setTimestampAndNonce(message);
	OAuth.SignatureMethod.sign(message, accessor);
	var parameterMap = OAuth.getParameterMap(message.parameters);
	parameterMap.oauth_signature = OAuth.percentEncode(parameterMap.oauth_signature);

	$.ajax({
		'url': message.action,
		'data': parameterMap,
		'cache': true,
		'dataType': 'jsonp',
		'success': handleYelpData
		}).fail(function(XMLHttpRequest, status, error) {
			console.log("Yelp! Yelp! Error from YELP!  " + business);
	});
}

// an array to store marker data from
var allMarkers = [];

// callback function that handles yelp data
// to populate our markers with
function handleYelpData(data) {
	var results = data.businesses;
	//console.log(data);
	console.log("this is good!");
	if (results.length > 0) {
		//build the successful data to be sent back from the first result
		/*
		display_phone: "+1-312-440-1500"
		id: "warwick-allerton-hotel-chicago-chicago-3"
		image_url: "http://s3-media3.fl.yelpcdn.com/bphoto/iaJuS6ehDXXvbzq27M85Zg/ms.jpg"
		is_claimed: true
		is_closed: false
		location: Object
		address: Array[1]
		city: "Chicago"
		coordinate: Object
		latitude: 41.895154
		longitude: -87.623928
		__proto__: Object
		country_code: "US"
		cross_streets: "Superior St & Huron St"
		display_address: Array[3]
		0: "701 N Michigan Ave"
		1: "Near North Side"
		2: "Chicago, IL 60611"
		length: 3
		__proto__: Array[0]
		geo_accuracy: 9.5
		neighborhoods: Array[2]
		postal_code: "60611"
		state_code: "IL"
		__proto__: Object
		mobile_url: "http://m.yelp.com/biz/warwick-allerton-hotel-chicago-chicago-3"
		name: "Warwick Allerton Hotel Chicago"
		phone: "3124401500"
		rating: 3.5
		rating_img_url: "http://s3-media1.fl.yelpcdn.com/assets/2/www/img/5ef3eb3cb162/ico/stars/v1/stars_3_half.png"
		rating_img_url_large: "http://s3-media3.fl.yelpcdn.com/assets/2/www/img/bd9b7a815d1b/ico/stars/v1/stars_large_3_half.png"
		rating_img_url_small: "http://s3-media1.fl.yelpcdn.com/assets/2/www/img/2e909d5d3536/ico/stars/v1/stars_small_3_half.png"
		review_count: 259
		snippet_image_url: "http://s3-media3.fl.yelpcdn.com/photo/8r8s6-tKCAbEPrRSyeOVuQ/ms.jpg"
		snippet_text: "Location, location, location! The Warwick Allerton is nestled along the Magnificent Mile, on the corner of Michigan and East Huron. While many reviewers..."
		url: "http://www.yelp.com/biz/warwick-allerton-hotel-chicago-chicago-3"
		*/
		var business = data.businesses[0];
		var name = business.name;
		var lat = business.location.coordinate.latitude;
		var lng = business.location.coordinate.longitude;
		var displayPhone = business.display_phone;
		var url = business.url;
		var mobileUrl = business.mobile_url;
		var stars = business.rating_img_url_small;
		var imageUrl = business.image_url;
		var rating = business.rating;
		var snippetText = business.snippet_text;
		var address = business.location.display_address[0] + "<br>" + business.location.display_address[business.location.display_address.length - 1];

		var markerData = {"name": name,
							"latitude": lat,
							"longitude": lng,
							"mobileUrl": mobileUrl,
							"rating": rating,
							"imageUrl": imageUrl,
							"snippetText": snippetText,
							"address": address,
							"stars": stars,
							"displayPhone": displayPhone,
							"url": url,
							"visible": true};


		allMarkers.push(markerData);
		//console.log("trying to display: " + markerData.name);
		displayMarker(markerData);

	} else {
		// TODO: send fail alert to infowindow view markerData or similar array
		console.log("Unable to obain yelp data for: " + data);
	}
}

	// all the data to be displayed by the markers
var locations = [
	{ name: "The Drake Hotel", visible: "true" },
	{ name: "Park Hyatt Chicago", visible: "true" },
	{ name: "Warwick Allerton Hotel Chicago", visible: "true" },
	{ name: "Omni Chicago Hotel", visible: "true" },
	{ name: "Tribune Tower", visible: "true" },
	{ name: "Michigan Avenue Bridge", visible: "true" },
	{ name: "John Hancock Center", visible: "true" },
	{ name: "The Magnificent Mile", visible: "true" },
	{ name: "Bloomingdale's", visible: "true" },
	{ name: "Burberry", visible: "true" },
	{ name: "Chanel Boutique", visible: "true" },
	{ name: "Coach", visible: "true" },
	{ name: "Louis Vuitton", visible: "true" },
	{ name: "Tumi Luggage", visible: "true" },
	{ name: "Saks Fifth Avenue", visible: "true" },
	{ name: "Tiffany & Co", visible: "true" },
	{ name: "Cartier", visible: "true" },
	{ name: "Water Tower Place", visible: "true" },
	{ name: "The Shops at North Bridge", visible: "true" },
	{ name: "The 900 Shops", visible: "true" },
	{ name: "Chase Bank", visible: "true" },
	{ name: "Citibank", visible: "true" },
	{ name: "Bank of America", visible: "true" },
	{ name: "The Purple Pig", visible: "true" },
	{ name: "NoMI Kitchen", visible: "true" },
	{ name: "Bandera Restaurant", visible: "true" },
	{ name: "The Signature Room at the 95th", visible: "true" },
	{ name: "Grand Lux Cafe", visible: "true" },
	{ name: "Foodlife", visible: "true" }
];

function displayInfoWindow(name) {
	console.log("name = " + name);
	for (var i = 0; i < allMarkers.length; i++) {
		if (allMarkers[i].name.toLowerCase() === name) {
			clearMarkers();
			displayMarker(allMarkers[i], true);
		}
	}
}

// our view model for knockout js
var viewModel = {

	yelps: ko.observableArray(allMarkers),

	places: ko.observableArray(locations),

	infoWindow: function(item) {
		displayInfoWindow(item.name.toLowerCase());
	},

	query: ko.observable(''),

	// credit: http://opensoul.org/2011/06/23/live-search-with-knockoutjs/
	search: function(value) {
		viewModel.yelps.removeAll();
        viewModel.places.removeAll();
        clearMarkers();
        for(var x in locations) {
          if(locations[x].name.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
            viewModel.places.push(locations[x]);
            var n = locations[x].name.toLowerCase();
            var numMarkers = allMarkers.length;
            for (var i = 0; i < numMarkers; i++) {
            	if (allMarkers[i].name.toLowerCase() === n) {
            		viewModel.yelps.push(allMarkers[i]);
            		displayMarker(allMarkers[i], false);
            	}
            }
          }
        }
      }
};

viewModel.query.subscribe(viewModel.search);

$(document).ready(function() {
	// apply the knockout bindings
	ko.applyBindings(viewModel);

    var numData = locations.length;
    for (var i = 0; i < numData; i++) {
    	var currentData = locations[i];
    	callYelp(currentData.name);
    }
});
