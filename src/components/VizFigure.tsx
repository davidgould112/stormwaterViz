import React, { useRef } from 'react';
import { CSVLink } from 'react-csv';
import * as Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import GridCell from '../types/GridCell'
import createChartCSV from "../utils/chartCSVGenerator"
import '../styles/VizFigure.css';

require('highcharts/modules/exporting')(Highcharts);
require('highcharts/modules/export-data')(Highcharts);

interface VizFigProps {
  vizConfig: object;
  xAxisParam: string;
  returnInt: number;
  decade: string;
  duration: number;
  gridJSON: object;
  gridCell: GridCell;  
}
const VizFigure: React.FC<VizFigProps> = ({ vizConfig,
                                            xAxisParam,
                                            returnInt,
                                            decade,
                                            duration,
                                            gridJSON,
                                            gridCell
                                          }) => {

  const chart = useRef<any>(null);
  
  let csvFileName: string = '';
  
  if (xAxisParam === "decade") {
    csvFileName = `${xAxisParam}-chart-data_row-col${gridCell.row_index_}-${gridCell.column_ind}_lat-lon${gridCell.Center_Lat}-${Math.abs(gridCell.Center_Lon)}_return-interval${returnInt}_duration${duration}.csv`;
  } else if (xAxisParam === "return-int") {
    csvFileName = `${xAxisParam}-chart-data_row-col${gridCell.row_index_}-${gridCell.column_ind}_lat-lon${gridCell.Center_Lat}-${Math.abs(gridCell.Center_Lon)}_decade${decade}_duration${duration}.csv`;
  } else if (xAxisParam === "duration") {
    csvFileName = `${xAxisParam}-chart-data_row-col${gridCell.row_index_}-${gridCell.column_ind}_lat-lon${gridCell.Center_Lat}-${Math.abs(gridCell.Center_Lon)}_return-interval${returnInt}_decade${decade}.csv`;
  }

  let pngFileName: string = '';
  
  if (xAxisParam === "decade") {
    pngFileName = `${xAxisParam}-chart-img_row-col${gridCell.row_index_}-${gridCell.column_ind}_lat-lon${gridCell.Center_Lat}-${Math.abs(gridCell.Center_Lon)}_return-interval${returnInt}_duration${duration}`;
  } else if (xAxisParam === "return-int") {
    pngFileName = `${xAxisParam}-chart-img_row-col${gridCell.row_index_}-${gridCell.column_ind}_lat-lon${gridCell.Center_Lat}-${Math.abs(gridCell.Center_Lon)}_decade${decade}_duration${duration}`;
  } else if (xAxisParam === "duration") {
    pngFileName = `${xAxisParam}-chart-img_row-col${gridCell.row_index_}-${gridCell.column_ind}_lat-lon${gridCell.Center_Lat}-${Math.abs(gridCell.Center_Lon)}_return-interval${returnInt}_decade${decade}`;
  }


  const downloadImage = () => { 
    if (chart && chart.current && chart.current.chart) {
      chart.current.chart.exportChart({filename: pngFileName});
    }
  };  
  
  let chartCSVData: any = [[]];
  if (Object.keys(gridJSON).length > 0) {
    chartCSVData = createChartCSV(gridJSON, xAxisParam, decade, returnInt, duration);
  }

  return (
    <div id="fig-container">
      <div id="viz-fig">
        <HighchartsReact id="viz-fig" ref={chart} updateArgs={[true]} highcharts={Highcharts} options={vizConfig}></HighchartsReact>
      </div>
      <div id="chart-info">
        Click and drag over points to zoom. 
      </div>
      <div id="btn-row">
        <button onClick={downloadImage} id="fig-btn">
          Download Figure
        </button>
        <CSVLink data={chartCSVData} filename={csvFileName}>
          <button id="data-btn">
            Download Chart Data
          </button>
        </CSVLink>
      </div>
    </div>
  )
  
}

export default VizFigure