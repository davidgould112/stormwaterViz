//@ts-nocheck
import React from 'react';
import '../styles/VizContainer.css';
import VizFigure from './VizFigure';
import VizSelectors from './VizSelectors';
import jsonToCSV from '../utils/csvGenerator';
import GridCell from '../types/GridCell'

interface VizProps {
  selectedGridCell: GridCell;
}

type VizState = {
  xAxisParam: string;
  returnInt: number;
  decade: string;
  duration: number;
  vizConfig: object;
  gridJSON: object;
  csvData: any[];
}


class VizContainer extends React.Component<VizProps, VizState> {

  public readonly state: Readonly<VizState> = {
    xAxisParam: 'duration',
    returnInt: 25,
    decade: '2050',
    duration: 1,
    gridJSON: {},
    csvData: [[]],
    vizConfig: {
      chart: {
        type: 'scatter',
        zoomType: 'xy'
      },
      exporting: {
        enabled: false
      },
      title: {
        text: 'Duration Projections for 25-year Event in Decade 2050', //changed by radio and menu
        style: {
          color: 'black',
          fontSize: '20px'
        }
      },
      xAxis: {
        categories: ['1', '2', '6', '24', '72'], // changed by radio
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
        verticalAlign: 'bottom',
        x: 50,
        y: 50,
        floating: true,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
      },
      plotOptions: {
        scatter: {
          marker: {
             radius: 5,
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
            headerFormat: '',
            pointFormat: '<span>{point.explanation}</span>', 
            style: {
              whiteSpace: "normal",
              width: 70
            }
          }
        }
      },
      series: [{
        name : 'Individual Model Value',
        color: 'rgba(11, 118, 183, .6)',
        border: 'solid 2px black',
        data: []
      }, {
        name: 'Median Model Value', 
        marker: {
          symbol: 'diamond',
          radius: 7,
        },
        color: '#D74D26',
        data: [] //changed by radio
      }]
    },    
  }

  componentDidMount () {
    fetch('grid_x101_y101.json',
    {
      headers : { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
       }
    })
      .then(response => response.json())
      .then(data => {
        const chartData: any = this.filterPrecipData(data, this.state.decade, this.state.xAxisParam, this.state.returnInt);
        let newVizConfig: any = this.state.vizConfig;
        newVizConfig.series[0].data = chartData["modelsArr"];
        newVizConfig.series[1].data = chartData["mediansArr"];
        const csvData: any[] = jsonToCSV(data);
        this.setState({
          vizConfig: newVizConfig,
          gridJSON: data,
          csvData: csvData
        })
      })
      .catch(function(err) {
        console.log('Fetch Error :-S', err);
      });
   
  }

  filterPrecipData (data: any ,decade: string, chartType: string, filterValue: number) {

    const decadeStrMap: any = {
      "2030": "2020-2049",
      "2050": "2040-2069",
      "2080": "2070-2099"
    };
    const durArrValues: number[] = [1, 2, 6, 24, 72];
    const returnArrValues: number[] = [2, 5, 10, 25, 50]
    const decadeData: any = data[decadeStrMap[decade]];
    let modelsArr: any[] = [];
    let mediansArr: any[] = [];
    let pointDictionary: any = {
      0: [],
      1: [],
      2: [],
      3: [],
      4: []
    }
    const sortPoints = () => {
      for (let i = 0; i < 5; i++) {
        pointDictionary[i] = pointDictionary[i].sort((a: any,b: any) => a.y - b.y);
        const medianPoint = pointDictionary[i].splice(6, 1)[0];
        mediansArr.push(medianPoint);
        modelsArr = [...modelsArr, ...pointDictionary[i]];
      }
    };
    // example data point {
      //     x: duration,
      //     y: projected % change val,
      //     explanation: "At this site, the 25-year recurrence interval, 1-hour design storm is projected to increase/decrease by X% by the 2080s (relative to 1970-1999), under a high greenhouse gas scenario (RCP 8.5)",
      // }
      
      if (chartType === "duration") {
        //choose all projection values for all durations given a return-interval filterValue
        for (const gcmKey in decadeData) {
          const gcmDataObj: any = decadeData[gcmKey];
          
          for (const durKey in gcmDataObj) {
            const durDataObj: any = gcmDataObj[durKey];
            const returnIntKey: string = `${filterValue}-yr`
            const projectionVal: number = Number(durDataObj[returnIntKey].toFixed(5));
            const durStr: string = durKey.substring(0, durKey.length-3);
            const explanationStr = `At this site, the ${filterValue}-year recurrence interval, ${durStr}-hour design storm is projected to increase/decrease by ${projectionVal}% by the ${decade}s (relative to 1970-1999) under a high greenhouse gas scenario (RCP 8.5)`
            
            const chartPoint : any = {
              x: durArrValues.indexOf(Number(durStr)),
              y: projectionVal,
              explanation: explanationStr
            };
            
            pointDictionary[chartPoint['x']].push(chartPoint);
          }
        } 
      } else if (chartType === "return-int") {
        // choose all projection values for all return-int values given a duration filterValue
        for (const gcmKey in decadeData) {
        const gcmDataObj: any = decadeData[gcmKey];
        const durKey: string = `${filterValue}-hr`;
        const durDataObj: any = gcmDataObj[durKey];
        
        for (const returnIntKey in durDataObj) {
          const projectionVal: number = Number(durDataObj[returnIntKey].toFixed(5));
          const returnIntStr: string = returnIntKey.substring(0, returnIntKey.length-3);
          const explanationStr: string = `At this site, the ${returnIntStr}-year recurrence interval, ${filterValue}-hour design storm is projected to increase/decrease by ${projectionVal}% by the ${decade}s (relative to 1970-1999) under a high greenhouse gas scenario (RCP 8.5)`
          
          const chartPoint : any = {
            x: returnArrValues.indexOf(Number(returnIntStr)),
            y: projectionVal,
            explanation: explanationStr
          };

          pointDictionary[chartPoint['x']].push(chartPoint);
        };
      };
      
    };
    
    sortPoints()
    return {
      modelsArr: modelsArr,
      mediansArr: mediansArr
    };
  }

