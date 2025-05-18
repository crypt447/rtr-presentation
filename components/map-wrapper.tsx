"use client"

import { useState, useEffect } from "react"
import { IndonesiaMap } from "./indonesia-map"

export function MapWrapper() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return (
      <div className="w-full h-full bg-purple-50 rounded-xl flex items-center justify-center">
        <div className="flex flex-col items-center">
          <i className="bi bi-globe text-4xl text-purple-600 animate-pulse mb-2"></i>
          <p className="text-gray-700">Loading peta...</p>
        </div>
      </div>
    )
  }

  return <IndonesiaMap />
}
