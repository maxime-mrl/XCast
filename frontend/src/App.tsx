import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { DataProvider } from "@context";

import { Home } from "@pages"

import "./App.css";

export default function App() {
  return (
    <DataProvider>
      <Router>
          <Routes>
            <Route path="/" element={ <Home /> } />
            <Route path="*" element={ <Navigate to="/" /> } />
          </Routes>
      </Router>
    </DataProvider>
  );
}

