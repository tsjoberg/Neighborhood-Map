/*
Neighborhood Map - Magnificient Mile, Chicago

Latitude: 41.89535°N
Longitude: 87.62432°W

Landmarks:

Retail:

Banks:

Malls:

Hotels and Dining:


*/

// there could be more parameters added to this constructor
// to divide and conquer the specific api details
// and also to contain the standard html that needs to go with the
// infowindow
var Place = function(name, position, content) {
	this.name = name;
	this.position = position;
	this.content = content;
}

var marker;

var centerMapCoordinates = {lat: 41.89535, lng: -87.62432};

var drakeHotel = new Place("Drake Hotel",
							{lat: 41.899886, lng: -87.625275},
							"<div style = 'width:200px;min-height:40px'>The Drake Hotel</div>");
var westMichiganAvenue = new Place("West Michigan Avenue",
							{lat: 41.89006, lng: -87.62420},
							"<div style = 'width:200px;min-height:40px'>West Michigan Ave</div>");
var fourSeasonsHotel = new Place("Four Seasons Hotel",
							{lat: 41.89934, lng: -87.62514},
							"<div style = 'width:200px;min-height:40px'>Four Seasons Hotel</div>");
var ritzCarltonChicago = new Place("Ritz-Carlton Chicago",
							{lat: 41.87811, lng: -87.62980},
							"<div style = 'width:200px;min-height:40px'>Ritz-Carlton Chicago</div>");
var parkHyatt = new Place("Park Hyatt Chicago",
							{lat: 41.89706, lng: -87.624992},
							"<div style = 'width:200px;min-height:40px'>Park Hyatt</div>");
var allertonHotel = new Place("Warwick Allerton Hotel",
							{lat: 41.8951737, lng: -87.623672},
							"<div style = 'width:200px;min-height:40px'>Warwick Allerton</div>");
var omniChicagoHotel = new Place("Omni Chicago Hotel",
							{lat: 41.8946608, lng: -87.6248416},
							"<div style = 'width:200px;min-height:40px'>Omni Chicago Hotel</div>");
var intercontinental = new Place("Hotel Inter-Continental Chicago",
							{lat: 41.8913023, lng: -87.6235601},
							"<div style = 'width:200px;min-height:40px'>Hotel Inter-Continental Chicago</div>");

var diningMarkers = [drakeHotel, westMichiganAvenue, fourSeasonsHotel, ritzCarltonChicago, parkHyatt, allertonHotel, omniChicagoHotel, intercontinental];

var drakeHotelBuilding = new Place("Drake Hotel",
							{lat: 41.899886, lng: -87.625275},
							"<div style = 'width:200px;min-height:40px'>The Drake Hotel</div>");
var palmoliveBuilding = new Place("The Palmolive Building Landmark",
									{lat: 41.8997926, lng: -87.6233398},
									"<div style = 'width:200px;min-height:40px'>The Palmolive Building Landmark</div>")
var palmoliveBuilding = new Place("The Palmolive Building Landmark",
									{lat: 41.8997926, lng: -87.6233398},
									"<div style = 'width:200px;min-height:40px'>The Palmolive Building Landmark</div>")

var landmarkMarkers = [drakeHotelBuilding, palmoliveBuilding];
var retailMarkers = [];
var bankMarkers = [];
var mallMarkers = [];

var neighborhoodMarkers = {"diningMarkers": diningMarkers,
							"landmarkMarkers": landmarkMarkers,
							"retailMarkers": retailMarkers,
							"bankMarkers": bankMarkers,
							"mallMarkers": mallMarkers };
var markers = [];
var map;

function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
		zoom: 15,
		center: centerMapCoordinates
	});
}

