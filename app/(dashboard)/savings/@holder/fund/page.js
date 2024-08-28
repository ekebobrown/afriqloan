import { AddFund } from '@/app/components/forms'

export default function Fund({searchParams}) {
  return (
    <div className="bg-light p-4 p-md-5 m-3 m-md-5 rounded-4">
        <AddFund destination={searchParams.q}/>
    </div>
  )
}
