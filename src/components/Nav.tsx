import React from 'react';
import '../styles/Nav.css';
import { LatLngTuple } from 'leaflet';
import NavMapBtn from './NavMapBtn'

interface Props {
  gridCell: LatLngTuple;
  mapRendered: boolean;
  navBtnClick: (event: any) => void;
};

const Nav: React.FC<Props> = ({ gridCell, mapRendered, navBtnClick }) => { 
  return (
    <div id="nav-container">
      <div id="nav-text">
        <div id="nav-title">
          Projected Changes in Extreme Precipitation
        </div>
        { mapRendered ? 
          (<div id="nav-subtitle">Click a grid cell to see extreme precipitation projection</div>)
        :
          (<div id="nav-subtitle">Selected Grid Cell: LAT {Number(gridCell[0].toFixed(3))} LONG {Number(gridCell[1].toFixed(3))}</div>)
        }
      </div>
      { mapRendered ? 
        (<div id="nav-"></div>)
      :
        (<NavMapBtn gridCell={gridCell} mapRendered={mapRendered} clickHandler={navBtnClick}/>)
      }
     
    </div>
  );
}

export default Nav;
