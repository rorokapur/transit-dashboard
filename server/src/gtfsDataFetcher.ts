import { time } from 'console';
import fetch from 'node-fetch';
import { positionTestData } from './offlineTestData';

interface gtfsJsonFeeds {
    pos: URL | undefined | null;
    updates: URL | undefined | null;
    alerts: URL | undefined | null;
}

interface TransitPositionData {
    timestamp: number;
    vehicles: TransitVehicle[];
}

interface TransitVehicle {
    id: string;
    position: {latitude: number, longitude: number};

}

let pos: TransitPositionData | null = null;
let updates = null;
let alerts = null;

export const updateRealtimeData = async (feeds: gtfsJsonFeeds) => {
    if (feeds.pos) {
        const posJson = await fetchAndParseGtfsJson(feeds.pos);
        //const posJson = positionTestData; Use when working offline
        if (posJson) {
            try {
                pos = await parsePosJson(posJson);
                console.log("Successfully updated vehicle position data!");
            } catch (error) {
                console.warn(`failed to parse new position data: ${error} old data will be retained`)
            }
        } else {
            console.warn("failed to get new position data json! old data will be retained!")
        }
    }
    

}

const fetchAndParseGtfsJson = async (feed: URL): Promise<unknown>  => {
    try{
        const resp = await fetch(feed);

        if (!resp.ok) {
            throw new Error(`Error fetching data from ${feed}: status code ${resp.status}`);
        }

        const json = await resp.json();
        return json;
    } catch (error){
        throw new Error(`Could not fetch/parse JSON from ${feed}`);
    }
}

const parsePosJson = async (json: any): Promise<TransitPositionData> => {
    if (!json.header || json.header.gtfs_realtime_version != "2.0" || !json.header.timestamp || !json.entity) {
        throw new Error("Invalid JSON header!")
    }
    const timestamp = json.header.timestamp;
    const vehicles: TransitVehicle[] = []
    for (const vehicle of json.entity) {
        if(!vehicle.vehicle || !vehicle.vehicle.position || !vehicle.vehicle.vehicle.id || typeof vehicle.vehicle.position.latitude !== 'number' || typeof vehicle.vehicle.position.longitude !== 'number') {
            console.error("Invalid vehicle position JSON: ");
            console.log(vehicle);
            continue;
        }
        vehicles.push({id: vehicle.vehicle.vehicle.id, position: vehicle.vehicle.position})
    }
    return {timestamp: timestamp, vehicles: vehicles}
    
}

export const vehiclePositionsInArea = (y1: number, x1: number, y2: number, x2: number): TransitPositionData => {
    if(!pos) {
        throw new Error("No position data available!");
    }

    const vehicles: TransitVehicle[] = [];
    for (const vehicle of pos.vehicles) {
        if (vehicle.position.latitude <= y1 && vehicle.position.longitude >= x1 && vehicle.position.latitude >= y2 && vehicle.position.longitude <= x2) {
            vehicles.push(vehicle);
        }
    }

    return {timestamp: pos.timestamp, vehicles: vehicles};
}