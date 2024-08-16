"use client"

import styles from "@/app/page.module.css"

export default function Error({error, reset}) {
  console.log(error)
  return (
    <div className={`p-5 bg-tertiary ${styles.fh}`}>
        <h5>An error occured</h5>
        <p className="text-danger">(See the browser console for more information)</p>
        <button className="btn btn-primary rounded-pill" onClick={reset}>Retry</button>
    </div>
  )
}