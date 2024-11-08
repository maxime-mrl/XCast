import { act, useEffect } from "react";
import { useMap } from "react-leaflet";

import L from "leaflet";
import "leaflet-geotiff-2";
import "leaflet-geotiff-2/dist/leaflet-geotiff-vector-arrows";
import chroma from "chroma-js";

import Renderer from "./Renderer";

import "./GeoTiffLayer.css";
import { useUnitStore } from "@store/useUnitsStore";
import { windUnits } from "./units";

export default function GeoTiffLayer({ url, renderer, name }: {url: string, renderer: "arrows" | "rgb", name: mapDataTypes | null}) {
  const units = useUnitStore();
  const activeUnit = name ? units[name] : null;

  const map = useMap();
  useEffect(() => {
    let isError = false;
    const geoTiffLayer = new L.LeafletGeotiff(url, {
      renderer: renderer === "arrows" ?
        L.LeafletGeotiff.vectorArrows({ arrowSize: 20, }) :
        new Renderer({
          chromaScale: activeUnit ? chroma.scale(activeUnit.scale.colors).domain(activeUnit.scale.levels) : null
        }),
      onError: (er:any) => {
        isError = true;
        console.log(`error: ${er}`)
      }, 
    });
    // Add the layer to the map
    if (!isError) geoTiffLayer.addTo(map);
    // Cleanup
    return () => { map.removeLayer(geoTiffLayer) };
  }, [map, url, renderer, activeUnit]);

  if (renderer === "rgb" && activeUnit) return (
    <div className="map-legend">
      {activeUnit.scale.colors.map((color, i) => (
        <div style={{backgroundColor: color}} key={i}>
          <i>
            {activeUnit.scale.levels[i]}
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