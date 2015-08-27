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
var marker;

var Place = function(name, position, content, marker) {
	this.name = name;
	this.position = position;
	this.content = content;
	this.marker = null;
}

//dining places
var centerMapCoordinates = {lat: 41.89535, lng: -87.62432};
// 41.899886,-87.625275
var drakeHotel = new Place("Drake Hotel", {lat: 41.899886, lng: -87.625275}, "<div style = 'width:200px;min-height:40px'>This is the Drake Hotel</div>", null);
var westMichiganAvenue = new Place("West Michigan Avenue", {lat: 41.89006, lng: -87.62420}, "<div style = 'width:200px;min-height:40px'>This is the West Michigan Ave</div>", null);
var fourSeasonsHotel = new Place("Four Seasons Hotel", {lat: 41.89934, lng: -87.62514}, "<div style = 'width:200px;min-height:40px'>This is the Four Seasons Hotel</div>", null);
var ritzCarltonChicago = new Place("Ritz-Carlton Chicago", {lat: 41.87811, lng: -87.62980}, "<div style = 'width:200px;min-height:40px'>This is the Ritz-Carlton Chicago</div>", null);

var diningMarkers = [drakeHotel, westMichiganAvenue, fourSeasonsHotel, ritzCarltonChicago];
var markers = [];
var map;

function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
		zoom: 15,
		center: centerMapCoordinates
	});
}

function drop() {
	clearMarkers(markers);
	for (var i = 0; i < diningMarkers.length; i++) {
		var diningMarker = diningMarkers[i];
		var marker = new google.maps.Marker({
							position: diningMarker.position,
							map: map,
							animation: google.maps.Animation.DROP
							});

		window.setTimeout(function() { markers.push(marker); }, i * 200);

		var infoWindow = new google.maps.InfoWindow({
							content: diningMarker.content
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
