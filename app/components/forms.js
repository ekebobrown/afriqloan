'use client'

import Link from 'next/link'
import { useState, useEffect, useRef, useId } from 'react'
import { useFormStatus, useFormState } from 'react-dom'
import { useSearchParams, useRouter } from 'next/navigation'

import { submitForm, recoverPassword } from '@/app/lib/actions'
import { Submit } from '@/app/components/buttons'

export function Newsletter() {
    useEffect(()=>{
        console.log(document.cookies)
    },[])

    async function submitForm(formData){
        const subscriberInfo = {
            names: formData.get('names'),
            phone: formData.get('phone'),
            email: formData.get('email'),
            active: true
        }
        const response = await fetch(`/api/newsletter`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(subscriberInfo)
        })
        const data = await response.json()
        const alert = document.getElementById("alert")
        if (response.ok) {
            const inputs = document.getElementsByTagName("input")
            alert.innerHTML=`<small class="text-success">${data.message}</small>`
            for(const input of inputs){
                input.value=""
            }
        }else{
            alert.innerHTML=`<small class="text-danger">${data.error}</small>`
        }

        setTimeout(()=>{
            alert.innerHTML = "&nbsp;"
        }, 8000)
    }

    return (
        <form action={submitForm} className="d-flex flex-column w-100 px-4 px-md-5 pt-5 pb-4 bg-white rounded-5">
            <label className="d-flex flex-column align-items-start mb-3 fs-6">Your Name<input type="text" name="names" className="w-100" placeholder="e.g John Doe" required /></label>
            <label className="d-flex flex-column align-items-start mb-3">Phone Number<input type="phone" name="phone" className="w-100" placeholder="e.g +234-801-234-5678" required /></label>
            <label className="d-flex flex-column align-items-start mb-3">E-mail Address<input type="email" name="email" className="w-100" placeholder="e.g johndoe@gmail.com" required /></label>
            <Submit>Submit</Submit>
            <em id="alert" className="text-center pt-1">&nbsp;</em>
        </form>
  )
}

export function AccountOpening({user, type}) {
    return (
        <form className="row row-cols-1 row-cols-md-2 row-gap-5 justify-content-center">
            <label className="d-flex flex-column align-items-start fs-6">Your Full Name<input type="text" name="name" className="rounded-3 w-100" defaultValue={user?.names} disabled /></label>
            <label className="d-flex flex-column align-items-start">Phone Number<input type="phone" name="phone" className="rounded-3 w-100" defaultValue={user?.phone} disabled /></label>
            <label className="d-flex flex-column align-items-start">NIN<input type="number" name="nin" className="rounded-3 w-100" placeholder="NIN"/></label>
            <label className="d-flex flex-column align-items-start">BVN<input type="number" name="bvn" className="rounded-3 w-100" placeholder="BVN"/></label>
            <label className="d-flex flex-column align-items-start">Saving Goals<input type="number" name="goal" className="rounded-3 w-100" placeholder="Saving Goals"/></label>
            <label className="d-flex flex-column align-items-start">Deposit Amount<input type="number" name="deposit" className="rounded-3 w-100" placeholder="Deposit Amount"/></label>
            <input type="hidden" name={`${type==="personal"?"personal":"joint"}`} />
            <Submit>Create Account</Submit>
        </form>
    )
}

