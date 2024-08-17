import Skeleton, { SkeletonTheme } from "react-loading-skeleton"

export async function Transaction() {
  return (
    <>
        <div className="d-flex flex-column flex-md-row">
            <div className="align-self-stretch d-flex flex-column me-auto">
                <h4><Skeleton className="align-self-stretch" /></h4>
                <span><Skeleton className="align-self-stretch" /></span>
            </div>
            <div className="d-flex gap-3 border border-1 rounded-3 p-1 align-items-center fs-5">
                <div href="#" className="btn btn-primary"><Skeleton width={40} /></div>
                <div href="#" className="div"><Skeleton width={40} /></div>
                <div href="#" className="div"><Skeleton width={40} /></div>
            </div>
        </div>
        <div className=" overflow-x-scroll" style={{scrollbarWidth:'none'}}>
            <table className="table table-hover flex-fill border border-1 rounded-4 fs-5 text-nowrap">
                <thead className="">
                    <tr className="table-light">
                    <th><Skeleton className="align-self-stretch" /></th>
                    <th><Skeleton /></th>
                    <th><Skeleton /></th>
                    <th><Skeleton /></th>
                    <th><Skeleton /></th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><Skeleton /></td>
                        <td><Skeleton /></td>
                        <td><div className="d-flex flex-column"><Skeleton /><small className="text-primary" style={{fontSize: "0.8rem"}}><Skeleton /></small></div></td>
                        <td><Skeleton /></td>
                        <td><Skeleton /></td>
                    </tr>
                    <tr>
                        <td><Skeleton /></td>
                        <td><Skeleton /></td>
                        <td><div className="d-flex flex-column"><Skeleton /><small className="text-primary" style={{fontSize: "0.8rem"}}><Skeleton /></small></div></td>
                        <td><Skeleton /></td>
                        <td><Skeleton /></td>
                    </tr>
                    <tr>
                        <td><Skeleton /></td>
                        <td><Skeleton /></td>
                        <td><div className="d-flex flex-column"><Skeleton /><small className="text-primary" style={{fontSize: "0.8rem"}}><Skeleton /></small></div></td>
                        <td><Skeleton /></td>
                        <td><Skeleton /></td>
                    </tr>
                </tbody>
            </table>
        </div>
    </>
  )
}
