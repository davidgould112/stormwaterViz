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
        text: 'Projected Change vs Duration for the 25-year Event, 2050s', //changed by radio and menu
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
        align: 'right',
        verticalAlign: 'bottom',
        x: -12,
        y: -52,
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
            pointFormat:'<span>Projected Change: {point.y} %</span><br/><span>Global Climate Model: {point.gcm}</span><br/><span>Greenhouse Gas Scenario: RCP 8.5 (High)</span><br/><span>Duration: {point.duration}</span><br/><span>Return Invterval: {point.returnInt}</span><br/><span>Time Period: {point.decade} relative to 1981-2010</span>'
          }
        }
      },
      series: [{
        name : 'Individual Model',
        color: 'rgba(11, 118, 183, .6)',
        border: 'solid 2px black',
        data: []
      }, {
        name: 'Model Average', 
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
    const returnArrValues: number[] = [2, 5, 10, 25, 50]
    const decadeData: any = data[decadeStrMap[decade]];
    let pointDictionary: any = {
      0: [],
      1: [],
      2: [],
      3: [],
      4: []
    }
  
    if (chartType === "duration") {
      //choose all projection values for all durations given a return-interval filterValue
      for (const gcmKey in decadeData) {
        const gcmDataObj: any = decadeData[gcmKey];
        
        for (const durKey in gcmDataObj) {
          const durDataObj: any = gcmDataObj[durKey];
          const returnIntKey: string = `${filterValue}-yr`
          const projectionVal: number = Number(durDataObj[returnIntKey].toFixed(2));
          const durStr: string = durKey.substring(0, durKey.length-3);
          
          const chartPoint : any = {
            x: durArrValues.indexOf(Number(durStr)),
            y: projectionVal,
            duration: durKey,
            returnInt: returnIntKey,
            gcm: gcmKey.slice(0, gcmKey.length-13),
            decade: `${decade} (${decadeStrMap[decade]})`
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
          const projectionVal: number = Number(durDataObj[returnIntKey].toFixed(2));
          const returnIntStr: string = returnIntKey.substring(0, returnIntKey.length-3);
          
          const chartPoint : any = {
            x: returnArrValues.indexOf(Number(returnIntStr)),
            y: projectionVal,
            duration: durKey,
            returnInt: returnIntKey,
            gcm: gcmKey.slice(0, gcmKey.length-13),
            decade: `${decade} (${decadeStrMap[decade]})`
          };

          pointDictionary[chartPoint['x']].push(chartPoint);
        };
      };
    };

    const sortPoints = () => {
      for (let i = 0; i < 5; i++) {
        pointDictionary[i] = pointDictionary[i].sort((a: any,b: any) => a.y - b.y);
        const medianPoint = pointDictionary[i].splice(6, 1)[0];
        mediansArr.push(medianPoint);
        modelsArr = [...modelsArr, ...pointDictionary[i]];
      }
    };
    sortPoints()
    return {
      modelsArr: modelsArr,
      mediansArr: mediansArr
    };
  }

  filterDecadeData (data: any, duration: number, returnInt: number) {

    let modelsArr: any[] = [];
    let mediansArr: any[] = [];

    const durKey: string = duration + "-hr";
    const retIntKey: string = returnInt + "-yr"

    const decadeStrMap: any = [
      ["2030", "2020-2049"],
      ["2040", "2030-2059"],
      ["2050", "2040-2069"],
      ["2060", "2050-2079"],
      ["2070", "2060-2089"],
      ["2080", "2070-2099"]
    ];
    
    let decadeDictionary: any = {
      0: [],
      1: [],
      2: [],
      3: [],
      4: [],
      5: [],
    }

    for (let i = 0; i < decadeStrMap.length; i++) {

      const decadeData = data[decadeStrMap[i][1]] 

      for (let key in decadeData) {
        const projectionVal: number = Number(decadeData[key][durKey][retIntKey].toFixed(2));
    
        const chartPoint : any = {
          x: i,
          y: projectionVal,
          duration: durKey,
          returnInt: retIntKey,
          gcm: key.slice(0, key.length-13),
          decade: `${decadeStrMap[i][0]}s (${decadeStrMap[i][1]})`
        };

        decadeDictionary[i].push(chartPoint)
      }
    }

    const sortDecadePoints = () => {
      for (let i = 0; i < 6; i++) {
        decadeDictionary[i] = decadeDictionary[i].sort((a: any,b: any) => a.y - b.y);
        const medianPoint = decadeDictionary[i].splice(6, 1)[0];
        mediansArr.push(medianPoint);
        modelsArr = [...modelsArr, ...decadeDictionary[i]];
      }
    };

    sortDecadePoints();
    
    return {
      modelsArr: modelsArr,
      mediansArr: mediansArr
    };

  }

  xAxisToggle (event: React.ChangeEvent<HTMLInputElement>): void {
    let newVizConfig: any = this.state.vizConfig;
    if(event.target.value === "duration") {
      newVizConfig.title.text = `Projected Change vs Duration for the ${this.state.returnInt}-year Event, ${this.state.decade}s`;
      newVizConfig.xAxis.title.text = "Duration (hours)";
      newVizConfig.xAxis.categories = [1, 2, 6, 24, 72];
      const chartData = this.filterPrecipData(this.state.gridJSON, this.state.decade, event.target.value, this.state.returnInt);
      newVizConfig.series[0].data = chartData["modelsArr"]
      newVizConfig.series[1].data = chartData["mediansArr"]
    } else if (event.target.value === "return-int") {
      newVizConfig.title.text = `Projected Change vs Return Interval for the ${this.state.duration}-hour Event, ${this.state.decade}s`;
      newVizConfig.xAxis.title.text = "Return Interval (years)";
      newVizConfig.xAxis.categories = [2, 5, 10, 25, 50];
      const chartData = this.filterPrecipData(this.state.gridJSON, this.state.decade, event.target.value, this.state.duration);
      newVizConfig.series[0].data = chartData["modelsArr"]
      newVizConfig.series[1].data = chartData["mediansArr"]
    } else if (event.target.value === "decade") {
      newVizConfig.title.text = `Projected Change vs Decade for the ${this.state.returnInt}-year, ${this.state.duration}-hour Event`;
      newVizConfig.xAxis.title.text = "Decade";
      newVizConfig.xAxis.categories = ['2030s', '2040s', '2050s', '2060s', '2070s', '2080s'];
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
      newVizConfig.title.text = `Projected Change vs Duration for the ${event.target.value}-year Event, ${this.state.decade}s`;
      const chartData = this.filterPrecipData(this.state.gridJSON, this.state.decade, this.state.xAxisParam, Number(event.target.value));
      newVizConfig.series[0].data = chartData["modelsArr"]
      newVizConfig.series[1].data = chartData["mediansArr"]
    } else if (this.state.xAxisParam === "decade") {
      newVizConfig.title.text = `Projected Change vs Decade for the ${event.target.value}-year, ${this.state.duration}-hour Event`;
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
      newVizConfig.title.text = `Projected Change vs Return Interval for the ${event.target.value}-hour Event, ${this.state.decade}s`;
      const chartData = this.filterPrecipData(this.state.gridJSON, this.state.decade, this.state.xAxisParam, Number(event.target.value));
      newVizConfig.series[0].data = chartData["modelsArr"]
      newVizConfig.series[1].data = chartData["mediansArr"]
    } else if (this.state.xAxisParam === "decade") {
      newVizConfig.title.text = `Projected Change vs Decade for the ${this.state.returnInt}-year, ${event.target.value}-hour Event`;
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
      newVizConfig.title.text = `Projected Change vs Duration for the ${this.state.returnInt}-year Event, ${event.target.value}s`
      const chartData = this.filterPrecipData(this.state.gridJSON, event.target.value, this.state.xAxisParam, this.state.returnInt)
      newVizConfig.series[0].data = chartData["modelsArr"]
      newVizConfig.series[1].data = chartData["mediansArr"]
    } else if (this.state.xAxisParam === "return-int") {
      newVizConfig.title.text = `Projected Change vs Duration for the ${this.state.duration}-hour Event, ${event.target.value}s`
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