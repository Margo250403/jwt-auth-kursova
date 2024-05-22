import React, { createContext } from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Store from './store/store';

interface IState {
  store: Store;
}

export const store = new Store();
export const Context = createContext<IState>({ store });

const rootElement = document.getElementById('root');

if (rootElement) {
  ReactDOM.render(
    <React.StrictMode>
      <Context.Provider value={{ store }}>
        <App />
      </Context.Provider>
    </React.StrictMode>,
    rootElement
  );
}
