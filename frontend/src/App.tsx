import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { DataProvider } from "./context/DataContext.tsx";

import { Home } from "./pages/index.ts";

import "./App.css";
import { Map } from "./containers/index.ts";

export default function App() {
  return (
    <DataProvider>
      <Router>
          <Routes>
            <Route path="/" element={ <Home /> } />
            <Route path="*" element={ <Navigate to="/" /> } />
          </Routes>
          <Map />
      </Router>
    </DataProvider>
  );
}

