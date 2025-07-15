import { isRecord } from "./record";

export type ArrivalData = ArrivalInfo[];

export interface ArrivalInfo {
    routeId: string;
    name: string;
    timeToArrival: number;
}

export interface TransitPositionData {
    timestamp: number;
    vehicles: TransitVehicle[];
}

export interface TransitVehicle {
    id: string;
    position: { latitude: number, longitude: number };

}

export interface TransitStop {
    id: string;
    code?: string;
    name?: string;
    position: { latitude: number, longitude: number };
}

export interface TransitRoutePath {
    id: string;
    points: [lat: number, lon: number][];
}


export function isTransitVehicle(value: unknown): value is TransitVehicle {
    return isRecord(value) 
    && typeof value.id === 'string' 
    && isRecord(value.position) 
    && typeof value.position.latitude === 'number' 
    && typeof value.position.longitude ==='number';
}

export function isTransitStopJson(value: unknown) {
    return isRecord(value)
        && typeof value.id === 'string'
        && typeof value.lat === 'number'
        && typeof value.lon === 'number';
}
export function isTransitRoutePathJson(value: unknown) {
    if (!isRecord(value)
        || typeof value.id !== 'string'
        || !Array.isArray(value.points)) {
            return false;
    }
    for(const section of value.points){
        if(!Array.isArray(section)) {
            return false;
        }
        for (const point of section) {
            if (!Array.isArray(point)) {
                return false;
            }
            for (const part of point) {
                if (typeof part !== "number") {
                    return false;
                }
            }
        }
    }
    return true;
}

export const routeIdToHexColor = (str: string, saturation: number = 65, lightness: number = 45): string => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
        hash = hash & hash; // Convert to 32bit integer
    }

    const hue = hash % 360;

    // --- HSL to RGB conversion ---
    const s = saturation / 100;
    const l = lightness / 100;
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs(((hue / 60) % 2) - 1));
    const m = l - c / 2;
    let r = 0;
    let g = 0;
    let b = 0;

    if (0 <= hue && hue < 60) {
        r = c; g = x; b = 0;
    } else if (60 <= hue && hue < 120) {
        r = x; g = c; b = 0;
    } else if (120 <= hue && hue < 180) {
        r = 0; g = c; b = x;
    } else if (180 <= hue && hue < 240) {
        r = 0; g = x; b = c;
    } else if (240 <= hue && hue < 300) {
        r = x; g = 0; b = c;
    } else if (300 <= hue && hue < 360) {
        r = c; g = 0; b = x;
    }

    // --- RGB to Hex conversion ---
    const toHex = (c: number) => {
        const hex = Math.round(c * 255).toString(16);
        return hex.length === 1 ? "0" + hex : hex;
    };

    const hexR = toHex(r + m);
    const hexG = toHex(g + m);
    const hexB = toHex(b + m);

    return `#${hexR}${hexG}${hexB}`;
  };