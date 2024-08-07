"use client"

export default function Error({error, reset}) {
  return (
    <div className="p-5">
        <h5>There was an error loading your dashboard. Please try again</h5>
        <p className="text-danger">{error.message}</p>
        <button className="btn btn-primary rounded-pill" onClick={reset}>Retry</button>
    </div>
  )
}
