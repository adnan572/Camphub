// Ensure Leaflet and MarkerCluster are loaded
if (typeof L === 'undefined') {
    throw new Error('Leaflet must be loaded before MarkerCluster.');
}

// Initialize the map and clusters
function initializeMap() {
    var map = L.map('map', { scrollWheelZoom: false }).setView([37.0870821, -76.4730122], 4);
    // Add the base layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Create a marker cluster group
    var markers = L.markerClusterGroup();


    campgrounds.forEach(function (campground) {
        var coordinates = campground.geometry.coordinates;
        var marker = L.marker([coordinates[1], coordinates[0]]); // Note: Leaflet expects [latitude, longitude]

        var popupContent = `
            <div style="font-family: inherit; padding: 2px; min-width: 170px;">
                <a href="/campgrounds/${campground._id}" style="text-decoration:none;">
                    <h6 style="margin: 0 0 4px 0; font-weight: 700; color: #0f172a; font-size: 0.98rem;">${campground.title}</h6>
                </a>
                <div style="font-size: 0.82rem; color: #64748b; margin-bottom: 6px;">
                    ${campground.location}
                </div>
                <div style="display: flex; align-items: center; justify-content: space-between; border-top: 1px solid #e2e8f0; padding-top: 6px;">
                    <span style="font-weight: 700; color: #2d6a4f; font-size: 0.9rem;">$${campground.price}<small style="color:#64748b; font-weight:400;">/night</small></span>
                    <a href="/campgrounds/${campground._id}" style="font-size: 0.78rem; background: #2d6a4f; color: #ffffff; padding: 2px 8px; border-radius: 4px; text-decoration: none; font-weight: 600;">View</a>
                </div>
            </div>
        `;
        marker.bindPopup(popupContent);

        markers.addLayer(marker);
    });

    // Add the marker cluster group to the map
    map.addLayer(markers);
}

// Initialize the map when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initializeMap);
