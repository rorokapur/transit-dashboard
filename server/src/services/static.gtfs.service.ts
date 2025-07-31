import { readFile } from "fs/promises";
import { TransitRoute, TransitRouteShape, TransitStop, TransitTrip } from "../types/static.gtfs.types";


class GTFSStaticDataService {
    private stops: TransitStop[] = [];
    private routes: Map<string, TransitRoute> = new Map();
    private shapes: TransitRouteShape[] = [];
    private trips: Map<string, TransitTrip> = new Map();


    public loadStops = async (path: string) => {
        try {
            const data = await readFile(path, 'utf-8');
            const split = data.split("\n");
            split.splice(0, 1);
            for (const line of split) {
                const cols = line.split(",");
                try{
                    this.stops.push({id: cols[0], code: cols[1], name: cols[2].replace(/\"/g, ""), lat: Number(cols[5]), lon: Number(cols[6])})
                } catch {
                    console.error(`Skipping malformed row: ${line}`)
                }
            }
            console.log("Loaded stop locations")
        } catch (err) {
            console.log("Could not load stops. Proceeding without this data!")
        }
    }

    public loadRouteShapes = async (path: string) => {
        try {
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
            this.shapes = this.shapes.concat([...map.values()].sort());
            for(const route of this.shapes) {
                route.points.sort((a,b)=> {
                    return a.seq - b.seq;
                })
            }
            console.log("Loaded route shapes")
        } catch (err) {
            console.log("Could not load route shapes. Proceeding without this data!");
        }
    }

    public loadRoutes = async (path: string) => {
        try{
            const data = await readFile(path, 'utf-8');
            const split = data.split("\n");
            split.splice(0, 1);
            for (const line of split) {
                const cols = line.split(",");
                try{
                    const key = cols[0];
                    if(this.routes.has(key)) {
                        throw Error("duplicate route found!")
                    }
                    this.routes.set(key, {id: cols[0], agency_id: cols[1], short_name: cols[2].replace(/\"/g, ""), desc: cols[4].replace(/\"/g, ""), trip_ids: []});
                } catch {
                    console.error(`Skipping malformed row: ${line}`)
                }
            }
            console.log("Loaded stop locations");
        } catch {
            console.log("Could not load routes. Proceeding without this data!");
        }
    }

    public loadTrips = async (path: string) => {
        try {
            if(this.routes.size == 0) {
                console.warn("Warning: loading trips before routes means you cannot lookup the trips for a given route!")
            }
            const data = await readFile(path, 'utf-8');
            const split = data.split("\n");
            split.splice(0, 1);
            for (const line of split) {
                const cols = line.split(",");
                try{
                    const key = cols[2];
                    if(this.trips.has(key)) {
                        throw Error("duplicate trip found, skipping!")
                    }
                    this.trips.set(key, {route_id: cols[0], trip_id: cols[2], headsign: cols[3].replace(/\"/g, ""), direction: cols[5], stops: []});
                    if(this.routes && this.routes.has(cols[0])) {
                        this.routes.get(cols[0])?.trip_ids?.push(key);
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

    public getStops = () => {
        return structuredClone(this.stops);
    }

    public getStopsInArea = (y1: number, x1: number, y2: number, x2: number): TransitStop[] => {
        const present: TransitStop[] = [];
        for (const stop of this.stops) {
            if (stop.lat <= y1 && stop.lon >= x1 && stop.lat >= y2 && stop.lon <= x2) {
                present.push(structuredClone(stop));
            }
        }

        return present;
    }

    public getRouteSegmentsInArea = (y1: number, x1: number, y2: number, x2: number) => {
        const result = []
        for (const route of this.shapes) {
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
        return structuredClone(result);
    }
}

export const gtfsStaticService = new GTFSStaticDataService();



