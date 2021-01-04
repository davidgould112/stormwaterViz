import React, { useRef } from 'react';
import * as Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import '../styles/VizFigure.css';

require('highcharts/modules/exporting')(Highcharts);
require('highcharts/modules/export-data')(Highcharts);

interface VizFigProps {
  vizConfig: object;
}
const VizFigure: React.FC<VizFigProps> = ({ vizConfig }) => {
  const chart = useRef<any>(null);

  const downloadCSV = () => {
    if (chart && chart.current && chart.current.chart) {
      chart.current.chart.downloadCSV();
    }
  };

  const downloadImage = () => {
    if (chart && chart.current && chart.current.chart) {
      chart.current.chart.exportChart();
    }
  };  
  
  return (
    <div id="fig-container">
      {/* <div id="viz-fig"> */}
        <HighchartsReact id="viz-fig" ref={chart} updateArgs={[true]} highcharts={Highcharts} options={vizConfig}></HighchartsReact>
      {/* </div> */}
      <div id="btn-row">
        <button onClick={downloadImage} id="fig-btn">Download Figure</button>
        <button onClick={downloadCSV} id="data-btn">Download Chart Data</button>
      </div>
    </div>
  )
  
}

export default VizFigure