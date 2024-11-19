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
declare class MapCoordinatesTracker {
    private readonly map;
    private readonly display;
    private readonly options;
    private lastUpdate;
    private animationFrameId;
    private rect;
    constructor(mapSelector: string, displaySelector: string, options?: MapCoordinatesOptions);
    private init;
    private calculateCoordinates;
    private defaultFormatCoordinates;
    private handleMouseMove;
    private updateCoordinates;
    private handleMouseLeave;
    destroy(): void;
    setOptions(newOptions: Partial<MapCoordinatesOptions>): void;
}
