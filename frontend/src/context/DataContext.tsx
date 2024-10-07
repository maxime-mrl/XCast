import React, { createContext, useState } from "react";

const Datactx = createContext({});

export function DataProvider({ children }) {
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [position, setPosition] = useState(false);

    return (
        <Datactx.Provider value={{
            settings: [ isSettingsOpen, setIsSettingsOpen ],
            forecast: [ position, setPosition ],
        }}>
            {children}
        </Datactx.Provider>
    )
}

export default Datactx;
