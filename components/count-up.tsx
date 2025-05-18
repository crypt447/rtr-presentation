"use client"

import { useEffect, useState, useRef } from "react"
import { useInView } from "framer-motion"

interface CountUpProps {
  end: number
  duration?: number
  className?: string
}

export function CountUp({ end, duration = 2, className = "" }: CountUpProps) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [hasAnimated, setHasAnimated] = useState(false)

  useEffect(() => {
    if (isInView && !hasAnimated) {
      let startTime: number
      let animationFrameId: number

      const startAnimation = (timestamp: number) => {
        startTime = timestamp
        animateCount(timestamp)
      }

      const animateCount = (timestamp: number) => {
        const progress = Math.min((timestamp - startTime) / (duration * 1000), 1)
        const currentCount = Math.floor(progress * end)

        setCount(currentCount)

        if (progress < 1) {
          animationFrameId = requestAnimationFrame(animateCount)
        } else {
          setCount(end)
          setHasAnimated(true)
        }
      }

      animationFrameId = requestAnimationFrame(startAnimation)

      return () => {
        cancelAnimationFrame(animationFrameId)
      }
    }
  }, [isInView, end, duration, hasAnimated])

  return (
    <span ref={ref} className={className}>
      {count}
    </span>
  )
}
