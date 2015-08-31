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

var HOTEL_TYPE = 'hotel';
var MALL_TYPE = 'mall';
var LANDMARK_TYPE = 'landmark';
var RETAIL_TYPE = 'retail';
var BANK_TYPE = 'bank';
var ALL_TYPE = 'all';
var RESTAURANT_TYPE = 'food';

//41.894829,-87.6242173
var allPlaces;
var markers = [];
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

function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
		zoom: 16,
		center: centerMapCoordinates

	});
	// all interested locations markers to be dropped when map is initiated
	drop(ALL_TYPE);

	var path = new google.maps.Polyline({
	    path: neighborhoodCoordinates,
	    geodesic: true,
	    strokeColor: '#FF69B4',
	    strokeOpacity: 1.0,
	    strokeWeight: 2
	});

  	path.setMap(map);
}

function drop(buttonId) {
	if (buttonId == HOTEL_TYPE) {
		setVisibleMarkers(getVisibleData(HOTEL_TYPE));
		displayMarkers(getVisibleData(HOTEL_TYPE));
	} else if (buttonId == MALL_TYPE) {
		setVisibleMarkers(getVisibleData(MALL_TYPE));
		displayMarkers(getVisibleData(MALL_TYPE));
	} else if (buttonId == LANDMARK_TYPE) {
		setVisibleMarkers(getVisibleData(LANDMARK_TYPE));
		displayMarkers(getVisibleData(LANDMARK_TYPE));
	} else if (buttonId == RETAIL_TYPE) {
		setVisibleMarkers(getVisibleData(RETAIL_TYPE));
		displayMarkers(getVisibleData(RETAIL_TYPE));
	} else if (buttonId == BANK_TYPE) {
		setVisibleMarkers(getVisibleData(BANK_TYPE));
		displayMarkers(getVisibleData(BANK_TYPE));
	} else if (buttonId == RESTAURANT_TYPE) {
		setVisibleMarkers(getVisibleData(RESTAURANT_TYPE));
		displayMarkers(getVisibleData(RESTAURANT_TYPE));
	} else if (buttonId = ALL_TYPE) {
		displayMarkers(getAllData());
	}
}

function getVisibleData(type) {
	var allData = getAllData();
	for (var data in allData) {
		if (allData[data].type == type) {
			allData[data].visible = true;
		} else {
			allData[data].visible = false;
		}
	}
	return allData;
}

function getVisibleSearchData(name, type) {
	var allOfThisType = getVisibleData(type);
	for (var one in allOfThisType) {
		if (allOfThisType[one].name == name) {
			allOfThisType[one].visible = true;
		} else {
			allOfThisType[one].visible = false;
		}
	}
	return allOfThisType;
}

function setVisibleMarkers(places) {
	for (place in places) {
		for (var marker in markers) {
			if (place.name == marker.title)
				markers[marker].setVisible(place.visible);
		}
	}
}

