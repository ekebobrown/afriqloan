'use client'

import Link from 'next/link'
import { useState, useEffect, useRef, useId } from 'react'
import { useFormStatus, useFormState, createPortal } from 'react-dom'
import { useSearchParams, useRouter } from 'next/navigation'

import { submitForm, passwordResetInstruction, passwordReset, createSavingsAccount } from '@/app/lib/actions'
import { Submit } from '@/app/components/buttons'
import Modal from '@/app/components/modals'
import { personalLoan } from '@/app/lib/actions/loans'

export function Newsletter() {
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
        <form action={submitForm} className="d-flex flex-column w-100 px-4 px-md-5 pt-5 pb-4 bg-white rounded-3">
            <label className="d-flex flex-column align-items-start mb-3 fs-6">Your Name<input type="text" name="names" className="w-100" placeholder="e.g John Doe" required /></label>
            <label className="d-flex flex-column align-items-start mb-3">Phone Number<input type="phone" name="phone" className="w-100" placeholder="e.g +234-801-234-5678" required /></label>
            <label className="d-flex flex-column align-items-start mb-3">E-mail Address<input type="email" name="email" className="w-100" placeholder="e.g johndoe@gmail.com" required /></label>
            <Submit classNames="px-5">Submit</Submit>
            <em id="alert" className="text-center pt-1">&nbsp;</em>
        </form>
  )
}

export function AccountOpening({user, type}) {
    const initialState = {names:user.names, phone:user.contact.phone, nin:"", bvn:"", savingsgoal:"", initialdeposit:"", email:user.contact.email, type:type==="personal"?"personal":"joint"}
    const currencyFormat = new Intl.NumberFormat('en-NG', {style:'currency', currency:'NGN'})
    const [state, setState] = useState(initialState)
    const [modal, setModal] = useState(false)
    const [status, setStatus] = useState({})
    const [inputs, setInputs] = useState({})

    function handleChange(e){
        const name = e.target.name
        const value = e.target.value
        setState({
            ...state,
            [name]: value
        })
    }
    useEffect(()=>{
        setInputs(document.getElementsByTagName("input"))
    },[])

    const emptyField = function(){
        const empty = Array.from(inputs)?.filter((elem)=>elem.required)
        return empty.some((elem)=>elem.value==="")
    }

    async function submitForm(){
        setStatus({...status, pending:true})
        const response = await createSavingsAccount(state)
        setStatus(response)
    }

    return (
        <>
            <form className="row row-cols-1 row-cols-md-2 row-gap-4 justify-content-center">
                <label className="d-flex flex-column justify-content-between align-items-start fs-6">Your Full Name<input type="text" name="names" className="rounded-3 w-100" defaultValue={user?.names} readOnly required /></label>
                <div className="d-flex flex-column">
                    <label className="d-flex flex-column align-items-start">
                        <div className="w-100 d-flex flex-column flex-xl-row">
                            Phone Number
                            <small className="fst-italic px-1 me-auto">(This will also form as your account number)</small>
                            <small className="align-self-end fst-italic" role="button" onClick={()=>document.getElementsByName('phone')[0].removeAttribute('disabled')}>Edit?</small>
                        </div>
                        <input type="phone" name="phone" className="rounded-3 w-100" defaultValue={user?.contact.phone} readOnly required />
                    </label>
                    </div>
                <label className="d-flex flex-column align-items-start">NIN<input type="text" inputMode="numeric" pattern='[0-9]{11}' name="nin" className="rounded-3 w-100" placeholder="NIN" value={state.nin} onChange={(e)=>handleChange(e)} required /></label>
                <label className="d-flex flex-column align-items-start">BVN<input type="text" inputMode="numeric" pattern='[0-9]{11}' name="bvn" className="rounded-3 w-100" placeholder="BVN" value={state.bvn} onChange={(e)=>handleChange(e)} required /></label>
                <label className="d-flex flex-column align-items-start">Savings Goal<input type="number" min="100000" step="1000" name="savingsgoal" className="rounded-3 w-100" placeholder="Savings Goal" value={state.savingsgoal} onChange={(e)=>handleChange(e)} required /></label>
                <label className="d-flex flex-column align-items-start">Deposit Amount<input type="number" min="1000" step="500" name="initialdeposit" className="rounded-3 w-100" placeholder="Deposit Amount" value={state.initialdeposit} onChange={(e)=>handleChange(e)} disabled={type==="joint"} /></label>
                <input type="hidden" name="type" value={`${type==="personal"?"personal":"joint"}`} />
                <input type="hidden" name="email" value={user.contact.email} />
                <button className="btn btn-primary rounded-pill border border-2 border-white align-self-center px-4" onClick={(e)=>{e.preventDefault(); setModal(true)}} disabled={emptyField()}>Create Account</button>
                {modal && createPortal(
                    <Modal>
                        <>
                            <div className="d-flex flex-column gap-2 align-items-center py-3">
                                <h4 className="text-primary">CONFIRM SUBMISSION</h4>
                                <div className="row row-cols-2">
                                    <strong className="text-end">Name:</strong><span>{state.names}</span>
                                    <strong className="text-end">Phone:</strong><span>{state.phone}</span>
                                    <strong className="text-end">NIN:</strong><span>{state.nin}</span>
                                    <strong className="text-end">BVN:</strong><span>{state.bvn}</span>
                                    <strong className="text-end">Savings Goal:</strong><span>{currencyFormat.format(state.savingsgoal)}</span>
                                    <strong className="text-end">Initial Deposit:</strong><span>{currencyFormat.format(state.initialdeposit)}</span>
                                    <strong className="text-end">Account Type:</strong><span>{state.type.charAt(0).toUpperCase()+state.type.slice(1,)} Savings</span>
                                </div>
                                <button className="btn btn-primary rounded-pill border border-2 border-white align-self-center px-4" onClick={submitForm} disabled={status?.pending}>
                                 {status?.pending && <><i className="fa-solid fa-circle-notch fa-spin"></i> Please Wait...</>}{!status?.pending && "Confirm"}
                                </button>
                                <div className="d-flex bg-info-subtle align-items-center p-2 rounded-2">
                                    <i className="fa-solid fa-circle-info me-2"></i>
                                    Please note that a wallet will automatically be created for you upon submission.
                                </div>
                                <em className={`text-center ${status?.success?"text-success":"text-danger"}`}>{status?.message}</em>
                            </div>
                            <i className="position-absolute top-0 end-0 mt-4 me-2 fa-solid fa-circle-xmark fa-xl text-primary" role="button" onClick={()=>setModal(false)}></i>
                        </>
                    </Modal>, document.getElementById('create')
                )}
            </form>
        </>
    )
}

