import { readFile } from "fs";
import { fileFrom } from "node-fetch";
import { fileURLToPath } from "url";

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