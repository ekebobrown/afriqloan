"use client"

import { useState, useEffect, useRef } from "react"
import { useSearchParams } from 'next/navigation'
import Image from "next/image"

export default function Preview(){
    const [order, setOrder] = useState({items:[]})
    const id = useSearchParams().get('id')
    const currencyFormat = new Intl.NumberFormat('en-NG', {style: 'currency', currency: 'NGN'})
    const idRef = useRef()

    useEffect(()=>{
        if(id){
            const cached = order.items?.some((item)=>item._id === id)
            if(!cached){
                setOrder({...order, isLoading:true})
                fetch(`/api/listing/orders/order?id=${id}`)
                .then(async(response)=>{
                    const data = await response.json()
                    if(!response.ok) throw new Error()
                    return data
                })
                .then((data)=>{
                    idRef.current = id
                    setOrder({...order, value:data.value, items:[...order.items, ...data.items], isLoading:false, isError:false})
                })
                .catch((error)=>{
                    setOrder({...order, isLoading:false, isError:true})
                })
            }else{
                idRef.current = id
                setOrder({...order, isLoading:false, isError:false})
            }
        }
    }, [id])

    return (
        <>
            {(!id ||(order.items.length===0 && !order.isError)) &&
                <div className="h-100 d-flex flex-column justify-content-center align-items-center gap-2 py-5">
                    <i className="fa-solid fa-bag-shopping fa-5x text-body-tertiary"></i>
                    <h6 className="text-primary text-center">Select an order to show details.</h6>
                </div>
            }
            {order.isError &&
                <div className="h-100 d-flex flex-column justify-content-center align-items-center gap-2 py-5">
                    <i className="fa-solid fa-triangle-exclamation fa-4x text-warning-emphasis"></i>
                    <small className="text-warning-emphasis text-center">Error previewing order. Please check the order ID and try again.</small>
                </div>
            }
            {id && order?.items.length > 0 && 
                <>
                <div className="items flex-fill d-flex flex-column gap-3 align-items-center overflow-scroll" style={{maxHeight:'400px', scrollbarWidth:'none'}}>
                    {order.items?.filter((item)=>item._id===idRef.current)?.map((order, index)=>(
                        <div key={index} className="item d-flex flex-column flex-md-row gap-2">
                            <div className="position-relative" style={{minWidth:'120px', height:'120px'}}>
                                <Image
                                    src={order.item?.image[0]}
                                    fill
                                    style={{objectFit: "cover", borderRadius:"4px"}}
                                    alt={order.item?.title}
                                />
                            </div>
                            <div className="d-flex flex-column">
                                <h5 className="mb-0 text-primary">{order.item?.title}</h5>
                                <small className="mb-2"><strong>Description</strong><br />{order.item.description}</small>
                                <small><strong>Price<i className="fa-solid fa-angles-right fa-2xs"></i></strong> {currencyFormat.format(order.item.pricing)}</small>
                                <small><strong>Status<i className="fa-solid fa-angles-right fa-2xs"></i></strong><span className={`ms-2 ${order.status==="processing"?"text-warning":"text-primary"}`}>{order.status.charAt(0).toUpperCase()+order.status.slice(1,)}</span></small>
                                {order.status==="processing" && <div className="d-flex flex-sm-column flex-md-row gap-2 mt-2">
                                    <button className="btn btn-primary rounded-pill border border-2 border-primary px-3 py-0 bg-primary align-self-start d-flex align-items-center" style={{fontSize:'0.8rem'}}><i className="fa-solid fa-xmark me-1 shadow-sm"></i>Drop</button>
                                    <button className="btn btn-primary rounded-pill border border-2 border-primary px-3 py-0 bg-primary align-self-start d-flex align-items-center" style={{fontSize:'0.8rem'}}><i className="fa-solid fa-check me-1 shadow-sm"></i>Process</button>
                                </div>}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="top-shadow d-flex flex-column flex-md-row align-items-center border-top justify-content-between position-aboslute pt-2 bottom-0 start-0 end-0 gap-2">
                    <h6 className="align-self-start mb-0">Total Amount: {currencyFormat.format(order.items?.filter((item)=>item._id===idRef.current).reduce((sum, item)=>sum+item.item.pricing, 0))}</h6>
                    {order.items?.find((item)=>item._id===idRef.current).status==="processing" && <button className="align-self-end btn btn-primary rounded-pill border border-2 border-primary px-3 py-0 bg-primary align-self-start d-flex align-items-center" style={{fontSize:'0.8rem'}}><i className="fa-solid fa-check me-1 shadow-sm"></i>Process All</button>}
                </div>
                </>
            }
            {order.isLoading &&
                <div className="d-flex justify-content-center align-items-center position-absolute top-0 end-0 bottom-0 start-0 py-5" style={{backgroundColor:'rgba(240, 240, 243, 0.8)'}}>
                    <i className="fa-solid fa-circle-notch fa-spin me-2"></i> Please Wait...
                </div>
            }
        </>
    )
}