export function Registration() {
    const searchParams = useSearchParams()
    //const [account, setAccount] = useState(searchParams.get("asa")||"user")
    const [state, action] = useFormState(submitForm, {api: '/api/account/register', status: "pending"})
    const [pass, setPass] = useState()
    const [confirmpass, setConfirmpass] = useState()
    const router = useRouter()

    if (state?.success) {
        setTimeout(()=>{
            router.replace('/login')
        }, 2000)
    }

    /*
    function updateURL(type) {
        const query = new URLSearchParams(searchParams.toString())
        query.set('asa', type)
        history.replaceState(null, '', `?${query.toString()}`)
        setAccount(type)
      }
    */

    return (
        <>
            {/*<div className="align-self-stretch d-flex flex-column flex-md-row justify-content-center align-items-center column-gap-3 mb-5">
               <h6 className="text-primary">Register as:</h6>
                <div className="align-self-stretch rounded-pill p-1 bg-secondary-subtle border border-1 border-primary">
                    <button className={`w-50 btn ${account==='user'?'bg-primary text-white fw-semibold shadow-sm':''} rounded-pill px-5`} onClick={()=>updateURL('user')}>User</button>
                    <button className={`w-50 btn ${account==='landlord'?'bg-primary text-white fw-semibold shadow-sm':''} rounded-pill px-5`} onClick={()=>updateURL('landlord')} >Landlord</button>
                </div>
            </div>*/}
            <form action={action} className="d-flex flex-column w-100" autoComplete="no">
                <label className="d-flex flex-column align-items-start mb-3 fs-6">Full name<input type="text" name="names" className="w-100 rounded-2" placeholder="e.g John Doe" required/></label>
                <label className="d-flex flex-column align-items-start mb-3">Phone Number<input type="phone" name="phone" className="w-100 rounded-2" placeholder="+234 801 234 5678" required/></label>
                <label className="d-flex flex-column align-items-start mb-3">E-mail Address<input type="email" name="email" className="w-100 rounded-2" placeholder="e.g johndoe@gmail.com" required/></label>
                {/*account==="landlord" &&
                    <label className="d-flex flex-column align-items-start mb-3">Space Location
                        <select name="location" className="w-100 rounded-2">
                            <option value="Uyo">Uyo</option>
                        </select>
                    </label>
                */}
                <label className="d-flex flex-column align-items-start mb-3">Password<input type="password" name="password"  className="w-100 rounded-2" value={pass} onChange={(e)=>setPass(e.target.value)} placeholder="************" required/></label>
                <label className="d-flex flex-column align-items-start mb-3">Confirm Password<input type="password" id="confirm-password"  className="w-100 rounded-2" value={confirmpass} onChange={(e)=>{e.target.nextElementSibling&&e.target.nextElementSibling.remove(); setConfirmpass(e.target.value)}} onBlur={(e)=>{pass!==confirmpass?e.target.parentElement.insertAdjacentHTML("beforeend","<em class='text-danger'>Must match with password</em>"):e.target.nextElementSibling?.remove()}} placeholder="***********" required/></label>
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-center">
                    <label className="d-flex flex-row align-items-start mb-3 align-items-center"><input type="checkbox" className="me-2" required/><span>I agree to the&nbsp;<Link href="/terms-and-conditions" className="link" required>Terms and Conditions</Link>&nbsp;of AfriqLoan</span></label>
                    <Link href="/login" className="link mb-3">Alread Registered?</Link>
                </div>
                <input type="hidden" name="type" value="user" />
                <input type="hidden" name="role" value="user" />
                <input type="hidden" name="status" value="pending" />
                <Submit disabled={pass!==confirmpass} classNames="px-5 align-self-center">Submit</Submit>
            </form>
            <small id="info" className={`${state?.success?"text-success":"text-danger"}`}>{state?.message}</small>
        </>
    )
}


