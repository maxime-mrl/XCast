import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";

import { Home } from "@pages"

import "./App.css";
import { useEffect, useState } from "react";

export default function App() {
  const [ isMobile, setIsMobile ] = useState(true); // default to true (it's better to see mobile version on desktop than other way)
  useEffect(() => {
    console.log("ee")
    // handle resizing
    const handleResize = () => setIsMobile(window.innerWidth < 800)
    handleResize(); // Set initial size
    // listen for resize and orientationchange
    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);
    // cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
    };
  }, []);
  
  return (
    <div className={isMobile ? "mobile" : "desktop"}>
    <Router>
        <Routes>
          <Route path="/" element={ <Home /> } />
          <Route path="*" element={ <Navigate to="/" /> } />
        </Routes>
    </Router>
    </div>
  );
}

