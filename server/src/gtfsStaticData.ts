import { readFile } from "fs/promises";


let stops: TransitStop[] | undefined = undefined;
let routes: Map<string, TransitRoute> | undefined = undefined;
let shapes: TransitRouteShape[] | undefined = undefined;
let trips: Map<string, TransitTrip> | undefined = undefined;

export const loadStops = async (path: string) => {
    try {
        if (!stops) {
            stops = [];
        }
        const data = await readFile(path, 'utf-8');
        const split = data.split("\n");
        split.splice(0, 1);
        for (const line of split) {
            const cols = line.split(",");
            try{
                stops.push({id: cols[0], code: cols[1], name: cols[2].replace(/\"/g, ""), lat: Number(cols[5]), lon: Number(cols[6])})
            } catch {
                console.error(`Skipping malformed row: ${line}`)
            }
        }
        console.log("Loaded stop locations")
    } catch (err) {
        console.log("Could not load stops. Proceeding without this data!")
    }
}

export const loadRouteShapes = async (path: string) => {
    try {
        if(!shapes) {
            shapes = [];
        }
        const map: Map<string, TransitRouteShape> = new Map();
        const data = await readFile(path, 'utf-8');
        const split = data.split("\n");
        split.splice(0, 1);
        for (const line of split) {
            const cols = line.split(",");
            try{
                if (map.has(cols[0])) {
                    map.get(cols[0])?.points.push({seq: Number(cols[3]), pos: [Number(cols[1]),Number(cols[2])]});
                } else {
                    map.set(cols[0], {id: cols[0], points: [{seq: Number(cols[3]), pos: [Number(cols[1]),Number(cols[2])]}]})
                }
            } catch {
                console.error(`Skipping malformed row: ${line}`)
            }
        }
        shapes = shapes.concat([...map.values()].sort());
        for(const route of shapes) {
            route.points.sort((a,b)=> {
                return a.seq - b.seq;
            })
        }
        console.log("Loaded route shapes")
    } catch (err) {
        console.log("Could not load route shapes. Proceeding without this data!");
    }
}

export const loadRoutes = async (path: string) => {
    try{
        if(!routes) {
            routes = new Map();
        }
        const data = await readFile(path, 'utf-8');
        const split = data.split("\n");
        split.splice(0, 1);
        for (const line of split) {
            const cols = line.split(",");
            try{
                const key = cols[0];
                if(routes.has(key)) {
                    throw Error("duplicate route found!")
                }
                routes.set(key, {id: cols[0], agency_id: cols[1], short_name: cols[2].replace(/\"/g, ""), desc: cols[4].replace(/\"/g, ""), trip_ids: []});
            } catch {
                console.error(`Skipping malformed row: ${line}`)
            }
        }
        console.log("Loaded stop locations");
    } catch {
        console.log("Could not load routes. Proceeding without this data!");
    }
}

export const loadTrips = async (path: string) => {
    try {
        if(!routes) {
            console.warn("Warning: loading trips before routes means you cannot lookup the trips for a given route!")
        }
        if(!trips) {
            trips = new Map();
        }
        const data = await readFile(path, 'utf-8');
        const split = data.split("\n");
        split.splice(0, 1);
        for (const line of split) {
            const cols = line.split(",");
            try{
                const key = cols[2];
                if(trips.has(key)) {
                    throw Error("duplicate trip found, skipping!")
                }
                trips.set(key, {route_id: cols[0], trip_id: cols[2], headsign: cols[3].replace(/\"/g, ""), direction: cols[5], stops: []});
                if(routes && routes.has(cols[0])) {
                    routes.get(cols[0])?.trip_ids?.push(key);
                }
                
            } catch {
                console.error(`Skipping malformed row: ${line}`)
            }
        }
        console.log("Loaded trips");
    } catch (err) {
        console.error(err);
        console.log("Could not load trips. Proceeding without this data!")
    }
}

interface TransitStop {
    id: string;
    code?: string;
    name?: string;
    tts_name?: string;
    desc?: string;
    lat: number;
    lon: number;
    zone_id?: string;
    stop_url?: string;
    location_type?: string;
    parent_station?: string;
    timezone?: string;
    wheelchair_boarding?: number;
    routes?: {id: string, direction: string}[];
}

interface TransitRoute {
    id: string;
    agency_id: string;
    short_name: string;
    long_name?: string;
    desc: string;
    type?: string;
    url?: string;
    color?: string;
    text_color?: string;
    trip_ids?: string[];
}

interface TransitTrip {
    route_id: string;
    service_id?: string;
    trip_id: string;
    direction: string;
    headsign?: string;
    stops?: TransitStopTime[];
}

interface TransitStopTime {
    arrival_time: string;
    departure_time: string;
    stop_id: string;
    stop_sequence: number;
}

interface TransitRouteShape {
    id: string;
    points: {seq: number, pos: [lat: number, lon: number]}[];
}

export const stopsInArea = (y1: number, x1: number, y2: number, x2: number): TransitStop[] => {
    if(!stops) {
        throw new Error("No stop data available!");
    }

    const present: TransitStop[] = [];
    for (const stop of stops) {
        if (stop.lat <= y1 && stop.lon >= x1 && stop.lat >= y2 && stop.lon <= x2) {
            present.push(stop);
        }
    }

    return present;
}

export const routeSegmentsInArea = (y1: number, x1: number, y2: number, x2: number) => {
    if (!shapes) {
        return [];
    }
    const result = []
    for (const route of shapes) {
        const arr = [];
        let sub = [];
        let prev = undefined;
        for(const point of route.points) {
            if(point.pos[0] <= y1 && point.pos[1] >= x1 && point.pos[0] >= y2 && point.pos[1] <= x2 && prev !== undefined){
                sub.push(prev);
                sub.push(point.pos);
                prev = undefined;
            } else {
                if (sub.length > 1) {
                    sub.push(point.pos);
                    arr.push(sub);
                }
                sub = [];
                prev = point.pos;
            }
        }
        if (sub.length > 1) {
            arr.push(sub);
        }
        if(arr.length > 0) {
            result.push({id: route.id, points: arr});
        }
        
    }
    return result;
}