
'use client'

import { useState, useEffect } from 'react'
import { createPortal, useFormState } from 'react-dom'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import Skeleton from 'react-loading-skeleton'

import LGA from '@/app/components/lgas'
import Modal from '@/app/components/modals'
import placeholder from "@/public/image-placeholder.webp"
import { jointSavingsInvitation, upgradeToMerchant } from '@/app/lib/actions'
import { Submit } from '@/app/components/buttons'

export function Token({title, balance, jointsavings, currentuser }){
    const [view, setView] = useState({})
    const [modal, setModal] = useState({width:0, height:0, opacity:0})
    const [response, action] = useFormState(jointSavingsInvitation, {})
    const amountFormat = new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', currencyDisplay: 'symbol' })

    useEffect(()=>{
        setView((view)=>({...view, ['title']: JSON.parse(window.localStorage.getItem(`${title}_balance_show`))}))
    },[title])

    function toggleView() {
        setView({...view, ['title']:!view['title']})
        window.localStorage.setItem(`${title}_balance_show`, !view['title'])
    }

    return (
        <>
            <div className="col-12 col-md-4 d-flex flex-column bg-light p-4 rounded-4 gap-3 fs-4 overflow-x-hidden border border-4 border-primary shadow-sm">
                <h5 className="text-truncate fw-bold">{title}</h5>
                <div className="d-inline-flex align-items-center fs-5 fw-semibold">
                    {view['title']?amountFormat.format(balance):"**************"}
                    <i className="fa-regular fa-eye ms-2 align-text-top" onClick={toggleView} role="button"></i>
                </div>
                <div className="d-flex align-items-center justify-content-end">
                    {title.includes('Joint')&& jointsavings.manager===currentuser && <button className="border-0 bg-transparent text-primary fs-6 me-auto" role="button" onClick={()=>setModal({width:'100%', height:'100%', opacity:1})} disabled={jointsavings.members?.total===jointsavings.members?.joined.length}>Invite Others ({jointsavings.members?.total-jointsavings.members?.joined.length})</button>}
                    {!title.includes('Wallet') && <><Link href={`/savings/fund?q=${title.toLowerCase().split(' ').join('-')}`}  className="link fa-solid fa-square-plus me-2"></Link>
                    <span>deposit</span></>}
                    {!title.includes('Joint') && <i className="fa-solid fa-database ms-auto"></i>}
                </div>
            </div>
            {createPortal(
                <Modal width={modal.width} height={modal.height} setModal={setModal}>
                    <div className="p-3 p-md-5">
                        <div className="text-center mb-4">
                            <h4 className="mb-0 text-primary">SEND INVITATION</h4>
                            <p className="mb-0">Please input the phone number or email address of the user you wish to invite.</p>
                        </div>
                        <form action={action} className="w-100 row justify-content-center gap-2 mb-2">
                            <input type="text" name="invitee" className="col-11 col-md-6 rounded-pill px-4" placeholder="Email or mobile number" required autoFocus />
                            <Submit classNames="col-11 col-md-5 px-4">Send</Submit>
                        </form>
                        <div className={`text-center fst-italic ${response?.success?"text-success":"text-danger"}`}>{response?.message}</div>
                        <i className="position-absolute top-0 end-0 mt-4 me-2 fa-solid fa-circle-xmark fa-xl text-primary" role="button" onClick={()=>setModal({width:0, height:0, opacity:0})}></i>
                    </div>
                </Modal>, document.body
            )}
        </>
    )
}

export function Order({type, bg, color, value}){
    const numberFormat = new Intl.NumberFormat('en-NG', type==="Orders" && {style: 'currency', currency: 'NGN'})
    return(
        <div className="flex-fill d-flex flex-column gap-3 p-3 justify-content-between rounded-4 text-white shadow-sm" style={{backgroundImage:`url(${bg})`, backgroundColor:color, backgroundSize:'cover', minWidth:'calc(360px - 48px)'}}>
            <div className="position-relative align-self-start">
                <div className={`rounded-2 p-3 bg-body-tertiary opacity-25`}>
                </div>
                <i className={`fa-solid ${type==='Orders'&&'fa-credit-card'} ${type==='Customers'&&'fa-user-plus'} ${type==='Subscriptions'&&'fa-box-archive'} position-absolute top-50 start-50 translate-middle`}></i>
            </div>
            <span className="text-nowrap">Total {type}</span>
            <h4>{numberFormat.format(value)}</h4>
        </div>
    )
}