export function Registration() {
    const searchParams = useSearchParams()
    const [account, setAccount] = useState(searchParams.get("asa")||"user")
    const [state, action] = useFormState(submitForm, {api: '/api/account/register', status: "pending"})
    const router = useRouter()
    //const session_token = document.cookie.split("; ").find((token)=>token.startsWith("session_token")).split("=")[1]

    //console.log(session_token)

    if (state?.success) {
        setTimeout(()=>{
            router.push('/login')
        }, 2000)
    }

    function updateURL(type) {
        const query = new URLSearchParams(searchParams.toString())
        query.set('asa', type)
        history.replaceState(null, '', `?${query.toString()}`)
        setAccount(type)
      }

    return (
        <>
            <div className="align-self-stretch d-flex flex-column flex-md-row justify-content-center align-items-center column-gap-3 mb-5">
                <h6 className="text-primary">Register as:</h6>
                <div className="align-self-stretch rounded-pill p-1 bg-secondary-subtle border border-1 border-primary">
                    <button className={`w-50 btn ${account==='user'?'bg-primary text-white fw-semibold shadow-sm':''} rounded-pill px-5`} onClick={()=>updateURL('user')}>User</button>
                    <button className={`w-50 btn ${account==='landlord'?'bg-primary text-white fw-semibold shadow-sm':''} rounded-pill px-5`} onClick={()=>updateURL('landlord')} >Landlord</button>
                </div>
            </div>
            <form action={action} className="d-flex flex-column w-100" autoComplete="no">
                <label className="d-flex flex-column align-items-start mb-3 fs-6">Full name<input type="text" name="names" className="w-100 rounded-2" placeholder="e.g John Doe" required/></label>
                <label className="d-flex flex-column align-items-start mb-3">Phone Number<input type="phone" name="phone" className="w-100 rounded-2" placeholder="+234 801 234 5678" required/></label>
                <label className="d-flex flex-column align-items-start mb-3">E-mail Address<input type="email" name="email" className="w-100 rounded-2" placeholder="e.g johndoe@gmail.com" required/></label>
                {account==="landlord" &&
                    <label className="d-flex flex-column align-items-start mb-3">Space Location
                        <select name="location" className="w-100 rounded-2">
                            <option value="Uyo">Uyo</option>
                        </select>
                    </label>
                }
                <label className="d-flex flex-column align-items-start mb-3">Password<input type="password" name="password"  className="w-100 rounded-2" placeholder="************" required/></label>
                <label className="d-flex flex-column align-items-start mb-3">Confirm Password<input type="password" id="confirm-password"  className="w-100 rounded-2" placeholder="***********" required/></label>
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-center">
                    <label className="d-flex flex-row align-items-start mb-3 align-items-center"><input type="checkbox" className="me-2" required/><span>I Agree To The&nbsp;<Link href="/terms-and-condition" className="link" required>Terms and Condition</Link>&nbsp;to AfriqLoan</span></label>
                    <Link href="/login" className="link mb-3">Alread Registered?</Link>
                </div>
                <input type="hidden" name="role" value={`${account==="landlord"?"Landlord":"User"}`} />
                <input type="hidden" name="status" value="pending" />
                <Submit>Submit</Submit>
            </form>
            <small id="info" className={`${state?.success?"text-success":"text-danger"}`}>{state?.message}</small>
        </>
    )
}


export function LoginForm() {
    const router = useRouter()
    const searchParams = useSearchParams().get("redirect")

    async function submitForm(formData) {
        const details = {
            email: formData.get('email'),
            password: formData.get('password'),
        }

        const response = await fetch('/api/account/login',{
            method: 'POST',
            body: JSON.stringify(details)
        })

        const data = await response.json()
        const elem = document.getElementById("alert")

        if(response.ok){
            elem.innerHTML = `<span class='text-success'>${data.message}</span>`
            router.replace(searchParams||"/dashboard")
        }else{
            elem.innerHTML = `<span class='text-danger'>${data.error}</span>`
            setTimeout(()=>{
                elem.innerHTML = "&nbsp;"
            }, 5000)
        }
      }

    return (
        <form action={submitForm} className="d-flex flex-column w-100">
            <label className="d-flex flex-column align-items-start mb-3">E-mail Address<input type="email" name="email" className="w-100 rounded-2" placeholder="e.g johndoe@gmail.com" required /></label>
            <label className="d-flex flex-column align-items-start mb-3">Password<input type="password" name="password" className="w-100 rounded-2" placeholder="************" required /></label>
            <Submit>Sign In</Submit>
        </form>
    )
}


export function PasswordRecovery() {
    const [data, action] = useFormState(recoverPassword, {})
    const router = useRouter()

    return(
        <>
            <form action={action} className="d-flex flex-column w-100">
                <label className="d-flex flex-column align-items-start mb-3">E-mail Address<input type="email" name="email" className="w-100 rounded-2" placeholder="e.g johndoe@gmail.com" required /></label>
                <Submit>Submit</Submit>
            </form>
            <small id="info" className={`${data?.success?'text-success':'text-danger'} text-center`}>{data?.message}</small>
        </>
    )
}


