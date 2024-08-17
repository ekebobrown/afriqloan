"use client"

import styles from "@/app/page.module.css"

export default function Error({error, reset}) {
  console.log(error)
  return (
    <div className={`p-5 bg-tertiary ${styles.fh}`}>
        <h5>An error occured. Details can be found by inspecting the console.</h5>
        <p className="text-danger">{error.message}</p>
        <button className="btn btn-primary rounded-pill" onClick={reset}>Retry</button>
    </div>
  )
}
