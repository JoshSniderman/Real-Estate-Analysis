// Create our initial map object
// Set the longitude, latitude, and the starting zoom level
var myMap = L.map("map", {
  center: [32.88, -96.8],
  zoom: 11
});

// Add a tile layer (the background map image) to our map
// We use the addTo method to add objects to our map
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
}).addTo(myMap);

coors_lat = 0;
coors_lng = 0;

d3.csv("./Coor_CSV.csv").then(function(coors) {
	for (var i = 0; i < coors.length; i++) {
		var marker = L.marker([coors[i].Lat, coors[i].Lng], {}).addTo(myMap);
		marker.bindPopup("Address: " + coors[i].Address + " :: Price: $" + coors[i].Price);
	}
})


