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

//display asked for markers on the google map
function displayMarkers(markersArray) {
	// this clears the google map array of markers
	clearMarkers();

	for (var j = 0; j < markersArray.length; j++) {
		var yelpArray = markersArray[j];
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

		// anonymous function to help tag proper content window to each marker
		google.maps.event.addListener(marker, 'click', function(handle, pop) {
			return function() {
				pop.open(map, handle);
			};
		}(marker, infoWindow));
	}
}

// clear all markers on the google map by setting them to null
function clearMarkers() {
	for (var i = 0; i < markers.length; i++) {
		markers[i].setMap(null);
	}
	markers = [];
}

// display markers on the map as requested by type
// determined by the button clicked
function drop(buttonId) {
	if (buttonId == HOTEL_TYPE) {
		setVisibleMarkers(HOTEL_TYPE);
		displayMarkers(getVisibleMarkers());
	} else if (buttonId == MALL_TYPE) {
		setVisibleMarkers(MALL_TYPE);
		displayMarkers(getVisibleMarkers());
	} else if (buttonId == LANDMARK_TYPE) {
		setVisibleMarkers(LANDMARK_TYPE);
		displayMarkers(getVisibleMarkers());
	} else if (buttonId == RETAIL_TYPE) {
		setVisibleMarkers(RETAIL_TYPE);
		displayMarkers(getVisibleMarkers());
	} else if (buttonId == BANK_TYPE) {
		setVisibleMarkers(BANK_TYPE);
		displayMarkers(getVisibleMarkers());
	} else if (buttonId == RESTAURANT_TYPE) {
		setVisibleMarkers(RESTAURANT_TYPE);
		displayMarkers(getVisibleMarkers());
	}
}

