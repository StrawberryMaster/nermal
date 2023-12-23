const nermalMap = document.querySelector('.map');
const nermalCoordinatesDisplay = document.getElementById('hover-coordinates');

if (nermalMap) {
nermalMap.addEventListener('mousemove', (e) => {
    const rect = nermalMap.getBoundingClientRect();
    const x = (e as MouseEvent).clientX - rect.left;
    const y = (e as MouseEvent).clientY - rect.top;

    // Convert pixel coordinates to latitude and longitude
    if (nermalCoordinatesDisplay) {
        const latitude = ((1 - y / rect.height) * 180 - 90).toFixed(2);
        const longitude = ((x / rect.width) * 360 - 180).toFixed(2);

        const latitudeDirection = parseFloat(latitude) >= 0 ? 'N' : 'S';
        const longitudeDirection = parseFloat(longitude) >= 0 ? 'E' : 'W';

        // Absolute values for display purposes
        const absLatitude = Math.abs(parseFloat(latitude));
        const absLongitude = Math.abs(parseFloat(longitude));

        const coordinates = `Latitude: ${absLatitude}°${latitudeDirection}, Longitude: ${absLongitude}°${longitudeDirection}`;

        nermalCoordinatesDisplay.innerText = coordinates;
    }
});
}

if (nermalMap) {
    nermalMap.addEventListener('mouseleave', () => {
        // Clear coordinates when leaving the map area
        if (nermalCoordinatesDisplay) {
            nermalCoordinatesDisplay.innerText = '';
        }
    });
}