function displayMarkers(places) {
	clearMarkers();
	for (var i = 0; i < places.length; i++) {
		var currentPlace = places[i];
		var marker = new google.maps.Marker({
							position: new google.maps.LatLng(currentPlace.latitude, currentPlace.longitude),
							map: map,
							animation: google.maps.Animation.DROP,
							title: currentPlace.name
							});
		marker.setVisible(currentPlace.visible);
		// TODO - make that markers drop to the map with a delay
		//window.setTimeout(function() { markers.push(marker); }, i * 200);
		markers.push(marker);

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
	console.log("Number of markers = " + markers.length);

}

function clearMarkers() {
	for (var i = 0; i < markers.length; i++) {
		markers[i].setMap(null);
	}
	markers = [];
}

function getSearchableData() {
	var searchableData = [];
	for (var key in neighborhoodMarkers) {
		//console.log("key = " +  key);
		var place = neighborhoodMarkers[key];
		for (var j = 0; j < place.length; j++) {
			//console.log(place[j].name);
			searchableData = searchableData.concat(place[j].name);
		}
	}
	return searchableData;
}

// for this version of implementation, name has to be unique and is our handle to
// getting at the correct object
function getAllData() {
	var allData = [
		{
			name: "The Drake Hotel",
			latitude: 41.900401,
			longitude: -87.623364,
			content: "<div style = 'width:200px;min-height:40px'>The Drake Hotel</div>",
			visible: true,
			type: HOTEL_TYPE
		},
		{
			name: "West Michigan Avenue",
			latitude: 41.89006,
			longitude: -87.62420,
			content: "<div style = 'width:200px;min-height:40px'>West Michigan Avenue</div>",
			visible: true,
			type: HOTEL_TYPE
		},
		{
			name: "Four Seasons Hotel",
			latitude: 41.89934,
			longitude: -87.62514,
			content: "<div style = 'width:200px;min-height:40px'>Four Seasons Hotel</div>",
			visible: true,
			type: HOTEL_TYPE
		},
		{
			name: "Ritz-Carlton Chicago",
			latitude: 41.898021,
			longitude: -87.622916,
			content: "<div style = 'width:200px;min-height:40px'>Ritz-Carlton Chicago</div>",
			visible: true,
			type: HOTEL_TYPE
		},
		{
			name: "Park Hyatt Chicago",
			latitude: 41.89706,
			longitude: -87.624992,
			content: "<div style = 'width:200px;min-height:40px'></div>",
			visible: true,
			type: HOTEL_TYPE
		},
		{
			name: "Warwick Allerton Hotel",
			latitude: 41.8951737,
			longitude: -87.623672,
			content: "<div style = 'width:200px;min-height:40px'></div>",
			visible: true,
			type: HOTEL_TYPE
		},
		{
			name: "Omni Chicago Hotel",
			latitude: 41.8946608,
			longitude: -87.6248416,
			content: "<div style = 'width:200px;min-height:40px'></div>",
			visible: true,
			type: HOTEL_TYPE
		},
		{
			name: "Hotel Inter-Continental Chicago",
			latitude: 41.8913023,
			longitude: -87.6235601,
			content: "<div style = 'width:200px;min-height:40px'></div>",
			visible: true,
			type: HOTEL_TYPE
		},
		{
			name: "The Palmolive Building",
			latitude: 41.8997926,
			longitude: -87.6233398,
			content: "<div style = 'width:200px;min-height:40px'>The Palmolive Building Landmark</div>",
			visible: true,
			type: LANDMARK_TYPE
		},
		{
			name: "Drake Hotel Landmark",
			latitude: 41.900401,
			longitude: -87.623364,
			content: "<div style = 'width:200px;min-height:40px'>The Drake Hotel Landmark</div>",
			visible: true,
			type: LANDMARK_TYPE
		},
		{
			name: "Old Chicago Water Tower",
			latitude: 41.8971797,
			longitude: -87.6243939,
			content: "<div style = 'width:200px;min-height:40px'></div>",
			visible: true,
			type: LANDMARK_TYPE
		},
		{
			name: "Tribune Tower",
			latitude: 41.8904213,
			longitude: -87.623588,
			content: "<div style = 'width:200px;min-height:40px'></div>",
			visible: true,
			type: LANDMARK_TYPE
		},
		{
			name: "Michigan Avenue Bridge",
			latitude: 41.8905111,
			longitude: -87.6244856,
			content: "<div style = 'width:200px;min-height:40px'></div>",
			visible: true,
			type: LANDMARK_TYPE
		},
		{
			name: "Site of Old Fort Dearborn",
			latitude: 41.8879019,
			longitude: -87.6240778,
			content: "<div style = 'width:200px;min-height:40px'></div>",
			visible: true,
			type: LANDMARK_TYPE
		},
		{
			name: "John Hancock Center",
			latitude: 41.8987699,
			longitude: -87.6229168,
			content: "<div style = 'width:200px;min-height:40px'></div>",
			visible: true,
			type: LANDMARK_TYPE
		},
		{
			name: "One Magnificient Mile",
			latitude: 41.9004747,
			longitude: -87.6246925,
			content: "<div style = 'width:200px;min-height:40px'></div>",
			visible: true,
			type: LANDMARK_TYPE
		},
		{
			name: "Bloomingdale's",
			latitude: 41.899638,
			longitude: -87.625613,
			content: "<div style = 'width:200px;min-height:40px'>Bloomingdale's</div>",
			visible: true,
			type: RETAIL_TYPE
		},
		{
			name: "Burberry",
			latitude: 41.8936109,
			longitude: -87.62389,
			content: "<div style = 'width:200px;min-height:40px'></div>",
			visible: true,
			type: RETAIL_TYPE
		},
		{
			name: "Chanel Boutique",
			latitude: 41.8989299,
			longitude: -87.6249675,
			content: "<div style = 'width:200px;min-height:40px'></div>",
			visible: true,
			type: RETAIL_TYPE
		},
		{
			name: "Coach",
			latitude: 41.8931504,
			longitude: -87.6237321,
			content: "<div style = 'width:200px;min-height:40px'></div>",
			visible: true,
			type: RETAIL_TYPE
		},
		{
			name: "Louis Vuitton",
			latitude: 41.899891,
			longitude: -87.623854,
			content: "<div style = 'width:200px;min-height:40px'></div>",
			visible: true,
			type: RETAIL_TYPE
		},
		{
			name: "Tumi",
			latitude: 41.8985519,
			longitude: -87.6245748,
			content: "<div style = 'width:200px;min-height:40px'></div>",
			visible: true,
			type: RETAIL_TYPE
		},
		{
			name: "Saks Fifth Avenue",
			latitude: 41.8955436,
			longitude: -87.6242948,
			content: "<div style = 'width:200px;min-height:40px'></div>",
			visible: true,
			type: RETAIL_TYPE
		},
		{
			name: "Tiffany & Co.",
			latitude: 41.895922,
			longitude: -87.624644,
			content: "<div style = 'width:200px;min-height:40px'></div>",
			visible: true,
			type: RETAIL_TYPE
		},
		{
			name: "Cartier",
			latitude: 41.893637,
			longitude: -87.624655,
			content: "<div style = 'width:200px;min-height:40px'></div>",
			visible: true,
			type: RETAIL_TYPE
		},
		{
			name: "H2O Plus Inc",
			latitude: 41.8929245,
			longitude: -87.6246406,
			content: "<div style = 'width:200px;min-height:40px'></div>",
			visible: true,
			type: RETAIL_TYPE
		},
		{	name: "Water Tower Place",
			latitude: 41.8979303,
			longitude: -87.6228927,
			content: "<div style = 'width:200px;min-height:40px'>Water Tower Place</div>",
			visible: true,
			type: MALL_TYPE
		},
		{
			name: "The Shops at North Bridge",
			latitude: 41.891432,
			longitude: -87.624808,
			content: "<div style = 'width:200px;min-height:40px'></div>",
			visible: true,
			type: MALL_TYPE
		},
		{
			name: "900 North Michigan Avenue",
			latitude: 41.899641,
			longitude: -87.625122,
			content: "<div style = 'width:200px;min-height:40px'></div>",
			visible: true,
			type: MALL_TYPE
		},
		{
			name: "JP Morgan Chase",
			latitude: 41.8872977,
			longitude: -87.6240254,
			content: "<div style = 'width:200px;min-height:40px'></div>",
			visible: true,
			type: BANK_TYPE
		},
		{
			name: "Citibank",
			latitude: 41.8863868,
			longitude: -87.6238476,
			content: "<div style = 'width:200px;min-height:40px'></div>",
			visible: true,
			type: BANK_TYPE
		},
		{
			name: "Bank of America",
			latitude: 41.8911024,
			longitude: -87.624805,
			content: "<div style = 'width:200px;min-height:40px'>Bank of America</div>",
			visible: true,
			type: BANK_TYPE
		},
		{
			name: "The Purple Pig",
			latitude: 41.8911214,
			longitude: -87.6246107,
			content: "<div style = 'width:200px;min-height:40px'></div>",
			visible: true,
			type: RESTAURANT_TYPE
		},
		{
			name: "Nomi Restaurant",
			latitude: 41.8969702,
			longitude: -87.62506,
			content: "<div style = 'width:200px;min-height:40px'></div>",
			visible: true,
			type: RESTAURANT_TYPE
		},
		{
			name: "Bandera",
			latitude: 41.8918882,
			longitude: -87.6238574,
			content: "<div style = 'width:200px;min-height:40px'></div>",
			visible: true,
			type: RESTAURANT_TYPE
		},
		{
			name: "The Signature Room at the 95th",
			latitude: 41.8986397,
			longitude: -87.6227539,
			content: "<div style = 'width:200px;min-height:40px'></div>",
			visible: true,
			type: RESTAURANT_TYPE
		},
		{
			name: "Grand Lux Cafe",
			latitude: 41.8945098,
			longitude: -87.6249427,
			content: "<div style = 'width:200px;min-height:40px'></div>",
			visible: true,
			type: RESTAURANT_TYPE
		},
		{
			name: "Foodlife",
			latitude: 41.8980164,
			longitude: -87.6236208,
			content: "<div style = 'width:200px;min-height:40px'></div>",
			visible: true,
			type: RESTAURANT_TYPE
		}


		];
	return allData;
}

function getSearchFriendlyData() {
	var allData = getAllData();
	var searchFriendly = [];
	for (var i = 0; i < allData.length; i++) {
		searchFriendly = searchFriendly.concat(allData[i].name);
	}
	return searchFriendly;
}


$(document).ready(function() {

	function Location(name, latitude, longitude, content, visible, type) {
		this.name = ko.observable(name);
		this.latitude = ko.observable(latitude);
		this.longitude = ko.observable(longitude);
		this.content = ko.observable(content);
		this.visible = ko.observable(visible);
		this.type = ko.observable(type);
	}

	var viewModel = {
		locations: ko.observableArray([]),
		search: ko.observable('')
	};

	viewModel.firstMatch = ko.dependentObservable(function() {
		var search = this.search().toLowerCase();
		if (!search) {
			return this.locations();
		} else {
			return ko.utils.arrayFilter(this.locations(), function(location){
				//item.Name().toLowerCase().indexOf(filter) !== -1
				//var val = location.name().toLowerCase().indexOf(search) !== -1
				return location.name().toLowerCase().indexOf(search) !== -1;
			});
		}

	}, viewModel);

	var mappedData = ko.utils.arrayMap(getAllData(), function(item) {
		return new Location(item.name, item.latitude, item.longitude, item.content, item.visible, item.type);
	});

	viewModel.locations(mappedData);

    ko.applyBindings(viewModel);

    // autocomplete widget implementation for our searchable points of interest
    $( "#autocomplete" ).autocomplete({
 		source: getSearchFriendlyData()
	});

    // when enter key is pressed, we grab the user selection
    $('#autocomplete').on('autocompleteselect', function(e, ui) {
    	if (e.which == 13) {
			console.log("ui gives: " + ui.item.label);
			//get the proper object
			var allData = getAllData();
			var currentData;
			for (var i = 0; i < allData.length; i++) {
				currentData = allData[i];
				console.log("currentData = " + currentData.content);
				if (ui.item.label == currentData.name) {
					break;
				}
			}
			setVisibleMarkers(getVisibleData(currentData.type));
			displayMarkers(getVisibleSearchData(currentData.name, currentData.type));
			/*
			if (currentData != null) {
				var marker = new google.maps.Marker({
						position: new google.maps.LatLng(currentData.latitude, currentData.longitude),
						map: map,
						animation: google.maps.Animation.DROP
						});

				var infoWindow = new google.maps.InfoWindow({
									content: currentData.content
				});

				marker.addListener('click', function() {
			    	infoWindow.open(map, marker);
  				});
			}

*/

			//link a marker to it
			//dropSearchedMarker()
    	}
    });
});





