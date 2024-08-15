
const coordinates = [campground.geometry.coordinates[1], campground.geometry.coordinates[0]];
const map = L.map('map').setView(coordinates, 13);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map)
const marker = L.marker(coordinates).addTo(map)
marker.bindPopup(`<b>${campground.title}</b><br>${campground.location}.`).openPopup();

