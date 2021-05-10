/* Creating map object
var myMap = L.map("map", {
  center: [33.145, -96.796],
  zoom: 15
});

// Adding tile layer to the map
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
}).addTo(myMap);
*/

// Assemble API query URL
var sold_listings_link = "./static/data/sold_listings_coord.json";
var current_listings_link = "./static/data/current_listings_coord.json";

// Grab the data with d3
d3.json(sold_listings_link).then(function(sold_listings_coord) {
	
	d3.json(current_listings_link).then(function(current_listings_coord) {
	
		console.log("sold_listings_coord")
		console.log(sold_listings_coord)
		
		console.log("current_listings_coord")
		console.log(current_listings_coord)
	  
		// Create a new marker cluster group for sold properties
		var sold_markers = L.markerClusterGroup({
		iconCreateFunction: function (cluster) {
		 
		 var childCount = cluster.getChildCount();
		 var c = ' marker-cluster-';
		 var sold_type = '';
		 if (childCount < 10) {
		   c += 'small';
		   sold_type = 'soldsmall';
		 } 
		 else if (childCount < 20) {
		   c += 'medium';
		   sold_type = 'soldmedium';
		 } 
		 else {
		   c += 'large';
		   sold_type = 'soldlarge';
		 }

		 return new L.DivIcon({ html: '<div><span>' + childCount + '</span></div>', 
		  className: sold_type +' marker-cluster' + c,iconSize: new L.Point(40, 40) });
		 }
		});
		
		// Create a new marker cluster group for current properties
		var current_markers = L.markerClusterGroup({
		iconCreateFunction: function (cluster) {
		 
		 var childCount = cluster.getChildCount();
		 var c = ' marker-cluster-';
		 var current_type = '';
		 if (childCount < 10) {
		   c += 'small';
		   current_type = 'currentsmall';
		 } 
		 else if (childCount < 20) {
		   c += 'medium';
		   current_type = 'currentmedium';
		 } 
		 else {
		   c += 'large';
		   current_type = 'currentlarge';
		 }

		 return new L.DivIcon({ html: '<div><span>' + childCount + '</span></div>', 
		  className: current_type+' marker-cluster' + c, iconSize: new L.Point(40, 40) });
		 }
		});
		
		// Loop through sold data
		for (var i = 0; i < sold_listings_coord.length; i++) {

		// Set the data location property to a variable
		var location = sold_listings_coord[i].coordinates;

		// Check for location property
		if (location) {
		  // Add a new marker to the cluster group and bind a pop-up
		  sold_markers.addLayer(L.circle(location, {
			  stroke: true,
			  fillOpacity: 0.75,
			  color: "black",
			  fillColor: '#FFA07A',
			  radius: 60
			}).bindPopup(
						"<h4>" + "Address: "+sold_listings_coord[i].Address + "</h4> <hr>" + 
						"<h4>" + "Price: $"+sold_listings_coord[i].price + "</h4> <hr>" 
						+ "<h4>" + "Beds: "+sold_listings_coord[i].NumberOfBeds + "</h4>" )
			);
			}
		}
		
		// Loop through current data
		for (var i = 0; i < current_listings_coord.length; i++) {

		// Set the data location property to a variable
		var location = current_listings_coord[i].coordinates;

		// Check for location property
		if (location) {
		  // Add a new marker to the cluster group and bind a pop-up
		  current_markers.addLayer(L.circle(location, {
			  stroke: true,
			  fillOpacity: 0.75,
			  color: "black",
			  fillColor: '#FF7F50',
			  radius: 60
			}).bindPopup("<h4>" + "Address: "+current_listings_coord[i].Address + "</h4> <hr>" + "<h4>" + "Price: $"+current_listings_coord[i].price + "</h4> <hr>" 
						+ "<h4>" + "Beds: "+current_listings_coord[i].NumberOfBeds + "</h4>" )
			
			);
			
			}
		}

  // Add our marker cluster layer to the map
  createMap(sold_markers, current_markers);
  
	})

});

function createMap(sold_markers, current_markers) {

  // Definiing base map layers
   
   var grayscale = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/light-v10",
    accessToken: API_KEY
  });
  
  var outdoors = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/outdoors-v11",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "dark-v10",
    accessToken: API_KEY
  });
  
  var satellitemap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/satellite-v9",
    accessToken: API_KEY
  });
  
  var streets = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
	});


  // Define a baseMaps object to hold our base layers
  var baseMaps = {
	  "Streets": streets,
	  "Satellite":satellitemap,
	  "Grayscale":grayscale,
	  "Outdoors":outdoors,
      "Dark Map": darkmap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
	"Sold Properties": sold_markers,
	"Current Properties": current_markers
  };

  // Create our map, giving it the satellite, earthquakes and tectonic layers to display on load
  var myMap = L.map("map", {
    center: [32.897480, -97.040443],
    zoom: 11,
    layers: [streets, sold_markers, current_markers]
  });
  
  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
  
  // Set up the legend
  var legend = L.control({ position: "bottomleft" });
  legend.onAdd = function() {
	var div = L.DomUtil.create("div", "info legend");
	var limits = ["Sold", "Current"];
	var colors = ["#008000", "#FF7F50"];
	var labels = [];

	// Add a header
	var legendInfo = "<h4> <strong> Properties Type </strong> </h4>" 

	div.innerHTML = legendInfo;

	limits.forEach(function(limit, index) {
	  labels.push("<li style=\"background-color: " + colors[index]+"\">" + limits[index] + "</li>");
	});

	div.innerHTML += "<ul style=\"text-align: center\">" + labels.join("") + "</ul>";
	return div;
  };

  // Adding legend to the map
  legend.addTo(myMap);
  
}
