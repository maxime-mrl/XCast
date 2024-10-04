import React, { createContext, useState } from "react";

const Datactx = createContext({});

export function DataProvider({ children }) {
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isForecastOpen, setIsForecastOpen] = useState(false);

    return (
        <Datactx.Provider value={{
            settings: [ isSettingsOpen, setIsSettingsOpen ],
            forecast: [ isForecastOpen, setIsForecastOpen ],
        }}>
            {children}
        </Datactx.Provider>
    )
}

export default Datactx;