// set markers of the given type to visible in our allMarkers array
function setVisibleMarkers(type) {
	var len = allMarkers.length;
	for (var i = 0; i < len; i++) {
		var marker = allMarkers[i];
		if (marker.type == type) {
			marker.visible = true;
		} else {
			marker.visible = false;
		}
	}
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
function getVisibleMarkersByPOI(name, type) {
	var poiMarkers = [];
	var len = allMarkers.length;
	for (var i = 0; i < len; i++) {
		var marker = allMarkers[i];
		if (marker.name == name &&  marker.type == type) {
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

// get the subset array of data of the requested 'type'
function getType(type) {
	var types = [];
	var length = allData.length;
	for (var i = 0; i < length; i++) {
		var data = allData[i];
		if (data.type == type) {
			types.push(data);
		}
	}
	return types;
}

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
		var type;

		// set hotel type in marker
		var hotelTypes = getType(HOTEL_TYPE);
		var hlength = hotelTypes.length;
		for (var i = 0; i < hlength; i++) {
			var hotelName = hotelTypes[i].name.toLowerCase();
			var markerName = name.toLowerCase();
			if (markerName.indexOf(hotelName) != -1) {
				type = HOTEL_TYPE;
			}
		}

		//set mall type for marker
		var mallTypes = getType(MALL_TYPE);
		var mlength = mallTypes.length;
		for (var j = 0; j < mlength; j++) {
			var mallName = mallTypes[j].name.toLowerCase();
			var markerName = name.toLowerCase();
			if (markerName.indexOf(mallName) != -1) {
				type = MALL_TYPE;
			}
		}

		// set retail type for marker
		var retailTypes = getType(RETAIL_TYPE);
		var rlength = retailTypes.length;
		for (var k = 0; k < rlength; k++) {
			var retailName = retailTypes[k].name.toLowerCase();
			var markerName = name.toLowerCase();
			if (markerName.indexOf(retailName) != -1) {
				type = RETAIL_TYPE;
			}
		}

		// set bank type for marker
		var bankTypes = getType(BANK_TYPE);
		var blength = bankTypes.length;
		for (var a = 0; a < blength; a++) {
			var bankName = bankTypes[a].name.toLowerCase();
			var markerName = name.toLowerCase();
			if (markerName.indexOf(bankName) != -1) {
				type = BANK_TYPE;
			}
		}

		// set food/restaurant type for marker
		var foodTypes = getType(RESTAURANT_TYPE);
		var flength = foodTypes.length;
		for (var b = 0; b < flength; b++) {
			var foodName = foodTypes[b].name.toLowerCase();
			var markerName = name.toLowerCase();
			if (markerName.indexOf(foodName) != -1) {
				type = RESTAURANT_TYPE;
			}
		}

		// set landmark type for marker
		var landmarkTypes = getType(LANDMARK_TYPE);
		var llength = landmarkTypes.length;
		for (var c = 0; c < llength; c++) {
			var landmarkName = landmarkTypes[c].name.toLowerCase();
			var markerName = name.toLowerCase();
			if (markerName.indexOf(landmarkName) != -1) {
				type = LANDMARK_TYPE;
			}
		}

		var markerData = {"name": name,
							"latitude": lat,
							"longitude": lng,
							"mobileUrl": mobileUrl,
							"rating": rating,
							"imageUrl": imageUrl,
							"type": type,
							"snippetText": snippetText,
							"address": address,
							"stars": stars,
							"displayPhone": displayPhone,
							"url": url,
							"visible": true};


		allMarkers.push(markerData);
	} else {
		console.log("Unable to obain yelp data for: " + data);
	}
}

// the locations name is the keyword on which our search works
// this method call returns an array of our interested locations names
function getSearchFriendlyData() {
	var length = allData.length;
	var searchFriendly = [];
	for (var i = 0; i < length; i++) {
		searchFriendly = searchFriendly.concat(allData[i].name);
	}
	return searchFriendly;
}

// our knockout obervable object
function Location(name, latitude, longitude, content, visible, type) {
	this.name = ko.observable(name);
	this.latitude = ko.observable(latitude);
	this.longitude = ko.observable(longitude);
	this.content = ko.observable(content);
	this.visible = ko.observable(visible);
	this.type = ko.observable(type);
}

// our view model for knockout js
var viewModel = {
	locations: ko.observableArray([]),
	search: ko.observable('')
	};
// search on the names adn filter on the matches as the user types the search text
viewModel.firstMatch = ko.dependentObservable(function() {
	var search = this.search().toLowerCase();
	if (!search) {
		return this.locations();
	} else {
		return ko.utils.arrayFilter(this.locations(), function(location){
			//var val = location.name().toLowerCase().indexOf(search) !== -1
			//console.log("val = " + val);
			return location.name().toLowerCase().indexOf(search) !== -1;
		});
	}

}, viewModel);

// our obervable mapped location data
var mappedData = ko.utils.arrayMap(allData, function(item) {
	return new Location(item.name, item.latitude, item.longitude, item.content, item.visible, item.type);
});

viewModel.locations(mappedData);

$(document).ready(function() {
	// apply the knockour bindings
    ko.applyBindings(viewModel);

    // autocomplete jqueryui widget implementation for our searchable points of interest
    $( "#autocomplete" ).autocomplete({
 		source: getSearchFriendlyData()
	});

    // when enter key is pressed, we grab the user selection
    $('#autocomplete').on('autocompleteselect', function(e, ui) {
    	// 13 == enter key
    	if (e.which == 13) {
			//get the proper object
			var length = allData.length;
			var currentData;
			for (var i = 0; i < length; i++) {
				currentData = allData[i];
				//console.log("currentData = " + currentData.content);
				if (ui.item.label == currentData.name) {
					break;
				}
			}
			displayMarkers(getVisibleMarkersByPOI(currentData.name, currentData.type));
    	}
    });

    var numData = allData.length;
    for (var i = 0; i < numData; i++) {
    	var currentData = allData[i];
    	callYelp(currentData.name);
    }
});

// all the data to be displayed by the markers
var allData = [
		{
			name: "The Drake Hotel",
			latitude: 41.900401,
			longitude: -87.623364,
			visible: true,
			type: HOTEL_TYPE
		},
		{
			name: "Spa At The Ritz-Carlton Chicago, A Four Seasons Hotel",
			latitude: 41.898021,
			longitude: -87.622916,
			visible: true,
			type: HOTEL_TYPE
		},
		{
			name: "Park Hyatt Chicago",
			latitude: 41.89706,
			longitude: -87.624992,
			visible: true,
			type: HOTEL_TYPE
		},
		{
			name: "Warwick Allerton Hotel Chicago",
			latitude: 41.8951737,
			longitude: -87.623672,
			visible: true,
			type: HOTEL_TYPE
		},
		{
			name: "Omni Chicago Hotel",
			latitude: 41.8946608,
			longitude: -87.6248416,
			visible: true,
			type: HOTEL_TYPE
		},
		{
			name: "Tribune Tower",
			latitude: 41.8904213,
			longitude: -87.623588,
			visible: true,
			type: LANDMARK_TYPE
		},
		{
			name: "Michigan Avenue Bridge",
			latitude: 41.8905111,
			longitude: -87.6244856,
			visible: true,
			type: LANDMARK_TYPE
		},
		{
			name: "John Hancock Center",
			latitude: 41.8987699,
			longitude: -87.6229168,
			visible: true,
			type: LANDMARK_TYPE
		},
		{
			name: "The Magnificent Mile",
			latitude: 41.9004747,
			longitude: -87.6246925,
			visible: true,
			type: LANDMARK_TYPE
		},
		{
			name: "Bloomingdale's",
			latitude: 41.899638,
			longitude: -87.625613,
			visible: true,
			type: RETAIL_TYPE
		},
		{
			name: "Burberry",
			latitude: 41.8936109,
			longitude: -87.62389,
			visible: true,
			type: RETAIL_TYPE
		},
		{
			name: "Chanel Boutique",
			latitude: 41.8989299,
			longitude: -87.6249675,
			visible: true,
			type: RETAIL_TYPE
		},
		{
			name: "Coach",
			latitude: 41.8931504,
			longitude: -87.6237321,
			visible: true,
			type: RETAIL_TYPE
		},
		{
			name: "Louis Vuitton",
			latitude: 41.899891,
			longitude: -87.623854,
			visible: true,
			type: RETAIL_TYPE
		},
		{
			name: "Tumi Luggage",
			latitude: 41.8985519,
			longitude: -87.6245748,
			visible: true,
			type: RETAIL_TYPE
		},
		{
			name: "Saks Fifth Avenue",
			latitude: 41.8955436,
			longitude: -87.6242948,
			visible: true,
			type: RETAIL_TYPE
		},
		{
			name: "Tiffany & Co",
			latitude: 41.895922,
			longitude: -87.624644,
			visible: true,
			type: RETAIL_TYPE
		},
		{
			name: "Cartier",
			latitude: 41.893637,
			longitude: -87.624655,
			visible: true,
			type: RETAIL_TYPE
		},
		{	name: "Water Tower Place",
			latitude: 41.8979303,
			longitude: -87.6228927,
			visible: true,
			type: MALL_TYPE
		},
		{
			name: "The Shops at North Bridge",
			latitude: 41.891432,
			longitude: -87.624808,
			visible: true,
			type: MALL_TYPE
		},
		{
			name: "The 900 Shops",
			latitude: 41.899641,
			longitude: -87.625122,
			visible: true,
			type: MALL_TYPE
		},
		{
			name: "Chase Bank",
			latitude: 41.8872977,
			longitude: -87.6240254,
			visible: true,
			type: BANK_TYPE
		},
		{
			name: "Citibank",
			latitude: 41.8863868,
			longitude: -87.6238476,
			visible: true,
			type: BANK_TYPE
		},
		{
			name: "Bank of America",
			latitude: 41.8911024,
			longitude: -87.624805,
			visible: true,
			type: BANK_TYPE
		},
		{
			name: "The Purple Pig",
			latitude: 41.8911214,
			longitude: -87.6246107,
			visible: true,
			type: RESTAURANT_TYPE
		},
		{
			name: "NoMI Kitchen",
			latitude: 41.8969702,
			longitude: -87.62506,
			visible: true,
			type: RESTAURANT_TYPE
		},
		{
			name: "Bandera Restaurant",
			latitude: 41.8918882,
			longitude: -87.6238574,
			visible: true,
			type: RESTAURANT_TYPE
		},
		{
			name: "The Signature Room at the 95th",
			latitude: 41.8986397,
			longitude: -87.6227539,
			visible: true,
			type: RESTAURANT_TYPE
		},
		{
			name: "Grand Lux Cafe",
			latitude: 41.8945098,
			longitude: -87.6249427,
			visible: true,
			type: RESTAURANT_TYPE
		},
		{
			name: "Foodlife",
			latitude: 41.8980164,
			longitude: -87.6236208,
			visible: true,
			type: RESTAURANT_TYPE
		}
	];