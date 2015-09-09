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
// constant for all type
var ALL_TYPE = 'all';
// an array to contain all interested locations
var allPlaces;
// an array to contain all markers
var markers = [];
// handle to the google map
var map;

// center the map at the middle(ish) if Magnificent Mile
var centerMapCoordinates = {lat: 41.894271, lng: -87.624148};
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
		zoom: 16,
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

// using allData's visible property, match on the place(s)
// and set the marker to be visible
function setVisibleMarkers(places) {
	for (place in places) {
		for (var marker in markers) {
			if (place.name == marker.title)
				markers[marker].setVisible(place.visible);
		}
	}
}

//display markers for the asked places
function displayMarkers(yelpArray) {
	console.log("array in displayMarkers = " + yelpArray);
	// signature of this array
	// name, latitude, longitude, displayString, rating, image
	var markerTitle = yelpArray[0];
	console.log("marker title = " + markerTitle);
	var lat = yelpArray[1];
	var lng = yelpArray[2];
	var marker = new google.maps.Marker({
							position: new google.maps.LatLng(lat, lng),
							map: map,
							animation: google.maps.Animation.DROP,
							title: markerTitle
							});
	console.log("content string = " + yelpArray[3]);
	var infoWindow = new google.maps.InfoWindow({
							content: yelpArray[3]
						});

	// anonymous function to help tag proper content window to each marker
	google.maps.event.addListener(marker, 'click', function(handle, pop) {
		return function() {
			pop.open(map, handle);
		};
	}(marker, infoWindow));


	/*clearMarkers();
	for (var i = 0; i < places.length; i++) {
		var currentPlace = places[i];
		var marker = new google.maps.Marker({
							position: new google.maps.LatLng(currentPlace.latitude, currentPlace.longitude),
							map: map,
							animation: google.maps.Animation.DROP,
							title: currentPlace.name
							});
		marker.setVisible(currentPlace.visible);
		// TODO - version 2 - make that markers drop to the map with a delay
		//window.setTimeout(function() { markers.push(marker); }, i * 200);
		markers.push(marker);
		callYelp(currentPlace.name);

		console.log("yelpResults = " + yelpResults);

		if (yelpResults.length > 0) {
			console.log("first item from yelpResults = " + yelpResults[0]);
		}
		/*var contentString = '<div class="info_content">';
		contentString += '<h4>' + mk.title + '</h4>';
		contentString += '<p>' + mk.ph + '</p>';
		contentString += '<p class="review"><img src="' + mk.pic + '">' + mk.blurb + '</p>';
		contentString += '</div>';

		var infoWindow = new google.maps.InfoWindow({
							content: currentPlace.content
						});

		// anonymous function to help tag proper content window to each marker
		google.maps.event.addListener(marker, 'click', function(handle, pop) {
			return function() {
				pop.open(map, handle);
			};
		}(marker, infoWindow));

	}
	//console.log("Number of markers = " + markers.length);
	*/
}

// consumer key for yelp
var consumerKey = "DnQn7xnOmHlQHpd80U2bEw";
// consumer secret for yelp
var consumerSecret = "PSGT6NZ978aecOU5Y6ElrEbKZMc";
// consumer token for yelp
var token = "aEKlZtLMH0rapH_-K7O4U6A5tGFW6fXT";
// consumer token secret for yelp
var tokenSecret = "bt64O7Xwt2qJvWACoC3UMOuqIDg";
// yelp url to send search request to
var yelpURL = "http://api.yelp.com/v2/search/";

//var restaurant = "The Purple Pig";
//var city = "Chicago";

// array for our consumer secret and token secret
var accessor = {
  consumerSecret: consumerSecret,
  tokenSecret: tokenSecret
};

// yelp api call
// works as a prototype. needs to be hooked to display retrieved data
// in the information window
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
	parameterMap.oauth_signature = OAuth.percentEncode(parameterMap.oauth_signature)

	$.ajax({
	  'url': message.action,
	  'data': parameterMap,
	  'cache': true,
	  'dataType': 'jsonp',
	  'success': handleYelpData
		}).fail(function(XMLHttpRequest, status, error) {
			//console.log("Yelp! Yelp! Error from YELP!  " + business);
	});
}

