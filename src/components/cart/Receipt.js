import React from 'react'
import { useLocation } from 'react-router-dom'

function Receipt() {
    const {state} = useLocation();
    const {receipt} = state;


  return (
      <div className="container">
          <div className="row">
              <div className="col-12 col-lg-2"></div>
              <div className="col-12 col-lg-10">
                <div dangerouslySetInnerHTML={{ __html: receipt}} />
              </div>
          </div>
      </div>
  )
}

export default Receipt