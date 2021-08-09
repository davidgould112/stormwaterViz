import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import '../styles/App.css';
import Nav from './Nav';
import LeafletMap from './Map';
import Modal from './Modal'
import VizContainer from './VizContainer';
import ReturnArrow from './ReturnArrow';
import { LeafletEvent, LatLngTuple } from 'leaflet';
import GridCell from '../types/GridCell'
import { createBrowserHistory } from 'history';
let history = createBrowserHistory();

type AppState = {
  selectedGridCell: GridCell
  renderMapView: boolean;
  center: LatLngTuple;
  zoom: number;
  showModal: boolean;
}

class App extends React.Component<RouteComponentProps<any>, AppState> {
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

  componentDidMount() {
    let search, Center_Lat, Center_Lon, col_ind, row_ind;

    if (this.props.location.search) {
      search = new URLSearchParams(this.props.location.search);
      Center_Lat = Number(search.get("Center_Lat"));
      Center_Lon = Number(search.get("Center_Lon"));
      col_ind = Number(search.get("col_ind"));
      row_ind = Number(search.get("row_ind"));
    } else {
      search = new URLSearchParams();
    }
    
    if (Center_Lat && Center_Lon && col_ind && row_ind) {
      history.replace({ pathname: "/figure", search: search.toString() })
      this.setState({
        selectedGridCell: {
          Center_Lat: Center_Lat,
          Center_Lon: Center_Lon,
          column_ind: col_ind,
          row_index_: row_ind
        },
        center: [Center_Lat, Center_Lon],
        zoom: 8,
        renderMapView: false   
      })
    } 
  };

  mapClick(e: LeafletEvent, feature: any, mapZoom: number): void {
    let search = new URLSearchParams(this.props.location.search);

    if (search.toString().includes("Center_Lat")
      && search.toString().includes("Center_Lon")
      && search.toString().includes("col_ind")
      && search.toString().includes("row_ind")
    ) {
      search.set("Center_Lat", feature.properties.Center_Lat.toString());
      search.set("Center_Lon", feature.properties.Center_Lon.toString());
      search.set("col_ind", feature.properties.column_ind.toString());
      search.set("row_ind", feature.properties.row_index_.toString());
    } else {
      search.append("Center_Lat", feature.properties.Center_Lat.toString());
      search.append("Center_Lon", feature.properties.Center_Lon.toString());
      search.append("col_ind", feature.properties.column_ind.toString());
      search.append("row_ind", feature.properties.row_index_.toString());
    }
    history.replace({ pathname: "/figure", search: search.toString() });
    if (this.state.renderMapView) {
      this.setState({
        renderMapView: false,
        selectedGridCell: feature.properties,
        center: [feature.properties.Center_Lat, feature.properties.Center_Lon],
        zoom: mapZoom || this.state.zoom
      });
    } else {
      this.setState({
        selectedGridCell: feature.properties
      });
    }
  }

  navBtnClick(event: any): void {
    this.setState({ renderMapView: true });
    history.replace('/')
  }

  closeModal(): void {
    this.setState({ showModal: false })
  }

  render() {
    return (
      <div className="App">
        <Modal showModal={this.state.showModal} closeModal={this.closeModal.bind(this)} />
        <Nav
          renderMapView={this.state.renderMapView}
          selectedGridCell={this.state.selectedGridCell}
          navBtnClick={this.navBtnClick.bind(this)}
          navMapClick={this.mapClick.bind(this)}
        />
        {this.state.renderMapView ?
          
          (<LeafletMap
            selectedGridCell={this.state.selectedGridCell}
            center={this.state.center}
            zoom={this.state.zoom}
            zoomControl={true}
            clickHandler={this.mapClick.bind(this)}
          />)
          :
          (<VizContainer selectedGridCell={this.state.selectedGridCell} />  )
        }
        <div id="app-footer">
          <a id="link" href="https://cig.uw.edu/projects/heavy-precipitation-projections-for-use-in-stormwater-planning/">
            <div id="footer-text">
              Return to Project Page
            </div>
            <ReturnArrow />
          </a>
        </div>
      </div>
    );
  };
};

export default withRouter(App);
