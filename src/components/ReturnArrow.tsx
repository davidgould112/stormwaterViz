import React from 'react';
import '../styles/App.css';
// {/* <svg 
//   width="20px"
//   height="20px"
//   viewBox="0 0 38 34"
//   xmlns="http://www.w3.org/2000/svg"
//   xmlnsXlink="http://www.w3.org/1999/xlink"> */}

const ReturnArrow: React.FC = () => {
  return (
    <div id="footer-arrow">
      <svg 
        version="1.1" 
        xmlns="http://www.w3.org/2000/svg" 
        xmlnsXlink="http://www.w3.org/1999/xlink" 
        x="0px" 
        y="0px"
        width="20px" 
        height="20px" 
        viewBox="0 0 250 250"
      >
        <path 
          fill="#0B76B7"
          d="M120.774,179.271v40c47.303,0,85.784-38.482,85.784-85.785c0-47.3-38.481-85.782-85.784-85.782H89.282L108.7,28.286
          L80.417,0L12.713,67.703l67.703,67.701l28.283-28.284L89.282,87.703h31.492c25.246,0,45.784,20.538,45.784,45.783
          C166.558,158.73,146.02,179.271,120.774,179.271z"/>
      </svg>
    </div>
  )
}


export default ReturnArrow;