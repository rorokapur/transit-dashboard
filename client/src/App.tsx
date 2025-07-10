import React, {ReactHTMLElement, useState} from 'react';
import './App.css';
import ArrivalDisplay from './ArrivalDisplay';
import TransitMap, { MapBounds } from './TransitMap';
import { isRecord } from './record';
import {isTransitStopJson, isTransitVehicle, TransitPositionData, TransitStop, TransitVehicle } from './transitdata'

interface AppProps {
};
interface AppState {
  mapBounds: MapBounds;
  vehiclePositions?: TransitPositionData;
  stopLocations?: TransitStop[]; 
};

const initialMapBounds = {
  y1: 47.668421,
  x1: -122.313108,
  y2: 47.64208,
  x2: -122.291436
}

const App: React.FC<AppProps> = (props: AppProps): React.JSX.Element => {
  const [state, setState] = useState<AppState>({
    mapBounds: initialMapBounds,

  });

  const onMapBoundsChange = (bounds: MapBounds, zoom: number) => {
    setState(state => ({...state, mapBounds: bounds}));
    getVehiclePositions(bounds);
    getStopLocations(bounds);
    
  }

  const getVehiclePositions = (bounds: MapBounds) => {
    const url = "/api/vehicles" +
      "?y1=" + encodeURIComponent(bounds.y1.toFixed(6)) +
      "&x1=" + encodeURIComponent(bounds.x1.toFixed(6)) +
      "&y2=" + encodeURIComponent(bounds.y2.toFixed(6)) +
      "&x2=" + encodeURIComponent(bounds.x2.toFixed(6));
    fetch(url).then(doVehiclePositionsResp)
      .catch(() => doVehiclePositionsError("could not connect to server!"))
  }

  const doVehiclePositionsResp = (res: Response) => {
    if (res.status === 200) {
      res.json().then(doVehiclePositionsJson)
        .catch(() => doVehiclePositionsError("response is not valid json!"));
    } else if (res.status === 400) {
      res.text().then(doVehiclePositionsError)
        .catch(() => doVehiclePositionsError("400 error response is not text!"));
    } else {
      doVehiclePositionsError(`error code ${res.status}`);
    }
  }

  const doVehiclePositionsJson = (data: unknown) => {
    if (!isRecord(data)) {
      doVehiclePositionsError(`data is not a record!`);
    } else if (typeof data.timestamp !== 'number') {
      doVehiclePositionsError(`bad type for timestamp: ${typeof data.timestamp}`);
    } else if (!Array.isArray(data.vehicles)) {
      doVehiclePositionsError(`vehicle data is not an array!`);
    } else {
      const vehicles: TransitVehicle[] = [];
      for (const vehicle of data.vehicles) {
        if (isTransitVehicle(vehicle))
          vehicles.push(vehicle)
      }
      const whyIsntThisANumber: number = data.timestamp;
      setState(state => ({...state, vehiclePositions: {timestamp: whyIsntThisANumber, vehicles: vehicles}, mapBounds: state.mapBounds}));
    }
  }

  const doVehiclePositionsError = (text: string) => {
    alert("Error fetching /api/vehicles: " + text);
  }

  const getStopLocations = (bounds: MapBounds) => {
    const url = "/api/stops" +
      "?y1=" + encodeURIComponent(bounds.y1.toFixed(6)) +
      "&x1=" + encodeURIComponent(bounds.x1.toFixed(6)) +
      "&y2=" + encodeURIComponent(bounds.y2.toFixed(6)) +
      "&x2=" + encodeURIComponent(bounds.x2.toFixed(6));
    fetch(url).then(doStopLocationsResp)
      .catch(() => doStopLocationsError("could not connect to server!"))
  }

  const doStopLocationsResp = (res: Response) => {
    if (res.status === 200) {
      res.json().then(doStopLocationsJson)
        .catch(() => doStopLocationsError("response is not valid json!"));
    } else if (res.status === 400) {
      res.text().then(doStopLocationsError)
        .catch(() => doStopLocationsError("400 error response is not text!"));
    } else {
      doStopLocationsError(`error code ${res.status}`);
    }
  }

  const doStopLocationsJson = (data: unknown) => {
    if (!Array.isArray(data)) {
      doStopLocationsError(`stop data is not an array!`);
    } else {
      const stops: TransitStop[] = [];
      for (const stop of data) {
        if (isTransitStopJson(stop))
          stops.push({id: stop.id, code: stop.code, name: stop.name, position: {latitude: stop.lat, longitude: stop.lon}})
      }
      setState(state => ({...state, stopLocations: stops}));
    }
  }

  const doStopLocationsError = (text: string) => {
    alert("Error fetching /api/stops: " + text);
  }


  return (
    <div className='App'>
      <ArrivalDisplay arrivalData={[{ routeId: "63", timeToArrival: 1, name: "Sand Point - East Green Lake" }, { routeId: "62", timeToArrival: 0, name: "Sand Point - East Green Lake" }, { routeId: "62", timeToArrival: 1, name: "Sand Point - East Green Lake" }]}></ArrivalDisplay>
      <TransitMap startBounds={initialMapBounds} onBoundsChange={onMapBoundsChange} vehiclePositions={state.vehiclePositions} stopLocations={state.stopLocations}></TransitMap>
    </div>
  );
}
export default App;
