"use client"

import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

const CITIES = {
  jakarta: {
    left: "27%",
    top: "73%",
    name: "Jakarta",
    desc: "Birthplace",
    color: "bg-red-500",
    icon: "bi-geo-alt-fill",
  },
  jayapura: {
    left: "98%",
    top: "70%",
    name: "Jayapura",
    desc: "Raised for a while",
    color: "bg-blue-500",
    icon: "bi-geo-fill",
  },
  medan: {
    left: "9%",
    top: "10%",
    name: "Medan",
    desc: "Current home / Residence",
    color: "bg-green-500",
    icon: "bi-geo-alt",
  },
  malang: {
    left: "38%",
    top: "81%",
    name: "Malang",
    desc: "Domicile & School",
    color: "bg-yellow-500",
    icon: "bi-geo",
  },
}

const CITY_ORDER = ["jakarta", "jayapura", "medan", "malang"]

export function IndonesiaMap() {
  const mapRef = useRef<HTMLDivElement>(null)
  const [isMapLoaded, setIsMapLoaded] = useState(false)
  const [activeCity, setActiveCity] = useState<string | null>(CITY_ORDER[0])
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
    let currentIndex = 0

    setActiveCity(CITY_ORDER[0])
    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % CITY_ORDER.length
      setActiveCity(CITY_ORDER[currentIndex])
    }, 3000)

    return () => clearInterval(interval)
  }, [isMapLoaded])

  return (
    <div className="w-full max-w-3xl mx-auto px-2 sm:px-4 flex flex-col items-stretch min-h-0">
      {/* Title */}
      <div className="w-full flex justify-center mb-2">
        <div className="bg-white bg-opacity-90 px-4 py-2 rounded-full shadow-lg">
          <h3 className="text-base md:text-lg font-bold text-purple-900 text-center">
            My Life Journey in Indonesia
          </h3>
        </div>
      </div>

      {/* Map container with aspect ratio */}
      <div
        className="relative w-full rounded-xl overflow-visible"
        style={{
          aspectRatio: `${1 / aspectRatio}`,
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
          <div className="absolute inset-0 bg-blue-900 z-0" />
          <img
            src={mapImageUrl}
            alt="Indonesia Map"
            className="absolute inset-0 w-full h-full object-contain z-10 select-none pointer-events-none"
            draggable={false}
          />

          {/* City Pins + Info Boxes */}
          {CITY_ORDER.map((key) => {
            const city = CITIES[key]
            const leftNum = parseFloat(city.left)
            const topNum = parseFloat(city.top)

            let infoBoxClass =
              "absolute bottom-full left-1/2 -translate-x-1/2 mb-2"
            if (key === "medan") {
              infoBoxClass = "absolute top-full left-1/2 -translate-x-1/2 mt-2"
            } else {
              if (topNum < 15)
                infoBoxClass =
                  "absolute top-full left-1/2 -translate-x-1/2 mt-2"
              if (leftNum < 15)
                infoBoxClass =
                  "absolute bottom-full left-full ml-2 -translate-y-1/2"
              if (leftNum > 85)
                infoBoxClass =
                  "absolute bottom-full right-full mr-2 -translate-y-1/2"
            }

            return (
              <div
                key={key}
                className="absolute z-20 transform -translate-x-1/2 -translate-y-1/2"
                style={{ left: city.left, top: city.top }}
              >
                <AnimatePresence>
                  {activeCity === key && (
                    <motion.div
                      key={key}
                      initial={{ opacity: 0, scale: 0.8, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.8, y: 10 }}
                      transition={{ duration: 0.5, type: "spring" }}
                      className={`${infoBoxClass} bg-white px-2 py-1 rounded shadow-md z-30 min-w-[100px] text-center`}
                    >
                      <p className="text-xs md:text-sm font-bold text-gray-800 whitespace-nowrap">
                        {city.name}
                      </p>
                      <p className="text-xs md:text-sm text-gray-600 whitespace-nowrap">
                        {city.desc}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
                <div
                  className={`w-6 h-6 md:w-7 md:h-7 rounded-full flex items-center justify-center ${city.color}`}
                >
                  <i className="bi bi-geo-alt-fill text-white text-sm md:text-base" />
                </div>
              </div>
            )
          })}

          {/* Zoom controls (non-functional placeholder) */}
          <div className="absolute top-2 right-2 md:top-4 md:right-4 bg-white bg-opacity-80 p-1 md:p-2 rounded shadow-md z-30 flex flex-col gap-1 md:gap-2">
            <button className="w-7 h-7 md:w-8 md:h-8 flex items-center justify-center rounded hover:bg-gray-200 transition-transform duration-300 hover:scale-110">
              <i className="bi bi-plus text-gray-700" />
            </button>
            <button className="w-7 h-7 md:w-8 md:h-8 flex items-center justify-center rounded hover:bg-gray-200">
              <i className="bi bi-dash text-gray-700" />
            </button>
          </div>

          {/* Loading indicator */}
          {!isMapLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-purple-50 z-40">
              <div className="flex flex-col items-center">
                <i className="bi bi-globe text-3xl md:text-4xl text-purple-600 animate-pulse mb-2" />
                <p className="text-gray-700 text-sm md:text-base">
                  Loading Indonesian map...
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Info Boxes Below Map */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* About Me */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h4 className="text-sm md:text-base font-bold text-gray-800 mb-1">About Me</h4>
          <p className="text-xs md:text-sm text-gray-700 mb-2">Important places in my life:</p>
          <div className="flex flex-col gap-1">
            {Object.entries(CITIES).map(([key, city]) => (
              <div key={key} className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${city.color}`} />
                <span className="text-xs md:text-sm text-gray-700">
                  {city.name} - {city.desc}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Indonesian Facts */}
        <div className="bg-white p-4 rounded-lg shadow-md flex flex-col justify-center">
          <h4 className="text-sm md:text-base font-bold text-purple-900 mb-1">Indonesian Facts</h4>
          <p className="text-xs md:text-sm text-gray-700 mb-2">Interesting facts about Indonesia:</p>
          <div className="flex items-center gap-2 text-xs md:text-sm text-gray-700 mb-1">
            <i className="bi bi-water" style={{ color: "#4FC3F7" }} />
            <span>World’s largest archipelagic country</span>
          </div>
          <div className="flex items-center gap-2 text-xs md:text-sm text-gray-700 mb-1">
            <i className="bi bi-people-fill" style={{ color: "#FFD600" }} />
            <span>Home to 1340+ ethnic groups</span>
          </div>
          <div className="flex items-center gap-2 text-xs md:text-sm text-gray-700">
            <i className="bi bi-bank2" style={{ color: "#FF7043" }} />
            <span>Country with 6 officially recognized religions</span>
          </div>
          <div className="flex items-center gap-2 text-xs md:text-sm text-gray-700">
          <i className="bi bi-globe-americas" style={{ color: "#81C784" }} />
          <span>Fourth most populous country in the world</span>
          </div>
        </div>
      </div>

      <div className="mb-6" />
    </div>
  )
}
