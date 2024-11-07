// ts-nocheck
import { useEffect } from "react";
import { useMap } from "react-leaflet";

import L from "leaflet";
import "leaflet-geotiff-2";
import "leaflet-geotiff-2/dist/leaflet-geotiff-vector-arrows";

import Renderer from "./Renderer";
import { windUnits } from "./units";

import "./GeoTiffLayer.css";

export default function GeoTiffLayer({ url, renderer }: {url: string, renderer: "arrows" | "rgb"}) {
  const map = useMap();
  useEffect(() => {
    let isError = false;
    const geoTiffLayer = new L.LeafletGeotiff(url, {
      renderer: renderer === "arrows" ?
        L.LeafletGeotiff.vectorArrows({ arrowSize: 20, }) :
        new Renderer(),
      onError: (er:any) => {
        isError = true;
        console.log(`error: ${er}`)
      }, 
    });
    // Add the layer to the map
    if (!isError) geoTiffLayer.addTo(map);
    // Cleanup
    return () => { map.removeLayer(geoTiffLayer) };
  }, [map, url, renderer]);

  if (renderer === "rgb") return (
    <div className="map-legend">
      {windUnits.colorScale.colors.map((color, i) => (
        <div style={{backgroundColor: color}} key={i}>
          <i>
            {windUnits.colorScale.levels[i]}
          </i>
        </div>
      ))}
      <div className="desc">
        Vent (sol)
        m/s
      </div>
    </div>
  )
  return null;
};