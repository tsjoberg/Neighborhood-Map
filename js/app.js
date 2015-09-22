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

// handle to the google map
var map;

// all the points of interest in our neighborhood map to be displayed by the markers
var pointsOfInterest = [
    "The Drake Hotel",
    "Park Hyatt Chicago",
    "Warwick Allerton Hotel Chicago",
    "Omni Chicago Hotel",
    "Tribune Tower",
    "Michigan Avenue Bridge",
    "John Hancock Center",
    "The Magnificent Mile",
    "Bloomingdale's",
    "Burberry",
    "Chanel Boutique",
    "Coach",
    "Louis Vuitton",
    "Tumi Luggage",
    "Saks Fifth Avenue",
    "Tiffany & Co",
    "Cartier",
    "Water Tower Place",
    "The Shops at North Bridge",
    "The 900 Shops",
    "Chase Bank",
    "Citibank",
    "Bank of America",
    "The Purple Pig",
    "NoMI Kitchen",
    "Bandera Restaurant",
    "The Signature Room at the 95th",
    "Grand Lux Cafe",
    "Foodlife"
];

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

/*  yelp api call
    @param business = the name of the business to query
*/
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

/*  callback function that handles yelp data
    to populate our markers with
    @param data = response from ajax call
 */
function handleYelpData(data) {
    var results = data.businesses;
    // if we have data, we will display only the first review from yelp
    if (results.length > 0) {
        // create a new location object and push it to view models
        // observable array 'locations'
        var mapLocation = new Location(results[0]);
        viewModel.locations.push(mapLocation);
    } else {
        console.log("Unable to obain yelp data for: " + data);
    }
}

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

/*  Handle the response from weather underground ajax call
    by setting knockout observable values
    @param data = response from ajax call
*/
function handleWeatherUnderground(data) {
    viewModel.temperature(data.current_observation.temperature_string);
    viewModel.feelsLike(data.current_observation.feelslike_string);
    viewModel.wind(data.current_observation.wind_string);
    viewModel.conditions(data.current_observation.weather);
}

/*  Opens a location's info window and animates its marker
    @param locationData = the location object
*/
function openInfoWindow(locationData) {
    if (viewModel.infoWindow !== undefined && viewModel.infoWindow !== null) {
        // close the open window
        viewModel.infoWindow.close();
    }
    var displayElement = '<div class="info-window"><h6>' +
                            locationData.name + '</h6>' +
                            locationData.address + '<p>' + locationData.displayPhone  +
                            '<p><img src="' + locationData.stars +
                            '" height=20 width=100 alt="Yelp Rating">' +
                            '</p>' +
                            '<p><img src="' + locationData.imageUrl +
                            '" height=100 width=150 class="img-thumbnail">' + '</p>' +
                            locationData.snippetText + '<br>' +
                            '<a class="btn btn-default btn-small" href="' + locationData.mobileUrl +
                             '" target="_blank">More Yelp!</a></p></div>';

    viewModel.infoWindow = new google.maps.InfoWindow({
        content: displayElement
    });

    viewModel.infoWindow.open(map, locationData.marker);

    locationData.marker.setAnimation(google.maps.Animation.BOUNCE);

    setTimeout(function() {
        locationData.marker.setAnimation(null);
    }, 2000);
}

/*  Constructor for map location
    @param business - response from yelp api call
*/
function Location(business) {
    var self = this;

    this.name = business.name;
    this.lat = business.location.coordinate.latitude;
    this.lng = business.location.coordinate.longitude;
    this.displayPhone = business.display_phone;
    this.url = business.url;
    this.mobileUrl = business.mobile_url;
    this.stars = business.rating_img_url_small;
    this.imageUrl = business.image_url;
    this.rating = business.rating;
    this.snippetText = business.snippet_text;
    this.address = business.location.display_address[0] + "<br>" +
                     business.location.display_address[business.location.display_address.length - 1];

    // save the marker as part of each location object
    this.marker = new google.maps.Marker({
        position: new google.maps.LatLng(self.lat, self.lng),
        map: map,
        animation: google.maps.Animation.DROP,
        title: self.name
    });

    // create an event listener to call when marker is clicked
    google.maps.event.addListener(self.marker, 'click', function() {
        openInfoWindow(self);
    });

    // special knockout property to automatically hide this location in list view
    // when set to true
    this._destroy = ko.observable(false);
}

// View model for knockout js
var NBViewModel = function() {
    var self = this;

    self.locations = ko.observableArray('');

    self.query = ko.observable('');

    self.infoWindow = null;

    self.search = function() {
        var len = self.locations().length;
        for (var i = 0; i < len; i++) {
            var n = self.locations()[i].name.toLowerCase();
            var input = self.query().toLowerCase();
            if (n.indexOf(input) >= 0) {
                self.locations()[i]._destroy(false);
                self.locations()[i].marker.setVisible(true);
            } else {
                self.locations()[i]._destroy(true);
                self.locations()[i].marker.setVisible(false);
            }
        }
    };

    // run self.search when user types in the search box
    self.query.subscribe(function(value) {
        self.search();
    });

    // when user clicks a location in the list view, triggers a
    // click event on the location's marker that opens an infowindow
    self.listViewClick = function(locationObject) {
        google.maps.event.trigger(locationObject.marker, 'click');
    };

    // observable to hold temperature data from weather ajax call
    self.temperature = ko.observable();

    // observable to hold feelslike data from weather ajax call
    self.feelsLike = ko.observable();

    // observable to hold wind data from weather ajax call
    self.wind = ko.observable();

    // observable to hold conditions data from weather ajax call
    self.conditions = ko.observable();
};

// create a new instance of the view model
var viewModel = new NBViewModel();

$(document).ready(function() {
    // apply the knockout bindings to the view model instance
    ko.applyBindings(viewModel);

    var numData = pointsOfInterest.length;
    for (var i = 0; i < numData; i++) {
        // call Yelp api to get data for the infowindow
        callYelp(pointsOfInterest[i]);
    }

    // call Weather Underground api to get weather information
    callWeatherUnderground();
});