import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";

import { About, Home } from "@pages"

import "./App.css";
import { useAppStore, useWindowSizeInitializer } from "@store/useAppStore";

export default function App() {
  // initialize window size (and get the ismobile while here c:)
  useWindowSizeInitializer();
  const isMobile = useAppStore.use.isMobile();
  
  return (
    <div className={isMobile ? "mobile" : "desktop"}>
    <Router>
        <Routes>
          <Route path="/" element={ <Home /> } />
          <Route path="/about" element={ <About /> } />
          <Route path="*" element={ <Navigate to="/" /> } />
        </Routes>
    </Router>
    </div>
  );
}

