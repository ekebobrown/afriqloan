
'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'

import Skeleton from 'react-loading-skeleton'

export function Token({title, balance }){
    const [view, setView] = useState({})
    const amountFormat = new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', currencyDisplay: 'symbol' })

    useEffect(()=>{
        setView({...view, ['title']: JSON.parse(window.localStorage.getItem(`${title}_balance_show`))})
    },[])

    function toggleView() {
        setView({...view, ['title']:!view['title']})
        window.localStorage.setItem(`${title}_balance_show`, !view['title'])
    }

    return (
        <div className="col-12 col-md-4 d-flex flex-column bg-light p-4 rounded-4 gap-3 fs-4 overflow-x-hidden border border-4 border-primary shadow-sm">
            <h5 className="text-truncate fw-bold">{title}</h5>
            <div className="d-inline-flex align-items-center fs-5 fw-semibold">
                {view['title']?amountFormat.format(balance):"**************"}
                <i className="fa-regular fa-eye ms-2 align-text-top" onClick={toggleView} role="button"></i>
            </div>
            <div className="d-flex align-items-center justify-content-end">
                {title.includes('Joint')&&<Link href="#" className="link fs-6 me-auto" scroll={false}>Invite Others</Link>}
                {!title.includes('Wallet') && <><Link href={`/dashboard/fund?q=${title}`}  className="link fa-solid fa-square-plus me-2"></Link>
                <span>deposit</span></>}
                {!title.includes('Joint') && <i className="fa-solid fa-database ms-auto"></i>}
            </div>
        </div>
    )
}


export function ServiceCard({image, title, children, layout}) {
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

export function SpaceCard({image, title, description, charge}) {
    const amount = new Intl.NumberFormat('en-US', {style:'currency', currency:'NGN'})
    return (
        <div className="d-flex flex-column border rounded-4">
            <Image
                src={image}
                sizes="100vw"
                width={100}
                height={100}
                style = {{
                    width: '100%',
                    height: 'auto',
                    objectFit: 'contain',
                    borderRadius: '15px 15px 0 0'
                }}
                alt={title}
            />
            <div className="d-flex flex-column gap-4 bg-tertiary p-3 rounded-bottom-4">
                <h3 className="fw-bold">{title}</h3>
                <p>{description}</p>
                <h5>From {amount.format(charge)} per day</h5>
                <div className="d-flex flex-column flex-md-row justify-content-between">
                    <Link href="#" className="btn btn-primary rounded-pill mb-2" role="button">Book Now</Link>
                    <Link href="#" className="btn btn-outline-primary rounded-pill mb-2" role="button">Learn More</Link>
                </div>
            </div>
        </div>
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
                <div className="fs-3 text-primary fw-bold my-2">
                    {author}
                </div>
            </div>
            <div className="fs-6">
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
