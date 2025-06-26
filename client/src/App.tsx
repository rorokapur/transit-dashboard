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
    <div className='App'>
      <ArrivalDisplay></ArrivalDisplay>
      <p>Hello World!</p>
    </div>
  );
}

export default App;
