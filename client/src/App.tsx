import React, {ReactHTMLElement, useState} from 'react';
import logo from './logo.svg';
import './App.css';
import ArrivalDisplay from './ArrivalDisplay';

interface AppProps {

};
interface AppState {

};

const App: React.FC = (props: AppProps): React.JSX.Element => {
  const [state, setState] = useState<AppState>();
  return (
    <div>
      <p>Hello World!</p>
      <ArrivalDisplay></ArrivalDisplay>
    </div>
  );
}

export default App;
