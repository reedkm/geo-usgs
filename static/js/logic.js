function createMap(earthquakes) {

	// Create the tile layer that will be the background of our map
	var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
		attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
		maxZoom: 18,
		id: "mapbox.light",
		accessToken: API_KEY
	});
	
		// Create the tile layer that will be the background of our map
	var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
		attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
		maxZoom: 18,
		id: "mapbox.dark",
		accessToken: API_KEY
	});

	// Create the tile layer that will be the background of our map
	var satmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
		attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
		maxZoom: 18,
		id: "mapbox.satellite",
		accessToken: API_KEY
	});

	// Create a baseMaps object to hold the map options layer
	var baseMaps = {
		"Light": lightmap,
		"Dark": darkmap,
		"Satellite": satmap
	};

	// Create an overlayMaps object to hold the allWeek layer
	var overlayMaps = {
		"All Earthquakes": earthquakes
	};

	// Create the map object with options
	var map = L.map("map", {
		center: [39.8283, -98.5795],
		zoom: 3,
		layers: [lightmap, earthquakes]
	});
	
		// Add legend
	var legend = L.control({position: "bottomleft"});
	legend.onAdd = function (map) {

	var div = L.DomUtil.create("div", "info legend");
	labels = ["<strong>Categories by Magnitude</strong>"],
	categories = ["Micro: 1 - 1.9", "Minor: 2 - 3.9", "Light: 4 - 4.9", "Moderate: 5 - 5.9", "Strong: 6 - 6.9", "Major: 7 - 7.9", "Great: 8 -"];
	bcolor = ["#4EBF00", "#87C500", "#C3CB00", "#D2A000", "#D86900", "#DE2E00", "#E5000E"];
	
	for (var i = 0; i < categories.length; i++) {

			div.innerHTML += 
			labels.push(
					'<span style="background-color:' + bcolor[i] + '"> ' + '&nbsp;&nbsp;&nbsp;&nbsp;</span>&nbsp;' +
					(categories[i] ? categories[i] : '+'));

		}
		div.innerHTML = labels.join("<br />");
	return div;
	};
	legend.addTo(map);
	
	

	// Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
	L.control.layers(baseMaps, overlayMaps, {
		collapsed: false
	}).addTo(map);
}

function createAllMarkers(response) {

	// Pull the "allQuakes" property off of response.data
	var allQuakes = response.features;
	
	//console.log(allQuakes);

	// Initialize an array to hold bike markers
	var allMarkers = [];

	// Loop through the allQuakes array
	for (var index = 0; index < allQuakes.length; index++) {
		var allResponse = allQuakes[index];
		
		var d = new Date(allResponse.properties.time);
		timeStampCon = d.getDate() + '/' + (d.getMonth()) + '/' + d.getFullYear() + " " + d.getHours() + ':' + d.getMinutes();
		
		var mag = allResponse.properties.mag;
		var magScale = allResponse.properties.mag * 2;
		
		if(mag < 1.9){							// micro
			var color = "#4EBF00";
		} else if(mag >= 2 && mag <= 3.9){		// minor
			var color = "#87C500";
		} else if(mag >= 4 && mag <= 4.9){		// light
			var color = "#C3CB00";
		} else if(mag >= 5 && mag <= 5.9){		// moderate
			var color = "#D2A000";
		} else if(mag >= 6 && mag <= 6.9){		// strong
			var color = "#D86900";
		} else if(mag >= 7 && mag <= 7.9){		// major
			var color = "#DE2E00";
		} else if(mag > 8){						// great
			var color = "#E5000E";
	};
		
		var markerOptions = {
		radius: magScale,
		fillColor: color,
		color: color,
		weight: 2,
		opacity: 1,
		fillOpacity: 0.8
	};

		// For each allResponse, create a marker and bind a popup with the allResponse's name
		var allMarker = L.circleMarker([allResponse.geometry.coordinates[1], allResponse.geometry.coordinates[0]], markerOptions)
			.bindPopup("<h3>" + allResponse.properties.place + "</h3><h3>Magnitude: " + allResponse.properties.mag + "</h3><h3>Type: " + allResponse.properties.type + "</h3></h3><h3>Date/Time: " + timeStampCon + "</h3>");
	
	//console.log(mag);
	
		// Add the marker to the allMarkers array
		allMarkers.push(allMarker);
	}

	// Create a layer group made from the bike markers array, pass it into the createMap function
 createMap(L.layerGroup(allMarkers));
	
}


// Perform an API call to the Citi Bike API to get allResponse information. Call createAllMarkers when complete
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson", createAllMarkers);






