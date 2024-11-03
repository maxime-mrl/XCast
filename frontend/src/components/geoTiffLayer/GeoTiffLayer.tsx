import { useEffect } from "react";
import { useMap } from "react-leaflet";

import L from "leaflet";

import "leaflet-geotiff-2";

// import "leaflet-geotiff-2/dist/leaflet-geotiff-vector-arrows";
import "leaflet-geotiff-2/dist/leaflet-geotiff-plotty"; // requires plotty


export default function GeoTiffLayer({ url }: {url: string}) {
  const map = useMap();
  useEffect(() => {
    let isError = false;
    const geoTiffLayer = new L.LeafletGeotiff(url, {
      band: 0,
      renderer: L.LeafletGeotiff.plotty({
        displayMin: 0,
        displayMax: 255,
        colorScale: "rainbow",
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
  }, [map, url]);

  return null; // No visual component to render
};