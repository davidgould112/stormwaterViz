import React from 'react';
import '../styles/VizContainer.css';
import VizFigure from './VizFigure';
import VizSelectors from './VizSelectors';
import { LatLngTuple } from 'leaflet';

interface VizProps {
  selectedGridCell: LatLngTuple;
}

type VizState = {
  xAxisParam: string;
  returnInt: number;
  decade: number;
  duration: number;
  vizConfig: object;
}


class VizContainer extends React.Component<VizProps, VizState> {


  public readonly state: Readonly<VizState> = {
    xAxisParam: 'duration',
    returnInt: 25,
    decade: 2050,
    duration: 1,
    vizConfig: {
      chart: {
        type: 'scatter',
        zoomType: 'xy'
      },
      title: {
        text: 'Duration Projections for 25-year Event in Decade 2050', //changed by radio and menu
       style: {
          color: 'black',
          fontSize: '20px'
        }
      },
      xAxis: {
        categories: ['2', '5', '10', '25', '50', '100'], // changed by radio
        title: {
          enabled: true,
          text: 'Duration (hours)', // changed by radio
          style: {
            color: 'black',
            fontSize: '16px'
          }
        },
        labels: {
          style: {
            color: 'black',
            fontSize: '13px'
          }
        }
      },
      yAxis: {
        title: {
          text: '% Change from Historical (1980s)',
          style: {
            color: 'black',
            fontSize: '16px'
          }
        },
        labels: {
          style: {
            color: 'black',
            fontSize: '13px'
          }
        }
      },
      legend: {
        layout: 'vertical',
        align: 'left',
        verticalAlign: 'top',
        x: 100,
        y: 70,
        floating: true,
        backgroundColor: '#FFFFFF',
        borderWidth: 1
      },
      plotOptions: {
        scatter: {
          marker: {
            radius: 6,
            states: {
              hover: {
                enabled: true,
                lineColor: 'rgb(100,100,100)'
              }
            }
          },
          states: {
            hover: {
              marker: {
                enabled: false
              }
            }
          },
          tooltip: {
            headerFormat: '<b>{series.name}</b><br>', //changed by radio
            pointFormat: '{point.x} year event, {point.y} %' //changed by radio
          }
        }
      },
      series: [{
        name : 'Individual Model Value',
        color: 'rgba(11, 118, 183, .6)',
        border: 'solid 2px black',
        data: [[0,6],[0,8],[0,4],[0,9], //changed by radio or menu
        [1,6],[1,9],[1,10],[1,12],
        [2,10],[2,11],[2,13],[2,15],
        [3,12],[3,15],[3,17],[3,22],
        [4,15],[4,21],[4,22],[4,24],
        [5,33],[5,24],[5,22],[5,27]]
      }, {
        name: 'Median Model Values', 
        marker: {
          symbol: 'diamond',
          radius: 7,
        },
        color: '#D74D26',
        data: [[0,5],[1,10],[2,12],[3,16],[4,22],[5,25]] //changed by radio
      }]
    }
    
  }

  xAxisToggle (event: React.ChangeEvent<HTMLInputElement>): void {
    let newVizConfig: any = this.state.vizConfig;
    if(event.target.value === "duration") {
      newVizConfig.title.text = `Duration Projections for ${this.state.returnInt}-year Event in Decade ${this.state.decade}`
      newVizConfig.xAxis.title.text = "Duration (hours)"
    } else if (event.target.value === "return-int") {
      newVizConfig.title.text = `Return Interval Projections for ${this.state.duration}-hour Event in Decade ${this.state.decade}`
      newVizConfig.xAxis.title.text = "Return Interval (years)"
    }

    this.setState({
      xAxisParam: event.target.value,
      vizConfig: newVizConfig  
    })
} 

  handleReturnIntChange (event: React.ChangeEvent<HTMLSelectElement>): void {
    let newVizConfig: any = this.state.vizConfig;
    if(this.state.xAxisParam === "duration") {
      newVizConfig.title.text = `Duration Projections for ${event.target.value}-year Event in Decade ${this.state.decade}`
    } 

    this.setState({
      returnInt: Number(event.target.value),
      vizConfig: newVizConfig  
    })
  }

  handleDurationChange (event: React.ChangeEvent<HTMLSelectElement>): void {
    let newVizConfig: any = this.state.vizConfig;
    if (this.state.xAxisParam === "return-int") {
      newVizConfig.title.text = `Return Interval Projections for ${event.target.value}-hour Event in Decade ${this.state.decade}`
    }
    
    this.setState({
      duration: Number(event.target.value),
      vizConfig: newVizConfig  
    })
  }
  
  handleDecadeChange (event: React.ChangeEvent<HTMLSelectElement>): void {
    let newVizConfig: any = this.state.vizConfig;
    if(this.state.xAxisParam === "duration") {
      newVizConfig.title.text = `Duration Projection for ${this.state.returnInt}-year Event in Decade ${event.target.value}`
    } else if (this.state.xAxisParam === "return-int") {
      newVizConfig.title.text = `Return Interval Projection for ${this.state.duration}-hour Event in Decade ${event.target.value}`
    }

    this.setState({
      decade: Number(event.target.value),
      vizConfig: newVizConfig
    })
  }
  

  render () {
    return(
      <div id="viz-container">
        <VizSelectors 
          xAxisParam={this.state.xAxisParam}
          duration={this.state.duration}
          returnInt={this.state.returnInt}
          decade={this.state.decade}
          xAxisToggle={this.xAxisToggle.bind(this)}
          handleReturnIntChange={this.handleReturnIntChange.bind(this)}
          handleDurationChange={this.handleDurationChange.bind(this)}
          handleDecadeChange={this.handleDecadeChange.bind(this)}
        />
        <VizFigure vizConfig={this.state.vizConfig}/>
      </div>
    )
  }
}
export default VizContainer;