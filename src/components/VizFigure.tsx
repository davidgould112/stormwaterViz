import React from 'react';
import ReactHighcharts from 'react-highcharts';
import '../styles/VizFigure.css';

interface VizFigProps {
  vizConfig: object;
}
class VizFigure extends React.Component<VizFigProps, {}> {
  constructor(props:VizFigProps) {
    super(props)
  };

  render() {
    return (
      <div id="fig-container">
        <div id="viz-fig">
          <ReactHighcharts config={this.props.vizConfig}> </ReactHighcharts>
        </div>
        <div id="btn-row">
          <button id="fig-btn">Download Figure</button>
          <button id="data-btn">Download Chart Data</button>
        </div>
      </div>
    )
  }

}

export default VizFigure