// ts-nocheck
import { useEffect } from "react";
import { useMap } from "react-leaflet";

import L from "leaflet";

import "leaflet-geotiff-2";

import "leaflet-geotiff-2/dist/leaflet-geotiff-vector-arrows";

import "./GeoTiffLayer.css"
import Renderer from "./Renderer";
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
    </div>
  )
  return null;
};