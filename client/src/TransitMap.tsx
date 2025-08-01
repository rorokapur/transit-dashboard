import React, { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, useMap, Marker, Circle, useMapEvents, Tooltip, Polyline } from 'react-leaflet';
import { latLng, LatLngBounds, latLngBounds } from 'leaflet';
import { routeIdToHexColor, TransitPositionData, TransitRoutePath, TransitStop } from './transitdata';
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
    routePaths?: TransitRoutePath[];
};

const TransitMap: React.FC<TransitMapProps> = (props: TransitMapProps): React.JSX.Element => {

    const vehicleMarkers = useMemo(() =>
        props.vehiclePositions
            ? props.vehiclePositions.vehicles.map(vehicle =>
                <Marker position={[vehicle.position.latitude, vehicle.position.longitude]} key={vehicle.id} icon={busIcon}>
                    <Tooltip>{vehicle.id}</Tooltip>
                </Marker>
            )
            : [],
        [props.vehiclePositions]
    );

    const stopMarkers = useMemo(() =>
        props.stopLocations
            ? props.stopLocations.map(stop =>
                <Circle center={[stop.position.latitude, stop.position.longitude]} radius={3} color="black" fillColor="white" fillOpacity={1} weight={4} key={stop.id}>
                    <Tooltip>{stop.name}</Tooltip>
                </Circle>
            )
            : [],
        [props.stopLocations]
    ); 
    
    const routePaths = useMemo(
        () =>
            props.routePaths
                ? props.routePaths.map(route =>
                    <Polyline
                        positions={route.points}
                        pathOptions={{ color: routeIdToHexColor(route.id), opacity: 1, weight: 5 , lineJoin: 'bevel' }}
                        key={route.id}
                    />
                )
                : [],
        [props.routePaths]
    );

    return (
        <MapContainer bounds={latLngBounds([latLng(props.startBounds.y1, props.startBounds.x1), latLng(props.startBounds.y2, props.startBounds.x2)])}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapBoundController onBoundsChange={props.onBoundsChange}></MapBoundController>
            {vehicleMarkers}
            {(stopMarkers.length < 50) ? stopMarkers : []}
            {routePaths}
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