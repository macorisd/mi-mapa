import React from "react";
import { createRoot } from "react-dom/client";

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import "leaflet/dist/leaflet.css";
import App from "./pages/app/App";

import { BrowserRouter as Router } from "react-router-dom";
import { APIProvider } from "./context/APIContext";
import { DataProvider } from "./context/DataContext";
import { AuthProvider } from "./context/AuthContext";

const container = document.getElementById('root');
const root = createRoot(container); // Crear el root para React 18

root.render(
  <Router>
    <APIProvider>
      <AuthProvider>
        <DataProvider>
          <App />
        </DataProvider>
      </AuthProvider>
    </APIProvider>
  </Router>
);
