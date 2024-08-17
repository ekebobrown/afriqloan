import { User, Info } from '@/app/(dashboard)/usermenus'

import styles from '@/app/page.module.css'

export default function Sidebar() {
  return (
    <div id="sidebar" className="d-flex flex-column justify-content-start align-items-center fs-5 bg-light flex-fill">
        <div id="navbar" className={`collapse navbar-collapse d-md-flex flex-column w-100 align-items-start p-4 p-md-0`}>
          <ul className="d-flex flex-column mb-auto align-self-stretch">
              <User />
          </ul>
          <ul className="d-flex flex-column">
              <Info />
          </ul>
        </div>
    </div>
  )
}
