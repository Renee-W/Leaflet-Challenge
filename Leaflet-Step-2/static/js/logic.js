// Define a markerSize function that will give each city a different marker radius based on earthquake magnitude
function markerSize(magnitude) {
    return magnitude *5;
}

// Define a color function that sets the colour of a marker based on earthquake magnitude
function magColor(magnitude) {
    if (magnitude <= 1) {
        return "green"
    } else if (magnitude <= 2) {
        return "yellowgreen"
    } else if (magnitude <= 3) {
        return "yellow"
    } else if (magnitude <= 4) {
        return "orange"
    } else if (magnitude <= 5) {
        return "red"
    } else {
        return "black"
    }
};
//USGS url
var url="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// boundry url
var boundurl = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"

//define the create map function
function createMap(earthquakes) {
    var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/light-v10",
    accessToken: API_KEY
    })
    
    // Creating map object
    var myMap = L.map("mapid", {
        center: [37.7749, -122.4194],
        zoom: 3,
        layers: [lightmap]
    });
    var tectoniclayer = new L.LayerGroup()
    var earthquakelayer = new L.LayerGroup()

    var datalayer = {
        'Tectonic Plates':tectoniclayer,
        'Earthquakes':earthquakelayer
    }
    var allmaps = {
        'light': lightmap
    }
    L.control.layers (allmaps, datalayer).addTo(myMap)

    // // Create the tile layer that will be the background of our map
    // var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    // attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    // tileSize: 512,
    // maxZoom: 18,
    // zoomOffset: -1,
    // id: "mapbox/light-v10",
    // accessToken: API_KEY
    // })
    //lightmap.addTo(myMap);

    //create a GeoJSON layer containing the features array on the respones object
    L.geoJSON(earthquakes, {
        //create circle markers
        pointToLayer: function(feature, latlng){
            return L.circleMarker(latlng, {
                radius: markerSize(feature.properties.mag),
                fillColor: magColor(feature.properties.mag),
                color: "white",
                weight: 0.3,
                opacity: 0.5,
                fillOpacity: 1
            });
        },
        onEachFeature: onEachFeature
    }).addTo(earthquakelayer)
    earthquakelayer.addTo(myMap)

    //binding each layer
    function onEachFeature(feature,layer){
        var format = d3.timeFormat("%d-%b-%Y at %H:%M");

        layer.bindPopup(`<strong>Place: </strong> ${feature.properties.place}<br><strong>Time: </strong>${format(new Date(feature.properties.time))}<br><strong>Magnitude: </strong>${feature.properties.mag}`);
    };
   // Set up the legend
   var legend = L.control({ position: "bottomright" });
   legend.onAdd = function() {
       var div = L.DomUtil.create("div", "info legend");
       var magnitudes = [0, 1, 2, 3, 4, 5];
       var labels = [];
       var legendInfo = "<h5>Magnitude</h5>";

       div.innerHTML = legendInfo;

       // go through each magnitude item to label and color the legend
       // push to labels array as list item
       for (var i = 0; i < magnitudes.length; i++) {
           labels.push('<li style="background-color:' + magColor(magnitudes[i] + 1) + '"> <span>' + magnitudes[i] + (magnitudes[i + 1] ? '&ndash;' + magnitudes[i + 1] + '' : '+') + '</span></li>');
       }

       // add each label list item to the div under the <ul> tag
       div.innerHTML += "<ul>" + labels.join("") + "</ul>";

       return div;
   };


   d3.json(boundurl, function(response){
       L.geoJSON(response,{
           color:"purple",
           weight: 5
       }).addTo(tectoniclayer)
       tectoniclayer.addTo(myMap)
   });
   // Adding legend to the map
   legend.addTo(myMap);

}; // end createMap function

    // Perform an API call to the USGS earthquakes API to get earthquake information. 
d3.json(url, function(response) {

    // Call create with response.features
    createMap(response.features);
});

