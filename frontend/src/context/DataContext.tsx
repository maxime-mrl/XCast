import { LatLng } from "leaflet";
import React, { createContext, ReactNode, useContext, useState } from "react";

type DataContext = {
    settings: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
    forecast: [false | LatLng, React.Dispatch<React.SetStateAction<false|LatLng>>];
};

const Datactx = createContext<DataContext | undefined>(undefined);

export function DataProvider({ children }: { children:ReactNode }) {
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [position, setPosition] = useState(false) as DataContext["forecast"];

    return (
        <Datactx.Provider value={{
            settings: [ isSettingsOpen, setIsSettingsOpen ],
            forecast: [ position, setPosition ],
        }}>
            {children}
        </Datactx.Provider>
    )
}

// Custom hook for easier context usage
export function useDataContext() {
    const context = useContext(Datactx);
    if (!context) throw new Error("useDataContext must be used within a DataProvider");
    return context;
};

export default Datactx;
