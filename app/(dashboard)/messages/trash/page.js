"use client"

import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"
import Skeleton from "react-loading-skeleton"

import { useFetcher } from "@/app/lib/fetchers"
import Toast from "@/app/components/toasts"
import silhouette from "@/public/silhouette/universal-blue.svg"

export default function Trash(){
    const [preview, setPreview] = useState()
    const [selected, setSelected] = useState([])
    const [update, setUpdate] = useState(false)
    const [toast, setToast] = useState({})
    const {data, error, isLoading, isValidating, mutate} = useFetcher('api/messages')

    function handleClick(message, index, property, value, e){
        if(message.flags[property]!==value){
            setUpdate(true)
            fetch("/api/messages", {
                method: value==="deleted"?"DELETE":"PATCH",
                body: JSON.stringify({
                    _id: message._id,
                    property: property,
                    value: value
                })
            })
            .then((response) => {
                if(!response.ok) throw new Error("An error occured trying to update message status")
                return response.json()
            })
            .then((data) => {
                mutate()
                setUpdate(false)
                if(value!=="read"&&value!=="unread") {setToast({...toast, state:true, color: '#FFFFFF', status: 'success', msg:`Message successfully ${typeof value==='boolean'?value===true?'starred':'unstarred':e.shiftKey?'deleted':'trashed'} `})}
            })
            .catch((error) => {
                setUpdate(false)
                if(value!=="read"&&value!=="unread") {setToast({...toast, state:true, color: '#FFFFFF', status: 'error', msg:`An error occurred. Please try again`})}
            })
        }
    }

    return(
        <section id="messages" className="flex-fill h-100 d-flex flex-column flex-md-row border-light border">
            <div className="col-12 col-md-4 bg-white shadow-sm">
                <div className="d-flex justify-content-between p-3 shadow-sm">
                    <div className="d-flex align-items-center position-relative">
                        <input type="checkbox" checked={selected?.length === data?.length && data?.length > 0} onChange={(e)=>{!e.target.checked?setSelected([]):setSelected(data?.map((msg)=> msg._id))}} disabled={data?.filter((message)=>message.flags.status==="deleted").length<=0}/>
                        <i className="fa-solid fa-angle-down ms-2" role="button" data-bs-toggle="dropdown"  disabled={data?.filter((message)=>message.flags.status==="deleted").length<=0}></i>
                        <ul className="dropdown dropdown-menu bg-white shadow border-0 rounded-0" style={{minWidth:'5rem'}}>
                            <li className="px-4 py-1" role="button" onClick={()=>setSelected(data?.map((msg)=> msg._id))}>All</li>
                            <li className="px-4 py-1" role="button" onClick={()=>setSelected([])}>None</li>
                            <li className="px-4 py-1" role="button" onClick={()=>setSelected(data?.filter((msg)=>msg?.flags.status==="read").map((msg)=> msg._id))}>Read</li>
                            <li className="px-4 py-1" role="button" onClick={()=>setSelected(data?.filter((msg)=>msg?.flags.status==="unread").map((msg)=> msg._id))}>Unread</li>
                            <li className="px-4 py-1" role="button" onClick={()=>setSelected(data?.filter((msg)=>msg?.flags.starred).map((msg)=> msg._id))}>Starred</li>
                            <li className="px-4 py-1" role="button" onClick={()=>setSelected(data?.map((msg)=>selected.includes(msg._id)?null:msg._id).filter((msg)=>msg!==null))}>Inverse</li>
                        </ul>

                    </div>
                    {selected.length>0 &&
                        <div>
                            <i className="fa-solid fa-trash-can text-danger" title="Empty trash" role="button" onClick={(e)=>{e.stopPropagation()}}></i>
                        </div>
                    }
                    <div className="d-flex align-items-center">
                        <span>Sort</span>
                        <i className="fa-solid fa-angle-down ms-2" role="button" data-bs-toggle="dropdown" disabled={data?.filter((message)=>message.flags.status==="deleted").length<=0}></i>
                        <ul className="dropdown dropdown-menu bg-white shadow border-0 rounded-0" style={{minWidth:'5rem'}}>
                            <li className="px-4 py-1" role="button" onClick={()=>data?.sort((i, j)=>{i._id - j._id})}>None</li>
                            <li className="px-4 py-1" role="button" onClick={()=>data?.sort((i, j)=>{i.flags.status - j.flags.status})}>Read</li>
                            <li className="px-4 py-1" role="button" onClick={()=>data?.sort((i, j)=>{i.flags.status - j.flags.status})}>Unread</li>
                            <li className="px-4 py-1" role="button" onClick={()=>data?.sort((i, j)=>{i.flags.starred === j.flags.starred})}>Starred</li>
                        </ul>
                    </div>
                </div>
                {isLoading &&
                    [1,2,3,4].map((elem)=>(
                        <div key={elem} className="d-flex flex-column p-3 border-bottom border-light">
                            <div className="w-100 d-flex align-items-center">
                                <h6 className="mb-0 me-auto" style={{width:"30%"}}><Skeleton className="rounded-pill" /></h6>
                                <h6 style={{width:"25%"}}><Skeleton className="rounded-pill" /></h6>
                            </div>
                            <h6 className="mb-0" style={{width:"70%"}}><Skeleton className="rounded-pill" /></h6>
                            <div className="w-100 d-flex align-items-center">
                                <h6 className="mb-0 me-auto" style={{width:"90%"}}><Skeleton className="rounded-pill" /></h6>
                                <Skeleton width={15} height={15} className="rounded-circle" />
                            </div>
                        </div>
                    ))
                }
                {data && data?.filter((message)=>message.flags.status==="deleted").length === 0 && <div className="p-4">(empty)</div>}
                {data && data?.length > 0 &&
                    data?.filter((message)=>message.flags.status==="deleted").map((message, index)=>(
                        <div key={index} className={`position-relative message d-flex flex-row p-3 border-bottom border-light ${update?'opacity-50':''} ${selected.includes(message?._id)?'bg-tertiary':''}`} role="button" onClick={()=>setPreview(message)}>
                            <input type="checkbox" className="align-self-center me-2" checked={selected.includes(message._id)} onChange={()=>setSelected(selected.includes(message._id)?selected.filter(elem => elem !== message._id):[...selected, message._id])} onClick={(e)=>e.stopPropagation()}/>
                            <div className="flex-fill d-flex flex-column" style={{maxWidth:'92%'}}>
                                <div className={`d-flex align-items-center ${message.flags.status!=="unread"?"fw-normal":"fw-semibold text-primary"}`}>
                                    <h6 className={`me-auto mb-0 ${message.flags.status!=="unread"?"fw-normal":""}`}>{message.names}</h6>
                                    {new Date() - new Date(message.timestamp) < 86400000?new Date(message.timestamp).toLocaleTimeString():new Date(message.timestamp).toDateString()}
                                </div>
                                <div className="d-inline-flex align-items-center">
                                    <i className={`fa-solid fa-angles-right fa-xs me-1 ${message.flags.important?'text-danger':''}`} title="Toggle Importance"></i>
                                    <h6 className={`mb-0 ${message.flags.status!=="unread"?"fw-normal":"text-primary"}`}>{message.subject}</h6>
                                </div>
                                <div className="d-flex flex-row align-items-center justify-content-between">
                                    <p className="mb-0 d-inline-block text-truncate pe-2">{message.body.replace(/(<([^>]+)>)/ig, '')}</p>
                                    <i className={`${message.flags.starred?"fa-solid text-warning":"fa-regular"} fa-star fa-xs`}></i>
                                </div>
                            </div>
                            <div className="d-flex flex-row position-absolute top-50 start-50 translate-middle p-2 z-3">
                                <i className="action fa-solid fa-envelope-circle-check text-primary me-2" title="Move to inbox" role="button" onClick={(e)=>{e.stopPropagation(); setPreview(); handleClick(message, index, "status", "read", e)}}></i>
                                <i className="action fa-solid fa-trash-can text-danger" title="Delete forever" role="button" onClick={(e)=>{e.stopPropagation(); setPreview(); setSelected([]); handleClick(message, index, "status", "deleted", e)}}></i>
                            </div>
                        </div>
                    ))
                }
            </div>
            <div id="preview" className="flex-fill d-flex col-0 col-md-8">
                {!preview &&
                    <div className="flex-fill d-flex flex-column justify-content-center align-items-center">
                        <i className="fa-solid fa-envelope-open-text fa-10x text-white opacity-50"></i>
                        <p className="m-2 fw-semibold fs-6 text-primary">No conversations selected</p>
                    </div>
                }
                {preview &&
                    <div className="flex-fill d-flex flex-column">
                        <div className="d-flex flex-column px-4 py-3">
                            <h5 className="fw-bold text-primary">{preview.subject}</h5>
                            <div className="d-flex align-items-center">
                                <Image
                                    src={preview.avatar||silhouette}
                                    width={40}
                                    height={40}
                                    alt="image placeholder"
                                    style={{borderRadius:"50%"}}
                                />
                                <div className="d-flex flex-column ms-3">
                                    <span className="mb-0"><strong>From:</strong> {preview.names}</span>
                                    <small><strong>To:</strong> me</small>
                                </div>
                            </div>
                        </div>
                        <div className="flex-fill d-flex flex-column p-4 justify-content-between bg-body-tertiary">
                            <p dangerouslySetInnerHTML={{__html:preview.body}} />
                            <button className="align-self-start btn btn-tertiary border border-2 px-4 rounded-pill">Reply</button>
                        </div>
                    </div>
                }
            </div>
            {toast.state &&
                <Toast position="bottom-right" toast={toast} setToast={setToast}>
                    {toast.msg}
                </Toast>
            }
        </section>
    )
}