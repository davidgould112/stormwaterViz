import React from 'react';
import '../styles/App.css';
import Nav from './Nav';
import LeafletMap from './Map';
import VizContainer from './VizContainer';
import { LatLngTuple, LocationEvent } from 'leaflet';


type AppState = {
  selectedGridCell : LatLngTuple;
  mapRendered: boolean;
}

class App extends React.Component<any, AppState> {

  public readonly state: Readonly<AppState> = {
    selectedGridCell: [0,0],
    mapRendered: true
  };

  componentDidMount () {
    const filePath = 'http://thredds.northwestknowledge.net:8080/thredds/catalog/CBI_MC2_VEGETATION_DATA/TEMP/CanESM2/catalog.html?dataset=CBI_MC2_VEGETATION_ALL_SCAN/TEMP/CanESM2/mc2_WithFireSuppression_VTYPE_CanESM2_r1i1p1_rcp45_2015_2099_CONUS_year.nc';
    fetch(`${filePath}`)
    .then(response => response.body)
    .then((body: any) => {
      const reader = body.getReader()
      console.log("reader :  ", reader)
    });
  }
  
  mapClick(e: LocationEvent, feature: any): void {
    this.setState({selectedGridCell: [feature.geometry.coordinates[0][0][1],feature.geometry.coordinates[0][0][0]], mapRendered: false}, () => {console.log("ya:  ", this.state.selectedGridCell)});
  }

  navBtnClick(event: any): void {
    this.setState({ mapRendered: true });
  }

  render () {
    return (
      <div className="App">
        <Nav navBtnClick={this.navBtnClick.bind(this)} mapRendered={this.state.mapRendered} selectedGridCell={this.state.selectedGridCell} ></Nav>
        { this.state.mapRendered ? 
          (<LeafletMap clickHandler={this.mapClick.bind(this)} mapRendered={this.state.mapRendered} selectedGridCell={this.state.selectedGridCell}/>)
        :
          (<VizContainer selectedGridCell={this.state.selectedGridCell} />)
        }
      </div>
    );
  };
};

export default App;
