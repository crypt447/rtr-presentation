"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"

const CITIES = {
  medan: { left: "9%", top: "10%", name: "Medan", desc: "Birthplace" },
  jakarta: { left: "27%", top: "73%", name: "Jakarta", desc: "Where I grew up" },
  malang: { left: "38%", top: "81%", name: "Malang", desc: "Current residence" },
  jayapura: { left: "98%", top: "70%", name: "Jayapura", desc: "Cultural visit" },
}

export function IndonesiaMap() {
  const mapRef = useRef<HTMLDivElement>(null)
  const [isMapLoaded, setIsMapLoaded] = useState(false)
  const [activeCity, setActiveCity] = useState<string | null>(null)
  const [aspectRatio, setAspectRatio] = useState(16 / 9)

  const mapImageUrl =
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-DgllxurNjDH49q4biALdmNq4ffHv8u.png"

  useEffect(() => {
    const img = new Image()
    img.src = mapImageUrl
    img.onload = () => {
      setAspectRatio(img.naturalHeight / img.naturalWidth)
      setIsMapLoaded(true)
    }
  }, [])

  useEffect(() => {
    if (!isMapLoaded) return
    const cities = Object.keys(CITIES)
    let currentIndex = 0

    const interval = setInterval(() => {
      setActiveCity(cities[currentIndex])
      currentIndex = (currentIndex + 1) % cities.length
    }, 3000)

    return () => clearInterval(interval)
  }, [isMapLoaded])

  return (
    <div className="w-full">
      {/* Responsive aspect-ratio wrapper */}
      <div
        className="relative w-full"
        style={{
          paddingBottom: `${aspectRatio * 100}%`,
        }}
      >
        <motion.div
          ref={mapRef}
          className="absolute inset-0 rounded-xl overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          {/* Background */}
          <div className="absolute inset-0 bg-blue-900 z-0" />

          {/* Responsive map image */}
          <img
            src={mapImageUrl}
            alt="Indonesia Map"
            className="absolute inset-0 w-full h-full object-contain z-10"
          />

          {/* City markers */}
          {Object.entries(CITIES).map(([key, city]) => (
            <div
              key={key}
              className={`absolute z-20 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ${
                activeCity === key ? "scale-125" : ""
              }`}
              style={{ left: city.left, top: city.top }}
              onMouseEnter={() => setActiveCity(key)}
              onMouseLeave={() => setActiveCity(null)}
            >
              <div className="relative">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    activeCity === key ? "bg-purple-500 pulse-glow" : "bg-red-500"
                  }`}
                >
                  <i className="bi bi-geo-alt-fill text-white text-sm" />
                </div>
                <div
                  className={`absolute top-8 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded shadow-md transition-opacity duration-300 ${
                    activeCity === key ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <p className="text-xs font-bold text-gray-800 whitespace-nowrap">
                    {city.name}
                  </p>
                  <p className="text-xs text-gray-600 whitespace-nowrap">
                    {city.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {/* Title - make sure it's above the map image */}
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white bg-opacity-90 px-4 py-2 rounded-full shadow-lg z-30">
            <h3 className="text-lg font-bold text-purple-900">My Life Journey in Indonesia</h3>
          </div>

          {/* Optional Zoom Buttons */}
          <div className="absolute top-4 right-4 bg-white bg-opacity-80 p-2 rounded shadow-md z-30">
            <div className="flex flex-col gap-2">
              <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-200">
                <i className="bi bi-plus text-gray-700" />
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-200">
                <i className="bi bi-dash text-gray-700" />
              </button>
            </div>
          </div>

          {/* Loading Overlay */}
          {!isMapLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-purple-50 z-40">
              <div className="flex flex-col items-center">
                <i className="bi bi-globe text-4xl text-purple-600 animate-pulse mb-2" />
                <p className="text-gray-700">Loading Indonesian map...</p>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Legend */}
      <div className="mt-4 bg-white p-4 rounded-lg shadow-md">
        <h4 className="text-sm font-bold text-gray-800 mb-1">Self Introduction</h4>
        <p className="text-xs text-gray-700 mb-2">Important places in my life:</p>
        <div className="flex flex-col gap-1">
          {Object.entries(CITIES).map(([key, city]) => (
            <div key={key} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span className="text-xs text-gray-700">
                {city.name} - {city.desc}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Personal Info */}
      <div className="mt-4 bg-white p-4 rounded-lg shadow-md">
        <h4 className="text-sm font-bold text-purple-900 mb-1">Alif Sinaga</h4>
        <p className="text-xs text-gray-700 mb-2">Rotary Youth Exchange Student 2025</p>
        <div className="flex items-center gap-2 text-xs text-gray-700">
          <i className="bi bi-heart-fill text-red-500" />
          <span>Loves Indonesia's diversity</span>
        </div>
      </div>
    </div>
  )
}