export function LoginForm({email, redirect}) {
    const [state, action] = useFormState(submitForm,  {api: '/api/account/login', status: "pending"})
    const router = useRouter()

    if (state?.success) {
        setTimeout(()=>{
            router.replace(redirect||'/dashboard')
        }, 500)
    }

    return (
        <>
            <form action={action} className="d-flex flex-column w-100">
                <label className="d-flex flex-column align-items-start mb-3">E-mail Address<input type="email" name="email" className="w-100 rounded-2" defaultValue={email&&email} placeholder="e.g johndoe@gmail.com" required /></label>
                <label className="d-flex flex-column align-items-start mb-3">Password<input type="password" name="password" className="w-100 rounded-2" placeholder="************" required /></label>
                <Submit classNames="align-self-center px-5">Sign In</Submit>
            </form>
            <small id="info" className={`${state?.success?"text-success":"text-danger"} text-center`}>{state.message}</small>
        </>
    )
}


export function PasswordResetRequest() {
    const [state, action] = useFormState(passwordResetInstruction, {})
    const router = useRouter()

    if (state?.success) {
        setTimeout(()=>{
            router.replace('/')
        }, 4000)
    }
    return(
        <>
            <form action={action} className="d-flex flex-column w-100">
                <label className="d-flex flex-column align-items-start mb-3">E-mail Address<input type="email" name="email" className="w-100 rounded-2" placeholder="e.g johndoe@gmail.com" disabled={state?.success} required /></label>
                <Submit disabled={state?.success} classNames="align-self-center px-5">Submit</Submit>
            </form>
            <small id="info" className={`${state?.success?'text-success':'text-danger'} text-center`}>{state?.message}</small>
        </>
    )
}


export function PasswordReset({email, token}) {
    const [state, action] = useFormState(passwordReset, {email:email, token:token})
    const [user, setUser] = useState({password:"", confirmPassword:""})
    const router = useRouter()

    if (state?.success) {
        setTimeout(()=>{
            router.replace('/login')
        }, 4000)
    }

    return(
        <>
            <form action={action} className="d-flex flex-column w-100">
                <label className="d-flex flex-column align-items-start mb-3">New Password<input type="password" name="password" className="w-100 rounded-2" value={user.password} onChange={(e)=>setUser({...user, password:e.target.value})} disabled={state?.success} required /></label>
                <label className="d-flex flex-column align-items-start mb-3">Confirm Password<input type="password" name="confirmpassword" className="w-100 rounded-2" value={user.confirmPassword} onChange={(e)=>setUser({...user, confirmPassword:e.target.value})}  disabled={state?.success} required /></label>
                <Submit disabled={user.password===""||user.password!==user.confirmPassword||state?.success} classNames="align-self-center px-5">Submit</Submit>
            </form>
            <small id="info" className={`${state?.success?'text-success':'text-danger'} text-center`}>{state?.message}</small>
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
            <input type="button" name="submit" id="submit" value="Send" className="btn btn-primary rounded-pill align-self-center px-4"/>
        </form>
    )
}

