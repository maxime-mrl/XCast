import { useEffect, useRef } from 'react'
import "leaflet/dist/leaflet.css"
import "leaflet/dist/leaflet.js"
import { MapContainer, Marker, TileLayer, useMapEvents } from 'react-leaflet'
import "leaflet-geotiff-2/src/leaflet-geotiff"

import './Map.css'
import { useDataContext } from '../../context/DataContext'
import L, { LatLng } from 'leaflet'

export default function Map() {
  const { forecast:[position]} = useDataContext();
  return (
        <MapContainer center={[35, -78]} zoom={7} scrollWheelZoom={true} zoomControl={false}>
            <TileLayer
                attribution='Tiles &copy; Esri &mdash; Source: Esri, Esri Japan, Esri China (Hong Kong), Esri (Thailand), DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, METI, TomTom'
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}"
            />


            <ClickHandler />
            
            {position && 
              <Marker position={position} icon={L.icon({
                iconUrl: "/images/marker.png", // Path to your custom marker icon
                iconSize: [38, 57], // Size of the icon
                iconAnchor: [19, 57], // Point where the icon should be anchored (left point or center)
              })}>
              </Marker>
            }
        </MapContainer>
  )
}


function ClickHandler() {
  const { forecast:[position, setPosition] } = useDataContext();
  const memoryPos = useRef(false as false | LatLng);
  const map = useMapEvents({});

  // listen for clicks
  map.addEventListener("click", e => setPosition(e.latlng));

  // update map sizing with or without forecast
  useEffect(() => {
    map.invalidateSize();
    if (!memoryPos.current && position) map.panTo(position);
    memoryPos.current = position;
  }, [position, map])

  return null;
}
