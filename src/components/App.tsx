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
  
  mapClick(e: LocationEvent, feature: any): void {
    this.setState({selectedGridCell: [feature.geometry.coordinates[0][0][1],feature.geometry.coordinates[0][0][0]], mapRendered: false}, () => {console.log("selectedGridCell:  ", this.state.selectedGridCell)});
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
