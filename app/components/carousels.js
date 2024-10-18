"use client"

import React from 'react'
import { useState, useRef, useEffect } from "react";

export default function Carousel({children, autoplay=false, pauseonhover=true, loop=false, delay=10, scrollCount=1, show=4, mobile=2, arrows="hover", navigation=true}){
  const [scrollindex, setScrollindex] = useState(0)
  const [play, setPlay] = useState(autoplay)
  const [playcount, setPlaycount] = useState(0)
  const [arrow, setArrow] = useState(arrows==="yes"?true:false)
  const [width, setWidth] = useState()
  const [overflowCount, setOverflowCount] = useState()
  const scrollRef = useRef()
  const container = useRef()

  useEffect(()=>{
      for (const elem of container.current.children) {
        elem.classList.add('px-3', 'transition')
        elem.addEventListener('mouseover', function(){
          this.firstElementChild.style.transform = "scale(1.2)"
          this.firstElementChild.style.filter = "grayscale(100%)"
        })
        elem.addEventListener('mouseout', function(){
          this.firstElementChild.style.transform = "scale(1.0)"
          this.firstElementChild.style.filter = "grayscale(0%)"
        })
      }
      const childcount = container.current.childElementCount
      const childwidth = container.current.firstElementChild.getBoundingClientRect().width
      const containerWidth = childwidth * childcount
      const carouselWidth = document.getElementById("carousel")?.getBoundingClientRect().width
      setWidth(childwidth)
      setOverflowCount(Math.round((containerWidth - carouselWidth)/childwidth))
  },[])

  useEffect(()=>{
    if(play && overflowCount > 0 && show > 0){
      scrollRef.current = setTimeout(()=>{
          if(scrollindex === overflowCount){
              container.current.style.transform = `translateX(-${0}px)`
              setScrollindex(0)
              setPlaycount(playcount=>playcount+1)
              return setPlay(loop)
          }else{
              container.current.style.transform = `translateX(-${width*(scrollindex+(overflowCount-scrollindex > scrollCount?scrollCount:overflowCount-scrollindex||1))}px)`
              return setScrollindex(scrollindex+(overflowCount-scrollindex > scrollCount?scrollCount:overflowCount-scrollindex||1))
          }
      }, delay*1000)
    }
  }, [width, scrollindex, overflowCount])

  const handleClick = (navigation) => {
      clearTimeout(scrollRef.current)
      setPlay(false)
      if(navigation === "left" ){
        if(scrollindex <= 0){
          return
        }else{
          container.current.style.transform = `translateX(-${width*(scrollindex-(scrollindex>scrollCount?scrollCount:scrollindex||1))}px)`
          setScrollindex(scrollindex-(scrollindex>scrollCount?scrollCount:scrollindex||1))
        }
      }else if(navigation==="right"){
        if(scrollindex === overflowCount){
          return
        }else{
          container.current.style.transform = `translateX(-${width*(scrollindex+(overflowCount-scrollindex > scrollCount?scrollCount:overflowCount-scrollindex||1))}px)`
          setScrollindex(scrollindex +(overflowCount-scrollindex > scrollCount?scrollCount:overflowCount-scrollindex||1))
        }
      }else{
          switch(navigation.i) {
              case(0): {
                  container.current.style.transform = `translateX(-${width*navigation.i}px)`
                  setScrollindex(navigation.i)
                  break
              }
              case(navigation.arr.length - 1): {
                  container.current.style.transform = `translateX(-${width*overflowCount}px)`
                  setScrollindex(overflowCount)
                  break
              }
              default: {
                  container.current.style.transform = `translateX(-${width*navigation.i*scrollCount}px)`
                  setScrollindex(navigation.i)
              }
          }
      }

      setTimeout(()=>{
          setPlay(loop)
      }, 5000)
  }

  return (
      <div id="carousel" className="d-flex flex-column overflow-hidden">
          <div id="wrapper" className="position-relative overflow-hidden py-2" onMouseOver={()=>{arrows==="hover" && setArrow(true); pauseonhover && clearTimeout(scrollRef.current); pauseonhover && setPlay(false)}} onMouseOut={()=>{arrows==="hover" && setArrow(false); pauseonhover && setPlay(loop?loop:scrollindex !== overflowCount && playcount < 1)}}>
              <div id="container" ref={container} className={`row-cols-${mobile} row-cols-md-${show} d-flex flex-row flex-nowrap justify-content-start transition`}>
                {children}
              </div>
              <>
                  {scrollindex > 0 && arrow &&
                      <div onClick={()=>handleClick("left")} role="button">
                          <div className="d-flex justify-content-center align-items-center bg-primary opacity-50 position-absolute top-0 start-0" style={{height: '100%', width: '35px'}}>
                              <i className="fa-solid fa-circle-arrow-left fa-xl text-white"></i>
                          </div>
                      </div>
                  }
                  {scrollindex < overflowCount && arrow &&
                      <div onClick={()=>handleClick("right")} role="button">
                          <div className="d-flex justify-content-center align-items-center bg-primary opacity-50 position-absolute top-0 end-0" style={{height: '100%', width: '35px'}}>
                              <i className="fa-solid fa-circle-arrow-right fa-xl text-white"></i>
                          </div>
                      </div>
                  }
              </>
          </div>
          {navigation && <div className="d-inline-flex justify-content-center" style={{height:'30px'}}>{overflowCount>0 && Array(Math.ceil(overflowCount/scrollCount)+1).fill(0).map((el, i, arr)=><div key={i} className="align-self-center border border-2 border-primary rounded-circle me-2"><div className={`rounded-circle transition ${i===Math.ceil(scrollindex/scrollCount) && 'bg-primary border border-1 border-tertiary'}`} style={{width: i===Math.ceil(scrollindex/scrollCount)?'12px':'7px', height: i===Math.ceil(scrollindex/scrollCount)?'12px':'7px'}} role="button" onClick={()=>handleClick({i, arr})} disabled={i===scrollindex}></div></div>)}</div>}
      </div>
  )
}

