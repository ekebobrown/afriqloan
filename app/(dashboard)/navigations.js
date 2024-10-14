"use client"
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

export function User({ user }) {
    const [msgcounts, setMsgcounts] = useState(0)
    const pathname = usePathname()

    useEffect(()=>{
        fetch(`/api/messages`, {next: {revalidate: 0}})
            .then((response)=>response.json())
            .then((messages)=>setMsgcounts(messages.filter(message=>message.flags.status==="unread").length))
            .catch((error)=>{
                throw new Error("Error retrieving your message. Please refresh to try again!")
            })
    }, [])

    return (
        <>
            <li className={`${pathname.includes('dashboard')?'active':''}`}><Link href="/dashboard" className="link d-inline-flex align-items-center"><span className="fa-solid fa-gauge-high fa-fw me-2"></span>Dashboard</Link></li>
            {user?.loans &&
                <>
                    <li className={`${pathname.includes('loans')?'active':''}`}><Link href="/loans" className="link navbar-toggler d-inline-flex align-items-center"><span className="fa-solid fa-landmark fa-fw me-2"></span>Loans</Link></li>
                    <ul className={`collapsible ${pathname.includes('loans')?'expand':''}`}>
                        <li className={`${pathname.includes('recovery')?'submenu':''}`}><Link href="/loans/recovery" className="link d-inline-flex align-items-center"><span className="fa-solid fa-money-bill-transfer fa-fw me-2 fs-6"></span><span className="fs-6">Recovery</span></Link></li>
                    </ul>
                </>
            }
            <li className={`${pathname.includes('savings')?'active':''}`}><Link href="/savings" className="link d-inline-flex align-items-center"><span className="fa-solid fa-vault fa-fw me-2"></span>Savings</Link></li>
            {user?.type==="merchant"&&
                <>
                    <li className={`${pathname.includes('listings')?'active':''}`}><Link href="/listings?type=coworking" className="link d-inline-flex align-items-center"><span className="fa-solid fa-elevator fa-fw me-2"></span>Listings</Link></li>
                    <ul className={`collapsible ${pathname.includes('listings')?'expand':''}`}>
                        <li className={`${pathname.includes('orders')?'submenu':''}`}><Link href="/listings/orders" className="link d-inline-flex align-items-center"><span className="fa-solid fa-bag-shopping fa-fw me-2 fs-6"></span><span className="fs-6">Orders</span></Link></li>
                        <li className={`${pathname.includes('subscriptions')?'submenu':''}`}><Link href="/listings/subscriptions" className="link d-inline-flex align-items-center"><span className="fa-solid fa-person-circle-plus fa-fw me-2 fs-6"></span><span className="fs-6">Subscriptions</span></Link></li>
                        <li className={`${pathname.includes('chat')?'submenu':''}`}><Link href="/listings/chats" className="link d-inline-flex align-items-center"><span className="fa-solid fa-comments fa-fw me-2 fs-6"></span><span className="fs-6">Chats</span></Link></li>
                    </ul>
                </>
            }
            <>
                <div className="position-relative">
                    <li className={`${pathname.includes('inbox')?'active':''}`}><Link href="/messages/inbox" className="link d-inline-flex align-items-center"><span className="fa-solid fa-inbox fa-fw me-2"></span>Inbox</Link></li>
                    {msgcounts>0&&<div className="position-absolute d-flex align-items-center justify-content-center rounded-circle bg-warning" style={{width:'18px', height:'18px', top:'2px', left:'12px'}}><small>{msgcounts}</small></div>}
                </div>
                <ul className={`collapsible ${pathname.includes('messages')?'expand':''}`}>
                    <li className={`${pathname.includes('draft')?'submenu':''}`}><Link href="/messages/drafts" className="link d-inline-flex align-items-center"><span className="fa-solid fa-file-lines fa-fw me-2 fs-6"></span><span className="fs-6">Drafts</span></Link></li>
                    <li className={`${pathname.includes('trash')?'submenu':''}`}><Link href="/messages/trash" className="link d-inline-flex align-items-center"><span className="fa-solid fa-trash fa-fw me-2 fs-6"></span><span className="fs-6">Trash</span></Link></li>
                </ul>
            </>
        </>
    )
}

export function Info() {
    const pathname = usePathname().split('/')
    const path = pathname[pathname.length-1]

    return (
        <>
            <li className={`${pathname.includes('settings')?'active':''}`}><Link href="/settings" className="link d-inline-flex align-items-start lh-1"><span className="fa-solid fa-gear fa-fw me-2"></span>Setting</Link></li>
            <li className={`${pathname.includes('information')?'active':''}`}><Link href="/information" className="link d-inline-flex align-items-start lh-1"><span className="fa-solid fa-circle-info fa-fw me-2"></span>Information</Link></li>
            <li className={`${pathname.includes('terms')?'active':''}`}><Link href="/terms" className="link d-inline-flex align-items-start lh-1"><span className="fa-solid fa-shield-halved fa-fw me-2"></span>Security Terms</Link></li>
            <li className={`${pathname.includes('#')?'active':''}`}><span className="fa-solid fa-phone fa-fw me-2"></span>+234-800-300-333</li>
        </>
    )
}