  xAxisToggle (event: React.ChangeEvent<HTMLInputElement>): void {
    let newVizConfig: any = this.state.vizConfig;
    if(event.target.value === "duration") {
      newVizConfig.title.text = `Duration Projections for ${this.state.returnInt}-year Event in Decade ${this.state.decade}`;
      newVizConfig.xAxis.title.text = "Duration (hours)";
      newVizConfig.xAxis.categories = [1, 2, 6, 24, 72];
      const chartData = this.filterPrecipData(this.state.gridJSON, this.state.decade, event.target.value, this.state.returnInt);
      newVizConfig.series[0].data = chartData["modelsArr"]
      newVizConfig.series[1].data = chartData["mediansArr"]
    } else if (event.target.value === "return-int") {
      newVizConfig.title.text = `Return Interval Projections for ${this.state.duration}-hour Event in Decade ${this.state.decade}`;
      newVizConfig.xAxis.title.text = "Return Interval (years)";
      newVizConfig.xAxis.categories = [1, 5, 10, 25, 50];
      const chartData = this.filterPrecipData(this.state.gridJSON, this.state.decade, event.target.value, this.state.duration);
      newVizConfig.series[0].data = chartData["modelsArr"]
      newVizConfig.series[1].data = chartData["mediansArr"]
    }

    this.setState({
      xAxisParam: event.target.value,
      vizConfig: newVizConfig  
    })
} 

  handleReturnIntChange (event: React.ChangeEvent<HTMLSelectElement>): void {
    let newVizConfig: any = this.state.vizConfig;
    if(this.state.xAxisParam === "duration") {
      newVizConfig.title.text = `Duration Projections for ${event.target.value}-year Event in Decade ${this.state.decade}`;
      const chartData = this.filterPrecipData(this.state.gridJSON, this.state.decade, this.state.xAxisParam, Number(event.target.value));
      newVizConfig.series[0].data = chartData["modelsArr"]
      newVizConfig.series[1].data = chartData["mediansArr"]
    } 

    this.setState({
      returnInt: Number(event.target.value),
      vizConfig: newVizConfig  
    })
  }

  handleDurationChange (event: React.ChangeEvent<HTMLSelectElement>): void {
    let newVizConfig: any = this.state.vizConfig;
    if (this.state.xAxisParam === "return-int") {
      newVizConfig.title.text = `Return Interval Projections for ${event.target.value}-hour Event in Decade ${this.state.decade}`;
      const chartData = this.filterPrecipData(this.state.gridJSON, this.state.decade, this.state.xAxisParam, Number(event.target.value));
      newVizConfig.series[0].data = chartData["modelsArr"]
      newVizConfig.series[1].data = chartData["mediansArr"]
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
      const chartData = this.filterPrecipData(this.state.gridJSON, event.target.value, this.state.xAxisParam, this.state.returnInt)
      newVizConfig.series[0].data = chartData["modelsArr"]
      newVizConfig.series[1].data = chartData["mediansArr"]
    } else if (this.state.xAxisParam === "return-int") {
      newVizConfig.title.text = `Return Interval Projection for ${this.state.duration}-hour Event in Decade ${event.target.value}`
      const chartData = this.filterPrecipData(this.state.gridJSON, event.target.value, this.state.xAxisParam, this.state.duration)
      newVizConfig.series[0].data = chartData["modelsArr"]
      newVizConfig.series[1].data = chartData["mediansArr"]
    }

    this.setState({
      decade: event.target.value,
      vizConfig: newVizConfig
    })
  }
  

  render() {
    return(
      <div id="viz-container">
        <VizSelectors 
          gridCell={this.props.selectedGridCell}
          xAxisParam={this.state.xAxisParam}
          duration={this.state.duration}
          returnInt={this.state.returnInt}
          decade={this.state.decade}
          csvData={this.state.csvData}
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