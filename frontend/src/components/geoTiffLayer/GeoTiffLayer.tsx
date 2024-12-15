import { useEffect } from "react";
import { useMap } from "react-leaflet";

import L from "leaflet";
import "leaflet-geotiff-2";
import "leaflet-geotiff-2/dist/leaflet-geotiff-vector-arrows";


import Renderer from "./Renderer";
import { useUnitStore } from "@store/useUnitsStore";
import "./GeoTiffLayer.css";

export default function GeoTiffLayer({ url, renderer, name, level }: {url: string, renderer: "arrows" | "rgb", name: mapDataTypes | "", level: number | null}) {
  const map = useMap();
  const units = useUnitStore();
  const activeUnit = name ? units[name] : null;

  useEffect(() => {
    const geoTiffLayer = new L.LeafletGeotiff(url, {
      renderer: renderer === "arrows"
        ? L.LeafletGeotiff.vectorArrows({ arrowSize: 20, })
        : new Renderer({
          chromaScale: activeUnit ? activeUnit.scale.colorScale : null
        }),
      onError: (er:any) => { console.log(`Geotiff layer error: ${er}`) }, 
    });
    // Add the layer to the map
    geoTiffLayer.addTo(map);
    // Cleanup
    return () => {
      if (map.hasLayer(geoTiffLayer)) {
        map.removeLayer(geoTiffLayer);
      }
    };
  }, [map, url, renderer, activeUnit]);
  // legend
  if (renderer === "rgb" && activeUnit) return (
    <div className="map-legend">
      {activeUnit.scale.colors.map((color, i) => (
        <div style={{backgroundColor: color}} key={i}>
          <i>
            {activeUnit.scale.levels[i]}
          </i>
        </div>
      ))}
      { name !== "" &&
        <div className="desc">
          {units.names.get(name)} ({level ? level : "sol"}) <br />
          {activeUnit.selected}
        </div>
      }
    </div>
  )
  return null;
};