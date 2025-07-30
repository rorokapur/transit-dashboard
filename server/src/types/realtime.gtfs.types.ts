/**
 * Represents the URLs of the three kinds of GTFS-RT feeds
 */
export interface gtfsJsonFeeds {
    /** URL of GTFS-RT Positions Feed */
    pos: URL | undefined | null;
    /** URL of GTFS-RT Updates Feed */
    updates: URL | undefined | null;
    /** URL of GTFS-RT Alerts Feed */
    alerts: URL | undefined | null;
}

/**
 * Represents the position data for a collection of vehicles at a given time
 */
export interface TransitPositionData {
    /** Time of last data update */
    timestamp: number;
    /** Collection vehicle data */
    vehicles: TransitVehicle[];
}

/**
 * Represents a transit vehicle and its relevant attributes
 */
export interface TransitVehicle {
    /** Unique vehicle id */
    id: string;
    /** Latitude and longitude of vehicle */
    position: {latitude: number, longitude: number};

}