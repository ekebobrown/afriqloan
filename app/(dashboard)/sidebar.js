import React from 'react'
import Link from 'next/link'

import { User, Info } from '@/app/(main)/navigations'

import styles from '@/app/page.module.css'

export default function Sidebar() {
  return (
    <div id="sidebar" className="d-flex flex-column justify-content-start align-items-center fs-5 bg-light flex-fill">
        <div id="navbar" className={`collapse navbar-collapse d-md-flex flex-column w-100 align-items-start p-4 ps-md-5 p-md-0`}>
          <ul className="d-flex flex-column gap-2 mb-auto">
              <User />
          </ul>
          <ul className="d-flex flex-column gap-2">
              <Info />
          </ul>
        </div>
    </div>
  )
}
