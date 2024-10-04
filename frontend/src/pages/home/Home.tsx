import React from "react";

import "./Home.css"
import { Forecast, Settings } from "../../containers/index.ts";

export default function Home() {
    return (
        <div className="home">
            <Settings />
            <Forecast />
        </div>
    )
}