export function Loan({user, type}) {
    const [action, setAction] = useState({})
    const numberFormat = new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', currencyDisplay: 'symbol' })
    const [state, setState] = useState({
        firstname: user?.names.split(" ")[0]||"",
        lastname: user?.names.split(" ")[1]||"",
        email: user?.contact.email||"",
        number: user?.contact.phone||"",
        dob: user?.dob||"",
        loanamount: "",
        purpose: "",
        tenure: 3,
        loaninterest: 0,
        totalrepayment: 0,
        monthlyrepayment: 0,
        businessname: "",
        businessaddress: "",
        cac:"",
        statement: "",
        id: "",
        bvn: user.banks?.verification.number||"",
        nin:  user.identifications?.nin||"",
        income:"",
        address:"",
        bankname:"",
        accountnumber:"",
    })

    useEffect(()=>{
        setState(state=>({...state,
            loaninterest: 0.15*state.loanamount,
            monthlyrepayment: (1.15*state.loanamount)/state.tenure||0,
            totalrepayment: 1.15*state.loanamount
        }))

    },[state.loanamount, state.tenure])

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
                if((target.name!=="income" && target.value==="")||(target.name==="income" && target.value==="" && document.getElementsByName("employmentstatus")[0].value==="Employed")){
                    target.classList.add("border","border-2","border-danger")
                    if(!target.nextSibling){
                        target.insertAdjacentHTML("afterend",`<em class='text-danger'>*${target.placeholder} is required</em>`)
                    }
                }
            })
        }
    },[])

    async function handleSubmit(){
        setAction({pending:true})
        const response = await personalLoan(state)
        setAction(response)
    }

    function handleChange(e) {
        e.preventDefault()
        e.target.classList.remove("border", "border-2", "border-danger")
        if(e.target.nextSibling){
            e.target.nextSibling?.remove()
        }
        setState({
          ...state,
          [e.target.name]: e.target.value
        });
    }

    return (
        <>
            {type==="individual"?
                <div className="d-flex flex-column gap-2  ">
                    <h2>Loan Personal Form</h2>
                    <form id="individualloan" className="d-flex flex-column gap-4">
                        <div>
                            <span>Basic Information</span>
                            <hr/>
                        </div>
                        <div className="d-flex flex-column flex-md-row gap-2">
                            <label className="col-12 col-md-6 d-flex flex-column align-self-start"><input type="text" name="firstname" className="flex-fill rounded-2" value={state.firstname} onChange={handleChange} placeholder="First name" required readOnly /></label>
                            <label className="col-12 col-md-6 d-flex flex-column align-self-start"><input type="text" name="lastname" className="flex-fill rounded-2" value={state.lastname} onChange={handleChange} placeholder="Last name" required readOnly /></label>
                        </div>
                        <div className="d-flex flex-column flex-md-row gap-2">
                            <label className="col-12 col-md-6 d-flex flex-column align-self-start"><input type="text" inputMode="number" pattern="[0-9]{11}" name="nin" className="flex-fill rounded-2" value={state.nin} onChange={handleChange} placeholder="NIN" required readOnly/></label>
                            <label className="col-12 col-md-6 d-flex flex-column align-self-start"><input type="text" inputMode="number" pattern="[0-9]{11}" name="bvn" className="flex-fill rounded-2" value={state.bvn} onChange={handleChange} placeholder="BVN" required readOnly/></label>
                        </div>
                        <div className="d-flex flex-column flex-md-row gap-2">
                            <label className="col-12 col-md-6 d-flex flex-column align-self-start"><input type="date" name="dob" className="flex-fill rounded-2" value={state.dob} onChange={handleChange} placeholder="DOB" required /></label>
                            <label className="col-12 col-md-6 d-flex flex-column align-self-start"><input type="text" name="employmentstatus" className="flex-fill rounded-2" value={state.employmentstatus} onChange={handleChange} placeholder="Employment Status" required /></label>
                        </div>
                        <div className="d-flex flex-column flex-md-row gap-2">
                            <label className="col-12 col-md-6 d-flex flex-column align-self-start"><input type="text" inputMode="number" min="50000" name="income" className="flex-fill rounded-2" value={state.income} onChange={handleChange} placeholder="Monthly Income" required={document.getElementsByName('employmentstatus')[0]==="employed"} /></label>
                            <label className="col-12 col-md-6 d-flex flex-column align-self-start"><input type="text" inputMode="number" min="20000" step="1000" max="1000000" name="loanamount" className="flex-fill rounded-2" value={state.loanamount} onChange={handleChange} placeholder="Requested Loan Amount" required /></label>
                        </div>
                        <div className="d-flex">
                            <select className="flex-fill rounded-2" name="tenure" value={state.tenure} onChange={handleChange} required hidden>
                                <option value="">Selection loan tenure</option>
                                <option value={3}>3 Months</option>
                                <option value={6}>6 Months</option>
                                <option value={12}>12 Months</option>
                            </select>
                        </div>
                        <span className="d-flex justify-content-end align-items-center fw-semibold fst-italic" title="Current lending interest rate!"><small>Applicable Interest Rate: 15% </small><i className="fa-solid fa-circle-question ms-2"></i></span>
                        <div className="d-flex flex-column flex-md-row gap-2">
                            <label className="col-12 col-md-4 d-flex flex-column align-self-start">Loan Interest<input type="text" className="fs-5 rounded-2" name="loaninterest" value={numberFormat.format(state.loaninterest)} onChange={handleChange} placeholder="Amount(N)" readOnly /></label>
                            <label className="col-12 col-md-4 d-flex flex-column align-self-start">Monthly Repayment<input type="text" className="fs-5 rounded-2" name="monthlyrepayment" value={numberFormat.format(state.monthlyrepayment)} onChange={handleChange} placeholder="Amount(N)" readOnly /></label>
                            <label className="col-12 col-md-4 d-flex flex-column align-self-start">Total Repayment<input type="text" className="fs-5 rounded-2" name="totalrepayment" value={numberFormat.format(state.totalrepayment)} onChange={handleChange} placeholder="Amount(N)" readOnly /></label>
                        </div>
                        <div className="d-flex flex-column flex-md-row gap-2">
                            <label className="col-12 col-md-6 d-flex flex-column align-self-start"><input type="text" name="address" className="flex-fill rounded-2" value={state.address} onChange={handleChange} placeholder="Residential Address" required /></label>
                            <label className="col-12 col-md-6 d-flex flex-column align-self-start"><input type="text" inputMode="number" pattern="[0-9]{11}" name="number" className="flex-fill rounded-2" value={state.number} onChange={handleChange} placeholder="Phone Number" required /></label>
                        </div>
                        <div className="d-flex flex-column flex-md-row gap-2">
                            <label className="col-12 col-md-4 d-flex flex-column align-self-start"><input type="email" name="email" className="flex-fill rounded-2" value={state.email} onChange={handleChange} placeholder="Email Address" required readOnly/></label>
                            <label className="col-12 col-md-4 d-flex flex-column align-self-start"><input type="text" name="bankname" className="flex-fill rounded-2" value={state.bankname} onChange={handleChange} placeholder="Bank Name" required /></label>
                            <label className="col-12 col-md-4 d-flex flex-column align-self-start"><input type="text" name="accountnumber" className="flex-fill rounded-2" value={state.accountnumber} onChange={handleChange} placeholder="Account Number" required /></label>
                        </div>
                        <button className="btn btn-primary border border-2 border-primary rounded-pill px-5 align-self-center" onClick={()=>handleSubmit()} disabled={action?.pending}>{action?.pending?<div className="d-flex align-items-center"><i className="fa-solid fa-circle-notch fa-spin me-2"></i>Please Wait...</div>:"Submit Application"}</button>
                        <em className={`${action.success?'text-success':'text-danger'} text-center`}>{action?.message}</em>
                    </form>
                </div>:
                <div className="d-flex flex-column gap-2">
                    <h2>Loan Organization Form</h2>
                    <form id="corporateloan" className="d-flex flex-column gap-4">
                        <div>
                            <span>Business Details</span>
                            <hr className="m-0"/>
                        </div>
                        <div className="d-flex flex-column flex-md-row gap-4">
                            <label className="d-flex flex-column flex-fill"><input type="text" name="companyname" className="rounded-2" value={state.companyname} onChange={handleChange} placeholder="Enterpise name" required /></label>
                            <label className="d-flex flex-column flex-fill"><input type="text" name="cac" className="rounded-2" value={state.cac} onChange={handleChange} placeholder="CAC Registration Number" required /></label>
                        </div>
                        <div className="d-flex flex-column flex-md-row gap-4">
                            <label className="d-flex flex-column flex-fill"><input type="text" name="businesstype" className="rounded-2" value={state.businesstype} onChange={handleChange} placeholder="Business Type" required /></label>
                            <label className="d-flex flex-column flex-fill"><input type="text" inputMode="number" pattern="[0-9]{11}" name="annualrevenue" className="rounded-2" value={state.annualrevenue} onChange={handleChange} placeholder="Annual Revenue" required /></label>
                        </div>
                        <div className="d-flex flex-column flex-md-row gap-4">
                            <label className="d-flex flex-column flex-fill"><input type="text" name="loanamount" inputMode="number" pattern="[0-9]{11}" className="rounded-2" value={state.loanamount} onChange={handleChange} placeholder="Loan Request Amount" required /></label>
                            <label className="d-flex flex-column flex-fill"><input type="text" name="purpose" className="rounded-2" value={state.purpose} onChange={handleChange} placeholder="Purpose For Loan" required /></label>
                        </div>
                        <div className="d-flex flex-column flex-md-row gap-4">
                            <label className="d-flex flex-column flex-fill"><input type="text" name="address" className="rounded-2" value={state.address} onChange={handleChange} placeholder="Business Address" required /></label>
                            <label className="d-flex flex-column flex-fill"><input type="text" inputMode="number" pattern="[0-9]{11}" name="number" className="rounded-2" value={state.number} onChange={handleChange} placeholder="Phone Number" required /></label>
                        </div>
                        <div className="d-flex flex-column flex-md-row gap-4">
                            <label className="d-flex flex-column flex-fill"><input type="email" name="email" className="rounded-2" value={state.email} onChange={handleChange} placeholder="Email Address" required /></label>
                            <label className="d-flex flex-column flex-fill"><input type="text" name="bankname" className="rounded-2" value={state.bankname} onChange={handleChange} placeholder="Bank Name" required /></label>
                            <label className="d-flex flex-column flex-fill"><input type="text" name="accountname" className="rounded-2" value={state.accountname} onChange={handleChange} placeholder="Account Name" required /></label>
                        </div>
                        <div className="d-flex flex-column flex-md-row gap-4">
                            <label className="d-flex flex-column flex-fill"><input type="text" name="directors" className="rounded-2" value={state.directors} onChange={handleChange} placeholder="List of Directors or Shareholders" required /></label>
                            <label className="d-flex flex-column flex-fill"><input type="text" name="financials" className="rounded-2" value={state.financials} onChange={handleChange} placeholder="Financial Statement" required /></label>
                        </div>
                        <button type="submit" className="btn btn-primary rounded-pill align-self-center px-5" disabled={!state.companyname||state.amount<10000||!state.purpose||!state.cac||!state.businesstype}>Submit</button>
                    </form>
                </div>
            }
        </>
    )
}

export function LoanRecovery() {
    const inputId = useId()
    return (
      <div>
          <form className="d-flex flex-column w-100 p-5 bg-white gap-3" autoComplete="no">
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
              <input type="button" name="submit" id="submit" value="Send" className="btn btn-primary rounded-pill align-self-center px-5"/>
          </form>
      </div>
    )
}

export function AddFund({destination}) {
    return (
        <div className="d-flex flex-column gap-3">
            <div className="d-flex flex-column">
                <h4>Fund Your {destination === 'personal-savings'&&"Personal Savings"}{destination === 'wallet'&&"Wallet"}{destination === 'joint-savings'&&"Joint Savings"}</h4>
                <hr className="m-0 border border-3 border-dark-subtle"/>
            </div>
            <span className="fs-5">Select Payment Source</span>
            <select name="source" className="rounded-5 ps-5" >
                <option>Wallet</option>
                <option>eTransact</option>
            </select>
            <input type="number" name="amount" className="rounded-5 ps-5" placeholder="Amount (NGN)" />
            <button className="btn btn-primary rounded-pill align-self-end px-4">Proceed</button>
        </div>
    )
}