export function Carousels({children, autoplay=false, pauseonhover=true, loop=false, delay=10, scrollCount=1, show=4, mobile=2, arrows="hover", navigation=true}){
  const [scrollindex, setScrollindex] = useState(0)
  const [play, setPlay] = useState(autoplay)
  const [playcount, setPlaycount] = useState(0)
  const [arrow, setArrow] = useState(arrows==="yes"?true:false)
  const [width, setWidth] = useState()
  const [translate, setTranslate] = useState(0)
  const [overflowCount, setOverflowCount] = useState()
  const scrollRef = useRef()
  const container = useRef()

  useEffect(()=>{
      for (const elem of container.current.children) {
        elem.classList.add('px-3', 'transition')
        elem.addEventListener('mouseover', function(){
          this.firstElementChild.style.transform = "scale(1.2)"
          this.firstElementChild.style.filter = "grayscale(100%)"
        })
        elem.addEventListener('mouseout', function(){
          this.firstElementChild.style.transform = "scale(1.0)"
          this.firstElementChild.style.filter = "grayscale(0%)"
        })
      }
      const childcount = container.current.childElementCount
      const childwidth = container.current.firstElementChild.getBoundingClientRect().width
      const containerWidth = childwidth * childcount
      const carouselWidth = document.getElementById("carousel")?.getBoundingClientRect().width
      setWidth(childwidth)
      setOverflowCount(Math.round((containerWidth - carouselWidth)/childwidth))
  },[])

  useEffect(()=>{
    if(play && overflowCount > 0 && show > 0){
      scrollRef.current = setTimeout(()=>{
        if((Math.round(translate) === Math.round(overflowCount*width))){
          if(loop){
            for (const elem of container.current.children){
              elem.style.transform = `translateX(-${width*scrollCount}px)`
              setPlaycount(playcount+1)
            }
            let i = 0
            while(i<overflowCount){
              container.current.removeChild(container.current.firstElementChild)
              i = i+1
            }
          }else{
            clearInterval(scrollRef.current)
          }
        }else{
          for (const elem of container.current.children){
            elem.style.transform = `translateX(-${width*scrollCount}px)`
          }
          setTranslate(translate => translate+(width*scrollCount))
        }
      }, delay*1000)
      return ()=>clearTimeout(scrollRef.current)
    }
  },[container.current?.style, width, translate, playcount])

  const handleClick = (navigation) => {
      clearTimeout(scrollRef.current)
      setPlay(false)
      if(navigation === "left" ){
        if(scrollindex <= 0){
          return
        }else{
          container.current.style.transform = `translateX(-${width*(scrollindex-(scrollindex>scrollCount?scrollCount:scrollindex||1))}px)`
          setScrollindex(scrollindex-(scrollindex>scrollCount?scrollCount:scrollindex||1))
        }
      }else if(navigation==="right"){
        if(scrollindex === overflowCount){
          return
        }else{
          container.current.style.transform = `translateX(-${width*(scrollindex+(overflowCount-scrollindex > scrollCount?scrollCount:overflowCount-scrollindex||1))}px)`
          setScrollindex(scrollindex +(overflowCount-scrollindex > scrollCount?scrollCount:overflowCount-scrollindex||1))
        }
      }else{
          switch(navigation.i) {
              case(0): {
                  container.current.style.transform = `translateX(-${width*navigation.i}px)`
                  setScrollindex(navigation.i)
                  break
              }
              case(navigation.arr.length - 1): {
                  container.current.style.transform = `translateX(-${width*overflowCount}px)`
                  setScrollindex(overflowCount)
                  break
              }
              default: {
                  container.current.style.transform = `translateX(-${width*navigation.i*scrollCount}px)`
                  setScrollindex(navigation.i)
              }
          }
      }

      setTimeout(()=>{
          setPlay(loop)
      }, 5000)
  }

  return (
      <div id="carousel" className="container-sm d-flex flex-column">
          <div id="wrapper" className="container-sm position-relative py-2" onMouseOver={()=>{arrows==="hover" && setArrow(true); pauseonhover && clearTimeout(scrollRef.current); pauseonhover && setPlay(false)}} onMouseOut={()=>{arrows==="hover" && setArrow(false); pauseonhover && setPlay(loop?loop:scrollindex !== overflowCount && playcount < 1)}}>
              <div id="container" ref={container} className={`row-cols-${mobile} row-cols-md-${show} d-flex flex-row flex-nowrap justify-content-start transition`}>
                {children}
              </div>
              <>
                  {scrollindex > 0 && arrow &&
                      <div onClick={()=>handleClick("left")} role="button">
                          <div className="d-flex justify-content-center align-items-center bg-primary opacity-50 position-absolute top-0 start-0" style={{height: '100%', width: '35px'}}>
                              <i className="fa-solid fa-circle-arrow-left fa-xl text-white"></i>
                          </div>
                      </div>
                  }
                  {scrollindex < overflowCount && arrow &&
                      <div onClick={()=>handleClick("right")} role="button">
                          <div className="d-flex justify-content-center align-items-center bg-primary opacity-50 position-absolute top-0 end-0" style={{height: '100%', width: '35px'}}>
                              <i className="fa-solid fa-circle-arrow-right fa-xl text-white"></i>
                          </div>
                      </div>
                  }
              </>
          </div>
          {navigation && <div className="d-inline-flex justify-content-center" style={{height:'30px'}}>{overflowCount>0 && Array(Math.ceil(overflowCount/scrollCount)+1).fill(0).map((el, i, arr)=><div key={i} className="align-self-center border border-2 border-primary rounded-circle me-2"><div className={`rounded-circle transition ${i===Math.ceil(scrollindex/scrollCount) && 'bg-primary border border-1 border-tertiary'}`} style={{width: i===Math.ceil(scrollindex/scrollCount)?'12px':'7px', height: i===Math.ceil(scrollindex/scrollCount)?'12px':'7px'}} role="button" onClick={()=>handleClick({i, arr})} disabled={i===scrollindex}></div></div>)}</div>}
      </div>
  )
}