export function Contact() {
    return (
        <form className="d-flex flex-column w-100">
            <label className="d-flex flex-column align-items-start mb-3 fs-6">Full name<input type="text" name="name" id="name" className="w-100 rounded-2" placeholder="e.g John Doe"/></label>
            <label className="d-flex flex-column align-items-start mb-3">Phone Number<input type="phone" name="phone" id="phone" className="w-100 rounded-2" placeholder="+234 801 234 5678" /></label>
            <label className="d-flex flex-column align-items-start mb-3">E-mail Address<input type="email" name="email" id="email"  className="w-100 rounded-2" placeholder="e.g johndoe@gmail.com"/></label>
            <label className="d-flex flex-column align-items-start mb-3">Password<input type="password" name="password" id="password"  className="w-100 rounded-2" placeholder="************"/></label>
            <label className="d-flex flex-column align-items-start mb-3">Confirm Password<input type="password" name="confirm-password" id="confirm-password"  className="w-100 rounded-2" placeholder="***********"/></label>
            <label className="d-flex flex-row align-items-start mb-3 align-items-center"><input type="checkbox" name="tac" id="tac" className="me-2" />I Agree To The <Link href="/terms-and-condition">&nbsp;Terms and Condition&nbsp;</Link> to AfriqLoan</label>
            <input type="button" name="submit" id="submit" value="Send" className="btn btn-primary rounded-pill align-self-center"/>
        </form>
    )
}

