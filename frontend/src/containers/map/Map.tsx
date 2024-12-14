import { useEffect, useRef, useState } from 'react'
import "leaflet/dist/leaflet.css"
import "leaflet/dist/leaflet.js"
import { MapContainer, Marker, TileLayer, useMapEvents } from 'react-leaflet'
import "leaflet-geotiff-2/src/leaflet-geotiff"

import './Map.css'
import L, { LatLng } from 'leaflet'
import { GeotiffLayer, TimeSelector } from '@components'
import { useForecastStore } from '@store/useForecastStore'

export default function Map() {
  const [baseUrl, setBaseUrl] = useState("");
  const [files, setFiles] = useState<string[]>([""]);
  const userSettings = useForecastStore.use.userSettings();
  const position = useForecastStore.use.position();
  const mapCapabilities = useForecastStore.use.forecastCapabilities();

  useEffect(() => {
    // check that zustand is well initialized
    const dataFiles = mapCapabilities?.data[userSettings.model ? userSettings.model : ""].dataset[userSettings.selected ? userSettings.selected : ""].names;
    if (!userSettings.time || !userSettings.model || !userSettings.selected || !dataFiles) return;
    // if wind dir put it at the end of the array
    const dirIndex = dataFiles.findIndex(file => /dir/.test(file));
    if (dirIndex !== -1) {
      dataFiles.push(dataFiles[dirIndex]);
      dataFiles.splice(dirIndex, 1);
    }
    // set state
    setBaseUrl(`${process.env.REACT_APP_API_URL}/map/${userSettings.model}/${userSettings.time.replace(":", "_")}/${userSettings.selected}`);
    setFiles(dataFiles)
  }, [userSettings.time, userSettings.model, userSettings.selected, mapCapabilities]);

  return (
    <div className="map">
      <MapContainer center={[-31, 148]} zoom={7} scrollWheelZoom={true} zoomControl={false}>
          <TileLayer
              attribution='Tiles &copy; Esri &mdash; Source: Esri, Esri Japan, Esri China (Hong Kong), Esri (Thailand), DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, METI, TomTom'
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}"
          />
          { baseUrl !== "" && files.length !== 0 && files.map(file => (
            <GeotiffLayer renderer={/dir/.test(file) ? "arrows" : "rgb"} url={`${baseUrl}/${file}-${userSettings.level}.tif`} name={userSettings.selected} level={userSettings.level} key={file} />
          ))
          
        }

          
          {position && 
            <Marker position={position} icon={L.icon({
              iconUrl: "/images/marker.png", // Path to your custom marker icon
              iconSize: [38, 57], // Size of the icon
              iconAnchor: [19, 57], // Point where the icon should be anchored (left point or center)
            })}>
            </Marker>
          }
        <ClickHandler />
      </MapContainer>
      <TimeSelector />  
    </div>
  )
}


function ClickHandler() {
  const position = useForecastStore.use.position();
  const setPosition = useForecastStore.use.setPosition();
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
