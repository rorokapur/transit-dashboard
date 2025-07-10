import { readFile } from "fs/promises";


let stops: TransitStop[] | undefined = undefined;
let routes: TransitRoute[] | undefined = undefined;
let shapes: Map<string, TransitRouteShape> | undefined = undefined;

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
        if (!shapes) {
            shapes = new Map();
        }
        const data = await readFile(path, 'utf-8');
        const split = data.split("\n");
        split.splice(0, 1);
        for (const line of split) {
            const cols = line.split(",");
            try{
                if (shapes.has(cols[0])) {
                    shapes.get(cols[0])?.points.push({lat: Number(cols[1]), lon: Number(cols[2]), seq: Number(cols[3])})
                } else {
                    shapes.set(cols[0], {id: cols[0], points: [{lat: Number(cols[1]), lon: Number(cols[2]), seq: Number(cols[3])}]})
                }
            } catch {
                console.error(`Skipping malformed row: ${line}`)
            }
        }
        console.log("Loaded route shapes")
    } catch (err) {
        console.log("Could not load route shapes. Proceeding without this data!")
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
}

interface TransitRouteShape {
    id: string;
    points: {seq: number, lat: number, lon: number}[];
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