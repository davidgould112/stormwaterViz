import React from 'react'
import "../styles/VizSelectors.css"
import Caret from "./Caret"
import { CSVLink } from "react-csv";
import GridCell from '../types/GridCell'
 

type SelectorProps = {
  xAxisParam: string;
  returnInt: number;
  decade: string;
  duration: number;
  csvData: any[];
  gridCell: GridCell ;
  xAxisToggle: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleReturnIntChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  handleDurationChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  handleDecadeChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

const VizSelectors: React.FC<SelectorProps> = ({duration, 
                                                returnInt, 
                                                decade, 
                                                xAxisParam, 
                                                csvData,
                                                gridCell,
                                                xAxisToggle, 
                                                handleReturnIntChange, 
                                                handleDurationChange, 
                                                handleDecadeChange }) => {
                 
  let fileName: string = '';                                                
  if (xAxisParam === "decade") {
    fileName = `grid-data_row${gridCell.row_index_}-col${gridCell.column_ind}_lat${gridCell.Center_Lat}-lon${gridCell.Center_Lon}_${returnInt}-yr_${duration}-hr.csv`;
  } else if (xAxisParam === "return-int") {
    fileName = `grid-data_row${gridCell.row_index_}-col${gridCell.column_ind}_lat${gridCell.Center_Lat}-lon${gridCell.Center_Lon}_${duration}-hr_${decade}s.csv`;
  } else if (xAxisParam === "duration") {
    fileName = `grid-data_row${gridCell.row_index_}-col${gridCell.column_ind}_lat${gridCell.Center_Lat}-lon${gridCell.Center_Lon}_${returnInt}-yr_${decade}s.csv`;
  }

  return (
    <div id="viz-select">
      <div id="radios">
        <div className="radio-container">
          <h3 style={{color: "#757575 "}}> Customize the graph </h3>
          <div id="radio-header">1. Select x-axis</div>
          <label className="radio-row">
            <input type="radio" value="duration" name="xParam" checked={xAxisParam === "duration"} onChange={xAxisToggle}/> 
            <span className="radio-label">Duration</span>
          </label>
          <div className="radio-description">How long a precipitation event lasts (e.g., 1 hour, 6 hours, 24 hours).</div>
        </div>
        <div className="radio-container">
          <label className="radio-row">
            <input type="radio" value="return-int" name="xParam" checked={xAxisParam === "return-int"} onChange={xAxisToggle}/> 
            <span className="radio-label">Return Interval</span>
          </label>
          <div className="radio-description">How common or rare a precipitation event of a specific duration is. A larger return interval implies a rarer and larger event.</div>
        </div>
        <div className="radio-container"> 
          <label className="radio-row">
            <input type="radio" value="decade" name="xParam" checked={xAxisParam === "decade"} onChange={xAxisToggle}/> 
            <span className="radio-label">Decade</span>
          </label>
          <div className="radio-description">Change for each future decade. Each decade represents a 30-year average (e.g., ‘2030s’ = 2020-2049). </div>
        </div>
      </div> 
      { (() => {
        if (xAxisParam === 'decade') {
          return <div id="selectors">
            <div id="parameter-header">2. Specify other parameters</div>
            <div className="select-container">
              <label>
                Return Interval
              </label>
              <div className="select-row">
                <select value={returnInt} onChange={handleReturnIntChange}>
                  <option value="2">2-year</option>
                  <option value="5">5-year</option>
                  <option value="10">10-year</option>
                  <option value="25">25-year</option>
                  <option value="50">50-year</option>
                  <option value="100">100-year</option>
                </select>
                <Caret/>
              </div>
            </div>
            <div className="select-container">
              <label>
                Duration
              </label>
              <div className="select-row">
                <select value={duration} onChange={handleDurationChange}>
                  <option value="1">1-hour</option>
                  <option value="2">2-hour</option>
                  <option value="6">6-hour</option>
                  <option value="24">24-hour</option>
                  <option value="72">72-hour</option>
                </select>
                <Caret/>
              </div>
            </div>
          </div>
        } else if (xAxisParam === "return-int") {
          return <div id="selectors">
            <div id="parameter-header">2. Specify other parameters</div>
            <div className="select-container">
              <label>
                Duration
              </label>
              <div className="select-row">
                <select value={duration} onChange={handleDurationChange}>
                  <option value="1">1-hour</option>
                  <option value="2">2-hour</option>
                  <option value="6">6-hour</option>
                  <option value="24">24-hour</option>
                  <option value="72">72-hour</option>
                </select>
                <Caret/>
              </div>
            </div>
            <div className="select-container">
              <label> 
                Decade
              </label>
              <div className="select-row">
                <select value={decade} onChange={handleDecadeChange}>
                  <option value="2030">2030s</option>
                  <option value="2040">2040s</option>
                  <option value="2050">2050s</option>
                  <option value="2060">2060s</option>
                  <option value="2070">2070s</option>
                  <option value="2080">2080s</option>
                </select>
                <Caret/>
              </div>
            </div> 
          </div>
        } else if (xAxisParam === "duration") {
          return <div id="selectors">
            <div id="parameter-header">2. Specify other parameters</div>
            <div className="select-container">
              <label>
                Return Interval
              </label>
              <div className="select-row">
                <select value={returnInt} onChange={handleReturnIntChange}>
                  <option value="2">2-year</option>
                  <option value="5">5-year</option>
                  <option value="10">10-year</option>
                  <option value="25">25-year</option>
                  <option value="50">50-year</option>
                  <option value="100">100-year</option>
                </select>
                <Caret/>
              </div>
            </div>
            <div className="select-container">
              <label> 
                Decade
              </label>
              <div className="select-row">
                <select value={decade} onChange={handleDecadeChange}>
                  <option value="2030">2030s</option>
                  <option value="2040">2040s</option>
                  <option value="2050">2050s</option>
                  <option value="2060">2060s</option>
                  <option value="2070">2070s</option>
                  <option value="2080">2080s</option>
                </select>
                <Caret/>
              </div>
            </div>
          </div>
        }
      })()
      }
      <CSVLink id="grid-btn-wrapper" data={csvData} filename={fileName}>
        <button id="grid-data-btn">
          Download All Data For Grid Cell
        </button>
      </CSVLink>
    </div>
  )
}

export default VizSelectors;