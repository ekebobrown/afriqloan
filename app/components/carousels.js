"use client"

import React from 'react'
import { useState, useRef, useEffect } from "react";
import Skeleton from "react-loading-skeleton";

export default function Carousel({children, autoplay=false, continous=false, delay=10, scrollCount=1, limit}){
  const [scrollindex, setScrollindex] = useState(0)
  const [play, setPlay] = useState(autoplay)
  const [playcount, setPlaycount] = useState(0)
  const [nav, setNav] = useState(false)
  const scrollRef = useRef()
  let width, containerWidth, carousel, carouselWidth, overflowCount

  if(children && document.getElementsByClassName("carousel-item")[0]){
      width = document.getElementsByClassName("carousel-item")[0].getBoundingClientRect().width
      containerWidth = width * limit
      carousel = document.getElementById("carousel")
      carouselWidth = carousel?.getBoundingClientRect().width
      overflowCount = Math.round((containerWidth - carouselWidth)/width)
  }

  useEffect(()=>{
      if(play && overflowCount > 0){
      if(limit > 0 && document.getElementById("carousel")){
          scrollRef.current = setTimeout(()=>{
              if(scrollindex === overflowCount){
                  carousel.style.transform = `translateX(-${0}px)`
                  setScrollindex(0)
                  setPlaycount(playcount=>playcount+1)
                  return setPlay(continous)
              }else{
                  carousel.style.transform = `translateX(-${width*(scrollindex+(overflowCount-scrollindex > scrollCount?scrollCount:overflowCount-scrollindex||1))}px)`
                  return setScrollindex(scrollindex+(overflowCount-scrollindex > scrollCount?scrollCount:overflowCount-scrollindex||1))
              }
          }, delay*1000)
      }
    }
  },[carousel?.style, continous, delay, limit, overflowCount, play, playcount, width, scrollCount, scrollindex])

  const handleClick = (navigation) => {
      clearTimeout(scrollRef.current)
      setPlay(false)
      if(navigation === "left" ){
        if(scrollindex <= 0){
          return
        }else{
          carousel.style.transform = `translateX(-${width*(scrollindex-(scrollindex>scrollCount?scrollCount:scrollindex||1))}px)`
          setScrollindex(scrollindex-(scrollindex>scrollCount?scrollCount:scrollindex||1))
        }
      }else if(navigation==="right"){
        if(scrollindex === overflowCount){
          return
        }else{
          carousel.style.transform = `translateX(-${width*(scrollindex+(overflowCount-scrollindex > scrollCount?scrollCount:overflowCount-scrollindex||1))}px)`
          setScrollindex(scrollindex +(overflowCount-scrollindex > scrollCount?scrollCount:overflowCount-scrollindex||1))
        }
      }else{
          switch(navigation.i) {
              case(0): {
                  carousel.style.transform = `translateX(-${width*navigation.i}px)`
                  setScrollindex(navigation.i)
                  break
              }
              case(navigation.arr.length - 1): {
                  carousel.style.transform = `translateX(-${width*overflowCount}px)`
                  setScrollindex(overflowCount)
                  break
              }
              default: {
                  carousel.style.transform = `translateX(-${width*navigation.i*scrollCount}px)`
                  setScrollindex(navigation.i)
              }
          }
      }

      setTimeout(()=>{
          setPlay(continous)
      }, 5000)
  }

  return (
      <div className="d-flex flex-column overflow-hidden">
          <div className="position-relative" onMouseOver={()=>{setNav(true); clearTimeout(scrollRef.current); setPlay(false)}} onMouseOut={()=>{setNav(false); setPlay(continous?continous:scrollindex !== overflowCount && playcount < 1)}}>
              {children}
              <>
                  {scrollindex > 0 && nav &&
                      <div onClick={()=>handleClick("left")} role="button">
                          <div className="d-flex justify-content-center align-items-center bg-dark opacity-75 position-absolute top-0 start-0" style={{height: '100%', width: '35px'}}>
                              <i className="fa-solid fa-circle-arrow-left fa-xl text-white"></i>
                          </div>
                      </div>
                  }
                  {scrollindex < overflowCount && nav &&
                      <div onClick={()=>handleClick("right")} role="button">
                          <div className="d-flex justify-content-center align-items-center bg-dark opacity-75 position-absolute top-0 end-0" style={{height: '100%', width: '35px'}}>
                              <i className="fa-solid fa-circle-arrow-right fa-xl text-white"></i>
                          </div>
                      </div>
                  }
              </>
          </div>
          <div className="d-inline-flex justify-content-center mt-4">{overflowCount>0 && Array(Math.ceil(overflowCount/scrollCount)+1).fill(0).map((el, i, arr)=><div key={i} className="align-self-center border border-2 border-primary rounded-circle me-2"><div className={`rounded-circle ${i===Math.ceil(scrollindex/scrollCount) && 'bg-primary border border-1 border-tertiary'}`} style={{width: '7px', height: '7px'}} role="button" onClick={()=>handleClick({i, arr})} disabled={i===scrollindex}></div></div>)}</div>
      </div>
  )
}
