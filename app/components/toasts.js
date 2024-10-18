"use client"

import { useState, useEffect, useRef } from 'react';

export default function Toast({children, position, toast, setToast, timeout=5}) {
  const [parent, setParent] = useState(toast.state)
  const [child, setChild] = useState(false)
  const manualClose = useRef()
  let style

  useEffect(()=>{
    if(parent && !child){
      setChild(true)
    }else if(!parent && child) {
        manualClose.current = setTimeout(()=>{
          setToast({...toast, state:false})
        }, 1000)
    }
    return ()=>clearTimeout(manualClose.current)
  },[parent, child, timeout, setToast, toast])

  const autoClose = setTimeout(()=>{
    setParent(!parent)
  },timeout*1000)

  const fontSize = "1rem"

  switch(position) {
    case("top-left"): {
      style = {
        top: '60px',
        left: 0,
        color: toast.color,
        maxWidth: '80%',
        zIndex: 9999,
        fontSize: fontSize
      };
      break;
    }
    case("top-right"): {
      style = {
        top: '60px',
        right: 0,
        color: toast.color,
        maxWidth: '80%',
        zIndex: 9999,
        fontSize: fontSize
      };
      break;
    }
    case("bottom-left"): {
      style = {
        bottom: '10px',
        left: 0,
        color: toast.color,
        maxWidth: '80%',
        zIndex: 9999,
        fontSize: fontSize
      };
      break;
    }
    default: {
      style = {
        bottom: '10px',
        right: 0,
        color: toast.color,
        maxWidth: '80%',
        zIndex: 9999,
        fontSize: fontSize
      }
    }
  }


  return (
      <div id="toast" className={`position-fixed m-4 ${parent?`${position==='top-left'||position==='bottom-left'?'slideinleft':'slideinright'}`:`${position==='top-right'||position==='bottom-right'?'slideoutright':'slideoutleft'}`} bg-${(toast.status==='success'&&'primary')||(toast.status==='warning'&&'warning')||(toast.status==='error'&&'danger')}`} style={style}>
        <div className="position-relative px-3 pt-2 pb-1 fw-normal d-inline-flex align-items-center lh-1">
          <i className={`pe-2 fa-solid fa-${(toast.status==='success'&&'circle-check')||(toast.status==='warning'&&'circle-exclamation')||(toast.status==='error'&&'triangle-exclamation')}`}></i>
              {children}
          <i className="fa-solid fa-circle-xmark position-absolute top-0 start-100 translate-middle z-3 text-white" role="button" onClick={()=>{setParent(!parent); clearTimeout(autoClose)}} style={{fontSize: '1em', color:'#FFFFFF'}}></i>
        </div>
        <div className={`progress ${!parent?`bg-${(toast.status==='success'&&'primary')||(toast.status==='warning'&&'warning')||(toast.status==='error'&&'danger')}`:'bg-warning'}`} style={{height:'4px'}}></div>
      </div>
  )
}
