import { useEffect } from "react";
import { useMap } from "react-leaflet";

import L from "leaflet";

import "leaflet-geotiff-2";

// import "leaflet-geotiff-2/dist/leaflet-geotiff-vector-arrows";
import "leaflet-geotiff-2/dist/leaflet-geotiff-plotty"; // requires plotty


export default function GeoTiffLayer({ url }: {url: string}) {
    const map = useMap();
    useEffect(() => {
      const geoTiffLayer = new L.LeafletGeotiff(url, {
        band: 0,
        renderer: L.LeafletGeotiff.plotty({
          displayMin: 0,
          displayMax: 255,
          colorScale: "rainbow",
        }),
      });
      // Add the layer to the map
      geoTiffLayer.addTo(map);
      // Cleanup
      return () => { map.removeLayer(geoTiffLayer) };
    }, [map, url]);
  
    return null; // No visual component to render
  };

// export default function GeoTiffLayer2({ url }) {
//   const map = useMap();

//   useEffect(() => {
//     const bounds = L.latLng([37, -78]).toBounds(200000)
//     const square = new L.Rectangle(bounds)
//     // const container = context.layerContainer || context.map
//     map.addLayer(square)
//     // container.addLayer(square)

//     return () => {
//       map.removeLayer(square)
//     }
//   })

//   return null
// }