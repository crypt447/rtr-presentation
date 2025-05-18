"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"

export function MapComponent() {
  const mapRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!mapRef.current) return

    // Set a small timeout to ensure the container is fully rendered
    const loadingTimeout = setTimeout(() => {
      setIsLoading(false)
    }, 800)

    const canvas = document.createElement("canvas")
    // Ensure canvas takes full width and height of parent
    canvas.width = mapRef.current.clientWidth
    canvas.height = mapRef.current.clientHeight
    canvas.style.display = "block" // Prevent any inline gaps
    mapRef.current.appendChild(canvas)

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Handle window resize to keep canvas properly sized
    const handleResize = () => {
      if (!mapRef.current || !ctx) return
      
      canvas.width = mapRef.current.clientWidth
      canvas.height = mapRef.current.clientHeight
      
      // Redraw the map after resize
      drawMap()
    }

    window.addEventListener('resize', handleResize)

    // Draw a satellite-style map
    const drawMap = () => {
      // Draw earth background (dark blue for oceans)
      ctx.fillStyle = "#0c2461"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw a satellite-style earth texture
      const earthPattern = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        canvas.width * 0.7,
      )
      earthPattern.addColorStop(0, "rgba(52, 152, 219, 0.2)")
      earthPattern.addColorStop(1, "rgba(0, 0, 0, 0)")
      ctx.fillStyle = earthPattern
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw continents (simplified)
      ctx.fillStyle = "#2ecc71" // Green for land with satellite-style tint

      // Asia
      ctx.beginPath()
      ctx.ellipse(canvas.width * 0.7, canvas.height * 0.4, canvas.width * 0.25, canvas.height * 0.3, 0, 0, Math.PI * 2)
      ctx.fill()

      // Europe
      ctx.beginPath()
      ctx.ellipse(canvas.width * 0.45, canvas.height * 0.3, canvas.width * 0.15, canvas.height * 0.2, 0, 0, Math.PI * 2)
      ctx.fill()

      // Add some cloud-like patterns for satellite effect
      ctx.fillStyle = "rgba(255, 255, 255, 0.3)"
      for (let i = 0; i < 10; i++) {
        const x = Math.random() * canvas.width
        const y = Math.random() * canvas.height
        const size = Math.random() * 50 + 20
        ctx.beginPath()
        ctx.ellipse(x, y, size, size / 2, 0, 0, Math.PI * 2)
        ctx.fill()
      }

      // Draw Indonesia (highlighted)
      ctx.fillStyle = "#f39c12" // Orange-yellow for Indonesia
      ctx.beginPath()
      ctx.ellipse(canvas.width * 0.75, canvas.height * 0.6, canvas.width * 0.1, canvas.height * 0.05, 0, 0, Math.PI * 2)
      ctx.fill()

      // Draw France (highlighted)
      ctx.fillStyle = "#9b59b6" // Purple for France
      ctx.beginPath()
      ctx.ellipse(
        canvas.width * 0.4,
        canvas.height * 0.35,
        canvas.width * 0.05,
        canvas.height * 0.05,
        0,
        0,
        Math.PI * 2,
      )
      ctx.fill()

      // Mark Surabaya
      ctx.fillStyle = "#e74c3c" // Red marker
      ctx.beginPath()
      ctx.arc(canvas.width * 0.75, canvas.height * 0.6, 8, 0, Math.PI * 2)
      ctx.fill()

      // Add glow effect to Surabaya marker
      const surabayaGlow = ctx.createRadialGradient(
        canvas.width * 0.75,
        canvas.height * 0.6,
        0,
        canvas.width * 0.75,
        canvas.height * 0.6,
        15,
      )
      surabayaGlow.addColorStop(0, "rgba(231, 76, 60, 0.8)")
      surabayaGlow.addColorStop(1, "rgba(231, 76, 60, 0)")
      ctx.fillStyle = surabayaGlow
      ctx.beginPath()
      ctx.arc(canvas.width * 0.75, canvas.height * 0.6, 15, 0, Math.PI * 2)
      ctx.fill()

      // Mark Morbecque
      ctx.fillStyle = "#e74c3c" // Red marker
      ctx.beginPath()
      ctx.arc(canvas.width * 0.4, canvas.height * 0.35, 8, 0, Math.PI * 2)
      ctx.fill()

      // Add glow effect to Morbecque marker
      const morbecqueGlow = ctx.createRadialGradient(
        canvas.width * 0.4,
        canvas.height * 0.35,
        0,
        canvas.width * 0.4,
        canvas.height * 0.35,
        15,
      )
      morbecqueGlow.addColorStop(0, "rgba(231, 76, 60, 0.8)")
      morbecqueGlow.addColorStop(1, "rgba(231, 76, 60, 0)")
      ctx.fillStyle = morbecqueGlow
      ctx.beginPath()
      ctx.arc(canvas.width * 0.4, canvas.height * 0.35, 15, 0, Math.PI * 2)
      ctx.fill()

      // Draw flight path with glow effect
      const gradient = ctx.createLinearGradient(
        canvas.width * 0.75,
        canvas.height * 0.6,
        canvas.width * 0.4,
        canvas.height * 0.35,
      )
      gradient.addColorStop(0, "#e74c3c")
      gradient.addColorStop(1, "#9b59b6")

      ctx.strokeStyle = gradient
      ctx.lineWidth = 3
      ctx.setLineDash([5, 5])
      ctx.beginPath()
      ctx.moveTo(canvas.width * 0.75, canvas.height * 0.6)

      // Create a curved path
      ctx.bezierCurveTo(
        canvas.width * 0.65,
        canvas.height * 0.3, // control point 1
        canvas.width * 0.5,
        canvas.height * 0.5, // control point 2
        canvas.width * 0.4,
        canvas.height * 0.35, // end point
      )
      ctx.stroke()

      // Add glow effect to the path
      ctx.shadowColor = "#e74c3c"
      ctx.shadowBlur = 10
      ctx.strokeStyle = "rgba(231, 76, 60, 0.5)"
      ctx.lineWidth = 6
      ctx.stroke()
      ctx.shadowBlur = 0

      // Add labels with shadow for better visibility
      ctx.font = "bold 14px Inter, sans-serif"
      ctx.fillStyle = "#ffffff"
      ctx.textAlign = "center"
      ctx.shadowColor = "#000000"
      ctx.shadowBlur = 4
      ctx.shadowOffsetX = 1
      ctx.shadowOffsetY = 1

      // Surabaya label
      ctx.fillText("Surabaya", canvas.width * 0.75, canvas.height * 0.6 + 25)
      ctx.fillText("Indonesia", canvas.width * 0.75, canvas.height * 0.6 + 45)

      // Morbecque label
      ctx.fillText("Morbecque", canvas.width * 0.4, canvas.height * 0.35 + 25)
      ctx.fillText("France", canvas.width * 0.4, canvas.height * 0.35 + 45)

      // Reset shadow
      ctx.shadowBlur = 0
      ctx.shadowOffsetX = 0
      ctx.shadowOffsetY = 0
    }

    // Initial draw
    drawMap()

    // Add a small plane icon that moves along the path
    const planeAnimation = () => {
      let progress = 0
      let animationFrameId: number | null = null
      
      const animatePlane = () => {
        if (!ctx) return

        // Clear previous plane position (redraw the map)
        drawMap()

        // Calculate position along the Bezier curve
        const t = progress / 100
        const x =
          Math.pow(1 - t, 3) * (canvas.width * 0.75) +
          3 * Math.pow(1 - t, 2) * t * (canvas.width * 0.65) +
          3 * (1 - t) * Math.pow(t, 2) * (canvas.width * 0.5) +
          Math.pow(t, 3) * (canvas.width * 0.4)

        const y =
          Math.pow(1 - t, 3) * (canvas.height * 0.6) +
          3 * Math.pow(1 - t, 2) * t * (canvas.height * 0.3) +
          3 * (1 - t) * Math.pow(t, 2) * (canvas.height * 0.5) +
          Math.pow(t, 3) * (canvas.height * 0.35)

        // Calculate angle of the plane
        const angle = Math.atan2(
          Math.pow(1 - t, 2) * (canvas.height * 0.3 - canvas.height * 0.6) +
            2 * (1 - t) * t * (canvas.height * 0.5 - canvas.height * 0.3) +
            Math.pow(t, 2) * (canvas.height * 0.35 - canvas.height * 0.5),
          Math.pow(1 - t, 2) * (canvas.width * 0.65 - canvas.width * 0.75) +
            2 * (1 - t) * t * (canvas.width * 0.5 - canvas.width * 0.65) +
            Math.pow(t, 2) * (canvas.width * 0.4 - canvas.width * 0.5),
        )

        // Draw plane with glow effect
        ctx.save()
        ctx.translate(x, y)
        ctx.rotate(angle)

        // Glow effect
        ctx.shadowColor = "#ffffff"
        ctx.shadowBlur = 15

        // Plane icon
        ctx.fillStyle = "#ffffff"
        ctx.beginPath()
        ctx.moveTo(10, 0)
        ctx.lineTo(-10, 5)
        ctx.lineTo(-5, 0)
        ctx.lineTo(-10, -5)
        ctx.closePath()
        ctx.fill()

        ctx.restore()

        progress += 0.5
        if (progress > 100) progress = 0

        animationFrameId = requestAnimationFrame(animatePlane)
      }

      animatePlane()
      
      return () => {
        if (animationFrameId !== null) {
          cancelAnimationFrame(animationFrameId)
        }
      }
    }

    const stopAnimation = planeAnimation()

    // Add UI elements after a small delay to ensure canvas is ready
    setTimeout(() => {
      if (!mapRef.current) return
      
      // Add controls overlay
      const controlsOverlay = document.createElement("div")
      controlsOverlay.className = "absolute top-4 left-4 bg-white bg-opacity-80 p-2 rounded-md shadow-md"
      controlsOverlay.innerHTML = `
        <h4 class="text-sm font-semibold text-gray-700">My Journey</h4>
        <p class="text-xs text-gray-600">Surabaya, Indonesia → Morbecque, France</p>
      `
      mapRef.current.appendChild(controlsOverlay)

      // Add zoom controls
      const zoomControls = document.createElement("div")
      zoomControls.className = "absolute top-4 right-4 bg-white bg-opacity-80 rounded-md shadow-md flex flex-col"
      zoomControls.innerHTML = `
        <button class="p-2 hover:bg-gray-200 transition-colors" id="zoom-in">+</button>
        <button class="p-2 hover:bg-gray-200 transition-colors" id="zoom-out">−</button>
      `
      mapRef.current.appendChild(zoomControls)

      // Add satellite/map toggle
      const mapTypeToggle = document.createElement("div")
      mapTypeToggle.className = "absolute bottom-4 left-4 bg-white bg-opacity-80 p-2 rounded-md shadow-md"
      mapTypeToggle.innerHTML = `
        <button class="text-xs font-semibold text-gray-700">Satellite View</button>
      `
      mapRef.current.appendChild(mapTypeToggle)
    }, 100)

    return () => {
      clearTimeout(loadingTimeout)
      window.removeEventListener('resize', handleResize)
      stopAnimation()
      
      if (mapRef.current) {
        while (mapRef.current.firstChild) {
          mapRef.current.removeChild(mapRef.current.firstChild)
        }
      }
    }
  }, [])

  return (
    <motion.div
      ref={mapRef}
      className="w-full h-[500px] bg-blue-900 relative rounded-xl overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-blue-900 z-10">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-white font-medium">Loading interactive map...</p>
          </div>
        </div>
      )}
    </motion.div>
  )
}
