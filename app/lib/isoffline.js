"use client"

import { useEffect, useState } from "react";

export default function IsOffline() {
  const [isOnline, setOnline] = useState(true)
  const [property, setProperty] = useState({height:0, opacity:0.8})

  const updateNetworkStatus = () => {
    setOnline(navigator.onLine);
  };
  
  useEffect(()=>{
    !isOnline?
      setProperty({height:30, opacity:1}):
      setTimeout(()=>{
        setProperty({height:0, opacity:0.8})
      }, 5000)
  },[isOnline])

  useEffect(() => {
    window.addEventListener("online", updateNetworkStatus);
    window.addEventListener("offline", updateNetworkStatus);

    return () => {
        window.removeEventListener("online", updateNetworkStatus);
        window.removeEventListener("offline", updateNetworkStatus);
    };
  });

  return (
    <div className="overflow-hidden" style={{height:`${property.height}px`, opacity:property.opacity, transition:'height 0.6s ease-in-out'}}>
        {!isOnline && <div className="px-4 py-1 bg-danger w-100 text-center text-white sticky-top"><i className="fa-solid fa-signal me-2"></i>You are currently offline</div>}
        {isOnline && <div className="px-4 py-1 bg-success w-100 text-center text-white sticky-top"><i className="fa-solid fa-signal me-2"></i>You are back online</div>}
    </div>
  )
};