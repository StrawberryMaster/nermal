var nermalMap = document.querySelector('.map');
var nermalCoordinatesDisplay = document.getElementById('hover-coordinates');
if (nermalMap) {
    nermalMap.addEventListener('mousemove', function (e) {
        var rect = nermalMap.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        // Convert pixel coordinates to latitude and longitude
        if (nermalCoordinatesDisplay) {
            var latitude = ((1 - y / rect.height) * 180 - 90).toFixed(2);
            var longitude = ((x / rect.width) * 360 - 180).toFixed(2);
            var latitudeDirection = parseFloat(latitude) >= 0 ? 'N' : 'S';
            var longitudeDirection = parseFloat(longitude) >= 0 ? 'E' : 'W';
            // Absolute values for display purposes
            var absLatitude = Math.abs(parseFloat(latitude));
            var absLongitude = Math.abs(parseFloat(longitude));
            var coordinates = "Latitude: ".concat(absLatitude, "\u00B0").concat(latitudeDirection, ", Longitude: ").concat(absLongitude, "\u00B0").concat(longitudeDirection);
            nermalCoordinatesDisplay.innerText = coordinates;
        }
    });
}
if (nermalMap) {
    nermalMap.addEventListener('mouseleave', function () {
        // Clear coordinates when leaving the map area
        if (nermalCoordinatesDisplay) {
            nermalCoordinatesDisplay.innerText = '';
        }
    });
}
