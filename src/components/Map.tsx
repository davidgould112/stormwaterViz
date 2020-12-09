import React from 'react';
import Grid from './Grid'
import '../styles/Map.css';
import { LatLngTuple, LocationEvent } from 'leaflet';
import { Map, TileLayer } from 'react-leaflet'

const defaultLatLng: LatLngTuple = [45.599870, -119.536093];
const zoom: number = 5;

interface MapProps {
  clickHandler: (e: LocationEvent, feature: any) => void;
  selectedGridCell: LatLngTuple;
  mapRendered: boolean;
}

const LeafletMap: React.FC<MapProps> = ({ clickHandler, selectedGridCell, mapRendered}) => {


      return (
        <Map id="map-container"
        center={defaultLatLng}
        zoom={zoom}
        >
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}"
          >
          </TileLayer>
          <Grid selectedGridCell={selectedGridCell} clickHandler={clickHandler} mapRendered={mapRendered}/>
        </Map>
      );
    
  }
  
  


export default LeafletMap;