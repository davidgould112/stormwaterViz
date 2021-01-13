//@ts-nocheck
import React, { useEffect } from 'react';
import shp from "shpjs";
import { useLeaflet } from "react-leaflet";
import L , { LeafletEvent } from "leaflet";
import SelectedGridCell from '../types/GridCell'

interface ShapeGridProps {
  selectedGridCell: SelectedGridCell
  clickHandler: (e: LeafletEvent, feature: any, mapZoom: number) => void;
};

const ShapeGrid: React.FC<ShapeGridProps> = ({ clickHandler, selectedGridCell }) => {
  const { map } = useLeaflet();
  const shapeZipUrl = "WRFgridRectangles_NoOcean_Attribs.zip";

  useEffect(() => {
    let gridLayer: any = [];

    shp(shapeZipUrl).then((data: any) => {
      gridLayer = L.geoJSON(data, {
        style: (feature:any) => {
          return (feature.properties.Center_Lat === selectedGridCell.Center_Lat && feature.properties.Center_Lon === selectedGridCell.Center_Lon) ? styleSelected : style
        },
        onEachFeature: onEachFeature
      });
      gridLayer.addTo(map);
    });

    const style = {
      color: 'rgb(199, 169, 62, .2)',
    }
  
    const styleSelected = {
      color: 'rgb(11, 118, 183, .6)',
    }
    
    function onEachFeature(feature: any, layer: any) {
      layer.on('mouseover', () => {
        layer.setStyle(styleSelected);
        let out = [];
        if (feature.properties) {
          out.push("Center Lat/Long: <b>(" + feature.properties["Center_Lat"].toFixed(3) + ", " + feature.properties["Center_Lon"].toFixed(3) + ")</b>");
          out.push("Row-Column ID: <b>" + feature.properties["row_index_"] + "-" + feature.properties["column_ind"] + "</b>");
          layer.bindTooltip(out.join("<br />"), {direction: "top", offset: L.point({x: 0, y: -20})});
          layer.openTooltip()
        }
      });
      layer.on('mouseout', () => {
        if (feature.properties.Center_Lat !== selectedGridCell.Center_Lat && feature.properties.Center_Lon !== selectedGridCell.Center_Lon) {
          layer.setStyle(style);
        }
        layer.unbindTooltip()
      });
      layer.on('click', (e: LeafletEvent) => {
        clickHandler(e, feature, map._zoom);
      });
    
    };
    
  }, [map, clickHandler, selectedGridCell])

  return null;
}

export default ShapeGrid