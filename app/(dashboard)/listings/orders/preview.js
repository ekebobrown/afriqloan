"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from 'next/navigation'

import { List } from "@/app/(dashboard)/listings/orders/list"

export default function Preview(){
    const [orders, setOrders] = useState([])
    const [order, setOrder] = useState({})
    const id = useSearchParams().get('id')

    useEffect(()=>{
        if(id){
            const cached = orders.some((order)=>order._id === id)
            if(!cached){
                setOrder({...order, isLoading:true})
                fetch(`/api/listing/orders/order?id=${id}`)
                .then(async(response)=>{
                    const data = await response.json()
                    if(!response.ok) throw new Error()
                    return data
                })
                .then((data)=>{
                    setOrders([...orders, data.order])
                    setOrder({
                        isLoading:false,
                        isError:false,
                        items:data.order.items,
                        status:data.order.status
                    })
                })
                .catch((error)=>{
                    setOrder({isLoading:false, isError:true})
                })
            }else{
                setOrder({
                    isError:false,
                    items:orders.find((order)=>order._id===id).items,
                    status:orders.find((order)=>order._id===id).status
                })
            }
        }
    }, [id])

    return (
        <>
            {(!id ||(orders.length===0 && !order.isError)) &&
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
            {id && orders.length>0 && !order.isError &&
                <div className="items flex-fill d-flex flex-column gap-3 align-items-start overflow-scroll" style={{maxHeight:'400px', scrollbarWidth:'none'}}>
                    <List order={order} />
                </div>
            }
            {order.isLoading  &&
                <div className="d-flex justify-content-center align-items-center position-absolute top-0 end-0 bottom-0 start-0 py-5" style={{backgroundColor:'rgba(240, 240, 243, 0.8)'}}>
                </div>
            }
        </>
    )
}