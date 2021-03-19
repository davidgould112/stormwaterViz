import React from 'react';
import '../styles/App.css';
import Nav from './Nav';
import LeafletMap from './Map';
import Modal from './Modal'
import VizContainer from './VizContainer';
import ReturnArrow from './ReturnArrow';
import { LeafletEvent, LatLngTuple } from 'leaflet';
import GridCell from '../types/GridCell'


type AppState = {
  selectedGridCell : GridCell
  renderMapView: boolean;
  center: LatLngTuple;
  zoom: number;
  showModal: boolean;
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
    zoom: 5,
    showModal: true
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

  closeModal(): void {
    this.setState({ showModal: false })
  }

  render () {
    return (
      <div className="App">
        <Modal showModal={this.state.showModal} closeModal={this.closeModal.bind(this)}/>
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
          <div id="app-footer"> 
              <a id="link" href="https://cig.uw.edu/projects/heavy-precipitation-projections-for-use-in-stormwater-planning/">
                <div id="footer-text">
                  Return to Project Page 
                </div>
                <ReturnArrow/>
              </a>
          </div>
      </div>
    );
  };
};

export default App;
