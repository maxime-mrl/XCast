import { useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

import { useAppStore, useWindowSizeInitializer } from "@store/useAppStore";
import { useForecastStore } from "@store/useForecastStore";
import { useUserStore } from "@store/useUserStore";
import { registerSocket } from "@utils/socketClient";

import { About, Home } from "@pages";
import { Account, Login, Register } from "@containers";
import { Loader, Notifications } from "@components";


import "./App.css";

export default function App() {
  // initialize window size (and get the ismobile while here c:)
  useWindowSizeInitializer();
  const isMobile = useAppStore.use.isMobile();
  const user = useUserStore.use.user();
  const sync = useUserStore.use.sync();
  // initialize forecast capabilities
  const initForecastCapabilities = useForecastStore.use.getCapabilities();
  useEffect(() => {
    initForecastCapabilities();
  }, [initForecastCapabilities]);

  // initialize socket
  useEffect(() => {
    if (user && sync) {
      registerSocket(user);
    }
  }, [user, sync]);

  return (
    <div className={isMobile ? "mobile" : "desktop"}>
      <Loader />
      <Notifications />
      {!user ? (
        <>
          <Register />
          <Login />
        </>
      ) : (
        <Account />
      )}
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </div>
  );
}