export function Loan() {
    const [page, setPage] = useState("basic")
    const [state, setState] = useState({
        fullname: "",
        amount: "",
        purpose: "",
        tenure: "",
        loaninterest: 0,
        totalrepayment: 0,
        monthlyrepayment: 0,
        businessname: "",
        businessaddress: "",
        cac:"",
        statement: "",
        id: "",
        bvn: "",
        nin: ""
    })

    useEffect(()=>{
        setState({...state,
            loaninterest: 0.15*state.amount,
            monthlyrepayment: (1.15*state.amount)/state.tenure||0,
            totalrepayment: 1.15*state.amount
        })

    },[state.amount, state.tenure])

    const numberFormat = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'NGN', currencyDisplay: 'symbol' })

    function handleChange(e) {
        e.preventDefault()
        e.target.classList.remove("border", "border-2", "border-danger")
        if(e.target.nextSibling){
            e.target.nextSibling?.remove()
        }
        const value = e.target.value;
        setState({
          ...state,
          [e.target.name]: value
        });
    }

    useEffect(()=>{
        const elements = document.getElementsByTagName("input")
        for (const element of elements){
            element.addEventListener('blur', (event)=>{
                const target= event.target
                if(target.name==='amount' && target.value<10000){
                    target.classList.add("border","border-2","border-danger")
                    if(!target.nextSibling){
                        target.insertAdjacentHTML("afterend","<em class='text-danger'>*Amount must be above N10,000</em>")
                    }
                }
                if(target.value===""){
                    target.classList.add("border","border-2","border-danger")
                    if(!target.nextSibling){
                        target.insertAdjacentHTML("afterend",`<em class='text-danger'>*${target.placeholder} is required</em>`)
                    }
                }
            })
        }
    },[page])

    return (
        <div className="d-flex flex-column gap-2  ">
            <h2>Loan Request Form</h2>
            <form id="loanform" className="d-flex flex-column gap-4">
            {page === "basic"?<>
                <div>
                    <span>Basic Information</span>
                    <hr/>
                </div>
                <div className="d-flex flex-column flex-md-row gap-4">
                    <label className="d-flex flex-column flex-fill align-self-start"><input type="text" name="fullname" className="flex-fill" value={state.fullname} onChange={handleChange} placeholder="Your full name" required /></label>
                    <label className="d-flex flex-column flex-fill align-self-start"><input type="number" name="amount" className="flex-fill" value={state.amount} onChange={handleChange} placeholder="Enter loan amount (Must be above N10,000)" step="10" min="1000" required /></label>
                </div>
                <label className="d-flex flex-column flex-fill">
                    <input type="text" name="purpose" placeholder="Reason for loan" value={state.purpose} onChange={handleChange} />
                </label>
                <div className="d-flex">
                <select className="flex-fill" name="tenure" value={state.tenure} onChange={handleChange} required >
                    <option value="">Selection loan tenure</option>
                    <option value={3}>3 Months</option>
                    <option value={6}>6 Months</option>
                    <option value={12}>12 Months</option>
                </select>
                </div>
                <span className="d-flex justify-content-end align-items-center fw-semibold fst-italic" title="Current lending interest rate!"><small>Applicable Interest Rate: 15% </small><i className="fa-solid fa-circle-question ms-2"></i></span>
                <div className="d-flex  flex-column flex-md-row gap-3">
                    <label className="col-12 col-md-3 d-flex flex-column flex-fill">Loan Interest<input type="text" className="fs-5" name="loaninterest" value={numberFormat.format(state.loaninterest)} onChange={handleChange} placeholder="Amount(N)" readOnly /></label>
                    <label className="col-12 col-md-3 d-flex flex-column flex-fill">Monthly Repayment<input type="text" className="fs-5" name="monthlyrepayment" value={numberFormat.format(state.monthlyrepayment)} onChange={handleChange} placeholder="Amount(N)" readOnly /></label>
                    <label className="col-12 col-md-3 d-flex flex-column flex-fill">Total Repayment<input type="text" className="fs-5" name="totalrepayment" value={numberFormat.format(state.totalrepayment)} onChange={handleChange} placeholder="Amount(N)" readOnly /></label>
                </div>
                <div className="d-flex flex-column flex-md-row gap-4">
                    <label className="d-flex flex-column flex-fill align-self-start"><input type="text" name="businessname" className="flex-fill" value={state.businessname} onChange={handleChange} placeholder="Business Name" required /></label>
                    <label className="d-flex flex-column flex-fill align-self-start"><input type="text" name="businessaddress" className="flex-fill" value={state.businessaddress} onChange={handleChange}  placeholder="Business Address" required /></label>
                </div>
                <button className="btn btn-primary rounded-pill align-self-center" onClick={()=>setPage("documentation")} disabled={!state.fullname||!state.tenure||state.amount<10000||!state.purpose||!state.businessname||!state.businessaddress}>Continue</button>
                </>:
                <>
                    <div>
                        <span>Documentation</span>
                        <hr/>
                    </div>
                    <label className="d-flex flex-column flex-fill">
                        <strong>Bank Statement</strong>
                        <div className="d-flex flex-row p-3 align-items-center border border-1 rounded-3" style={{cursor:"pointer"}}>
                            <i className="fa-solid fa-cloud-arrow-up me-3"></i>
                            <span className="me-auto">{state.statement||'Click here to upload bank statement'}</span>
                            <i className="fa-solid fa-circle-question"></i>
                        </div>
                        <input type="file" className="fs-5" name="statement" onChange={(e)=>setState({...state, statement: e.target.files[0].name})}  accept=".pdf" hidden />
                    </label>
                    <label className="d-flex flex-column flex-fill">
                        <strong>CAC Documents</strong>
                        <div className="d-flex flex-row p-3 align-items-center border border-1 rounded-3" style={{cursor:"pointer"}}>
                            <i className="fa-solid fa-cloud-arrow-up me-3"></i>
                            <span className="me-auto">{state.cac||'Click here to upload CAC documents'}</span>
                            <i className="fa-solid fa-circle-question"></i>
                        </div>
                        <input type="file" className="fs-5" name="cac" onChange={(e)=>setState({...state, cac: e.target.files[0].name})} accept=".pdf" hidden/>
                    </label>
                    <label className="d-flex flex-column flex-fill">
                        <strong>Government ID</strong>
                        <div className="d-flex flex-row p-3 align-items-center border border-1 rounded-3" style={{cursor:"pointer"}}>
                            <i className="fa-solid fa-cloud-arrow-up me-3"></i>
                            <span className="me-auto">{state.id||'Click here to upload Government ID'}</span>
                            <i className="fa-solid fa-circle-question" title="Portable Document Format (PDF) Only"></i>
                        </div>
                        <input type="file" className="fs-5" name="governmentid" onChange={(e)=>setState({...state, id: e.target.files[0].name})}  accept=".pdf" hidden />
                    </label>
                    <div className="d-flex flex-column flex-md-row gap-4">
                        <label className="d-flex flex-column flex-fill align-self-start"><input type="number" name="bvn" className="flex-fill" value={state.bvn} onChange={handleChange} placeholder="BVN" min="11" max="11"/></label>
                        <label className="d-flex flex-column flex-fill align-self-start"><input type="number" name="nin" className="flex-fill" value={state.nin} onChange={handleChange} placeholder="NIN" min="11" max="11"/></label>
                    </div>
                        <div className="d-flex flex-column flex-md-row justify-content-center gap-5">
                            <button className="btn btn-primary rounded-pill align-self-center" onClick={()=>setPage('basic')}>Back</button>
                            <button className="btn btn-primary rounded-pill align-self-center" onClick={()=>setPage('Submit')} disabled={!state.bvn||!state.nin}>Continue</button>
                    </div>
                </>}
            </form>
        </div>
    )
}