export function Services({image, title, children, layout}) {
  return (
    <div className="bg-tertiary rounded-5 px-4 py-5">
        <div className={`d-flex ${layout===1?'flex-column align-items-center':'flex-row'}`}>
            <Image
                src={image}
                alt={title}
                width={100}
                height={100}
            />
            <div className="fs-4 fw-semibold my-2">
                {title}
            </div>
        </div>
        {children}
    </div>
  )
}

export function Listing({_id, image, title, description, pricing, preview, user, remove, status}) {
    const [index, setIndex] = useState(0)
    const [state, setState] = useState('')
    const [modal, setModal] = useState({width:'100%', height:'100%', opacity:1})
    const [action, setAction] = useState('')
    const amount = new Intl.NumberFormat('en-NG', {style:'currency', currency:'NGN'})
    const router = useRouter()
    const pathname = usePathname()

    function updateListing(_id, action){
        const info = document.getElementById('info')
        setState('pending')
        fetch(`/api/listing?_id=${_id}&action=${action}`, {
            method: "PATCH"
        })
        .then(async (response)=>{
            const data = await response.json()
            if(!response.ok) throw new Error(data.message)
            return data
        })
        .then((data)=>{
            info.innerHTML = `<i class="text-success">${data.message}</i>`
        })
        .catch((error)=>{
            info.innerHTML = `<i class="text-danger">${error.message}. Please try again!</i>`
        })
        .finally(()=>{
            setState('completed')
            setTimeout(()=>{
                setState('')
            }, 4000)
        })
    }

    return (
        <>
        <div className={`${preview?'h-75':'h-100'} ${status==="out of order"||status==="pending"?'opacity-50':''} d-flex flex-column rounded-4 shadow-sm position-relative`}>
            {user && !preview && !pathname.includes('services') &&
            <>
                <div className="d-flex align-items-center justify-content-center bg-primary rounded-circle p-2 position-absolute z-2" data-bs-toggle="dropdown" role="button" style={{width:'30px', height:'30px', top:'10px', right:'10px'}}>
                    <i className="fa-solid fa-ellipsis-vertical text-white fa-xl"></i>
                </div>
                <ul className="dropdown dropdown-menu bg-white shadow border-0 rounded-1" style={{minWidth:'5rem'}}>
                    <li className="px-4 py-1" role="button" onClick={()=>router.push(`/listings/listing?mode=edit&id=${_id}`)}>Edit</li>
                    <li className="px-4 py-1" role="button" onClick={()=>{setAction('deleted'); setState('action')}}>Delete</li>
                    <li className="px-4 py-1" role="button" onClick={()=>{setAction(status==="out of order"?'active':'out of order'); setState('action')}}>{status==="out of order"?'Set Active':'Out of Order'}</li>
                </ul>
            </>
            }
            {(state === "action" || state === "pending"||state === "completed") &&
                createPortal(
                    <Modal height={modal.height} width={modal.width} setModal={setModal}>
                        <>
                            <p className="text-primary fs-5 fw-semibold text-center">{`CONFIRM UPDATE?`}</p>
                            <div className="w-100 d-flex flex-column flex-md-row gap-2 justify-content-center ">
                                <button className="btn btn-primary rounded-pill px-4 border border-2 border-primary" onClick={()=>setState('')} disabled={state==='pending'||state==='completed'}><i className="fa-solid fa-xmark pe-2"></i>Cancel</button>
                                <button className="btn btn-primary rounded-pill px-4 border border-2 border-primary" onClick={()=>updateListing(_id, action)} disabled={state==='pending'||state==='completed'}><i className={`fa-solid ${state==='pending'?'fa-circle-notch fa-spin':'fa-check'} me-2`}></i>{state === 'pending'?'Please Wait':'Confirm'}</button>
                            </div>
                            <em id="info"></em>
                        </>
                    </Modal>,
                    document.getElementById('listings'))
            }
            <div className="position-relative">
                <Image
                    src={image[index]||placeholder}
                    sizes="100vw"
                    width={100}
                    height={100}
                    style = {{
                        width: '100%',
                        height: '250px',
                        objectFit: 'cover',
                        borderRadius: '15px 15px 0 0'
                    }}
                    alt={title}
                />
                {preview && image.length>0 && <i className="fa-solid fa-circle-minus fa-2x text-danger position-absolute top-50 end-50" title="Remove picture" role="button" onClick={()=>{remove(index); setIndex(0)}}></i>}
                {image.length>1 &&
                    <>
                        {index!=0 &&
                            <button className="d-flex align-items-center justify-content-center position-absolute top-50 start-0 mx-3 border border-0 bg-primary rounded-circle" style={{width:"40px", height:"40px"}} onClick={()=>setIndex(index-1)}>
                                <i className="fa-solid fa-angle-left fa-xl text-white"></i>
                            </button>
                        }
                        {index!=image.length-1 && 
                            <button className="d-flex align-items-center justify-content-center position-absolute top-50 end-0 mx-3 border border-0 bg-primary rounded-circle" style={{width:"40px", height:"40px"}} onClick={()=>setIndex(index+1)}>
                                <i className="fa-solid fa-angle-right fa-xl text-white"></i>
                            </button>
                        }
                    </>
                }
            </div>
            <div className="flex-fill d-flex flex-column gap-1 bg-body-secondary p-3 rounded-bottom-4">
                <h3 className="fw-bold">{title}</h3>
                <p className="mb-auto">{description}</p>
                <h5 className="text-primary mt-5">From {amount.format(pricing)} per day</h5>
                <div className="d-flex flex-column flex-md-row justify-content-between gap-2">
                    {(preview || (pathname.includes('services') && user?.type!=='merchant')) && <Link href="#" className={`${preview && 'pe-none'} btn btn-outline-primary border border-2 border-primary rounded-pill mb-2 px-3 flex-fill`} role="button" disabled={preview} >Book Now</Link>}
                    <Link href="#" className={`${preview && 'pe-none'} btn btn-primary border border-2 border-primary rounded-pill mb-2 px-3 flex-fill`} role="button" disabled={preview}>View Listing</Link>
                </div>
            </div>
        </div>
        {image.length===0 && <div className="d-flex justify-content-center align-items-center my-2 p-2 bg-warning-subtle"><i className="fa-solid fa-triangle-exclamation me-2"></i>You must have at lease one picture uploaded!</div>}
        </>
    )
}

