import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store/store.ts';
import App from './App.tsx';
// PWA
import * as serviceWorkerRegistration from './serviceWorkerRegistration.js';

const root = ReactDOM.createRoot(document.getElementById("root") || document.body);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);

serviceWorkerRegistration.unregister();
