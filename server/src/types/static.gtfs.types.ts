/** Represents a transit stop/station and its relevant attributes */
export interface TransitStop {

    /** Unique stop identifier */
    id: string;

    /** Customer-facing stop code (often the same as id) */
    code?: string;

    /** Customer-facing stop/station name */
    name?: string;

    /** Name read out by onboard TTS announcments */
    tts_name?: string;

    /** Description of stop with other relevant information */
    desc?: string;

    /** Latitude of stop location */
    lat: number;

    /** Longitude of stop location */
    lon: number;

    /** The id of the fare zone of a stop */
    zone_id?: string;

    //** URL to webpage for stop */
    stop_url?: string;

    /**
     * Stop location type
     * @remarks
     * ```
     * 0 - Stop/Platform
     * 1 - Station
     * 2 - Entrance/Exit
     * 3 - Generic
     * 4 - Boarding Area
     * ```
     */
    location_type?: number;

    /** id of parent station if relevant (required for location types 2-4) */
    parent_station?: string;

    /** Timezone of stop (useful if this is different from agency timezone) */
    timezone?: string;

    /**
     * Wheelchair accessibility information
     * @remarks
     * ```
     * 0 - No info
     * 1 - Some vehicles at stop are accessible
     * 2 - No accessible vehicles at stop
     * ```
     */
    wheelchair_boarding?: number;

    /**
     * Unique id and direction of each route that serves stop
     */
    routes?: {id: string, direction: string}[];
}

/** Represents a transit route and its relevant attributes*/
export interface TransitRoute {

    /** Unique GTFS route id */
    id: string;

    /** Transit agency id (to avoid collisions) */
    agency_id: string;

    /** Short route name or identifier (e.g route number, color) */
    short_name: string;

    /** More descriptive route name */
    long_name?: string;

    /** Useful additional customer-facing info */
    desc: string;

    /** Transportation type: see gtfs documentation route_type */
    type?: string;

    /** URL to webpage for route */
    url?: string;

    /** Customer facing route color hex code (e.g. green line) */
    color?: string;

    /** Color to use for text set against route color */
    text_color?: string;

    /** ids of each trip in route */
    trip_ids?: string[];
}

/** Represents the trip of a vehicle along stops on a route */
export interface TransitTrip {

    /** id of the route for this trip */
    route_id: string;

    /** id for the group of dates this trip runs */
    service_id?: string;

    /** Unique id for this trip */
    trip_id: string;

    /** Direction of this trip along route (e.g north/south)
     * @remarks
     * ```
     * 0 - one direction
     * 1 - the opposite direction
     * ```
     */
    direction: string;

    /** Text displayed on customer-facing signage for this trip */
    headsign?: string;

    /** The sequence and timing of stops on this trip */
    stops?: TransitStopTime[];
}

/** Represents a specific stop on a trip */
export interface TransitStopTime {

    /** Time when the vehicle arrives at the stop */
    arrival_time: string;

    /** Time when the vehicle leaves the stop */
    departure_time: string;

    /** The id of this stop */
    stop_id: string;

    /** Order of this stop on the route */
    stop_sequence: number;
}

/** Represents the path of a transit route on a map */
export interface TransitRouteShape {
    /** GTFS route id */
    id: string;

    /** The points (lat, lon) that make the path */
    points: {seq: number, pos: [lat: number, lon: number]}[];
}