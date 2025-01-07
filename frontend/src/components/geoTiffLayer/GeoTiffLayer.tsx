import { useEffect } from "react";
import { useMap } from "react-leaflet";

import L from "leaflet";
import "leaflet-geotiff-2";
import "leaflet-geotiff-2/dist/leaflet-geotiff-vector-arrows";


import Renderer from "@utils/geotiffRenderer";
import { useUnitStore } from "@store/useUnitsStore";
import "./GeoTiffLayer.css";

export default function GeoTiffLayer(
  { url, renderer, name, level }
  : {
    url: string,
    renderer: "arrows" | "rgb",
    name: mapDataTypes | "",
    level: number | null
}) {
  const map = useMap();
  const units = useUnitStore();
  const activeUnit = name ? units[name] : null;

  useEffect(() => {
    // create geotiff layer
    const geoTiffLayer = new L.LeafletGeotiff(url, {
      // arrows is for now default vectors arrow for leaflet geotiff
      // may change in the future to make something more stylish
      renderer: renderer === "arrows"
        ? L.LeafletGeotiff.vectorArrows({ arrowSize: 20, })
      // custom renderer for color scales
        : new Renderer({
          chromaScale: activeUnit ? activeUnit.scale.colorScale : null
        }),
      // listen for errors
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
            {activeUnit.units[activeUnit.selected](activeUnit.scale.levels[i])}
          </i>
        </div>
      ))}
      { name !== "" &&
        <i>
          {units.names.get(name)} ({level ? level + "m" : "sol"}) <br />
          {activeUnit.selected}
        </i>
      }
    </div>
  )
  return null;
};