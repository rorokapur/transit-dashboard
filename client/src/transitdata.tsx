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

export function isTransitVehicle(value: unknown): value is TransitVehicle {
    return isRecord(value) 
    && typeof value.id === 'string' 
    && isRecord(value.position) 
    && typeof value.position.latitude === 'number' 
    && typeof value.position.longitude ==='number';
}