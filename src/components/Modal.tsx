import React from 'react'
import "../styles/Modal.css"

interface Props {
  showModal: boolean;
  closeModal: () => void;
};

const Modal: React.FC<Props> = ({ showModal, closeModal }) => { 

  if (!showModal) {
    return null;
  }

  return (
    <div id="modal-screen">
      <div id="modal">
        <h2>Modal Window</h2>
        <div id="content">
          <h3>
            About the tool
          </h3>
          <h4>
            The purpose of this tool is to visualize projected changes in heavy rainfall (or extreme precipitation) events across the Pacific Northwest. This tool provides extreme precipitation projections as a function of decade, duration, and frequency (or return interval). The tool is populated with results from a new ensemble of 12 regional climate model projections, all based on the high-end RCP 8.5 greenhouse gas scenario. These were used to simulate future conditions over the entire Pacific Northwest at a resolution of 12 km.
            <br/>
            <br/>
            Users can customize the tool to select various precipitation frequencies and durations to ensure the data shown in the tool is relevant to your specific needs. The resulting graphics can be downloaded for later use and the data for each grid cell can also be downloaded in an excel-readable spreadsheet.
          </h4>
          <h3>
            Acknowledgements
          </h3>
          <h4>
            The original source of funding for this work was the King County Department of Natural Resources and Parks, with additional provided by the Washington State Department of Ecology. Since then, the work has been refined and expanded with funding from the City of Everett, Thurston County, the Port Gamble S’Klallam Tribe, Portland’s Bureau of Environmental Services, Clackamas County, and the City of Gresham.
            <br/>
            <br/>
            The regional climate model simulations were produced by Professor Cliff Mass of UW Atmospheric Sciences, with funding from the Amazon Catalyst program.
          </h4>
        </div>
        <div id="actions">
          <button id="toggle-button" onClick={closeModal}>
            close
          </button>
        </div>
      </div>
    </div>
  );
}

export default Modal