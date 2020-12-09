import React from 'react';
import Grid from './Grid';
import '../styles/NavMapBtn.css';
import { Map, TileLayer } from 'react-leaflet';
import { LatLngTuple } from 'leaflet';

interface MapBtnProps {
  selectedGridCell: LatLngTuple;
  clickHandler: (event: any) => void;
  mapRendered: boolean;
}

const NavMapBtn: React.FC<MapBtnProps> = ({ selectedGridCell, clickHandler, mapRendered }) => {
  return (
    <div id="nav-map-btn" onClick={clickHandler}>
      <Map id="map-thumb"
        center={selectedGridCell}
        zoom={8}
        zoomControl={false}
      >
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}"
        >
        </TileLayer>
        <Grid selectedGridCell={selectedGridCell} mapRendered={mapRendered}/>
      </Map>
      <button id="nav-btn">Choose a Different Cell</button>
    </div>
  )
};

export default NavMapBtn;