export function Testimonial ({avatar = "/assets/picture-placeholder.jpeg", layout, author, children}){
    return (
        <div className="d-flex flex-column bg-tertiary rounded-3 px-4 py-3 mb-4 h-100">
            <div className={`d-flex ${layout===1?'flex-column flex-fill align-items-start justify-content-start':'flex-row align-items-end'} mb-2`}>
                <div className={`${layout===1?'mb-auto':''} me-4`} style={{height:80, width:80, borderRadius:"50%", overflow:"hidden"}}>
                    <Image
                        src={avatar}
                        alt={author}
                        width={80}
                        height={80}
                    />
                </div>
                <div className="fs-4 text-primary fw-bold my-2">
                    {author}
                </div>
            </div>
            <div className="fs-6 fw-semibold">
                {children}
            </div>
        </div>
    )
}

export function TestimonialsFallbackCard ({ layout }){
    return (
        <div className="d-flex flex-column bg-secondary-subtle rounded-3 px-4 py-3 mb-4 h-100">
            <div className={`d-flex ${layout===1?'flex-column flex-fill align-items-start justify-content-start':'flex-row align-items-end'} mb-2`}>
                <Skeleton width={80} height={80} className={`${layout===1?'mb-auto':''} me-4 rounded-circle`}/>
                <div className="flex-fill d-flex flex-row fs-3 fw-semibold my-2">
                    <Skeleton width={120} inline={true} className="rounded-pill me-2" />
                    <Skeleton width={80} inline={true} className="rounded-pill" />
                </div>
            </div>
            <Skeleton height={10} count={2.5} className="fs-5 rounded-pill" />
        </div>
    )
}

