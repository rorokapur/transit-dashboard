import React, {ReactHTMLElement, useState} from 'react';
import logo from './logo.svg';
import './App.css';

interface AppProps {

};
interface AppState {

};

const App: React.FC = (props: AppProps): React.JSX.Element => {
  const [state, setState] = useState<AppState>();
  return (
    <div>
      <p>Hello World!</p>
    </div>
  );
}

export default App;
