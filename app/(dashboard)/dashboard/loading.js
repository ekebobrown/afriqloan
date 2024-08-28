import Skeleton from "react-loading-skeleton"

export default function Loading(){
    return(
        <section className="h-100 bg-primary">
            <div className="d-flex flex-column p-5 gap-3">
                <h3><Skeleton width={200} className="rounded-pill"/></h3>
                <div className="row gap-4">
                    {[1,2,3,4].map((datum)=>(
                        <div key={datum} className="card col-12 col-md-5 d-flex flex-column rounded-4 justify-content-between bg-white p-4 p-md-5 gap-4">
                            <h3><Skeleton width={200} className="rounded-pill"/></h3>
                            <div className="d-flex justify-content-between">
                                <Skeleton width={120} height={50} className="rounded-pill" />
                                <Skeleton width={50} height={50} className="rounded-circle" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}