"use client"

import { useState, useRef, useEffect } from "react"
import { useFormStatus, useFormState } from 'react-dom'
import { useRouter, useSearchParams, notFound } from 'next/navigation'

import { Submit } from "@/app/components/buttons"
import { Listing } from "@/app/components/cards"
import { submitForm } from "@/app/lib/actions"

const initialState = {title:"", subtitle:"", type:"", description:"", pricing:0, image:[], status:"active"}

export default function Single(){
    const [state, setState] = useState(initialState)
    const [data, setData] = useState()
    const [action, setAction] = useState("")
    const labelRef = useRef()
    const router = useRouter()
    const id = useSearchParams().get('id')
    const mode = useSearchParams().get('mode')
    let prevState = useRef()
    let draft

    if(useSearchParams().size===1){
        if(!mode || mode==="edit" && !id || mode!=="new"){
            notFound()
        }
    }

    useEffect(()=>{
        if(id){
            setAction("pending")
            fetch(`/api/listing?_id=${id}`)
            .then(async(response)=>{
                const data = await response.json()
                if(!response.ok) throw new Error(data.message)
                return data
            })
            .then(data=>{
                setState(data.listing)
                prevState.current=data.listing
                setAction("")
            })
            .catch(error=>{
                setAction("error")
            })
        }
    }, [id])

    function handleChange(e){
        const name = e.target.name
        const value = e.target.value
        setState({...state,
            [name]:value
        })
    }

    function previewFile(e){
        const file = e.target.files[0];
        const reader = new FileReader();

        if(file) {
           if(file.size > 1024 * 1000) {
            let msg = document.createElement("em")
            msg?.classList.add("text-danger", "fw-bolder")
            let text = document.createTextNode(`File Size Too Large (300kb Max)`)
            msg.appendChild(text)
            labelRef.current.insertAdjacentElement("afterend", msg)
            setTimeout(()=>{
                labelRef.current.nextElementSibling && labelRef.current.nextElementSibling.remove()
            },5000)

           }else{
            reader.readAsDataURL(file);
           }
        }

        reader.addEventListener(
            "load",
            () => {
              setState({...state, image: [...state.image, reader.result]})
            },
            false,
          );
      }

      function removePicture(index){
        setState({...state, image: state.image.filter((elem, i)=>i===index?null:elem)})
      }

    function submitListing(){
        const info = document.getElementById('info')
        setAction("submitting")
        fetch(`/api/listing?_id=${id}`, {
            method: mode==="edit"?"PUT":"POST",
            signal: AbortSignal.timeout(30000),
            body: JSON.stringify(state)
        })
        .then(async(response) => {
            window.scroll({top:0, left:0, behavior:"smooth"})
            const data = await response.json()
            if(!response.ok) throw new Error(data.message||"An error occured trying to submit your listing")
            return data
        })
        .then((data)=>{
            info.style.height = "30px"
            setData(data)
            setState(initialState)
            setTimeout(()=>{
                router.replace("/listings")
            }, 5000)
        })
        .catch((error) => {
            info.style.height = "30px"
            setData({success:false, message:`${error.message}. Please try again.`})
        })
        .finally(()=>{
            setAction("")
            setTimeout(()=>{
                info.style.height = "0px"
            }, 5000)
        })
    }


    return(
        <section id="listing" className="d-flex flex-column p-3 p-md-5 row-gap-2 position-relative">
            {action==="pending" && 
                <>
                    <div className="w-100 h-100 position-fixed start-0 top-0 bg-tertiary opacity-75 z-2"></div>
                    <div className="position-fixed start-50 top-50 z-3 translate-middle-x">
                        <i className="fa-solid fa-circle-notch fa-spin me-2"></i>
                        <em>Please wait while we load your listing...</em>
                    </div>
                </>
            }
            {action==="error" &&
                <>
                    <p className="text-danger">There was an error loading your listing. Please check your request and try again.</p>
                    <button className="btn btn-primary border border-2 border-primary rounded-pill px-5 align-self-start" onClick={()=>router.refresh()}>Retry</button>
                </>
            }
            {action!=="error" &&
                <>
                    <em id="info" className={`${data?.success?"bg-success-subtle text-primary":"bg-danger-subtle text-danger"} d-flex justify-content-center align-items-center rounded-2 text-center overflow-hidden`} style={{height:'0px', transition:'height 0.5s ease-in-out'}}>{data && <i className="fa-solid fa-circle-info me-2"></i>}{data && data?.message}</em>
                    <div className="d-flex flex-column flex-md-row row-gap-5">
                        <div className="flex-fill d-flex flex-column col-12 col-md-7 gap-5 pe-0 pe-md-5">
                            <div>
                                <div className="d-inline-flex align-items-center mb-2">
                                    <i className={`fa-solid fa-circle-arrow-left fa-2xl text-primary me-2`} role="button" onClick={()=>router.back()}></i>
                                    <h4 className="mb-0">{mode==='edit'?'Edit':'Add'} listing</h4>
                                </div>
                                <label ref={labelRef} className="d-flex flex-column border border-1 rounded-3 align-items-center justify-content-center p-5" role="button">
                                    <input type="file" name="image" onChange={previewFile} accept="image/jpeg, image/png, image/webp" hidden />
                                    <i className="fa-solid fa-image fa-6x text-success"></i>
                                    <h5>Add Photo/Image</h5>
                                    <small>Or drag and drop</small>
                                </label>
                            </div>
                            <div>
                                <h4>Required</h4>
                                <form action={submitListing} className="d-flex flex-column gap-3">
                                    <input type="text" className="rounded-2" name="title" value={state.title} onChange={handleChange} placeholder="Title" required />
                                    <input type="text" className="rounded-2" name="subtitle" value={state.subtitle} onChange={handleChange} placeholder="Subtitle" required />
                                    <input type="text" className="rounded-2" name="description" value={state.description} onChange={handleChange} placeholder="Description" required />
                                    <select className="rounded-2" name="type" value={state.type} onChange={handleChange} required>
                                        <option value="" disabled>Choose Listing Type</option>
                                        <option value="coliving">Co living</option>
                                        <option value="coworking">Co working</option>
                                        <option value="officespace">Office Space</option>
                                    </select>
                                    <input type="number" step="100" min="1000" className="rounded-2" name="pricing" value={state.pricing} onChange={handleChange} placeholder="Pricing" required />
                                    <input type="hidden" name="status" value={state.status} />
                                    <button className=" btn btn-primary rounded-pill border border-2 border-primary align-self-stretch" disabled={action==="submitting"||state.image.length===0||JSON.stringify(state)===JSON.stringify(prevState.current)}>{action==="submitting" && <i className="fa-solid fa-circle-notch fa-spin me-2"></i>}{mode==="edit"?"Update":"Post"}</button>
                                    {JSON.stringify(state)===JSON.stringify(prevState.current) && <div id="alert" className="d-flex justify-content-center align-items-center p-2 my-2 bg-warning-subtle overflow-hidden" style={{transition:'all 2s ease-in'}}><i className="fa-solid fa-triangle-exclamation me-2"></i>No changes have been made so far!</div>}
                                </form>
                            </div>
                        </div>
                        <div className="col-12 col-md-5 d-flex flex-column pe-0 pe-md-5">
                            <h4>Preview</h4>
                            <Listing
                                image={state?.image}
                                title={state.title||"Subtitle here"}
                                description={state.description||"Description will appear here"}
                                pricing={state.pricing && parseInt(state.pricing)}
                                disabled={true}
                                preview={true}
                                remove={removePicture}
                            />
                        </div>
                    </div>
                </>
            }
        </section>
    )
}