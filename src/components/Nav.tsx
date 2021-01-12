import React from 'react';
import '../styles/Nav.css';
import { LeafletEvent } from 'leaflet';
import NavMapBtn from './NavMapBtn'
import GridCell from '../types/GridCell'

interface Props {
  renderMapView: boolean;
  selectedGridCell: GridCell;
  navBtnClick: (event: any) => void;
  navMapClick: (e: LeafletEvent, feature: any, mapZoom: number) => void;
};

const Nav: React.FC<Props> = ({ renderMapView, 
                                selectedGridCell, 
                                navBtnClick, 
                                navMapClick }) => { 

  return (
    <div id="nav-container">
      <div id="nav-logo"/>
      <div id="nav-text">
        <div id="nav-title">
          Projected Changes in Extreme Precipitation
        </div>
        { renderMapView ? 
          (<div id="nav-subtitle-map">
            Click a grid cell to see extreme precipitation projection
          </div>)
        :
          (<div id="nav-subtitle-container">
            <div id="nav-subtitle-base">
              Selected Grid Cell:   
            </div>
            <div id="nav-subtitle-dynamic">
              LAT {Number(selectedGridCell.Center_Lat.toFixed(3))}, LONG {Number(selectedGridCell.Center_Lon.toFixed(3))}, Row-Col {selectedGridCell.row_index_ + "-" + selectedGridCell.column_ind}
            </div>
          </div>)
        }
      </div>
      { renderMapView ? 
        (<div id="nav-"></div>)
      :
        
        (<NavMapBtn 
          selectedGridCell={selectedGridCell} 
          buttonClickHandler={navBtnClick} 
          mapClickHandler={navMapClick}
        />)
      }
     
    </div>
  );
}

export default Nav;
