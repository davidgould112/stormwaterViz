// @ts-nocheck
import React from 'react';
import { useLeaflet } from 'react-leaflet';
import L, { LatLngTuple, LocationEvent } from 'leaflet';
import squareGrid from '@turf/square-grid';


interface GridProps {
  gridCell: LatLngTuple
  clickHandler?: (e: LocationEvent, feature: any) => void;
  mapRendered: boolean;
}

const Grid: React.FC<GridProps> = ({ gridCell, clickHandler, mapRendered }) => {

  let lContext = useLeaflet();

  const bbox = [-124.491758, 41.990800, -117.031483, 48.997039];
  const cellSide = 12;
  const options = {units: 'kilometers'};
  let sqGrid = squareGrid(bbox, cellSide, options);

  const style = {
    color: 'rgb(199, 169, 62, .2)',
  }

  const styleSelected = {
    color: 'rgb(199, 169, 62)',
  }

  function onEachFeature(feature: any, layer: any) {
 
    if (mapRendered) {
      layer.on('click', function(ev) {
        console.log("E and F: ", ev, feature)
        clickHandler(ev, feature);
      });
      layer.on('mouseover', function () {
        this.setStyle(styleSelected);
      });
      layer.on('mouseout', function () {
        this.setStyle(style);
      });
    };
  }

  L.geoJSON(sqGrid, {
    style: function(feature) {
      return (feature.geometry.coordinates[0][0][0] === gridCell[1] && feature.geometry.coordinates[0][0][1] === gridCell[0] ) ? styleSelected : style
    },
    onEachFeature: onEachFeature
  }).addTo(lContext.map)
        
  return (
    <div></div>
  )
}

export default Grid;


    

// createLeafletElement(props: Props): LeafletElement {
//   return new LeafletGridLayer(this.getOptions(props))
// }

// updateLeafletElement(fromProps: Props, toProps: Props) {
//   const { opacity, zIndex } = toProps
//   if (opacity !== fromProps.opacity) {
//     this.leafletElement.setOpacity(opacity)
//   }
//   if (zIndex !== fromProps.zIndex) {
//     this.leafletElement.setZIndex(zIndex)
//   }
// }

// getOptions(props: Props): Props {
//   const options = { ...super.getOptions(props) }
//   const { map } = props.leaflet
//   if (map != null) {
//     // $FlowFixMe: Object spread
//     if (options.maxZoom == null && map.options.maxZoom != null) {
//       // $FlowFixMe: Object spread
//       options.maxZoom = map.options.maxZoom
//     }
//     // $FlowFixMe: Object spread
//     if (options.minZoom == null && map.options.minZoom != null) {
//       // $FlowFixMe: Object spread
//       options.minZoom = map.options.minZoom
//     }
//   }
//   return options
// }