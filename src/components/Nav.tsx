import React from 'react';
import '../styles/Nav.css';
import { LatLngTuple } from 'leaflet';
import NavMapBtn from './NavMapBtn'

interface Props {
  selectedGridCell: LatLngTuple;
  mapRendered: boolean;
  navBtnClick: (event: any) => void;
};

const Nav: React.FC<Props> = ({ selectedGridCell, mapRendered, navBtnClick }) => { 
  return (
    <div id="nav-container">
      <div id="nav-text">
        <div id="nav-title">
          Projected Changes in Extreme Precipitation
        </div>
        { mapRendered ? 
          (<div id="nav-subtitle">Click a grid cell to see extreme precipitation projection</div>)
        :
          (<div id="nav-subtitle">Selected Grid Cell: LAT {Number(selectedGridCell[0].toFixed(3))} LONG {Number(selectedGridCell[1].toFixed(3))}</div>)
        }
      </div>
      { mapRendered ? 
        (<div id="nav-"></div>)
      :
        (<NavMapBtn selectedGridCell={selectedGridCell} mapRendered={mapRendered} clickHandler={navBtnClick}/>)
      }
     
    </div>
  );
}

export default Nav;
