"use client"
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Skeleton from 'react-loading-skeleton'

import { useFetcher } from '@/app/lib/fetchers'
import { revalidate } from './page'

export default function Recent({userId}){
    const initialSort = {column:'orderdate', order:-1}
    const [sort, setSort] = useState(initialSort)
    const [date, setDate] = useState('')
    const [search, setSearch] = useState('')
    const [q, setQ] = useState('')
    const [display, setDisplay] = useState(20)
    const [page, setPage] = useState(0)
    const [filter, setFilter] = useState([])
    const [processing, setProcessing] = useState()
    const currencyFormat = new Intl.NumberFormat('en-NG', {style: 'currency', currency: 'NGN'})
    const router = useRouter()
    const {data, error, isLoading, isValidating, mutate} = useFetcher(`api/listing/orders?search=${q}&limit=${display}&sort=${sort.column}&order=${sort.order}&orderdate=${date}&skip=${display*page}`)

    useEffect(()=>{
        setProcessing(data?.lists?.filter((list)=>list.status==="processing")||[])
        setFilter(data?.lists)
        const elements = document.getElementsByTagName('th')
        for (const element of elements){
            element.addEventListener('click', sortOrders)
        }
    },[])

    function sortOrders(e){
        if(filter?.length>0){
            const elements = document.getElementsByTagName('th')
            for (const element of elements){
                if(element.innerText === e.target.innerText){
                    element.classList.add('active')
                    element.classList.toggle("descending")
                }else{
                    element.classList.remove('active')
                }
            }
        }
    }

    function filterOrders(status){
       mutate({
                optimisticData: {...data, lists: data?.lists.filter((list)=>list.status===status)},
                revalidate: false
        })
    }

    return (
        <>
            <div className="d-flex flex-column flex-md-row px-4 pt-4 rounded-3 gap-2 align-items-center">
                <h6 className="me-auto d-flex flex-row flex-md-column flex-xl-row gap-2">Recent Orders {Array.isArray(processing)?processing?.length>0&&<div className="d-flex justify-content-center rounded-2 bg-success-subtle text-success px-2 fs-6">+{processing?.length} Order{processing?.length>1?'s':''}</div>:<Skeleton width={100} borderRadius={5} />}</h6>
                <button className="align-self-stretch d-flex rounded-2 border border-1 justify-content-between align-items-center px-4 py-2 bg-body position-relative" disabled={error||isLoading}>
                    <input type="date" min="2024-08-01" max={`${new Date().toISOString().split('T')[0]}`} className="position-absolute top-0 start-0 w-100 opacity-0 py-2"  value={date} onChange={(e)=>{setDate(e.target.value); window.history.pushState({}, '', '/listings/orders')}} disabled={error||isLoading} />
                    <span className="text-nowrap">{date||'Select Date'}</span>
                    <i className="fa-solid fa-calendar-days ms-2"></i>
                </button>
                <div className="align-self-stretch d-flex align-items-center gap-2">
                <button className="flex-fill dropdown-toggle align-self-stretch d-flex rounded-2 border border-1 justify-content-between align-items-center px-4 py-2 bg-body position-relative" disabled={error||isLoading} data-bs-toggle="dropdown" aria-expanded="false">
                    Filters
                    <i className="fa-solid fa-sliders ms-2"></i>
                    <ul className="dropdown dropdown-menu border shadow-sm" style={{minWidth:'102%'}}>
                        <li className="dropdown-item" onClick={()=>filterOrders("partial")}>Partial</li>
                        <li className="dropdown-item" onClick={()=>filterOrders("completed")}>Completed</li>
                        <li className="dropdown-item" onClick={()=>filterOrders("cancelled")}>Cancelled</li>
                        <li className="dropdown-item" onClick={()=>filterOrders("processing")}>Processing</li>
                    </ul>
                </button>
                <button className={`align-self-stretch d-flex rounded-2 border border-1 align-items-center px-3 py-2`} title="Reset All" style={{backgroundColor:'rgba(137,70,207,0.2)', color:'#8946CF'}} onClick={()=>{q!==""&&setQ(""); setFilter(data?.lists); JSON.stringify(initialSort)!==JSON.stringify(sort) && setSort(initialSort); date!==""&&setDate(''); window.history.pushState({}, '', '/listings/orders')}} disabled={isLoading||isValidating}>
                    <i className={`fa-solid fa-arrows-rotate ${isLoading&&'fa-spin'}`}></i>
                </button>
                </div>
            </div>
            <div className="search flex-fill px-4 py-3 position-relative">
                <input type="search" className="w-100 border border-1 border-tertiary px-5 py-2" value={search} onChange={(e)=>setSearch(e.target.value)} onKeyUp={(e)=>e.keyCode===13&&e.target.value!==''&&setQ(search)} placeholder="Search Orders" disabled={error||isLoading}/>
                <i className="fa-solid fa-magnifying-glass position-absolute top-50 translate-middle-y text-body-tertiary" style={{left:'40px'}}></i>
            </div>
            <div className="bg-tertiary">
                <div className="d-flex flex-nowrap overflow-scroll" style={{scrollbarWidth:'none'}}>
                    <table className="table table-hover table-responsive fs-6 text-nowrap mb-0">
                        <thead>
                            <tr className="position-relative">
                                <th className="" onClick={()=>filter.length>0 && setSort({column:"item.title", order:sort.order===1&&sort.column==="item.title"?-1:1})}>Product</th>
                                <th className="" onClick={()=>filter.length>0 && setSort({column:"contact.email", order:sort.order===1&&sort.column==="contact.email"?-1:1})}>Customer</th>
                                <th className="" onClick={()=>filter.length>0 && setSort({column:"value", order:sort.order===1&&sort.column==="value"?-1:1})}>Total</th>
                                <th className="" onClick={()=>filter.length>0 && setSort({column:"status", order:sort.order===1&&sort.column==="status"?-1:1})}>Status</th>
                                <th className="flex-shrink-0">Action</th>
                            </tr>
                        </thead>
                        <tbody className="position-relative">
                        {error && <tr><td colSpan="5" className="text-danger">{data?.message}</td></tr>}
                        {data && data.lists?.length===0 && <tr><td colSpan="5"><div className="flex-fill d-flex text-primary align-items-center"><i className="fa-solid fa-circle-info me-2"></i>No order. Kindly review your filter(s) or check back later.</div></td></tr>}
                        {data?.lists.map((order, index)=>(
                            <tr key={index} className="fs-6 px-4" role="button" onClick={()=>window.innerWidth<=767?router.push(`./orders/${order._id}`):window.history.pushState({id:order?._id}, '', `?id=${order?._id}`)}>
                                <td>
                                    <div className="d-flex flex-row align-items-center gap-1">
                                        {order.item?.image?<Image
                                            src={order.item?.image[0]}
                                            height={40}
                                            width={40}
                                            alt={order.item?.title}
                                            style={{borderRadius:"5px"}}
                                        />:<Skeleton width={40} height={40} className="rounded-2" />}
                                        <div className="d-flex flex-column">
                                            {order.item?.title||<Skeleton width={100} />}{order?.quantity?order.quantity>1 && <span>+{order?.quantity-1} other item{order.quantity>2&&'s'}</span>:<Skeleton width={80} />}
                                        </div>
                                    </div></td>
                                <td>{order?.names||<Skeleton width={100} />}<span>{order.contact?.email||<Skeleton width={120} />}</span></td>
                                <td>{order?.value?currencyFormat.format(order?.value):<Skeleton />}</td>
                                <td>{order?.status?<span className={`${order?.status==='processing'?'text-warning bg-warning-subtle':'text-success bg-success-subtle'} rounded-2 px-3 fw-bold justify-content-center`}>{order.status?.charAt(0).toUpperCase()+order.status?.slice(1,)}</span>:<Skeleton />}</td>
                                <td>{order?.names?<div className="d-flex align-items-center h-100"><i className="action fa-solid fa-eye me-2" role="button"></i><i className="action fa-solid fa-trash text-danger" role="button"></i></div>:<Skeleton />}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="d-flex flex-column flex-md-row p-4 justify-content-center align-items-center">
                {data && data.lists?.length > 0 &&
                    <>
                        <span className="d-flex me-md-auto text-center">Showing {page*display+1} - {Math.min(page*display+display, Math.max(data?.count, data?.lists.length))} of {Math.max(data?.count, data?.lists.length)}</span>
                        <div className="d-flex gap-1 align-items-center transition">
                            {Math.ceil(data?.count/display)>1 && page>0?
                                <i className="fa-solid fa-caret-left" role="button" onClick={()=>setPage(page-1)} style={{color:'#8946CF'}}></i>:<i className="fa-solid fa-caret-left text-white"></i>
                            }
                            {Array.from({ length: Math.ceil(data?.count/display)}, (pg, index)=>(
                                <div key={index} className="d-flex rounded-3 justify-content-center text-center transition" style={{width:'25px', height:'25px', backgroundColor:page===index?'#8946CF':'#c79cff', color:'#FFFFFF', verticalAlign:'middle'}} role="button" onClick={()=>setPage(index)}>{index+1}</div>
                            ))}
                            {Math.ceil(data?.count/display)>1 && (page===0||page < Math.ceil(data?.count/display)-1)?
                                <i className="fa-solid fa-caret-right" role="button" onClick={()=>setPage(page+1)} style={{color:'#8946CF'}} disabled ></i>:<i className="fa-solid fa-caret-right text-white"></i>
                            }
                        </div>
                    </>
                }
            </div>
            {isLoading &&
                <div className="d-flex justify-content-center align-items-center position-absolute top-0 end-0 bottom-0 start-0" style={{backgroundColor:'rgba(240, 240, 243, 0.5)'}}>
                </div>
            }
        </>
    )
}