function handleYelpData(data) {
	//console.log(data);
	var yelpResults = [];
	var results = data.businesses;
	console.log("this is good!");
	if (results.length > 0) {
		//build the successful data to be sent back from the first result

		var business = data.businesses[0];
		var name = business.name;
		var lat = business.location.coordinate.latitude;
		var lng = business.location.coordinate.longitude;
		var image = business.image_url;
		var rating = business.rating;

		var displayElement = '<div class="row"><h3>' + name + '</h3>' + '<span>' + rating + '</span>';

		var markerData = [name, lat, lng, displayElement, rating, image];

		//yelpResults.push(markerData);
		displayMarkers(markerData);
		//$yelpList.append(el);
	} else {
		yelpResults.push(["failed to return data"]);
	}
}

// clear all markers by setting them to null
function clearMarkers() {
	for (var i = 0; i < markers.length; i++) {
		markers[i].setMap(null);
	}
	markers = [];
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

// our view model for knockour js
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
			//console.log("ui gives: " + ui.item.label);
			//get the proper object
			var length = allData.length;
			var currentData;
			for (var i = 0; i < length; i++) {
				currentData = allData[i];
				console.log("currentData = " + currentData.content);
				if (ui.item.label == currentData.name) {
					break;
				}
			}
			// set visible on all data objects of this 'type'
			setVisibleMarkers(getVisibleData(currentData.type));
			// first set visible on data object of this 'type' and 'name'
			// then set visible on that marker to true and all other markers to 'false'
			displayMarkers(getVisibleSearchData(currentData.name, currentData.type));
    	}
    });

    var numData = allData.length;
    for (var i = 0; i < numData; i++) {
    	var currentData = allData[i];
    	callYelp(currentData.name);
    }

});

// the generic string for information window
var htmlContentString = "<div style = 'width:200px;min-height:40px'>" +
						"<h5 id='header'></h5><hr>" +
						"<p id='wiki'></p><hr></div>";

