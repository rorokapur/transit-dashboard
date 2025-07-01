import React, {ReactHTMLElement, useState} from 'react';
import './App.css';
import ArrivalDisplay from './ArrivalDisplay';
import TransitMap, { MapBounds } from './TransitMap';

interface AppProps {
};
interface AppState {
  mapBounds: MapBounds;
};

const initialMapBounds = {
  y1: 47.668421,
  x1: -122.313108,
  y2: 47.64208,
  x2: -122.291436
}

const App: React.FC<AppProps> = (props: AppProps): React.JSX.Element => {
  const [state, setState] = useState<AppState>({
    mapBounds: initialMapBounds
  });

  const onMapBoundsChange = (bounds: MapBounds) => {
    setState({mapBounds: bounds});
  }



  return (
    <div className='App'>
      <ArrivalDisplay arrivalData={[{ routeId: "63", timeToArrival: 1, name: "Sand Point - East Green Lake" }, { routeId: "62", timeToArrival: 0, name: "Sand Point - East Green Lake" }, { routeId: "62", timeToArrival: 1, name: "Sand Point - East Green Lake" }]}></ArrivalDisplay>
      <TransitMap startBounds={initialMapBounds} onBoundsChange={onMapBoundsChange}></TransitMap>
    </div>
  );
}

export default App;
