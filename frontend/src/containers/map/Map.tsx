import React, { useContext } from 'react'
import "leaflet/dist/leaflet.css"
import "leaflet/dist/leaflet.js"
import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet'

import './Map.css'
import Datactx from '../../context/DataContext.tsx'

export default function Map() {
  return (
        <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={true} zoomControl={false}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <ClickHandler />
        </MapContainer>
  )
}


function ClickHandler() {
  const { forecast:[,setIsOpen] } = useContext(Datactx) as { forecast: [Boolean, (arg:any) => {}] };
  useMapEvents({
    click: (e) => {
      setIsOpen(e.latlng)
    }
  });

  return null;
}
