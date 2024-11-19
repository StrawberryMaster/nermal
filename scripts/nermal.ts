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

class MapCoordinatesTracker {
    private readonly map: HTMLElement;
    private readonly display: HTMLElement;
    private readonly options: Required<MapCoordinatesOptions>;
    private lastUpdate: number = 0;
    private animationFrameId: number | null = null;
    private rect: DOMRect;

    constructor(
        mapSelector: string,
        displaySelector: string,
        options: MapCoordinatesOptions = {}
    ) {
        const map = document.querySelector(mapSelector);
        const display = document.getElementById(displaySelector);

        if (!map || !display) {
            throw new Error('Zoinks! Map or display element not found');
        }

        this.map = map as HTMLElement;
        this.display = display;
        this.options = {
            precision: options.precision ?? 2,
            useThrottle: options.useThrottle ?? false,
            throttleInterval: options.throttleInterval ?? 16, // ~60fps
            onCoordinatesUpdate: options.onCoordinatesUpdate ?? (() => { }),
            formatCoordinates: options.formatCoordinates ?? this.defaultFormatCoordinates.bind(this)
        };

        this.rect = this.map.getBoundingClientRect();

        const resizeObserver = new ResizeObserver(() => {
            this.rect = this.map.getBoundingClientRect();
        });
        resizeObserver.observe(this.map);

        this.init();
    }

    private init(): void {
        this.map.addEventListener('mousemove', this.handleMouseMove.bind(this), { passive: true });
        this.map.addEventListener('mouseleave', this.handleMouseLeave.bind(this), { passive: true });

        if (!this.map.hasAttribute('tabindex')) {
            this.map.setAttribute('tabindex', '0');
        }
        this.map.setAttribute('role', 'application');
        this.map.setAttribute('aria-label', 'Interactive map with coordinate tracking');
        this.display.setAttribute('role', 'status');
        this.display.setAttribute('aria-live', 'polite');
    }

    private calculateCoordinates(x: number, y: number): CoordinatesData {
        // convert pixel coordinates to latitude and longitude
        const latitude = (1 - y / this.rect.height) * 180 - 90;
        const longitude = (x / this.rect.width) * 360 - 180;

        const latValue = Number(latitude.toFixed(this.options.precision));
        const lonValue = Number(longitude.toFixed(this.options.precision));

        return {
            latitude: Math.abs(latValue),
            longitude: Math.abs(lonValue),
            latitudeDirection: latValue >= 0 ? 'N' : 'S',
            longitudeDirection: lonValue >= 0 ? 'E' : 'W',
            raw: { x, y }
        };
    }

    private defaultFormatCoordinates(coords: CoordinatesData): string {
        return `Latitude: ${coords.latitude}°${coords.latitudeDirection}, Longitude: ${coords.longitude}°${coords.longitudeDirection}`;
    }

    private handleMouseMove = (e: MouseEvent): void => {
        const now = performance.now();

        if (this.options.useThrottle && now - this.lastUpdate < this.options.throttleInterval) {
            // if throttling is enabled and we're within the throttle interval,
            // schedule an update for the next frame if we haven't already
            if (!this.animationFrameId) {
                this.animationFrameId = requestAnimationFrame(() => this.updateCoordinates(e));
            }
            return;
        }

        // immediate update if not throttling or if enough time has passed
        this.updateCoordinates(e);
        this.lastUpdate = now;
    };

    private updateCoordinates(e: MouseEvent): void {
        const x = e.clientX - this.rect.left;
        const y = e.clientY - this.rect.top;

        const coords = this.calculateCoordinates(x, y);

        // update the display
        this.display.innerText = this.options.formatCoordinates(coords);

        // call callback with coordinates data
        this.options.onCoordinatesUpdate(coords);

        // clear the animation frame ID
        this.animationFrameId = null;
    }

    private handleMouseLeave = (): void => {
        this.display.innerText = '';
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
    };

    public destroy(): void {
        this.map.removeEventListener('mousemove', this.handleMouseMove);
        this.map.removeEventListener('mouseleave', this.handleMouseLeave);
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
    }

    public setOptions(newOptions: Partial<MapCoordinatesOptions>): void {
        Object.assign(this.options, newOptions);
    }
}
