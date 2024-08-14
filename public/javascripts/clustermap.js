// Ensure Leaflet and MarkerCluster are loaded
if (typeof L === 'undefined') {
    throw new Error('Leaflet must be loaded before MarkerCluster.');
}

// Initialize the map and clusters
function initializeMap() {
    var map = L.map('map').setView([37.0870821, -76.4730122], 4);
    // Add the base layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Create a marker cluster group
    var markers = L.markerClusterGroup();


    campgrounds.forEach(function (campground) {
        var coordinates = campground.geometry.coordinates;
        var marker = L.marker([coordinates[0], coordinates[1]]); // Note: Leaflet expects [latitude, longitude]

        var popupContent = `<a href = "/campgrounds/${campground._id}"> <h5> ${campground.title} </h5> </a> <b>Location:</b> ${campground.location}<br>
         <b>Price:</b> $${campground.price}<br>
                           `;
        marker.bindPopup(popupContent);

        markers.addLayer(marker);
    });

    // Add the marker cluster group to the map
    map.addLayer(markers);
}

// Initialize the map when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initializeMap);