export function DashboardCard({ user, title, service }){
    const [modal, setModal] = useState({width:0, height:0, opacity:0})
    const [response, action] = useFormState(upgradeToMerchant, {})
    const router = useRouter()

    if (response?.success) {
        setTimeout(()=>{
            setModal({width:0, height:0, opacity:0})
        }, 2000)
    }

    return (
        <div className="card col-12 col-md-5 d-flex flex-column rounded-4 justify-content-between bg-white p-4 p-md-5 gap-4">
            <h4>{title}</h4>
            <div className="d-flex flex-row align-items-center">
                <div className="d-flex flex-column flex-xl-row me-auto gap-2">
                    {service==="loan" && <button className="btn btn-primary border border-2 border-primary rounded-pill fw-bold px-4" onClick={()=>{user.loans?router.push("/loans"):setModal({width:'100%', height:'100%', opacity:1})}}>{user?.loans?"View Status":"Apply"}</button>}
                    {service==="space" &&
                        <>
                            {user?.type === "merchant" &&
                                <Link href="/listings?type=coworking" className="btn btn-primary border border-2 border-primary rounded-pill fw-bold px-4">View Listings</Link>
                            }
                            {user?.type !== "merchant" &&
                                <button className="btn btn-primary border border-2 border-primary rounded-pill fw-bold px-4" onClick={()=>setShow({width:'100%', height:'100%', opacity:1})}>Upgrade To Mechant</button>
                            }
                        </>
                    }
                </div>
                <span className="d-flex justify-content-center align-items-center p-2 rounded-circle" style={{backgroundColor: '#8AF0FF', width: '45px', height: '45px'}}>
                    <i className={`fa-solid fa-fw fa-xl ${service==="space"?"fa-people-roof":"fa-hand-holding-dollar"}`}></i>
                </span>
            </div>
            {createPortal(
                <Modal height={modal.height} width={modal.width} setModal={setModal}>
                    {service==="loan"&&
                        <div className="p-3 p-md-5">
                            <div className="text-center mb-4">
                                <h4 className="text-primary mb-0">APPLICATION TYPE</h4>
                                <p className="text-primary mb-0">Are you applying for a personal loan or onbehalf of an establishment?</p>
                            </div>
                            <div className="w-100 d-flex flex-column flex-md-row justify-content-center gap-3">
                                <Link href="/loans/application?type=individual" className="btn btn-primary border border-2 border-primary rounded-pill px-4">Individual</Link>
                                <Link href="/loans/application?type=corporate" className="btn btn-primary border border-2 border-primary rounded-pill px-4">Corporate</Link>
                            </div>
                        </div>
                    }
                    {service==="space"&&
                        <>
                            <div>
                                <h4 className="text-primary text-center mb-0">Select Your Primary Location</h4>
                                <p className="mb-0 text-center ">Kindly select the location as to which the property you&apos;re leasing is located. </p>
                            </div>
                            <form action={action} className="w-100 d-flex flex-column gap-4">
                                <div className="d-flex flex-column flex-md-row gap-2">
                                    <select name="location" className="flex-fill rounded-3 flex-fills py-3">
                                        <LGA />
                                    </select>
                                    <Submit classNames="px-5">Submit</Submit>
                                </div>
                                <input type="hidden" name="userId" defaultValue={user._id} />
                                <em className={`text-center ${response?.success?"text-success":"text-danger"}`}>{response?.message}</em>
                            </form>
                        </>
                    }
                    <i className="position-absolute top-0 end-0 mt-4 me-2 fa-solid fa-circle-xmark fa-xl text-primary" role="button" onClick={()=>setModal({width:0, height:0, opacity:0})}></i>
                </Modal>, document.body
            )}
      </div>
    )
}
