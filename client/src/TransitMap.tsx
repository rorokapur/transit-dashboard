import React, { ComponentProps, ReactHTMLElement, useState, useEffect } from 'react';
import { MapContainer, TileLayer, useMap, Marker, Circle, Popup, useMapEvents, Tooltip } from 'react-leaflet';
import L, { latLng, LatLngBounds, latLngBounds } from 'leaflet';
import { NumberLiteralType, unescapeLeadingUnderscores } from 'typescript';
import { TransitPositionData, TransitStop } from './transitdata';
import { render } from '@testing-library/react';
import { busIcon } from './markers';

export interface MapBounds {
    x1: number;
    y1: number;
    x2: number;
    y2: number;

}

export interface MapBoundControllerProps {
    onBoundsChange?: (bounds: MapBounds, zoom: number) => void;
}

export interface TransitMapProps {
    startBounds: MapBounds;
    onBoundsChange?: (bounds: MapBounds, zoom: number) => void;
    vehiclePositions?: TransitPositionData;
    stopLocations?: TransitStop[];
};

interface TransitMapState {
    vehicles: Set<React.JSX.Element>;
    stops: Set<React.JSX.Element>;
    lastVehiclePositionUpdate: number;
}

const TransitMap: React.FC<TransitMapProps> = (props: TransitMapProps): React.JSX.Element => {
    const [state, setState] = useState<TransitMapState>({
        vehicles: new Set<React.JSX.Element>(),
        stops: new Set<React.JSX.Element>(),
        lastVehiclePositionUpdate: 0
    
    });

    useEffect(() => {
        if (props.vehiclePositions !== undefined) {
            const markers = new Set<React.JSX.Element>();
            for (const vehicle of props.vehiclePositions.vehicles) {
                markers.add(<Marker position={[vehicle.position.latitude, vehicle.position.longitude]} key={vehicle.id} icon={busIcon}><Tooltip>{vehicle.id}</Tooltip></Marker>)
            }
            setState(state => ({...state, vehicles: markers}));
        }
        
    }, [props.vehiclePositions])

    useEffect(() => {
        if (props.stopLocations !== undefined) {
            const markers = new Set<React.JSX.Element>();
            for (const stop of props.stopLocations) {
                //markers.add(<Marker position={[stop.position.latitude, stop.position.longitude]} key={stop.id}><Tooltip>{stop.name}</Tooltip></Marker>)
                markers.add(<Circle center={[stop.position.latitude, stop.position.longitude]} radius={3} color="black" fillColor='white' fillOpacity={1} weight={4}><Tooltip>{stop.name}</Tooltip></Circle>);
            }
            setState(state => ({ ...state, stops: markers}));
        }

    }, [props.stopLocations])
    
    return (
        <MapContainer bounds={latLngBounds([latLng(props.startBounds.y1, props.startBounds.x1), latLng(props.startBounds.y2, props.startBounds.x2)])}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapBoundController onBoundsChange={props.onBoundsChange}></MapBoundController>
            {state.stops}
            {state.vehicles}
        </MapContainer>
    );
}


const MapBoundController: React.FC<MapBoundControllerProps> = (props: MapBoundControllerProps) => {
    const map = useMap();
    const updateBounds = () => {
        if (props.onBoundsChange) {
            const bounds: LatLngBounds = map.getBounds();
            props.onBoundsChange({ y1: bounds.getNorth(), x1: bounds.getWest(), y2: bounds.getSouth(), x2: bounds.getEast() }, map.getZoom())

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