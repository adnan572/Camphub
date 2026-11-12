
const coordinates = [campground.geometry.coordinates[1], campground.geometry.coordinates[0]];
const map = L.map('map', { scrollWheelZoom: false }).setView(coordinates, 13);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);
const marker = L.marker(coordinates).addTo(map);
const popupContent = `
    <div style="font-family: inherit; padding: 2px;">
        <h6 style="margin: 0 0 3px 0; font-weight: 700; color: #0f172a;">${campground.title}</h6>
        <div style="font-size: 0.82rem; color: #64748b;">${campground.location}</div>
    </div>
`;
marker.bindPopup(popupContent).openPopup();

