import React from 'react';
import ReactHighcharts from 'react-highcharts';
import '../styles/VizFigure.css';

interface VizFigProps {
  vizConfig: object;
}
const VizFigure: React.FC<VizFigProps> = ({ vizConfig }) => {

  return (
    <div id="fig-container">
      <div id="viz-fig">
        <ReactHighcharts config={vizConfig}> </ReactHighcharts>
      </div>
      <div id="btn-row">
        <button id="fig-btn">Download Figure</button>
        <button id="data-btn">Download Chart Data</button>
      </div>
    </div>
  )
  
}

export default VizFigure