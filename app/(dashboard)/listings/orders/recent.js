"use client"
import Image from 'next/image'
import { useEffect, useState } from 'react'
import Skeleton from 'react-loading-skeleton'

export default function Recent({userId}){
    const initialSort = {column:'orderdate', order:-1}
    const [sort, setSort] = useState(initialSort)
    const [date, setDate] = useState('')
    const [orders, setOrders] = useState({lists:[{}]})
    const [filter, setFilter] = useState([{}])
    const [search, setSearch] = useState('')
    const [display, setDisplay] = useState(20)
    const [page, setPage] = useState(0)
    const [processing, setProcessing] = useState()
    const currencyFormat = new Intl.NumberFormat('en-NG', {style: 'currency', currency: 'NGN'})

    useEffect(()=>{
        setOrders({...orders, status:orders.message?'loading':'pending'})
        fetch(`/api/listing/orders?limit=${display}&sort=${sort.column}&order=${sort.order}&orderdate=${date}&skip=${display*page}`)
        .then((response) => response.json())
        .then((orders) => {
            setOrders(orders)
            setProcessing(orders.lists?.filter((list)=>list.status==="processing")||[])
            setFilter(orders.lists)
        })
        .catch((error) => console.log(error))
    },[userId, sort, date, display, page])

    useEffect(()=>{
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
        setFilter(orders.lists.filter((list)=>list.status===status))
    }

    return (
        <>
            <div className="d-flex flex-column flex-md-row px-4 pt-4 rounded-3 gap-2 align-items-center">
                <h6 className="me-auto d-flex gap-2">Recent Orders {Array.isArray(processing)?processing?.length>0&&<div className="d-flex justify-content-center rounded-2 bg-success-subtle text-success px-2 fs-6">+{processing?.length} Order{processing?.length>1?'s':''}</div>:<Skeleton width={100} />}</h6>
                {orders.message?<button className="align-self-stretch d-flex rounded-2 border border-1 justify-content-between align-items-center px-4 py-2 bg-body position-relative" disabled={!orders.success||orders.status==='loading'}>
                    <input type="date" min="2024-08-01" max={`${new Date().toISOString().split('T')[0]}`} className="position-absolute top-0 start-0 w-100 opacity-0 py-2"  value={date} onChange={(e)=>{setDate(e.target.value); window.history.pushState({}, '', '/listings/orders')}} disabled={!orders.success||orders.status==='loading'} />
                    <span className="text-nowrap">{date||'Select Date'}</span>
                    <i className="fa-solid fa-calendar-days ms-2"></i>
                </button>:<Skeleton width={140} direction="rtl" className="btn rounded-2 border border-1 px-4 py-3 bg-body"/>}
                <div className="align-self-stretch d-flex align-items-center gap-2">
                {orders.message?
                    <button className="flex-fill dropdown-toggle align-self-stretch d-flex rounded-2 border border-1 justify-content-between align-items-center px-4 py-2 bg-body position-relative" disabled={!orders.success||orders.status==='loading'} data-bs-toggle="dropdown" aria-expanded="false">
                        Filters
                        <i className="fa-solid fa-sliders ms-2"></i>
                        <ul className="dropdown dropdown-menu border shadow-sm" style={{minWidth:'102%'}}>
                            <li className="dropdown-item" onClick={()=>filterOrders("partial")}>Partial</li>
                            <li className="dropdown-item" onClick={()=>filterOrders("completed")}>Completed</li>
                            <li className="dropdown-item" onClick={()=>filterOrders("cancelled")}>Cancelled</li>
                            <li className="dropdown-item" onClick={()=>filterOrders("processing")}>Processing</li>
                        </ul>
                    </button>:
                    <Skeleton width={120} className="btn rounded-2 border border-1 px-4 py-3 bg-body" />
                }
                {orders.message?
                    <button className={`align-self-stretch d-flex rounded-2 border border-1 align-items-center px-3 py-2`} title="Reset All" style={{backgroundColor:'rgba(137,70,207,0.2)', color:'#8946CF'}} onClick={()=>{setFilter(orders.lists); JSON.stringify(initialSort)!==JSON.stringify(sort) && setSort(initialSort); date!==""&&setDate(''); window.history.pushState({}, '', '/listings/orders')}} disabled={!orders.success||orders.status==='loading'}>
                        <i className="fa-solid fa-arrows-rotate"></i>
                    </button>:
                    <Skeleton width={50} className="btn rounded-2 border border-1 px-4 py-3" highlightColor="#cbaee6" baseColor="#DFCCF1" direction="rtl" duration={2} />
                }
                </div>
            </div>
            <div className="search flex-fill px-4 py-3 position-relative">
                <input type="search" className="w-100 border border-1 border-tertiary px-5 py-2" value={search} onChange={(e)=>setSearch(e.target.value)} placeholder="Search Orders" disabled={!orders.success||orders.status==='loading'}/>
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
                        {!Array.isArray(orders?.lists) && <tr><td colSpan="5" className="text-danger">{orders?.message}</td></tr>}
                        {orders.success && filter.length===0 && <tr><td colSpan="5"><div className="flex-fill d-flex text-primary align-items-center"><i className="fa-solid fa-circle-info me-2"></i>No order. Kindly review your filter(s) or check back later.</div></td></tr>}
                        {Array.isArray(orders.lists) && filter.map((order, index)=>(
                            <tr key={index} className="fs-6 px-4" role="button" onClick={()=>window.history.pushState({}, '', `?id=${order?._id}`)}>
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
                {orders?.success && filter.length > 0 &&
                    <>
                        <span className="d-flex me-md-auto text-center">Showing {page*display+1} - {Math.min(page*display+display, Math.max(orders?.count, filter.length))} of {Math.max(orders?.count, filter.length)}</span>
                        <div className="d-flex gap-1 align-items-center transition">
                            {Math.ceil(orders?.count/display)>1 && page>0?
                                <i className="fa-solid fa-caret-left" role="button" onClick={()=>setPage(page-1)} style={{color:'#8946CF'}}></i>:<i className="fa-solid fa-caret-left text-white"></i>
                            }
                            {Array.from({ length: Math.ceil(orders?.count/display)}, (pg, index)=>(
                                <div key={index} className="d-flex rounded-3 justify-content-center text-center transition" style={{width:'25px', height:'25px', backgroundColor:page===index?'#8946CF':'#c79cff', color:'#FFFFFF', verticalAlign:'middle'}} role="button" onClick={()=>setPage(index)}>{index+1}</div>
                            ))}
                            {Math.ceil(orders?.count/display)>1 && (page===0||page < Math.ceil(orders?.count/display)-1)?
                                <i className="fa-solid fa-caret-right" role="button" onClick={()=>setPage(page+1)} style={{color:'#8946CF'}} disabled ></i>:<i className="fa-solid fa-caret-right text-white"></i>
                            }
                        </div>
                    </>
                }
            </div>
            {orders.status==="loading" &&
                <div className="d-flex justify-content-center align-items-center position-absolute top-0 end-0 bottom-0 start-0" style={{backgroundColor:'rgba(240, 240, 243, 0.8)'}}>
                    <i className="fa-solid fa-circle-notch fa-spin me-2"></i> Please Wait...
                </div>
            }
        </>
    )
}