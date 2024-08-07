import React from 'react'

export default function Carousel({children}) {
  return (
    <div className="d-flex flex-column flex-md-row row-gap-3 row-cols-1 row-cols-md-4 justify-content-center my-4 px-md-5 gap-4">
        {children}
    </div>
  )
}
