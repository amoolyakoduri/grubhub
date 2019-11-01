import React from 'react';
import './App.css';
import Main from './../src/components/Main';
import { createStore } from 'redux'
import { Provider } from 'react-redux';
import app from './reducers/index';

const initialState = {"isLoggedIn":false,"emailId":null,"firstName":null, restDetails: {}, app: {}};

const store = createStore(app,initialState, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

function App() {

  return (
    <Provider store={store}>
      <Main/>
      </Provider>
  );
}

export default App;
