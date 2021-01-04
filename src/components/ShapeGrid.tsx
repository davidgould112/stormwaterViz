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

    const style = {
      color: 'rgb(199, 169, 62, .2)',
    }
  
    const styleSelected = {
      color: 'rgb(199, 169, 62)',
    }
  
    function onEachFeature(feature: any, layer: any) {
      layer.on('mouseover', function () {
        this.setStyle(styleSelected);
        let out = [];
        if (feature.properties) {
          out.push("Center Lat/Long: (" + feature.properties["Center_Lat"].toFixed(3) + ", " + feature.properties["Center_Lon"].toFixed(3) + ")");
          out.push("Row-Column ID: " + feature.properties["row_index_"] + "-" + feature.properties["column_ind"]);
          layer.bindTooltip(out.join("<br />"), {direction: "top", offset: L.point({x: 0, y: -20})});
          layer.openTooltip()
        }
      });
      layer.on('mouseout', function () {
        if (feature.properties.Center_Lat !== selectedGridCell.Center_Lat) {
          this.setStyle(style);
        }
        layer.unbindTooltip()
      });
      layer.on('click', function(e: LeafletEvent) {
        this.setStyle(styleSelected);
        clickHandler(e, feature, map._zoom)
      });
    
    };
    
    shp(shapeZipUrl).then((data: any) => {
        L.geoJSON(data, {
          style: function (feature:any) {
            return (feature.properties.Center_Lat === selectedGridCell.Center_Lat && feature.properties.Center_Lon === selectedGridCell.Center_Lon) ? styleSelected : style
          },
          onEachFeature: onEachFeature
        }).addTo(map);
      });
    
  }, [map, clickHandler, selectedGridCell])

  return null;
}

export default ShapeGrid