export function LoanRecovery() {
    const inputId = useId()
    return (
      <div>
          <form className="d-flex flex-column w-100 p-4 bg-white rounded-3 gap-3" autoComplete="no">
            <div className="d-flex flex-column flex-md-row justify-content-between gap-4">
                <label className="d-flex flex-column flex-fill align-items-start fs-6">Firt Name<input type="text" name="firstname" id="firstname" className="w-100" placeholder="e.g John"/></label>
                <label className="d-flex flex-column flex-fill align-items-start fs-6">Last Name<input type="text" name="lastname" id="lastname" className="w-100" placeholder="e.g Doe"/></label>
            </div>
            <label className="d-flex flex-column flex-fill align-items-start fs-6">Organization<input type="text" name="organization" id="organization" className="w-100" placeholder="Organization" aria-describedby={`${inputId}-organization`} /></label>
            <div className="">
                <i className="fa-solid fa-circle-info fa-pull-left me-2"></i>
                <small id={`${inputId}-organization`}>If you would like to work with us, please enter the name of the business that you represent. If you would like to repay your loan, kindly enter the name of the loan agency that provided your loan.</small>
            </div>
            <label className="d-flex flex-column flex-fill align-items-start fs-6">Purpose<input type="text" name="purpose" id="purpose" className="w-100" placeholder="Debt Recovery"/></label>
                <label className="d-flex flex-column align-items-start ">Contact Phone Number<input type="phone" name="phone" id="phone" className="w-100" placeholder="+234-812-345-6789"/></label>
                <label className="d-flex flex-column align-items-start ">E-mail<input type="email" name="email" id="email"  className="w-100" placeholder="name@domain.tld"/></label>
                <div className="">
                    <i className="fa-solid fa-circle-info fa-pull-left me-2"></i>
                    <small> Kindly provide your official email address if you represent an organisation. For personal enquiries please provide your personal email address.</small>
                </div>
                <label className="d-flex flex-column align-items-start">How Can We Help You<textarea rows={10} name="description" id="description" className="w-100" resized="false" placeholder="Kindly provide a narration of what you would like us to assist you with"/></label>
              <input type="button" name="submit" id="submit" value="Send" className="btn btn-primary rounded-pill align-self-center"/>
          </form>
      </div>
    )
}

export function AddFund({destination}) {
    return (
        <div className="d-flex flex-column gap-3">
            <div className="d-flex flex-column">
                <h4>Fund Your {destination}</h4>
                <hr />
            </div>
            <span className="fs-5">Select Payment Source</span>
            <select name="source" className="rounded-5 ps-5" >
                <option>Wallet</option>
                <option>eTransact</option>
            </select>
            <input type="number" name="amount" className="rounded-5 ps-5" placeholder="Amount (NGN)" />
            <button className="btn btn-primary rounded-pill align-self-end">Proceed</button>
        </div>
    )
}
