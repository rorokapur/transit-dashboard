import React, {ReactHTMLElement, useState} from 'react';
import './App.css';
import ArrivalDisplay from './ArrivalDisplay';

interface AppProps {

};
interface AppState {

};

const App: React.FC = (props: AppProps): React.JSX.Element => {
  const [state, setState] = useState<AppState>();
  return (
    <div className='App'>
      <ArrivalDisplay arrivalData={[{ routeId: "63", timeToArrival: 1, name: "Sand Point - East Green Lake" }, { routeId: "62", timeToArrival: 0, name: "Sand Point - East Green Lake" }, { routeId: "62", timeToArrival: 1, name: "Sand Point - East Green Lake" }]}></ArrivalDisplay>
      <p>Hello World!</p>
    </div>
  );
}

export default App;
