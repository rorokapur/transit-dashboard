import React, { ComponentProps, ReactHTMLElement, useState, useEffect } from 'react';
import { MapContainer, TileLayer, useMap, Marker, Popup, useMapEvents } from 'react-leaflet';
import L, { latLng, LatLngBounds, latLngBounds } from 'leaflet';
import { NumberLiteralType, unescapeLeadingUnderscores } from 'typescript';

export interface MapBounds {
    x1: number;
    y1: number;
    x2: number;
    y2: number;

}

export interface MapBoundControllerProps {
    onBoundsChange?: (bounds: MapBounds) => void;
}

export interface TransitMapProps {
    startBounds: MapBounds;
    onBoundsChange?: (bounds: MapBounds) => void;
};

const TransitMap: React.FC<TransitMapProps> = (props: TransitMapProps): React.JSX.Element => {
    const items: React.JSX.Element[] = [];
    return (
        <MapContainer bounds={latLngBounds([latLng(props.startBounds.y1, props.startBounds.x1), latLng(props.startBounds.y2, props.startBounds.x2)])}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapBoundController onBoundsChange={props.onBoundsChange}></MapBoundController>
        </MapContainer>
    );
}

const MapBoundController: React.FC<MapBoundControllerProps> = (props: MapBoundControllerProps) => {
    const map = useMap();
    useEffect(() => {
        if (props.onBoundsChange) {
            const bounds: LatLngBounds = map.getBounds();
            props.onBoundsChange({ y1: bounds.getNorth(), x1: bounds.getWest(), y2: bounds.getSouth(), x2: bounds.getEast() })
        }
    }, []);
    useMapEvents({
        moveend() {
            if(props.onBoundsChange) {
                const bounds: LatLngBounds = map.getBounds();
                props.onBoundsChange({ y1: bounds.getNorth(), x1: bounds.getWest(), y2: bounds.getSouth(), x2: bounds.getEast() })
                
            }
        }
    })

    return null; // This component doesn't render anything visible
}
export default TransitMap;