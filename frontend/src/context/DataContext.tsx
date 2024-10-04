import React, { createContext } from "react";

const Datactx = createContext({});

export function DataProvider({ children }) {
    return (
        <Datactx.Provider value={{}}>
            {children}
        </Datactx.Provider>
    )
}

export default Datactx;
