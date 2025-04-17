interface MapCoordinatesOptions {
    precision?: number;
    useThrottle?: boolean;
    throttleInterval?: number;
    onCoordinatesUpdate?: (coords: CoordinatesData) => void;
    formatCoordinates?: (coords: CoordinatesData) => string;
}
interface CoordinatesData {
    latitude: number;
    longitude: number;
    latitudeDirection: 'N' | 'S';
    longitudeDirection: 'E' | 'W';
    raw: {
        x: number;
        y: number;
    };
}
interface PinData {
    id: string;
    x: number;
    y: number;
    category: string;
    label?: string;
}
type Theme = 'light' | 'dark';
declare class NermalApp {
    private mapContainer;
    private coordinatesDisplay;
    private mapImg;
    private pins;
    private pinLayer;
    private zoom;
    private pan;
    private isPanning;
    private panStart;
    private theme;
    private gridOverlay;
    private showGrid;
    private categories;
    private selectedCategory;
    constructor();
    private initUI;
    private handleMapUpload;
    private loadMap;
    private handleZoom;
    private startPan;
    private panMove;
    private endPan;
    private applyTransform;
    private handleMouseMove;
    private calculateCoordinates;
    private formatCoordinates;
    private addPinAtEvent;
    private renderPins;
    private editOrRemovePin;
    private exportPins;
    private importPins;
    private toggleTheme;
    private initTheme;
    private toggleGrid;
    private updateGridOverlay;
}
