import React from 'react';
import "../styles/Caret.css"

const Caret: React.FC<{}> = ({}) => {
  return (
    <svg className="caret" width="7" height="6" viewBox="0 0 7 6" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" clipRule="evenodd" d="M0.601166 0.800049H5.40117C5.89517 0.800049 6.17717 1.36405 5.88117 1.76005L3.48117 4.96005C3.24117 5.28005 2.76117 5.28005 2.52117 4.96005L0.121166 1.76005C-0.175834 1.36405 0.107166 0.800049 0.601166 0.800049Z" fill="#757575"/>
    </svg>
  )
}

export default Caret;