import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Provider } from 'react-redux'
import store from './store'

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <React.StrictMode>
      <HelmetProvider>
      <Provider store={store}>
        <App />
      </Provider>
      </HelmetProvider>
    </React.StrictMode>
  </BrowserRouter>
);
