"use client"

import { useEffect, useState } from "react";

export default function IsOffline() {
  const [isOnline, setOnline] = useState(true);

  const updateNetworkStatus = () => {
    setOnline(navigator.onLine);
  };

  useEffect(() => {
    window.addEventListener("online", updateNetworkStatus);
    window.addEventListener("offline", updateNetworkStatus);

    return () => {
        window.removeEventListener("online", updateNetworkStatus);
        window.removeEventListener("offline", updateNetworkStatus);
    };
  });

  return (
    <>
        {!isOnline && <div className="px-4 py-1 bg-danger w-100 text-center text-white sticky-top" style={{transition:'all 2s ease-out'}}><i className="fa-solid fa-link-slash me-2"></i>You are currently working offline</div>}
    </>
  )
};