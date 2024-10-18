"use client"
import { createPortal, useFormStatus } from "react-dom"
import { useState, useActionState } from "react"
import Link from "next/link"

import Modal from "@/app/components/modals"
import Join from "@/app/(dashboard)/savings/@holder/join/page"
import { createJointSavings, addPersonalSavings } from "@/app/lib/actions"

export function ActivateSavings({children, classNames, type, holder, disabled}) {
    const [modal, setModal] = useState({width:0, height:0, opacity:0})
    const [prompt, setPrompt] = useState("")
    const [joint, jointAction] = useActionState(createJointSavings, {new:true})
    const [personal, personalAction] = useActionState(addPersonalSavings, {})
    return (
        <>
            <button type="submit" className={`btn btn-primary rounded-pill border border-2 border-white align-self-center ${classNames}`} disabled={disabled} onClick={()=>setModal({width:'100%', height:'100%', opacity:1})}>
                {children}
            </button>
            {createPortal(
                <Modal height={modal.height} width={modal.width} setModal={setModal}>
                    <>
                        <div className="d-flex flex-column align-items-center p-3 p-md-4">
                            {type==="joint" &&
                                <div className="p-3">
                                    <h4 className="text-primary text-center">CONFIRM ACTION</h4>
                                    <p className="text-center text-primary">Do you want to activate a new joint savings where you can invite other members or you want to join an existing one using an invitation ID?</p>
                                    <div className="w-100 d-flex flex-column flex-md-row gap-2 justify-content-center">
                                        {holder?
                                            <button className="btn btn-primary border border-2 border-primary rounded-pill px-4" onClick={()=>setPrompt("new")}>Create New</button>:
                                            <Link href="/savings/create?type=joint" className="btn btn-primary border border-2 border-primary rounded-pill px-4">Create New</Link>
                                        }
                                        <button className="btn btn-primary border border-2 border-primary rounded-pill px-4" onClick={()=>setPrompt("join")}>Join Existing</button>
                                    </div>
                                    <em className={`text-center ${joint?.success?"text-success":"text-danger"}`}>{joint?.message}</em>
                                </div>
                            }
                            {type==="personal" &&
                                <>
                                    <h4 className="text-primary">ADD PERSONAL SAVINGS</h4>
                                    <p className="text-center text-primary">Please supply the following information to continue</p>
                                    <form action={personalAction} className="w-100 d-flex flex-column gap-3">
                                        <div className="d-flex flex-column flex-md-row gap-2">
                                            <label className="d-flex flex-column align-items-start fw-semibold">BVN<input type="text" inputMode="number" minLength="11" maxLength="11" name="bvn" className="rounded-3 w-100" placeholder="BVN" required /></label>
                                            <label className="d-flex flex-column align-items-start fw-semibold">NIN<input type="text" inputMode="number" minLength="11"  maxLength="11" name="nin" className="rounded-3 w-100" placeholder="NIN" required/></label>
                                        </div>
                                        <label className="d-flex flex-column align-items-start fw-semibold">Saving Goals<input type="number" min="100000" step="1000" name="savingsgoal" className="rounded-3 w-100" placeholder="Saving Goals" required /></label>
                                        <label className="d-flex flex-column align-items-start fw-semibold">Deposit Amount<input type="number" min="1000" step="500" name="initialdeposit" className="rounded-3 w-100" placeholder="Deposit Amount" required/></label>
                                        <div className="w-100 d-flex flex-column flex-md-row gap-2 justify-content-center">
                                            <Submit classNames="px-5">Add</Submit>
                                            <button className="btn btn-primary border border-2 border-primary rounded-pill px-5" onClick={()=>setModal({height:0, width:0, opacity:0})}>Cancel</button>
                                        </div>
                                    </form>
                                    <em className={`text-center ${personal?.success?"text-success":"text-danger"}`}>{personal?.message}</em>
                                </>
                            }
                            </div>
                            <i className="position-absolute top-0 end-0 mt-4 me-2 fa-solid fa-circle-xmark fa-xl text-primary" role="button" onClick={()=>setModal({height:0, width:0, opacity:0})}></i>
                        </>
                </Modal>, document.body
            )}
            {prompt === "join" && createPortal(
                <Modal height="100%" width="100%">
                    <Join />
                    <i className="position-absolute top-0 end-0 mt-4 me-2 fa-solid fa-circle-xmark fa-xl text-primary" role="button" onClick={()=>setPrompt("")}></i>
                </Modal>, document.body
            )}
            {prompt === "new" && createPortal(
                <Modal  height="100%" width="100%">
                    <>
                        <div className="text-center">
                            <h4 className="text-primary mb-0">NEW JOINT SAVINGS</h4>
                            <p className="text-center text-primary mb-0">Kindly provide the following information to continue.</p>
                        </div>
                        <form action={jointAction} className="w-100 d-flex flex-column align-items-center gap-3">
                            <div className="row gap-3 justify-content-center">
                                <input type="number" name="savingsgoal" min="100000" step="20000" className="col-11 col-md-6 rounded-3" placeholder="Savings Goal" required />
                                <input type="number" name="members" min="2" step="1" max="12" className="col-11 col-md-4 rounded-3" placeholder="No of Members" required />
                                <input type="number" name="duration" min="3" step="1" max="24" className="col-11 col-md-4 rounded-3" placeholder="Duration (In months)" required />
                                <input type="number" name="payout" min="2" step="1" className="col-11 col-md-6 rounded-3" placeholder="Payout Period (In Weeks)" required />
                            </div>
                            <div className="w-100 d-flex flex-column flex-md-row gap-2 justify-content-center">
                                <Submit classNames="px-5">Create</Submit>
                                <button className="btn btn-primary border border-2 border-primary rounded-pill px-5" onClick={()=>setPrompt("")}>Cancel</button>
                            </div>
                        </form>
                        <em className={`text-center ${joint?.success?"text-success":"text-danger"}`}>{joint?.message}</em>
                    </>
                </Modal>, document.body
            )}
        </>
    );
  }

export function PrimaryLinkButtonIcon({children, href, disabled}) {
    const {pending} = useFormStatus()
    return(
        <>
        {disabled?
            <button type="button" className="d-flex border border-2 border-white align-items-center rounded-pill text-white px-4 py-2 fs-5" disabled>{children}</button>:
            <Link href={href} className="d-flex link btn-primary border border-2 border-white align-items-center rounded-pill text-white px-4 py-3 fs-5" >
            {pending ?
                <><i className="fa-solid fa-circle-notch fa-spin fa-spin-pulse me-2"></i>Please Wait...</>:children}
            </Link>
        }
        </>
    )
}

export function Submit({children, classNames, disabled}) {
    const { pending } = useFormStatus();
    return (
      <button type="submit" className={`btn btn-primary rounded-pill border border-2 border-primary ${classNames}`} disabled={disabled||pending}>
        {pending ?
        <><i className="fa-solid fa-circle-notch fa-spin fa-spin-pulse me-2"></i>Please Wait...</>:children}
      </button>
    );
  }

  