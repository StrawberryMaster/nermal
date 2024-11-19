const map = document.querySelector('.map');
const coordinatesDisplay = document.getElementById('hover-coordinates');

map.addEventListener('mousemove', (e) => {
    const rect = map.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Convert pixel coordinates to latitude and longitude
    const latitude = ((1 - y / rect.height) * 180 - 90).toFixed(2);
    const longitude = ((x / rect.width) * 360 - 180).toFixed(2);

    const latitudeDirection = latitude >= 0 ? 'N' : 'S';
    const longitudeDirection = longitude >= 0 ? 'E' : 'W';

    // Absolute values for display purposes
    const absLatitude = Math.abs(latitude);
    const absLongitude = Math.abs(longitude);

    const coordinates = `Latitude: ${absLatitude}°${latitudeDirection}, Longitude: ${absLongitude}°${longitudeDirection}`;

    coordinatesDisplay.innerText = coordinates;
});

map.addEventListener('mouseleave', () => {
    // Clear coordinates when leaving the map area
    coordinatesDisplay.innerText = '';
});
