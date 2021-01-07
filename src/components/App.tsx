import React from 'react';
import '../styles/App.css';
import Nav from './Nav';
import LeafletMap from './Map';
import VizContainer from './VizContainer';
import { LeafletEvent, LatLngTuple } from 'leaflet';
import GridCell from '../types/GridCell'

type AppState = {
  selectedGridCell : GridCell
  renderMapView: boolean;
  center: LatLngTuple;
  zoom: number;
}

class App extends React.Component<any, AppState> {

  state: Readonly<AppState> = {
    renderMapView: true,
    selectedGridCell: {
      Center_Lat: 0,
      Center_Lon: 0,
      column_ind: 0,
      row_index_: 0
    },
    center: [45.3, -116.9],
    zoom: 5
  };
  
  mapClick(e: LeafletEvent, feature: any, mapZoom: number): void {
    if(this.state.renderMapView) {
      this.setState({
      renderMapView: false, 
      selectedGridCell: feature.properties, 
      center: [feature.properties.Center_Lat, feature.properties.Center_Lon],
      zoom: mapZoom || this.state.zoom
                  });
    } else {
      this.setState({selectedGridCell: feature.properties});
    }
  }

  navBtnClick(event: any): void {
    this.setState({ renderMapView: true });
  }

  render () {
    return (
      <div className="App">
        <Nav 
          renderMapView={this.state.renderMapView} 
          selectedGridCell={this.state.selectedGridCell}
          navBtnClick={this.navBtnClick.bind(this)} 
          navMapClick={this.mapClick.bind(this)} 
        />
        { this.state.renderMapView ? 
          (<LeafletMap
            selectedGridCell={this.state.selectedGridCell}
            center={this.state.center}
            zoom={this.state.zoom}
            zoomControl={true}
            clickHandler={this.mapClick.bind(this)}
            />)
            :
            (<VizContainer selectedGridCell={this.state.selectedGridCell} />)
          }
      </div>
    );
  };
};

export default App;
