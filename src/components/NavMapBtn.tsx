import '../styles/NavMapBtn.css';
import React from 'react';
import LeafletMap from './Map'
import { LeafletEvent } from 'leaflet';
import GridCell from '../types/GridCell'

interface MapBtnProps {
  selectedGridCell: GridCell;
  buttonClickHandler: (event: any) => void;
  mapClickHandler: (e: LeafletEvent, feature: any, mapZoom: number) => void;
}

const NavMapBtn: React.FC<MapBtnProps> = ({ selectedGridCell, buttonClickHandler, mapClickHandler }) => {

  return (
    <div id="nav-map">
      <div id="map-thumb">
        <LeafletMap 
          selectedGridCell={selectedGridCell}
          center={[selectedGridCell.Center_Lat + 0.23, selectedGridCell.Center_Lon]}
          zoom={8}
          clickHandler={mapClickHandler}
          zoomControl={true}
        />
        <div id="nav-map-text">Click to select new cell, Click and drag to pan</div>
      </div>
      <button id="nav-btn" onClick={buttonClickHandler}>Return to Map</button>
    </div>
  )
};

export default NavMapBtn;