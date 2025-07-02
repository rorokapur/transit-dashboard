import React, { ComponentProps, ReactHTMLElement, useState, useEffect } from 'react';
import { MapContainer, TileLayer, useMap, Marker, Popup, useMapEvents, Tooltip } from 'react-leaflet';
import L, { latLng, LatLngBounds, latLngBounds } from 'leaflet';
import { NumberLiteralType, unescapeLeadingUnderscores } from 'typescript';
import { TransitPositionData } from './transitdata';

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
    vehiclePositions?: TransitPositionData;
};

const TransitMap: React.FC<TransitMapProps> = (props: TransitMapProps): React.JSX.Element => {
    const markers: React.JSX.Element[] = [];
    if(props.vehiclePositions !== undefined) {
        for(const vehicle of props.vehiclePositions.vehicles) {
            markers.push(<Marker position={[vehicle.position.latitude, vehicle.position.longitude]} key={vehicle.id}><Tooltip>{vehicle.id}</Tooltip></Marker>)
        }
    }
    return (
        <MapContainer bounds={latLngBounds([latLng(props.startBounds.y1, props.startBounds.x1), latLng(props.startBounds.y2, props.startBounds.x2)])}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapBoundController onBoundsChange={props.onBoundsChange}></MapBoundController>
            {markers}
        </MapContainer>
    );
}

const MapBoundController: React.FC<MapBoundControllerProps> = (props: MapBoundControllerProps) => {
    const map = useMap();
    useEffect(() => {
        if (props.onBoundsChange) {
            const bounds: LatLngBounds = map.getBounds();
            const y1 = bounds.getSouthWest().lat;
            const x1 = bounds.getSouthWest().lng; 
            const y2 = bounds.getNorthEast().lat;
            const x2 = bounds.getNorthEast().lng; 
            props.onBoundsChange({ y1: y1, x1: x1, y2: y2, x2: x2 })
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