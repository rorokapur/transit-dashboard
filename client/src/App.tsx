import React, {useRef, useCallback, useEffect, useState} from 'react';
import './App.css';
import ArrivalDisplay from './ArrivalDisplay';
import TransitMap, { MapBounds } from './TransitMap';
import { isRecord } from './record';
import {isTransitRoutePathJson, isTransitStopJson, isTransitVehicle, TransitPositionData, TransitRoutePath, TransitStop, TransitVehicle } from './transitdata'

interface AppProps {
};
interface AppState {
  mapBounds: MapBounds;
  dataArea: MapBounds;
  vehiclePositions?: TransitPositionData;
  stopLocations?: TransitStop[]; 
  routePaths?: TransitRoutePath[];
  vehicleInterval?: ReturnType<typeof setInterval>;
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
    dataArea: initialMapBounds
  });
  const vehiclePollTimerRef = useRef<NodeJS.Timeout | null>(null);

  const doVehiclePositionsJson = useCallback((data: unknown) => {
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
      setState(state => ({ ...state, vehiclePositions: { timestamp: whyIsntThisANumber, vehicles: vehicles }, mapBounds: state.mapBounds }));
    }
  },[]);

  const doVehiclePositionsResp = useCallback((res: Response) => {
    if (res.status === 200) {
      res.json().then(doVehiclePositionsJson)
        .catch(() => doVehiclePositionsError("response is not valid json!"));
    } else if (res.status === 400) {
      res.text().then(doVehiclePositionsError)
        .catch(() => doVehiclePositionsError("400 error response is not text!"));
    } else {
      doVehiclePositionsError(`error code ${res.status}`);
    }
  }, [doVehiclePositionsJson])

  const getVehiclePositions = useCallback((bounds: MapBounds) => {
    const url = "/api/vehicles" +
      "?y1=" + encodeURIComponent(bounds.y1.toFixed(6)) +
      "&x1=" + encodeURIComponent(bounds.x1.toFixed(6)) +
      "&y2=" + encodeURIComponent(bounds.y2.toFixed(6)) +
      "&x2=" + encodeURIComponent(bounds.x2.toFixed(6));
    fetch(url).then(doVehiclePositionsResp)
      .catch(() => doVehiclePositionsError("could not connect to server!"))
  },[doVehiclePositionsResp]);


  const doVehiclePositionsError = (text: string) => {
    alert("Error fetching /api/vehicles: " + text);
  }

  const doStopLocationsJson = useCallback((data: unknown) => {
    if (!Array.isArray(data)) {
      doStopLocationsError(`stop data is not an array!`);
    } else {
      const stops: TransitStop[] = [];
      for (const stop of data) {
        if (isTransitStopJson(stop)) {
          stops.push({ id: stop.id, code: stop.code, name: stop.name, position: { latitude: stop.lat, longitude: stop.lon } })
        }
      }
      setState(state => ({ ...state, stopLocations: stops }));
    }
  }, []);

  const doStopLocationsResp = useCallback((res: Response) => {
    if (res.status === 200) {
      res.json().then(doStopLocationsJson)
        .catch(() => doStopLocationsError("response is not valid json!"));
    } else if (res.status === 400) {
      res.text().then(doStopLocationsError)
        .catch(() => doStopLocationsError("400 error response is not text!"));
    } else {
      doStopLocationsError(`error code ${res.status}`);
    }
  }, [doStopLocationsJson]);

  const getStopLocations = useCallback((bounds: MapBounds) => {
    const url = "/api/stops" +
      "?y1=" + encodeURIComponent(bounds.y1.toFixed(6)) +
      "&x1=" + encodeURIComponent(bounds.x1.toFixed(6)) +
      "&y2=" + encodeURIComponent(bounds.y2.toFixed(6)) +
      "&x2=" + encodeURIComponent(bounds.x2.toFixed(6));
    fetch(url).then(doStopLocationsResp)
      .catch(() => doStopLocationsError("could not connect to server!"))
  }, [doStopLocationsResp]);


  const doStopLocationsError = (text: string) => {
    alert("Error fetching /api/stops: " + text);
  }

  const doRoutePathsJson = useCallback((data: unknown) => {
    if (!Array.isArray(data)) {
      doRoutePathsError(`route path data is not an array!`);
    } else {
      const routes: TransitRoutePath[] = [];
      for (const route of data) {
        if (isTransitRoutePathJson(route))
          routes.push(route);
      }
      console.log(routes)
      setState(state => ({ ...state, routePaths: routes }));
    }
  }, []);

  const doRoutePathsResp = useCallback((res: Response) => {
    if (res.status === 200) {
      res.json().then(doRoutePathsJson)
        .catch(() => doRoutePathsError("response is not valid json!"));
    } else if (res.status === 400) {
      res.text().then(doRoutePathsError)
        .catch(() => doRoutePathsError("400 error response is not text!"));
    } else {
      doRoutePathsError(`error code ${res.status}`);
    }
  }, [doRoutePathsJson]);

  const getRoutePaths = useCallback((bounds: MapBounds) => {
    const url = "/api/paths" +
      "?y1=" + encodeURIComponent(bounds.y1.toFixed(6)) +
      "&x1=" + encodeURIComponent(bounds.x1.toFixed(6)) +
      "&y2=" + encodeURIComponent(bounds.y2.toFixed(6)) +
      "&x2=" + encodeURIComponent(bounds.x2.toFixed(6));
    fetch(url).then(doRoutePathsResp)
      .catch(() => doRoutePathsError("could not connect to server!"))
  }, [doRoutePathsResp]);



  const doRoutePathsError = (text: string) => {
    alert("Error fetching /api/stops: " + text);
  }

  const onMapBoundsChange = useCallback((bounds: MapBounds, zoom: number) => {
    setState(prevState => {
      if (!(bounds.y1 <= prevState.dataArea.y1 && bounds.x1 >= prevState.dataArea.x1 && bounds.y2 >= prevState.dataArea.y2 && bounds.x2 <= prevState.dataArea.x2)) {
        if (vehiclePollTimerRef.current) {
          clearTimeout(vehiclePollTimerRef.current);
        }
        getVehiclePositions(bounds);
        getRoutePaths(bounds);
        getStopLocations(bounds);
        return { ...prevState, dataArea: bounds, mapBounds: bounds };
      } else {
        return { ...prevState, mapBounds: bounds };
      }
    });

  }, [getVehiclePositions, getRoutePaths, getStopLocations]);

  useEffect(() => {
    const scheduleNextFetch = () => {
      const timestamp = state.vehiclePositions?.timestamp;
      const delay = timestamp
        ? Math.max(0, (timestamp + 35000) - (Date.now()/1000))
        : 15000;
      vehiclePollTimerRef.current = setTimeout(() => {
        getVehiclePositions(state.mapBounds);
        setState((state) => ({...state, dataArea: state.mapBounds}));
      }, delay);
    };

    scheduleNextFetch();
    
    return () => {
      if (vehiclePollTimerRef.current) {
        clearTimeout(vehiclePollTimerRef.current);
      }
    };
  }, [state.vehiclePositions, state.mapBounds, getVehiclePositions]);

  return (
    <div className='App'>
      <ArrivalDisplay arrivalData={[{ routeId: "63", timeToArrival: 1, name: "Sand Point - East Green Lake" }, { routeId: "62", timeToArrival: 0, name: "Sand Point - East Green Lake" }, { routeId: "62", timeToArrival: 1, name: "Sand Point - East Green Lake" }]}></ArrivalDisplay>
      <TransitMap startBounds={initialMapBounds} onBoundsChange={onMapBoundsChange} vehiclePositions={state.vehiclePositions} stopLocations={state.stopLocations} routePaths={state.routePaths}></TransitMap>
    </div>
  );
}
export default App;
