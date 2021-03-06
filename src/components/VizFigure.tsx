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
    csvFileName = `${xAxisParam}-chart-data_row${gridCell.row_index_}-col${gridCell.column_ind}_lat${gridCell.Center_Lat}-lon${gridCell.Center_Lon}_${returnInt}-yr_${duration}-hr.csv`;
  } else if (xAxisParam === "return-int") {
    csvFileName = `${xAxisParam}-chart-data_row${gridCell.row_index_}-col${gridCell.column_ind}_lat${gridCell.Center_Lat}-lon${gridCell.Center_Lon}_${duration}-hr_${decade}s.csv`;
  } else if (xAxisParam === "duration") {
    csvFileName = `${xAxisParam}-chart-data_row${gridCell.row_index_}-col${gridCell.column_ind}_lat${gridCell.Center_Lat}-lon${gridCell.Center_Lon}_${returnInt}-yr_${decade}s.csv`;
  }

  let pngFileName: string = '';
  
  if (xAxisParam === "decade") {
    pngFileName = `${xAxisParam}-chart-img_row${gridCell.row_index_}-col${gridCell.column_ind}_lat${gridCell.Center_Lat}-lon${gridCell.Center_Lon}_${returnInt}-yr_${duration}-hr`;
  } else if (xAxisParam === "return-int") {
    pngFileName = `${xAxisParam}-chart-img_row${gridCell.row_index_}-col${gridCell.column_ind}_lat${gridCell.Center_Lat}-lon${gridCell.Center_Lon}_${duration}-hr_${decade}s`;
  } else if (xAxisParam === "duration") {
    pngFileName = `${xAxisParam}-chart-img_row${gridCell.row_index_}-col${gridCell.column_ind}_lat${gridCell.Center_Lat}-lon${gridCell.Center_Lon}_${returnInt}-yr_${decade}s`;
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
      <div id="citation">
        Recommended Citation: Morgan, H., Mauger, G., Won, J., Gould, D. 2021 &nbsp;
        <i>Projected Changes in Extreme Precipitation Web Tool.</i> &nbsp;
        University of Washington Climate Impacts Group. &nbsp;
        <u>https:/doi.org/10.6069/79CV-4233</u>
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