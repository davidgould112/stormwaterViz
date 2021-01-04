import React from 'react';
import ShapeGrid from './ShapeGrid'
import '../styles/Map.css';
import { LeafletEvent, LatLngTuple } from 'leaflet';
import { Map, TileLayer } from 'react-leaflet'
import SelectedGridCell from '../types/GridCell'


interface MapProps {
  selectedGridCell: SelectedGridCell;
  center: LatLngTuple
  zoom: number;
  zoomControl: boolean;
  clickHandler: (e: LeafletEvent, feature: any, mapZoom: number) => void;
}

const LeafletMap: React.FC<MapProps> = ({ selectedGridCell, 
                                          center,
                                          zoom, 
                                          zoomControl, 
                                          clickHandler }) => {

  return (
    <Map 
      id="map-container" 
      center={center}
      zoom={zoom} 
      zoomControl={zoomControl} 
    >
      <TileLayer
        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}"
      >
      </TileLayer>
      <ShapeGrid clickHandler={clickHandler} selectedGridCell={selectedGridCell}/>
    </Map>
  );
    
}

export default LeafletMap;