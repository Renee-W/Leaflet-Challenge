//USGS url
var url="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

//define the create map function
function createMap(earthquakes) {
    
    // Creating map object
    var myMap = L.map("map", {
        center: [37.7749, -122.4194],
        zoom: 4
    });
    
    // Create the tile layer that will be the background of our map
    L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "light-v10",
    accessToken: API_KEY
    }).addTo(myMap);

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
    }).addTo(myMap)
    //binding each layer
    function onEachFeature(feature,layer){
        
    }
};

