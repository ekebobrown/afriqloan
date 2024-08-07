import React from 'react'

import { AddFund } from '@/app/components/forms'

export default function Fund({searchParams}) {

  return (
    <div className="bg-light p-5 m-5 rounded-4">
        <AddFund destination={searchParams.q}/>
    </div>
  )
}
