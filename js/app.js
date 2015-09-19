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

// an array to contain all markers of type google marker
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
	// draw a polyline for magnificent mile in google maps
	var path = new google.maps.Polyline({
	    path: neighborhoodCoordinates,
	    geodesic: true,
	    strokeColor: '#1414c0',
	    strokeOpacity: 1.0,
	    strokeWeight: 2
	});
  	path.setMap(map);
}

/*  display the markers in the array in google maps map
	markersArray - the markers to be displayed
	popOpen - if true, pop the infowindow for the marker open
*/
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

	// when links in list view are clicked, infowindow should pop
	if(popOpen === true) {
		infoWindow.open(map, marker);
	}

	// anonymous function to open infowindow when marker is clicked
	google.maps.event.addListener(marker, 'click', function(handle, pop) {
		return function() {
			// marker bounces when user clicks on the marker
			animate(marker);
			pop.open(map, handle);

		};
	}(marker, infoWindow));

	// anonymous function to close the infowindow, when mouse moves out
	google.maps.event.addListener(marker, 'mouseout', function(handle, pop) {
		return function() {
			pop.close();
		};
	}(marker, infoWindow));
}

/*  animate the marker with a bounce and set a time out on the animation
	marker - the marker to act on
*/
function animate(marker) {
	marker.setAnimation(google.maps.Animation.BOUNCE);
	stopAnimation(marker);
}

/*  stop the marker from bouncing in set time
	marker - the marker to act on
*/
function stopAnimation(marker) {
    setTimeout(function () {
        marker.setAnimation(null);
    }, 2000);
}

/*  display asked for markers on the google map
	markersArray - the array of markers to be displayed
*/
function displayMarkers(markersArray) {
	// this clears the google map array of markers
	clearMarkers();
	for (var j = 0; j < markersArray.length; j++) {
		displayMarker(markersArray[j], false);
	}
}

/*  clear all markers on the google map by setting them to null
*/
function clearMarkers() {
	for (var i = 0; i < markers.length; i++) {
		markers[i].setMap(null);
	}
	markers = [];
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
			alert("Yelp! Yelp! Error from YELP! : could not retrieve Yelp data");
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

// all the points of interest in our neighbourhood map to be displayed by the markers
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

/*  display the infowindow for the item clicked on in the list
	name - the name of point of interest
*/
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

	yelps: ko.observableArray([]),
	// credit: @mcs forum mentor for suggesting to use a copy of locations thusly
	// using the original wipes locations out everywhere! Thank you mcs!!
	locations: ko.observableArray(locations.slice(0)),

	infoWindow: function(item) {
		displayInfoWindow(item.name.toLowerCase());
	},

	query: ko.observable(''),

	// credit: http://opensoul.org/2011/06/23/live-search-with-knockoutjs/
	search: function(value) {
		//console.log("value = " + value);
		clearMarkers();
        viewModel.yelps.removeAll();
        viewModel.locations.removeAll();
        for(var x in locations) {
        	var n = locations[x].name.toLowerCase();
			if(n.indexOf(value.toLowerCase()) >= 0) {
				viewModel.locations.push(locations[x]);
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
    	// call Yelp api to get data for the infowindow
    	callYelp(currentData.name);
    }

    callWeatherUnderground();
});

/*  AJAX call to Weather Underground API to get weather conditions
	for the City of Chicago
*/
function callWeatherUnderground() {
	$.ajax({
		url : "http://api.wunderground.com/api/117f669b717366bc/geolookup/conditions/q/IA/Chicago.json",
		dataType : "jsonp",
		success : handleWeatherUnderground
	}).fail(function(XMLHttpRequest, status, error) {
		alert("Could not get Chicago weather report");
	});
}

/*  Handle the response from weather underground ajax call by appending the
	results to our html object #wu-weather to display on the header
*/
function handleWeatherUnderground(data) {
	var $weather = $("#wu-weather");
	$weather.append('<span><b>Temperature: </b>' +
		data['current_observation']['temperature_string'] +
		' <b> Feels like:  </b>' +
		data['current_observation']['feelslike_string'] +
		'<b> Wind: </b>' +
		data['current_observation']['wind_string'] +
		' <b> Current Conditions: </b>' +
		data['current_observation']['weather'] +
		'</span>');
}