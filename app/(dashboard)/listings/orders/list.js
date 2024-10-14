"use client"

import Image from "next/image"
import { useState, Fragment } from "react"
import { createPortal } from "react-dom"

export function List({order}){
    const [elem, setElem] = useState([false, false])
    const [index, setIndex] = useState(0)
    const currencyFormat = new Intl.NumberFormat('en-NG', {style: 'currency', currency: 'NGN'})

    function transition(i){
        const overlay = document.getElementsByClassName('overlay')[0]
        overlay.classList.toggle('slidein')
        setIndex(0)
        if(elem[i]){
            setTimeout(()=>{
                setElem(elem.map((el, index)=>i===index?!el:el))
            }, 300)
        }else{
            setElem(elem.map((el, index)=>i===index?true:el))
        }

        document.body.addEventListener('click', (e)=>{
            if(e.target.nodeName==="SECTION"){
                overlay.classList.remove('slidein')
                setTimeout(()=>{
                    setElem([false, false])
                },300)
            }
        })
    }

    return (
        <>
            {order.items.map((item, i)=>(
                <Fragment key={i}>
                    <div className="item d-flex flex-column flex-lg-row gap-2 mb-4">
                        <div className="position-relative" style={{minWidth:'120px', height:'120px'}} role="button" onClick={()=>transition(i)}>
                            <Image
                                src={item?.image[0]}
                                fill
                                style={{objectFit: "cover", borderRadius:"4px"}}
                                alt={item?.title}
                            />
                        </div>
                        <div className="d-flex flex-column">
                            <h5 className="mb-0 text-primary">{item?.title}</h5>
                            <small className="mb-2"><strong>Description</strong><br />{item.description}</small>
                            <small><strong>Price<i className="fa-solid fa-angles-right fa-2xs"></i></strong> {currencyFormat.format(item?.pricing)}</small>
                            <small><strong>Status<i className="fa-solid fa-angles-right fa-2xs"></i></strong><span className={`ms-2 ${order.status==="processing"?"text-warning":"text-primary"}`}>{order.status.charAt(0).toUpperCase()+order.status.slice(1,)}</span></small>
                            {order.status==="processing" &&
                                <div className="d-flex flex-sm-column flex-md-row gap-2 mt-2">
                                    <button className="btn btn-primary rounded-pill border border-2 border-primary px-3 py-0 bg-primary align-self-start d-flex align-items-center" style={{fontSize:'0.8rem'}}><i className="fa-solid fa-xmark me-1 shadow-sm"></i>Drop</button>
                                    <button className="btn btn-primary rounded-pill border border-2 border-primary px-3 py-0 bg-primary align-self-start d-flex align-items-center" style={{fontSize:'0.8rem'}}><i className="fa-solid fa-check me-1 shadow-sm"></i>Process</button>
                                </div>
                            }
                        </div>
                    </div>
                    {elem[i] && createPortal(
                        <div className="position-relative" style={{width:'100%', height:'500px'}}>
                            <Image
                                src={item?.image[index]}
                                fill
                                style={{objectFit: "cover", borderRadius:"8px"}}
                                alt={item?.title}
                            />
                            <i className="position-absolute top-0 end-0 mt-4 me-2 fa-solid fa-circle-xmark fa-xl text-primary" role="button" onClick={()=>transition(i)}></i>
                            {(item.image.length>1 && index>0) && 
                                <i className="fa-solid fa-circle-arrow-left position-absolute top-50 start-0 ps-2 translate-middle-y text-primary fa-xl" role="button" onClick={()=>setIndex(index-1)} style={{zIndex:99999}}></i>
                            }
                            {(item.image.length>1 && index<item.image.length-1) && 
                                <i className="fa-solid fa-circle-arrow-right position-absolute top-50 end-0 pe-2 translate-middle-y text-primary fa-xl" role="button" onClick={()=>setIndex(index+1)} style={{zIndex:99999}}></i>
                            }
                        </div>, document?.getElementById('portal'))
                    }
                </Fragment>
            ))}
            <div className="top-shadow d-flex flex-column flex-md-row align-self-stretch align-items-center border-top justify-content-between justify-content-md-start position-aboslute pt-2 bottom-0 start-0 end-0 gap-2">
                <h6 className="align-self-start align-self-md-middle mb-0">Total Amount: {currencyFormat.format(order.items.reduce((sum, item)=>sum+item.pricing, 0))}</h6>
                {order.status==="processing" && <button className="align-self-end btn btn-primary rounded-pill border border-2 border-primary px-3 py-0 bg-primary align-self-start d-flex align-items-center" style={{fontSize:'0.8rem'}}><i className="fa-solid fa-check me-1 shadow-sm"></i>Process All</button>}
            </div>
        </>
    )
}