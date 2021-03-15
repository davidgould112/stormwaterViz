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
        zoomType: 'xy',
        spacingBottom: 40,
      },
      credits: {
        position: {
            align: 'right',
            x: -15
        },
        enabled: true
      },
      exporting: {
        enabled: false,
        scale: 1, 
        chartOptions: {
            chart:{
              height: 700,
              width:  1200,
            },
            title: {
              text: 'Projected Change v Duration: 25-year Event, 2050s', //changed by radio and menu
              style: {
                color: 'black',
                fontSize: '20px'
              }
            },
            yAxis: [{
              title: {
                text: '% Change from Historical (1981-2010)',
                style: {
                  color: 'black',
                  fontSize: '20px'
                }
              },
              labels: {
                style: {
                  color: 'black',
                  fontSize: '16px'
                }
              },
              allowDecimals: false
            }],
            xAxis: [{
              categories: ['1', '2', '6', '24', '72'],
              title: {
                text: 'Duration (hours)', 
                style: {
                  color: 'black',
                  fontSize: '20px'
                }
              },
              labels: {
                style: {
                  color: 'black',
                  fontSize: '16px'
                }
              },
              allowDecimals: false
            }],
            plotOptions: {
              scatter: {
                marker: {
                  radius: 7
                }
              }
            }
        }
      },
      title: {
        text: 'Projected Change v Duration: 25-year Event, 2050s', //changed by radio and menu
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
          text: '% Change from Historical (1981-2010)',
          style: {
            color: 'black',
            fontSize: '14px'
          }
        },
        plotLines: [{
          color: '#C0C0C0',
          width: 2,
          value: 0
        }],
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
        x: 40,
        y: 25,
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
          }
        }
      },
      series: [{
        name : 'Individual Model',
        className: 'ind-model',
        color: 'rgba(11, 118, 183, .6)',
        border: 'solid 2px black',
        data: [],
        tooltip: {
          headerFormat: '',
          pointFormat:'<span>Individual Model: <b>{point.gcm}</b></span><br/><span>Projected Change: <b>{point.y} %</b></span><br/><span>Duration: <b>{point.duration}</b></span><br/><span>Return Invterval: <b>{point.returnInt}</b></span><br/><span>Time Period: <b>{point.decade}</b> relative to 1981-2010</span><br/><span>Greenhouse Gas Scenario: <b>RCP 8.5 (High)</b></span>'
        }
      }, 
      {
        name: 'Model Average', 
        className: 'model-avg',
        marker: {
          symbol: 'diamond',
          radius: 7,
        },
        color: '#D74D26',
        data: [], //changed by radio
        tooltip: {
          headerFormat: '',
          pointFormat:'<span><b> Model Average </span></b><br/><span>Projected Change: <b>{point.y} %</b></span><br/><span>Duration: <b>{point.duration}</b></span><br/><span>Return Invterval: <b>{point.returnInt}</b></span><br/><span>Time Period: <b>{point.decade}</b> relative to 1981-2010</span><br/><span>Greenhouse Gas Scenario: <b>RCP 8.5 (High)</b></span>'
        }
      }]
    }    
  }
  

  componentDidMount () {
    this.fetchJSON(this.props.selectedGridCell.column_ind, this.props.selectedGridCell.row_index_);
  }

  componentDidUpdate(prevProps: VizProps) {
    if (this.props.selectedGridCell.Center_Lon !== prevProps.selectedGridCell.Center_Lon || this.props.selectedGridCell.Center_Lat !== prevProps.selectedGridCell.Center_Lat) {
      this.fetchJSON(this.props.selectedGridCell.column_ind, this.props.selectedGridCell.row_index_);
    }
  }

  fetchJSON(x: number, y: number) {
    fetch('https://data.cig.uw.edu/picea/stormwater/pub/viz_data/grid_x' + x + '_y' + y + '.json',
      { headers : { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
    .then(response => response.json())
    .then(data => {
      let chartData: any = [];
      if(this.state.xAxisParam === "decade") {
        chartData = this.filterDecadeData(data, this.state.duration, this.state.returnInt);
      } else if (this.state.xAxisParam === "duration") {
        chartData = this.filterPrecipData(data, this.state.decade, this.state.xAxisParam, this.state.returnInt);
      } else if (this.state.xAxisParam === "return-int") {
        chartData = this.filterPrecipData(data, this.state.decade, this.state.xAxisParam, this.state.duration);
      }

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

  filterPrecipData (data: any, decade: string, chartType: string, filterValue: number) {

    let modelsArr: any[] = [];
    let mediansArr: any[] = [];

    const decadeStrMap: any = {
      "2030": "2020-2049",
      "2040": "2030-2059",
      "2050": "2040-2069",
      "2060": "2050-2079",
      "2070": "2060-2089",
      "2080": "2070-2099"
    };
    const durArrValues: number[] = [1, 2, 6, 24, 72];
    const returnArrValues: number[] = [2, 5, 10, 25, 50, 100]
    const decadeData: any = data[decadeStrMap[decade]];

  
    if (chartType === "duration") {
      //choose all projection values for all durations given a return-interval filterValue
      for (const gcmKey in decadeData) {
        const gcmDataObj: any = decadeData[gcmKey];
        
        for (const durKey in gcmDataObj) {
          const durDataObj: any = gcmDataObj[durKey];
          const returnIntKey: string = `${filterValue}-yr`
          const projectionVal: number = Number(durDataObj[returnIntKey].toFixed(0));
          const durStr: string = durKey.substring(0, durKey.length-3);
          
          const chartPoint : any = {
            x: durArrValues.indexOf(Number(durStr)),
            y: projectionVal,
            duration: durKey,
            returnInt: returnIntKey,
            gcm: gcmKey.slice(0, gcmKey.length-13),
            decade: `${decade} (${decadeStrMap[decade]})`
          };
          if(chartPoint['gcm'] === 'ensemble') {
            mediansArr[chartPoint['x']] = chartPoint
          } else {
            modelsArr.push(chartPoint);
          }
        }
      } 
    } else if (chartType === "return-int") {
      // choose all projection values for all return-int values given a duration filterValue
      for (const gcmKey in decadeData) {
        const gcmDataObj: any = decadeData[gcmKey];
        const durKey: string = `${filterValue}-hr`;
        const durDataObj: any = gcmDataObj[durKey];
        for (const returnIntKey in durDataObj) {
          const projectionVal: number = Number(durDataObj[returnIntKey].toFixed(0));
          const returnIntStr: string = returnIntKey.substring(0, returnIntKey.length-3);
          
          const chartPoint : any = {
            x: returnArrValues.indexOf(Number(returnIntStr)),
            y: projectionVal,
            duration: durKey,
            returnInt: returnIntKey,
            gcm: gcmKey.slice(0, gcmKey.length-13),
            decade: `${decade} (${decadeStrMap[decade]})`
          };
          if(chartPoint['gcm'] === 'ensemble') {
            mediansArr[chartPoint['x']] = chartPoint
          } else {
            modelsArr.push(chartPoint);
          }
        };
      };
    };



    return {
      modelsArr: modelsArr,
      mediansArr: mediansArr
    };
  }

  filterDecadeData (data: any, duration: number, returnInt: number) {

    let modelsArr: any[] = [];
    let mediansArr: any[] = [];

    
    const decadeStrMap: any = [
      ["2030", "2020-2049"],
      ["2040", "2030-2059"],
      ["2050", "2040-2069"],
      ["2060", "2050-2079"],
      ["2070", "2060-2089"],
      ["2080", "2070-2099"]
    ];
    
    const durKey: string = duration + "-hr";
    const retIntKey: string = returnInt + "-yr"

    for (let i = 0; i < decadeStrMap.length; i++) {

      const decadeData = data[decadeStrMap[i][1]] 

      for (let key in decadeData) {
        const projectionVal: number = Number(decadeData[key][durKey][retIntKey].toFixed(0));
    
        const chartPoint : any = {
          x: i,
          y: projectionVal,
          duration: durKey,
          returnInt: retIntKey,
          gcm: key.slice(0, key.length-13),
          decade: `${decadeStrMap[i][0]}s (${decadeStrMap[i][1]})`
        };
        if(chartPoint['gcm'] === 'ensemble') {
          mediansArr[chartPoint['x']] = chartPoint
        } else {
          modelsArr.push(chartPoint);
        }
      }
    }

    return {
      modelsArr: modelsArr,
      mediansArr: mediansArr
    };
  }

  xAxisToggle (event: React.ChangeEvent<HTMLInputElement>): void {
    let newVizConfig: any = this.state.vizConfig;
    if(event.target.value === "duration") {
      newVizConfig.title.text = `Projected Change v Duration: ${this.state.returnInt}-year Event, ${this.state.decade}s`;
      newVizConfig.xAxis.title.text = "Duration (hours)";
      newVizConfig.xAxis.categories = [1, 2, 6, 24, 72];
      newVizConfig.exporting.chartOptions.title.text = `Projected Change v Duration: ${this.state.returnInt}-year Event, ${this.state.decade}s`;
      newVizConfig.exporting.chartOptions.xAxis[0].title.text = "Duration (hours)";
      newVizConfig.exporting.chartOptions.xAxis[0].categories = [1, 2, 6, 24, 72];
      const chartData = this.filterPrecipData(this.state.gridJSON, this.state.decade, event.target.value, this.state.returnInt);
      newVizConfig.series[0].data = chartData["modelsArr"]
      newVizConfig.series[1].data = chartData["mediansArr"]
    } else if (event.target.value === "return-int") {
      newVizConfig.title.text = `Projected Change v Return Interval: ${this.state.duration}-hour Event, ${this.state.decade}s`;
      newVizConfig.xAxis.title.text = "Return Interval (years)";
      newVizConfig.xAxis.categories = [2, 5, 10, 25, 50, 100];
      newVizConfig.exporting.chartOptions.title.text = `Projected Change v Return Interval: ${this.state.duration}-hour Event, ${this.state.decade}s`;
      newVizConfig.exporting.chartOptions.xAxis[0].title.text = "Return Interval (years)";
      newVizConfig.exporting.chartOptions.xAxis[0].categories = [2, 5, 10, 25, 50, 100];
      const chartData = this.filterPrecipData(this.state.gridJSON, this.state.decade, event.target.value, this.state.duration);
      newVizConfig.series[0].data = chartData["modelsArr"]
      newVizConfig.series[1].data = chartData["mediansArr"]
    } else if (event.target.value === "decade") {
      newVizConfig.title.text = `Projected Change v Decade: ${this.state.returnInt}-year, ${this.state.duration}-hour Event`;
      newVizConfig.xAxis.title.text = "Decade";
      newVizConfig.xAxis.categories = ['2030s', '2040s', '2050s', '2060s', '2070s', '2080s'];
      newVizConfig.exporting.chartOptions.title.text = `Projected Change v Decade: ${this.state.returnInt}-year, ${this.state.duration}-hour Event`;
      newVizConfig.exporting.chartOptions.xAxis[0].title.text = "Decade";
      newVizConfig.exporting.chartOptions.xAxis[0].categories = ['2030s', '2040s', '2050s', '2060s', '2070s', '2080s'];
      const chartData = this.filterDecadeData(this.state.gridJSON, this.state.duration, this.state.returnInt);
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
      newVizConfig.title.text = `Projected Change v Duration: ${event.target.value}-year Event, ${this.state.decade}s`;
      newVizConfig.exporting.chartOptions.title.text = `Projected Change v Duration: ${event.target.value}-year Event, ${this.state.decade}s`;
      const chartData = this.filterPrecipData(this.state.gridJSON, this.state.decade, this.state.xAxisParam, Number(event.target.value));
      newVizConfig.series[0].data = chartData["modelsArr"]
      newVizConfig.series[1].data = chartData["mediansArr"]
    } else if (this.state.xAxisParam === "decade") {
      newVizConfig.title.text = `Projected Change v Decade: ${event.target.value}-year, ${this.state.duration}-hour Event`;
      newVizConfig.exporting.chartOptions.title.text = `Projected Change v Decade: ${event.target.value}-year, ${this.state.duration}-hour Event`;
      const chartData = this.filterDecadeData(this.state.gridJSON, this.state.duration, Number(event.target.value))
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
      newVizConfig.title.text = `Projected Change v Return Interval: ${event.target.value}-hour Event, ${this.state.decade}s`;
      newVizConfig.exporting.chartOptions.title.text = `Projected Change v Return Interval: ${event.target.value}-hour Event, ${this.state.decade}s`;
      const chartData = this.filterPrecipData(this.state.gridJSON, this.state.decade, this.state.xAxisParam, Number(event.target.value));
      newVizConfig.series[0].data = chartData["modelsArr"]
      newVizConfig.series[1].data = chartData["mediansArr"]
    } else if (this.state.xAxisParam === "decade") {
      newVizConfig.title.text = `Projected Change v Decade: ${this.state.returnInt}-year, ${event.target.value}-hour Event`;
      newVizConfig.exporting.chartOptions.title.text = `Projected Change v Decade: ${this.state.returnInt}-year, ${event.target.value}-hour Event`;
      const chartData = this.filterDecadeData(this.state.gridJSON, Number(event.target.value), this.state.returnInt)
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
      newVizConfig.title.text = `Projected Change v Duration: ${this.state.returnInt}-year Event, ${event.target.value}s`
      newVizConfig.exporting.chartOptions.title.text = `Projected Change v Duration: ${this.state.returnInt}-year Event, ${event.target.value}s`
      const chartData = this.filterPrecipData(this.state.gridJSON, event.target.value, this.state.xAxisParam, this.state.returnInt)
      newVizConfig.series[0].data = chartData["modelsArr"]
      newVizConfig.series[1].data = chartData["mediansArr"]
    } else if (this.state.xAxisParam === "return-int") {
      newVizConfig.title.text = `Projected Change v Return Interval: ${this.state.duration}-hour Event, ${event.target.value}s`
      newVizConfig.exporting.chartOptions.title.text = `Projected Change v Return Interval: ${this.state.duration}-hour Event, ${event.target.value}s`
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
        <VizFigure 
          vizConfig={this.state.vizConfig} 
          xAxisParam={this.state.xAxisParam}
          duration={this.state.duration}
          returnInt={this.state.returnInt}
          decade={this.state.decade}
          gridJSON={this.state.gridJSON}
          gridCell={this.props.selectedGridCell}
        />
      </div>
    )
  }
}

export default VizContainer;