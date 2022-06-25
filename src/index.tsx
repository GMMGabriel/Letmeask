import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

import './services/firebase';

import './styles/css/global.css';
import './styles/css/modal.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);