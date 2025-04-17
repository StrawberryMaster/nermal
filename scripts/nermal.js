"use strict";
class NermalApp {
    mapContainer;
    coordinatesDisplay;
    mapImg = null;
    pins = [];
    pinLayer;
    zoom = 1;
    pan = { x: 0, y: 0 };
    isPanning = false;
    panStart = { x: 0, y: 0 };
    theme = 'light';
    gridOverlay;
    showGrid = false;
    categories = {
        default: '📍',
        city: '🏙️',
        mountain: '⛰️',
        water: '🌊'
    };
    selectedCategory = 'default';
    constructor() {
        this.mapContainer = document.getElementById('map-container');
        this.coordinatesDisplay = document.getElementById('hover-coordinates');
        this.pinLayer = document.createElement('div');
        this.pinLayer.className = 'pin-layer';
        this.pinLayer.style.position = 'absolute';
        this.pinLayer.style.left = '0';
        this.pinLayer.style.top = '0';
        this.pinLayer.style.width = '100%';
        this.pinLayer.style.height = '100%';
        this.pinLayer.style.pointerEvents = 'none';
        this.mapContainer.appendChild(this.pinLayer);
        this.gridOverlay = document.getElementById('grid-overlay');
        this.initUI();
        this.initTheme();
    }
    initUI() {
        const uploadInput = document.getElementById('map-upload');
        uploadInput.addEventListener('change', (e) => this.handleMapUpload(e));
        document.getElementById('theme-toggle').addEventListener('click', () => this.toggleTheme());
        document.getElementById('export-pins').addEventListener('click', () => this.exportPins());
        document.getElementById('import-pins').addEventListener('click', () => this.importPins());
        document.getElementById('toggle-grid').addEventListener('click', () => this.toggleGrid());
        document.getElementById('measure-tool').addEventListener('click', () => alert('Not implemented yet!'));
        this.mapContainer.addEventListener('wheel', (e) => this.handleZoom(e));
        this.mapContainer.addEventListener('mousedown', (e) => this.startPan(e));
        window.addEventListener('mousemove', (e) => this.panMove(e));
        window.addEventListener('mouseup', () => this.endPan());
        this.mapContainer.addEventListener('dblclick', (e) => this.addPinAtEvent(e));
        this.mapContainer.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.mapContainer.addEventListener('mouseleave', () => this.coordinatesDisplay.innerText = '');
        window.addEventListener('resize', () => this.updateGridOverlay());
    }
    handleMapUpload(e) {
        const input = e.target;
        if (!input.files || !input.files[0])
            return;
        const file = input.files[0];
        if (!/^image\/(png|jpeg|webp)$/.test(file.type)) {
            alert('File type not supported. Yet.');
            return;
        }
        const reader = new FileReader();
        reader.onload = () => {
            this.loadMap(reader.result);
        };
        reader.readAsDataURL(file);
    }
    loadMap(src) {
        if (this.mapImg) {
            this.mapContainer.removeChild(this.mapImg);
        }
        this.mapImg = document.createElement('img');
        this.mapImg.src = src;
        this.mapImg.className = 'map';
        this.mapImg.style.position = 'absolute';
        this.mapImg.style.left = '0';
        this.mapImg.style.top = '0';
        this.mapImg.style.width = '100%';
        this.mapImg.style.height = '100%';
        this.mapImg.style.objectFit = 'contain';
        this.mapImg.onload = () => {
            this.updateGridOverlay();
            this.renderPins();
        };
        this.mapContainer.insertBefore(this.mapImg, this.pinLayer);
    }
    handleZoom(e) {
        if (!this.mapImg)
            return;
        e.preventDefault();
        const scale = e.deltaY < 0 ? 1.1 : 0.9;
        this.zoom = Math.max(0.5, Math.min(5, this.zoom * scale));
        this.applyTransform();
        this.updateGridOverlay();
    }
    startPan(e) {
        if (!this.mapImg)
            return;
        this.isPanning = true;
        this.panStart = { x: e.clientX - this.pan.x, y: e.clientY - this.pan.y };
        this.mapContainer.style.cursor = 'grabbing';
    }
    panMove(e) {
        if (!this.isPanning || !this.mapImg)
            return;
        this.pan.x = e.clientX - this.panStart.x;
        this.pan.y = e.clientY - this.panStart.y;
        this.applyTransform();
        this.updateGridOverlay();
    }
    endPan() {
        this.isPanning = false;
        this.mapContainer.style.cursor = '';
    }
    applyTransform() {
        if (!this.mapImg)
            return;
        const t = `translate(${this.pan.x}px,${this.pan.y}px) scale(${this.zoom})`;
        this.mapImg.style.transform = t;
        this.pinLayer.style.transform = t;
        this.gridOverlay.style.transform = t;
    }
    handleMouseMove(e) {
        if (!this.mapImg)
            return;
        const rect = this.mapImg.getBoundingClientRect();
        const x = (e.clientX - rect.left) / this.zoom;
        const y = (e.clientY - rect.top) / this.zoom;
        if (x < 0 || y < 0 || x > rect.width / this.zoom || y > rect.height / this.zoom) {
            this.coordinatesDisplay.innerText = '';
            return;
        }
        const coords = this.calculateCoordinates(x, y, rect.width / this.zoom, rect.height / this.zoom);
        this.coordinatesDisplay.innerText = this.formatCoordinates(coords);
    }
    calculateCoordinates(x, y, width, height) {
        const latitude = (1 - y / height) * 180 - 90;
        const longitude = (x / width) * 360 - 180;
        const latValue = Number(latitude.toFixed(4));
        const lonValue = Number(longitude.toFixed(4));
        return {
            latitude: Math.abs(latValue),
            longitude: Math.abs(lonValue),
            latitudeDirection: latValue >= 0 ? 'N' : 'S',
            longitudeDirection: lonValue >= 0 ? 'E' : 'W',
            raw: { x, y }
        };
    }
    formatCoordinates(coords) {
        return `Lat: ${coords.latitude}°${coords.latitudeDirection}, Lon: ${coords.longitude}°${coords.longitudeDirection}`;
    }
    addPinAtEvent(e) {
        if (!this.mapImg)
            return;
        const rect = this.mapImg.getBoundingClientRect();
        const x = (e.clientX - rect.left) / this.zoom;
        const y = (e.clientY - rect.top) / this.zoom;
        if (x < 0 || y < 0 || x > rect.width / this.zoom || y > rect.height / this.zoom)
            return;
        const pin = {
            id: crypto.randomUUID(),
            x: x / (rect.width / this.zoom),
            y: y / (rect.height / this.zoom),
            category: this.selectedCategory
        };
        this.pins.push(pin);
        this.renderPins();
    }
    renderPins() {
        this.pinLayer.innerHTML = '';
        if (!this.mapImg)
            return;
        for (const pin of this.pins) {
            const pinEl = document.createElement('div');
            pinEl.className = 'pin';
            pinEl.style.position = 'absolute';
            pinEl.style.left = `${pin.x * 100}%`;
            pinEl.style.top = `${pin.y * 100}%`;
            pinEl.style.transform = 'translate(-50%, -100%)';
            pinEl.style.cursor = 'pointer';
            pinEl.style.fontSize = '2rem';
            pinEl.innerText = this.categories[pin.category] || this.categories['default'];
            pinEl.title = pin.label || '';
            pinEl.style.pointerEvents = 'auto';
            pinEl.addEventListener('click', (ev) => {
                ev.stopPropagation();
                this.editOrRemovePin(pin.id);
            });
            this.pinLayer.appendChild(pinEl);
        }
    }
    editOrRemovePin(pinId) {
        const pin = this.pins.find(p => p.id === pinId);
        if (!pin)
            return;
        const action = prompt('Editar rótulo do pin ou digite "remover" para excluir:', pin.label || '');
        if (action === null)
            return;
        if (action.trim().toLowerCase() === 'remover') {
            this.pins = this.pins.filter(p => p.id !== pinId);
        }
        else {
            pin.label = action.trim();
        }
        this.renderPins();
    }
    exportPins() {
        const data = JSON.stringify(this.pins, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'pins.json';
        a.click();
        URL.revokeObjectURL(url);
    }
    importPins() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'application/json';
        input.onchange = () => {
            if (!input.files || !input.files[0])
                return;
            const reader = new FileReader();
            reader.onload = () => {
                try {
                    const pins = JSON.parse(reader.result);
                    if (Array.isArray(pins)) {
                        this.pins = pins;
                        this.renderPins();
                    }
                }
                catch {
                    alert('Arquivo inválido.');
                }
            };
            reader.readAsText(input.files[0]);
        };
        input.click();
    }
    toggleTheme() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        document.body.setAttribute('data-theme', this.theme);
    }
    initTheme() {
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            this.theme = 'dark';
            document.body.setAttribute('data-theme', 'dark');
        }
    }
    toggleGrid() {
        this.showGrid = !this.showGrid;
        this.gridOverlay.style.display = this.showGrid ? 'block' : 'none';
        this.updateGridOverlay();
    }
    updateGridOverlay() {
        if (!this.mapImg || !this.showGrid)
            return;
        const rect = this.mapImg.getBoundingClientRect();
        this.gridOverlay.width = rect.width;
        this.gridOverlay.height = rect.height;
        this.gridOverlay.style.left = this.mapImg.style.left;
        this.gridOverlay.style.top = this.mapImg.style.top;
        const ctx = this.gridOverlay.getContext('2d');
        ctx.clearRect(0, 0, rect.width, rect.height);
        ctx.strokeStyle = 'rgba(100,100,100,0.3)';
        ctx.lineWidth = 1;
        for (let i = 0; i <= 12; i++) {
            const x = (rect.width / 12) * i;
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, rect.height);
            ctx.stroke();
        }
        for (let i = 0; i <= 6; i++) {
            const y = (rect.height / 6) * i;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(rect.width, y);
            ctx.stroke();
        }
    }
}
window.addEventListener('DOMContentLoaded', () => {
    new NermalApp();
});
//# sourceMappingURL=nermal.js.map