// all the data to be displayed by the markers
var allData = [
		{
			name: "The Drake Hotel",
			latitude: 41.900401,
			longitude: -87.623364,
			content: htmlContentString,
			visible: true,
			type: HOTEL_TYPE
		},
		{
			name: "West Michigan Avenue",
			latitude: 41.89006,
			longitude: -87.62420,
			content: htmlContentString,
			visible: true,
			type: HOTEL_TYPE
		},
		{
			name: "Four Seasons Hotel",
			latitude: 41.89934,
			longitude: -87.62514,
			content: htmlContentString,
			visible: true,
			type: HOTEL_TYPE
		},
		{
			name: "Ritz-Carlton Chicago",
			latitude: 41.898021,
			longitude: -87.622916,
			content: htmlContentString,
			visible: true,
			type: HOTEL_TYPE
		},
		{
			name: "Park Hyatt Chicago",
			latitude: 41.89706,
			longitude: -87.624992,
			content: htmlContentString,
			visible: true,
			type: HOTEL_TYPE
		},
		{
			name: "Warwick Allerton Hotel",
			latitude: 41.8951737,
			longitude: -87.623672,
			content: htmlContentString,
			visible: true,
			type: HOTEL_TYPE
		},
		{
			name: "Omni Chicago Hotel",
			latitude: 41.8946608,
			longitude: -87.6248416,
			content: htmlContentString,
			visible: true,
			type: HOTEL_TYPE
		},
		{
			name: "Hotel Inter-Continental Chicago",
			latitude: 41.8913023,
			longitude: -87.6235601,
			content: htmlContentString,
			visible: true,
			type: HOTEL_TYPE
		},
		{
			name: "The Palmolive Building",
			latitude: 41.8997926,
			longitude: -87.6233398,
			content: htmlContentString,
			visible: true,
			type: LANDMARK_TYPE
		},
		{
			name: "Drake Hotel Landmark",
			latitude: 41.900401,
			longitude: -87.623364,
			content: htmlContentString,
			visible: true,
			type: LANDMARK_TYPE
		},
		{
			name: "Old Chicago Water Tower",
			latitude: 41.8971797,
			longitude: -87.6243939,
			content: htmlContentString,
			visible: true,
			type: LANDMARK_TYPE
		},
		{
			name: "Tribune Tower",
			latitude: 41.8904213,
			longitude: -87.623588,
			content: htmlContentString,
			visible: true,
			type: LANDMARK_TYPE
		},
		{
			name: "Michigan Avenue Bridge",
			latitude: 41.8905111,
			longitude: -87.6244856,
			content: htmlContentString,
			visible: true,
			type: LANDMARK_TYPE
		},
		{
			name: "Site of Old Fort Dearborn",
			latitude: 41.8879019,
			longitude: -87.6240778,
			content: htmlContentString,
			visible: true,
			type: LANDMARK_TYPE
		},
		{
			name: "John Hancock Center",
			latitude: 41.8987699,
			longitude: -87.6229168,
			content: htmlContentString,
			visible: true,
			type: LANDMARK_TYPE
		},
		{
			name: "One Magnificient Mile",
			latitude: 41.9004747,
			longitude: -87.6246925,
			content: htmlContentString,
			visible: true,
			type: LANDMARK_TYPE
		},
		{
			name: "Bloomingdale's",
			latitude: 41.899638,
			longitude: -87.625613,
			content: htmlContentString,
			visible: true,
			type: RETAIL_TYPE
		},
		{
			name: "Burberry",
			latitude: 41.8936109,
			longitude: -87.62389,
			content: htmlContentString,
			visible: true,
			type: RETAIL_TYPE
		},
		{
			name: "Chanel Boutique",
			latitude: 41.8989299,
			longitude: -87.6249675,
			content: htmlContentString,
			visible: true,
			type: RETAIL_TYPE
		},
		{
			name: "Coach",
			latitude: 41.8931504,
			longitude: -87.6237321,
			content: htmlContentString,
			visible: true,
			type: RETAIL_TYPE
		},
		{
			name: "Louis Vuitton",
			latitude: 41.899891,
			longitude: -87.623854,
			content: htmlContentString,
			visible: true,
			type: RETAIL_TYPE
		},
		{
			name: "Tumi",
			latitude: 41.8985519,
			longitude: -87.6245748,
			content: htmlContentString,
			visible: true,
			type: RETAIL_TYPE
		},
		{
			name: "Saks Fifth Avenue",
			latitude: 41.8955436,
			longitude: -87.6242948,
			content: htmlContentString,
			visible: true,
			type: RETAIL_TYPE
		},
		{
			name: "Tiffany & Co.",
			latitude: 41.895922,
			longitude: -87.624644,
			content: htmlContentString,
			visible: true,
			type: RETAIL_TYPE
		},
		{
			name: "Cartier",
			latitude: 41.893637,
			longitude: -87.624655,
			content: htmlContentString,
			visible: true,
			type: RETAIL_TYPE
		},
		{
			name: "H2O Plus Inc",
			latitude: 41.8929245,
			longitude: -87.6246406,
			content: htmlContentString,
			visible: true,
			type: RETAIL_TYPE
		},
		{	name: "Water Tower Place",
			latitude: 41.8979303,
			longitude: -87.6228927,
			content: htmlContentString,
			visible: true,
			type: MALL_TYPE
		},
		{
			name: "The Shops at North Bridge",
			latitude: 41.891432,
			longitude: -87.624808,
			content: htmlContentString,
			visible: true,
			type: MALL_TYPE
		},
		{
			name: "900 North Michigan Avenue",
			latitude: 41.899641,
			longitude: -87.625122,
			content: htmlContentString,
			visible: true,
			type: MALL_TYPE
		},
		{
			name: "JP Morgan Chase",
			latitude: 41.8872977,
			longitude: -87.6240254,
			content: htmlContentString,
			visible: true,
			type: BANK_TYPE
		},
		{
			name: "Citibank",
			latitude: 41.8863868,
			longitude: -87.6238476,
			content: htmlContentString,
			visible: true,
			type: BANK_TYPE
		},
		{
			name: "Bank of America",
			latitude: 41.8911024,
			longitude: -87.624805,
			content: htmlContentString,
			visible: true,
			type: BANK_TYPE
		},
		{
			name: "The Purple Pig",
			latitude: 41.8911214,
			longitude: -87.6246107,
			content: htmlContentString,
			visible: true,
			type: RESTAURANT_TYPE
		},
		{
			name: "Nomi Restaurant",
			latitude: 41.8969702,
			longitude: -87.62506,
			content: htmlContentString,
			visible: true,
			type: RESTAURANT_TYPE
		},
		{
			name: "Bandera",
			latitude: 41.8918882,
			longitude: -87.6238574,
			content: htmlContentString,
			visible: true,
			type: RESTAURANT_TYPE
		},
		{
			name: "The Signature Room at the 95th",
			latitude: 41.8986397,
			longitude: -87.6227539,
			content: htmlContentString,
			visible: true,
			type: RESTAURANT_TYPE
		},
		{
			name: "Grand Lux Cafe",
			latitude: 41.8945098,
			longitude: -87.6249427,
			content: htmlContentString,
			visible: true,
			type: RESTAURANT_TYPE
		},
		{
			name: "Foodlife",
			latitude: 41.8980164,
			longitude: -87.6236208,
			content: htmlContentString,
			visible: true,
			type: RESTAURANT_TYPE
		}
	];