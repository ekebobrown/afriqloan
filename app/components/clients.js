import React from 'react'

import Carousel from './carousels'

export default function Clients() {
  return (
    <div className="d-flex flex-column text-center flex-fill justify-content-center">
        <h1 className="text-primary display-5">Some Of Our Clients</h1>
        <p className="fs-5 text-primary">Here are some leading brands that have trusted us to recover delinquent loans.</p>
        <Carousel>
            <div className="d-flex justify-content-center btn btn-light fs-2 fw-bold text-body-tertiary"><span className="p-3">AfriqLoan</span></div>
            <div className="d-flex justify-content-center btn btn-light fs-2 fw-bold text-body-tertiary"><span className="p-3">AfriqLoan</span></div>
            <div className="d-flex justify-content-center btn btn-light fs-2 fw-bold text-body-tertiary"><span className="p-3">AfriqLoan</span></div>
            <div className="d-flex justify-content-center btn btn-light fs-2 fw-bold text-body-tertiary"><span className="p-3">AfriqLoan</span></div>
        </Carousel>
    </div>
  )
}