function drop(buttonId) {
	console.log("id for the button = " + buttonId);
	var currentMarkers = [];
	clearMarkers(markers);
	//clearMarkers(currentMarkers);
	if (buttonId == 'hotels') {
		clearMarkers(currentMarkers);
		currentMarkers = neighborhoodMarkers.diningMarkers;
	} else if (buttonId == 'malls') {
		clearMarkers(currentMarkers);
		currentMarkers = neighborhoodMarkers.mallMarkers;
	} else if (buttonId == 'landmarks') {
		clearMarkers(currentMarkers);
		currentMarkers = neighborhoodMarkers.landmarkMarkers;
	} else if (buttonId == 'retail') {
		clearMarkers(currentMarkers);
		currentMarkers = neighborhoodMarkers.retailMarkers;
	} else if (buttonId == 'banks') {
		clearMarkers(currentMarkers);
		currentMarkers = neighborhoodMarkers.bankMarkers;
	} else {
		clearMarkers(currentMarkers);
		// TODO
		// by default all the markers must be shown
		for (var key in neighborhoodMarkers) {
    			currentMarkers = currentMarkers.concat(neighborhoodMarkers[key]);
		}
	}
	for (var i = 0; i < currentMarkers.length; i++) {
		var currentMarker = currentMarkers[i];
		var marker = new google.maps.Marker({
							position: currentMarker.position,
							map: map,
							animation: google.maps.Animation.DROP
							});

		window.setTimeout(function() { markers.push(marker); }, i * 200);

		var infoWindow = new google.maps.InfoWindow({
							content: currentMarker.content
		});

		// anonymous function to help tag proper content window to each marker
		google.maps.event.addListener(marker, 'click', function(handle, pop) {
			return function() {
				pop.open(map, handle);
			};
		}(marker, infoWindow));
	}
}

function clearMarkers(markers) {
	for (var i = 0; i < markers.length; i++) {
		markers[i].setMap(null);
	}
	markers = [];
}

function getSearchableData() {
	var searchableData = [];
	for (var key in neighborhoodMarkers) {
		console.log("key = " +  key);
		var place = neighborhoodMarkers[key];
		for (var j = 0; j < place.length; j++) {
			console.log(place[j].name);
			searchableData = searchableData.concat(place[j].name);
		}
	}
	return searchableData;
}



$(document).ready(function() {

	var JSONdataFromServer = [
	    		{
	    			name: "The Drake Hotel",
	    			latitude: 22,
	    			longitude: 22,
	    			content: "More content here",
	    			visible: true
	    		},
	    		{
	    			name: "The Park Hyatt",
	    			latitude: 32,
	    			longitude: 32,
	    			content: "about park hyatt",
	    			visible: true
	    		},
	    		{
	    			name: "The Ritz-Carlton Hotel",
	    			latitude: 42,
	    			longitude: 42,
	    			content: "more about carlton",
	    			visible: true
	    		}
	    	];

	var dataFromServer = ko.utils.parseJson(JSONdataFromServer);

	function Location(name, latitude, longitude, content, visible) {
		this.name = ko.observable(name);
		this.latitude = ko.observable(latitude);
		this.longitude = ko.observable(longitude);
		this.content = ko.observable(content);
		this.visible = ko.observable(visible);
	}

	var viewModel = {
		locations: ko.observableArray([]),
		search: ko.observable('')
	};

	viewModel.firstMatch = ko.dependentObservable(function() {
		console.log("entering firstmatch..");
		var search = this.search().toLowerCase();
		if (!search) {
			console.log("!search entered");
			return this.locations();
		} else {
			console.log("entering search: " + this.locations());
			return ko.utils.arrayFilter(this.locations(), function(location){
				//item.Name().toLowerCase().indexOf(filter) !== -1
				var val = location.name().toLowerCase().indexOf(search) !== -1
				console.log("returning - " + val);
				return location.name().toLowerCase().indexOf(search) !== -1;
			});
		}

	}, viewModel);

	var mappedData = ko.utils.arrayMap(JSONdataFromServer, function(item) {
		return new Location(item.name, item.latitude, item.longitude, item.content, item.visible);
	});

	viewModel.locations(mappedData);

    ko.applyBindings(viewModel);

    // autocomplete widget implementation for our searchable points of interest
    $( "#autocomplete" ).autocomplete({
 		source: getSearchableData()
	});

    // when enter key is pressed, we grab the user selection
    $('#autocomplete').on('autocompleteselect', function(e, ui) {
    	if (e.which == 13) {
			console.log("ui gives: " + ui.item.label);
    	}
    });
});





