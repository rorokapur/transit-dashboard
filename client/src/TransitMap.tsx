import React, { ComponentProps, ReactHTMLElement, useState, useEffect } from 'react';
import { MapContainer, TileLayer, useMap, Marker, Popup, useMapEvents, Tooltip } from 'react-leaflet';
import L, { latLng, LatLngBounds, latLngBounds } from 'leaflet';
import { NumberLiteralType, unescapeLeadingUnderscores } from 'typescript';
import { TransitPositionData } from './transitdata';
import { render } from '@testing-library/react';

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

interface TransitMapState {
    vehicles: Set<React.JSX.Element>;
    lastVehiclePositionUpdate: number;
}

const TransitMap: React.FC<TransitMapProps> = (props: TransitMapProps): React.JSX.Element => {

    const [state, setState] = useState<TransitMapState>({
        vehicles: new Set<React.JSX.Element>(),
        lastVehiclePositionUpdate: 0
    
    });

    useEffect(() => {
        const markers = new Set<React.JSX.Element>();
        if (props.vehiclePositions !== undefined) {
            for (const vehicle of props.vehiclePositions.vehicles) {
                markers.add(<Marker position={[vehicle.position.latitude, vehicle.position.longitude]} key={vehicle.id}><Tooltip>{vehicle.id}</Tooltip></Marker>)
            }
        }
        setState({ vehicles: markers, lastVehiclePositionUpdate: 0 });
    }, [props.vehiclePositions])
    
    return (
        <MapContainer bounds={latLngBounds([latLng(props.startBounds.y1, props.startBounds.x1), latLng(props.startBounds.y2, props.startBounds.x2)])}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapBoundController onBoundsChange={props.onBoundsChange}></MapBoundController>
            {state.vehicles}
        </MapContainer>
    );
}


const MapBoundController: React.FC<MapBoundControllerProps> = (props: MapBoundControllerProps) => {
    const map = useMap();
    const updateBounds = () => {
        if (props.onBoundsChange) {
            const bounds: LatLngBounds = map.getBounds();
            console.log(bounds.getWest());
            props.onBoundsChange({ y1: bounds.getNorth(), x1: bounds.getWest(), y2: bounds.getSouth(), x2: bounds.getEast() })

        }
    }
    useEffect(() => {
        updateBounds();
    }, []);
    useMapEvents({
        moveend() {
            updateBounds();
        }
    })

    return null; // This component doesn't render anything visible
}
export default TransitMap;