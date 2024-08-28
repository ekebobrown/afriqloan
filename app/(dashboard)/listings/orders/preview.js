"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from 'next/navigation'
import Image from "next/image"

export default function Preview(){
    const [order, setOrder] = useState({})
    const id = useSearchParams().get('id')
    const currencyFormat = new Intl.NumberFormat('en-NG', {style: 'currency', currency: 'NGN'})

    useEffect(()=>{
        if(id){
            setOrder({...order, isLoading:true})
            fetch(`/api/listing/orders/order?id=${id}`)
            .then(async(response)=>{
                const data = await response.json()
                if(!response.ok) throw new Error()
                return data
            })
            .then((data)=>{
                setOrder({...order, data:data.order, isLoading:false, isError:false})
            })
            .catch((error)=>{
                console.log(error)
                setOrder({...order, data:null, isLoading:false, isError:true})
            })
        }else{
            setOrder({})
        }
    }, [id])

    return (
        <>
            {(!id || Object.values(order).length<2) &&
                <div className="h-100 d-flex flex-column justify-content-center align-items-center gap-2">
                    <i className="fa-solid fa-bag-shopping fa-5x text-body-tertiary"></i>
                    <h6 className="text-primary">Select an order to show details.</h6>
                </div>
            }
            {order.isError &&
                <div className="h-100 d-flex flex-column justify-content-center align-items-center gap-2">
                    <i className="fa-solid fa-triangle-exclamation fa-5x text-warning"></i>
                    <h6 className="text-warning">Error previewing order. Please try again.</h6>
                </div>
            }
            {order.isLoading &&
                <div className="d-flex justify-content-center align-items-center position-absolute top-0 end-0 bottom-0 start-0" style={{backgroundColor:'rgba(240, 240, 243, 0.8)'}}>
                    <i className="fa-solid fa-circle-notch fa-spin me-2"></i> Please Wait...
                </div>
            }
            {order?.data &&
                <div className="flex-fill d-flex flex-column gap-5 align-items-center overflow-scroll" style={{maxHeight:'400px', scrollbarWidth:'none'}}>
                    {order.data?.map((item, index)=>(
                        <div key={index} className="d-flex gap-2">
                            <Image
                                src={item.items.image[0]}
                                width={100}
                                height={100}
                                style={{borderRadius:"4px"}}
                                alt={item.items.title}
                            />
                            <div className="d-flex flex-column">
                                <h5 className="mb-0 text-primary">{item.items.title}</h5>
                                <small><strong>Description</strong><br />{item.items.description}</small>
                                <small><strong>Price<i className="fa-solid fa-angles-right fa-2xs"></i></strong> {currencyFormat.format(item.items.pricing)}</small>
                                <small><strong>Status<i className="fa-solid fa-angles-right fa-2xs"></i></strong><span className={`ms-2 ${item.status==="processing"?"text-warning":"text-primary"}`}>{item.status.charAt(0).toUpperCase()+item.status.slice(1,)}</span></small>
                                <div className="d-flex flex-column flex-md-row gap-2 mt-2">
                                    <button className="btn btn-primary rounded-pill border border-2 border-primary px-3 py-0 bg-primary"><small>Approve</small></button>
                                    <button className="btn btn-primary rounded-pill border border-2 border-primary px-3 py-0 bg-primary"><small>Reject</small></button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            }
        </>
    )
}