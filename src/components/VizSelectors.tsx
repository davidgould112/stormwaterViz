import React from 'react'
import "../styles/VizSelectors.css"
import Caret from "./Caret"
import { CSVLink } from "react-csv";
import { LatLngTuple } from 'leaflet';

 

type SelectorProps = {
  xAxisParam: string;
  returnInt: number;
  decade: string;
  duration: number;
  csvData: any[];
  gridLatLong: LatLngTuple;
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
                                                gridLatLong,
                                                xAxisToggle, 
                                                handleReturnIntChange, 
                                                handleDurationChange, 
                                                handleDecadeChange }) => {
                                  
  const fileName = `lat${gridLatLong[0]}_lon${gridLatLong[1]}.csv`                                                
  return (
    <div id="viz-select">
      <div id="radios">
        <div className="radio-container">
          <div id="radio-header">Select to show projected changes in</div>
          <label className="radio-row">
            <input type="radio" value="duration" name="xParam" checked={xAxisParam === "duration"} onChange={xAxisToggle}/> 
            <span className="radio-label">Duration</span>
          </label>
          <div className="radio-description">Duration is how long a precipitation events lasts (i.e. 1-hour, 6-hours, 24-hours)</div>
        </div>
        <div className="radio-container">
          <label className="radio-row">
            <input type="radio" value="return-int" name="xParam" checked={xAxisParam === "return-int"} onChange={xAxisToggle}/> 
            <span className="radio-label">Return Interval</span>
          </label>
          <div className="radio-description">How common or rare storms of different magnitudes are. A larger return period implies a rarer event.</div>
        </div>
      </div>
      <div id="selectors"> 
      { xAxisParam === "return-int" ?
        (
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
        )
      :
        (
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
              </select>
              <Caret/>
            </div>
          </div>
        )}
        <div className="select-container">
          <label> 
            Decade
          </label>
          <div className="select-row">
            <select value={decade} onChange={handleDecadeChange}>
              <option value="2030">2030s</option>
              <option value="2050">2050s</option>
              <option value="2080">2080s</option>
            </select>
            <Caret/>
          </div>
        </div>
        <CSVLink id="button-link" data={csvData} filename={fileName}>
          <button id="grid-data-btn">
            Download Grid Cell Data
          </button>
        </CSVLink>
      </div>
    </div>
  )
}

export default VizSelectors;