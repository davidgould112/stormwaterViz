//@ts-nocheck
import React from 'react';
import { useLeaflet } from 'react-leaflet';
import L, { LatLngTuple, LocationEvent } from 'leaflet';
import squareGrid from '@turf/square-grid';


const lonArr = [38.32287, 38.43284, 38.54284, 38.65286, 38.762905, 38.872967, 38.983044,
  39.093147, 39.203274, 39.31341, 39.423573, 39.533756, 39.643955, 39.75416,
  39.864403, 39.974648, 40.084927, 40.19521, 40.305508, 40.41582, 40.526157,
  40.636505, 40.746857, 40.857227, 40.967613, 41.078014, 41.188423, 41.29885,
  41.40929, 41.51974, 41.630203, 41.740677, 41.851154, 41.961643, 42.072144,
  42.18266, 42.29318, 42.403706, 42.51424, 42.624783, 42.735332, 42.845882,
  42.95645, 43.06702, 43.17759, 43.28817, 43.398754, 43.509335, 43.61993,
  43.73053, 43.841125, 43.95172, 44.06232, 44.172924, 44.28353, 44.39414,
  44.504745, 44.61535, 44.725956, 44.836563, 44.94716, 45.057762, 45.16836,
  45.278965, 45.38955, 45.50014, 45.61072, 45.721302, 45.831886, 45.942455,
  46.053024, 46.163578, 46.27413, 46.384674, 46.495213, 46.605743, 46.716263,
  46.826775, 46.937283, 47.047775, 47.158253, 47.268723, 47.379196, 47.489635,
  47.600075, 47.710495, 47.820915, 47.931316, 48.0417, 48.15207, 48.26242,
  48.37276, 48.483086, 48.593395, 48.703686, 48.813965, 48.924213, 49.034466,
  49.144676, 49.254883, 49.365063, 49.475224, 49.58537, 49.695488, 49.80558,
  49.915672, 50.02572, 50.135757, 50.24576, 50.35575, 50.465714, 50.575653,
  50.685566, 50.795452, 50.905308, 51.015144, 51.124954, 51.234734, 51.34448,
  51.454205, 51.5639, 51.67357, 51.783203];

const latArr = [-131.3447, -131.2045, -131.06424, -130.92392, -130.78352, -130.64308, 
  -130.50258, -130.36201, -130.22139, -130.08072, -129.93997, -129.79918, -129.65834, 
  -129.51744, -129.37648, -129.23547, -129.09442, -128.95332, -128.81216, -128.67096, 
  -128.52971, -128.3884, -128.24706, -128.10567, -127.96423, -127.822754, -127.68123, 
  -127.53967, -127.39807, -127.25641, -127.11473, -126.97301, -126.83124, -126.68945, 
  -126.54762, -126.40576, -126.263855, -126.12192, -125.97995, -125.83795, -125.69592,
  -125.55386, -125.41177, -125.26965, -125.12752, -124.98535, -124.84317, -124.70094, 
  -124.5587, -124.41644, -124.274155, -124.13185, -123.98953, -123.84718, -123.70482, 
  -123.56244, -123.420044, -123.27763, -123.13521, -122.99277, -122.85031, -122.707855, 
  -122.565384, -122.4229, -122.280396, -122.13791, -121.99539, -121.852875, -121.71036, 
  -121.56784, -121.42531, -121.282776, -121.14026, -120.99771, -120.85518, -120.71265, 
  -120.57013, -120.42758, -120.285065, -120.14255, -120.00003, -119.85753, -119.71503, 
  -119.57254, -119.43005, -119.28757, -119.14511, -119.002655, -118.86023, -118.717804, 
  -118.57539, -118.433, -118.29062, -118.148254, -118.00592, -117.86359, -117.72128, 
  -117.57901, -117.43674, -117.294495, -117.15228, -117.010086, -116.86792, -116.725784, 
  -116.583664, -116.44159, -116.29953, -116.1575, -116.0155, -115.873535, -115.7316, 
  -115.58969, -115.44783, -115.306, -115.164215, -115.022446, -114.88074, -114.739044, 
  -114.5974, -114.455795, -114.31424, -114.172714, -114.031235, -113.8898, -113.74841, 
  -113.607056, -113.46576, -113.324524, -113.18332, -113.04216, -112.90106, -112.759995, 
  -112.61899, -112.47804, -112.33714, -112.196304, -112.05551, -111.91478, -111.77411, 
  -111.633484, -111.49292, -111.35242, -111.211975, -111.071594, -110.93126, -110.791,
  -110.6508, -110.51068, -110.370605, -110.23059, -110.09067, -109.95079, -109.81099, 
  -109.671265, -109.531586, -109.392, -109.25247, -109.11302, -108.97365, -108.83435, 
  -108.6951, -108.555954];


interface GridProps {
  selectedGridCell: LatLngTuple
  clickHandler?: (e: LocationEvent, feature: any) => void;
  mapRendered: boolean;
}

const Grid: React.FC<GridProps> = ({ selectedGridCell, clickHandler, mapRendered }) => {

  let lContext = useLeaflet();

  const style = {
    color: 'rgb(199, 169, 62, .2)',
  }

  const styleSelected = {
    color: 'rgb(199, 169, 62)',
  }

  function onEachFeature(feature: any, layer: any) {
 
    if (mapRendered) {
      layer.on('click', function(ev: any) {
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

  const bbox = [latArr[0], lonArr[0], latArr[latArr.length-1], lonArr[lonArr.length-1]]
  const cellSide = 12;
  const sqGridOptions = {
    units: 'kilometers',
  };
  const sqGrid = squareGrid(bbox, cellSide, sqGridOptions);
  console.log("square grid: ", sqGrid);

  const gridGeoJSON = L.geoJSON(sqGrid, {
    style: function(feature:any) {
      return (feature.geometry.coordinates[0][0][0] === selectedGridCell[1] && feature.geometry.coordinates[0][0][1] === selectedGridCell[0] ) ? styleSelected : style
    },
    onEachFeature: onEachFeature
  })
  gridGeoJSON.addTo(lContext.map);

  return (
    <div></div>
  )
}

export default Grid;


  // L.GridLayer.extend({
  //   createTile: function(coords){
      
  //     // create a <canvas> element for drawing
  //     var tile = L.DomUtil.create('canvas', 'leaflet-tile');

  //     // setup tile width and height according to the options
  //     var size = this.getTileSize();
  //     tile.width = size.x;
  //     tile.height = size.y;
      
  //     var ctx = tile.getContext('2d');
  //     ctx.strokeStyle = 'red';
  //     ctx.stroke();

  //     return tile;
  //   }
  // });
  // let options = {
  //   tileSize: 300,
  //   opacity: 15,
  //   bounds: L.latLngBounds([-131.3447, 40], [-119.14511, 49])
  // }
  // let gridLayer: any = new L.GridLayer(options);
  // gridLayer.createTile([3, 3, 99], () => {console.log("TILE")});
  // console.log("GL : ", gridLayer)
  // gridLayer.addTo(lContext.map)

 // let bbox, cellSide, sqGridOptions, sqGrid, gridGeoJSON

  // for(let i = 45; i < 48; i++) {
  //   for(let j = 33; j < 36; j++) {