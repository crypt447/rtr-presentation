"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { motion, useAnimation, AnimatePresence } from "framer-motion"
import { MapWrapper } from "@/components/map-wrapper"
import { CountUp } from "@/components/count-up"
import { Line } from "react-chartjs-2"
import { Pie } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js"

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Tooltip, Legend)

export default function Home() {
  const [activeSection, setActiveSection] = useState(0)
  const [nameToggle, setNameToggle] = useState(false)
  const [parallaxBromo, setParallaxBromo] = useState(1)
  const [parallaxOther, setParallaxOther] = useState(1)
  const [showOrientationAlert, setShowOrientationAlert] = useState(false)
  const nameControls = useAnimation()
  const sectionRefs = useRef<(HTMLElement | null)[]>([])

  // Auto toggle name effect
  useEffect(() => {
    const toggleInterval = setInterval(() => {
      setNameToggle((prev) => !prev)
    }, 5000)
    return () => clearInterval(toggleInterval)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      if (scrollY < (sectionRefs.current[2]?.offsetTop ?? 1000)) {
        const scale = 1 + Math.min(scrollY, 600) / 4000
        setParallaxBromo(scale)
      } else if (scrollY < (sectionRefs.current[4]?.offsetTop ?? 3000)) {
        const base = sectionRefs.current[2]?.offsetTop ?? 0
        const relY = Math.max(0, scrollY - base)
        const scale = 1.15 - Math.min(relY, 600) / 4000
        setParallaxBromo(scale)
      }
      if (scrollY >= (sectionRefs.current[4]?.offsetTop ?? 3000)) {
        const base = sectionRefs.current[4]?.offsetTop ?? 0
        const relY = Math.max(0, scrollY - base)
        const scale = 1 + Math.min(relY, 600) / 4000
        setParallaxOther(scale)
      }
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleDotClick = (index: number) => {
    sectionRefs.current[index]?.scrollIntoView({ behavior: "smooth" })
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowDown" && activeSection < sectionRefs.current.length - 1) {
      sectionRefs.current[activeSection + 1]?.scrollIntoView({ behavior: "smooth" })
    } else if (e.key === "ArrowUp" && activeSection > 0) {
      sectionRefs.current[activeSection - 1]?.scrollIntoView({ behavior: "smooth" })
    }
  }

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [activeSection])

  useEffect(() => {
    const handleScroll = () => {
      const offsets = sectionRefs.current.map((ref) => ref?.offsetTop ?? 0)
      const scrollY = window.scrollY + window.innerHeight / 2
      let current = 0
      for (let i = 0; i < offsets.length; i++) {
        if (scrollY >= offsets[i]) current = i
      }
      setActiveSection(current)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Cek orientasi saat mount dan saat resize
  useEffect(() => {
    const checkOrientation = () => {
      // Ratio < 1 berarti portrait
      if (window.innerWidth < window.innerHeight) {
        setShowOrientationAlert(true)
      } else {
        setShowOrientationAlert(false)
      }
    }
    checkOrientation()
    window.addEventListener("resize", checkOrientation)
    return () => window.removeEventListener("resize", checkOrientation)
  }, [])

  return (
    <main className="relative">
      {/* Orientation Alert Modal */}
      {showOrientationAlert && (
        <div className="fixed inset-0 z-[9999] bg-black bg-opacity-70 flex items-center justify-center">
          <div
            className="bg-white rounded-xl shadow-2xl p-8 max-w-xs w-[90vw] flex flex-col items-center text-center"
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <h2 className="text-2xl font-bold text-purple-800 mb-4">Landscape Only</h2>
            <p className="text-gray-700 mb-6">
              This website is designed for presentation and only supports laptops, tablets, or devices in <b>landscape</b> orientation.<br />
              If you continue using <b>portrait</b> mode, the layout may break.
            </p>
            <div className="flex flex-col gap-3 w-full">
              <button
                className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded-lg transition"
                onClick={() => setShowOrientationAlert(false)}
              >
                Continue Anyway (I Understand)
              </button>
              <button
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 rounded-lg transition"
                onClick={() => window.location.reload()}
              >
                Refresh After Switching to Landscape
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Dots */}
      <div className="fixed right-2 sm:right-4 md:right-8 top-1/2 transform -translate-y-1/2 z-50 hidden md:block">
        <div className="flex flex-col gap-3 md:gap-4">
          {Array(11)
            .fill(0)
            .map((_, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300
        ${activeSection === index ? "bg-purple-600 scale-125" : "bg-gray-300"}
        hover:bg-purple-400 hover:scale-125 hover:-translate-y-1`}
                aria-label={`Go to section ${index + 1}`}
              />
            ))}
        </div>
      </div>

      {/* Social Media Fixed Bar */}
      <div className="fixed left-2 sm:left-4 md:left-8 top-1/2 transform -translate-y-1/2 z-50 hidden md:flex flex-col gap-4 md:gap-6">
        <a
          href="https://instagram.com/cryptvn_"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-pink-500 transition-colors duration-300 hover:scale-110 transform"
          aria-label="Instagram"
        >
          <i className="bi bi-instagram text-2xl"></i>
        </a>
        <a
          href="https://snapchat.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-yellow-400 transition-colors duration-300 hover:scale-110 transform"
          aria-label="Snapchat"
        >
          <i className="bi bi-snapchat text-2xl"></i>
        </a>
        <a
          href="https://wa.me/+6285280117063"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-green-500 transition-colors duration-300 hover:scale-110 transform"
          aria-label="WhatsApp"
        >
          <i className="bi bi-whatsapp text-2xl"></i>
        </a>
        <a
          href="mailto:alifcrypto3420@gmail.com"
          className="text-gray-400 hover:text-red-500 transition-colors duration-300 hover:scale-110 transform"
          aria-label="Email"
        >
          <i className="bi bi-envelope text-2xl"></i>
        </a>
        <a
          href="https://open.spotify.com/user/31yh5zxpxqy6oguix7e234lpiwie?si=a8ce20ef46b94253"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-green-400 transition-colors duration-300 hover:scale-110 transform"
          aria-label="Spotify"
        >
          <i className="bi bi-spotify text-2xl"></i>
        </a>
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-black transition-colors duration-300 hover:scale-110 transform"
          aria-label="GitHub"
        >
          <i className="bi bi-github text-2xl"></i>
        </a>
      </div>

      {/* Social Media Links (Mobile) */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        viewport={{ once: true }}
        className="flex flex-wrap justify-center gap-4 md:gap-6 md:hidden mt-8 sm:mt-12"
      >
        <a
          href="https://instagram.com/cryptvn_"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-pink-500 transition-colors duration-300"
          aria-label="Instagram"
        >
          <i className="bi bi-instagram text-2xl"></i>
        </a>
        <a
          href="https://snapchat.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-yellow-400 transition-colors duration-300"
          aria-label="Snapchat"
        >
          <i className="bi bi-snapchat text-2xl"></i>
        </a>
        <a
          href="https://wa.me/+6285280117063"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-green-500 transition-colors duration-300"
          aria-label="WhatsApp"
        >
          <i className="bi bi-whatsapp text-2xl"></i>
        </a>
        <a
          href="mailto:alifcrypto3420@gmail.com"
          className="text-gray-400 hover:text-red-500 transition-colors duration-300"
          aria-label="Email"
        >
          <i className="bi bi-envelope text-2xl"></i>
        </a>
        <a
          href="https://open.spotify.com/user/31yh5zxpxqy6oguix7e234lpiwie?si=a8ce20ef46b94253"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-green-400 transition-colors duration-300"
          aria-label="Spotify"
        >
          <i className="bi bi-spotify text-2xl"></i>
        </a>
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-black transition-colors duration-300"
          aria-label="GitHub"
        >
          <i className="bi bi-github text-2xl"></i>
        </a>
      </motion.div>

      {/* Section 1: Opening / Salut */}
      <section
        ref={(el) => (sectionRefs.current[0] = el)}
        className="min-h-screen flex flex-col justify-center items-center relative overflow-hidden bg-gradient-to-b from-purple-50 to-white px-4 sm:px-6"
      >
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center z-10 max-w-4xl"
        >
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-serif font-bold text-purple-900 mb-6">
            Salut, Je m&apos;appelle{" "}
            <span className="relative inline-block min-w-[120px] min-h-[48px] align-middle">
              <AnimatePresence mode="wait">
                {nameToggle ? (
                  <motion.span
                    key="name1"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -40 }}
                    transition={{ duration: 0.5, type: "spring" }}
                    className="block w-full text-center"
                  >
                    Alif
                  </motion.span>
                ) : (
                  <motion.span
                    key="name2"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -40 }}
                    transition={{ duration: 0.5, type: "spring" }}
                    className="block w-full text-center"
                  >
                    Crypto
                  </motion.span>
                )}
              </AnimatePresence>
            </span>
            <span className="ml-1">.</span>
          </h1>
          <p className="text-xl sm:text-2xl md:text-3xl font-light text-purple-700 mb-8">
            From the islands of Indonesia... to the heart of France.
            <br />A journey is about to begin.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-10 flex flex-col items-center"
        >
          <p className="text-purple-600 mb-2">↓ Scroll to begin ↓</p>
          <i className="bi bi-chevron-down text-2xl text-purple-600 animate-bounce"></i>
        </motion.div>
      </section>

      {/* Section 2: A Glimpse into My Journey + Map */}
      <section
        ref={(el) => (sectionRefs.current[1] = el)}
        className="min-h-screen flex flex-col justify-center items-center px-4 sm:px-6 py-20 bg-white relative"
      >
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center z-10 max-w-4xl"
        ></motion.div>
        <div className="max-w-4xl z-10 w-full">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-serif font-bold text-purple-900 mb-8">A Glimpse into My Journey</h2>
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
              I was born in Jakarta, spent part of my childhood in Jayapura, and grew up in Medan.  
              <br />
              Now, I study in Malang — a city where I continue to learn and grow.  
              <br />
              Each place has shaped me with unique memories and valuable lessons.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
            className="mb-16 flex flex-col items-center w-full"
          >
            <h3 className="text-2xl font-semibold text-purple-900 mb-6 text-center flex items-center justify-center gap-2">
              <i className="bi bi-globe text-2xl text-purple-600"></i>
              My Life Journey
            </h3>
            <div className="w-full max-w-3xl">
              <MapWrapper />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Section 3: Rotary Surabaya & Morbecque */}
      <section
        ref={(el) => (sectionRefs.current[2] = el)}
        className="min-h-screen flex flex-col justify-center items-center px-4 sm:px-6 py-20 bg-gradient-to-b from-white to-purple-50 relative"
      >
        <div className="w-full max-w-4xl mb-12">
          <div
            className="relative w-full h-28 md:h-32 flex items-center justify-center rounded-xl overflow-hidden shadow-lg bg-gradient-to-r from-purple-100 via-white to-purple-100"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-200/80 via-white/80 to-purple-200/80" />
            <div className="relative z-10 w-full flex flex-col items-center">
              <div className="flex flex-row items-center justify-center w-full">
                <span className="font-serif font-bold text-purple-900 text-3xl md:text-5xl tracking-widest drop-shadow-lg mr-2">
                  SURABAYA
                </span>
                <span className="font-serif font-bold text-purple-900 text-3xl md:text-5xl tracking-widest drop-shadow-lg mx-2">
                  <span className="opacity-70">→</span>
                </span>
                <span className="font-serif font-bold text-purple-900 text-3xl md:text-5xl tracking-widest drop-shadow-lg ml-2">
                  MORBECQUE
                </span>
              </div>
              <div className="flex flex-row items-center justify-center w-full mt-2">
                <span className="font-mono text-purple-700 text-lg md:text-2xl tracking-widest mr-4 drop-shadow">
                  INDONESIA - 3420
                </span>
                <span className="font-mono text-purple-700 text-lg md:text-2xl tracking-widest ml-4 drop-shadow">
                  FRANCE - 1520
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-4xl z-10 w-full">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            <div className="bg-purple-50 rounded-xl overflow-hidden shadow-lg transform transition-transform hover:scale-105 flex flex-col">
              <Image
                src="/placeholder.svg?height=400&width=600"
                alt="Rotary Surabaya"
                width={600}
                height={400}
                className="w-full h-64 object-cover"
              />
              <div className="p-6 flex-1 flex flex-col justify-end">
                <h3 className="text-xl font-semibold text-purple-900 mb-2">
                  Rotary Surabaya Persada – District 3420
                </h3>
                <p className="text-gray-700">
                  The place where my global Rotary journey began.
                </p>
              </div>
            </div>
            <div className="bg-purple-50 rounded-xl overflow-hidden shadow-lg transform transition-transform hover:scale-105 flex flex-col">
              <Image
                src="/placeholder.svg?height=400&width=600"
                alt="Rotary Morbecque"
                width={600}
                height={400}
                className="w-full h-64 object-cover"
              />
              <div className="p-6 flex-1 flex flex-col justify-end">
                <h3 className="text-xl font-semibold text-purple-900 mb-2">
                  Rotary Morbecque – District 1520
                </h3>
                <p className="text-gray-700">
                  My future Rotary host in Morbecque, France.<br />
                  A new beginning of learning, culture, and connection.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Section 4: My Family & My School */}
      <section
        ref={(el) => (sectionRefs.current[3] = el)}
        className="min-h-screen flex flex-col justify-center items-center px-4 sm:px-6 py-20 bg-gradient-to-b from-white to-purple-50 relative"
      >
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center z-10 max-w-4xl"
        ></motion.div>
        <div className="max-w-4xl z-10 w-full">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-serif font-bold text-purple-900 mb-8">My World Back Home</h2>
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
              I was born in Jakarta — the bustling heart of Indonesia.
              <br />
              My family taught me kindness, resilience, and the joy of togetherness.
              <br />
              At Thursina International Islamic Boarding School in Malang,
              <br />I learned leadership, empathy, and a global mindset.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-8"
          >
            <div
              className="bg-white rounded-xl overflow-hidden shadow-lg transform transition-transform hover:scale-105 flex flex-col items-center w-full"
              style={{ maxWidth: 400, margin: "0 auto" }}
            >
              <div style={{ width: "100%", aspectRatio: "4/5", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Image
                  src="https://g8k6z2mz2pgxmlcl.public.blob.vercel-storage.com/family-H9hFQibvYjEYlR599s3p2ha78Z1V1e.jpg"
                  alt="Family life"
                  width={400}
                  height={500}
                  className="object-cover rounded w-full h-full"
                  style={{ maxHeight: 400 }}
                />
              </div>
              <div className="p-6 w-full flex-1 flex flex-col justify-center">
                <h3 className="text-xl font-semibold text-purple-900 mb-2">Family Life</h3>
                <p className="text-gray-700">
                  Moments of joy, learning, and togetherness with my loving family in Surabaya.
                </p>
              </div>
            </div>
            <div
              className="bg-white rounded-xl overflow-hidden shadow-lg transform transition-transform hover:scale-105 flex flex-col items-center w-full"
              style={{ maxWidth: 400, margin: "0 auto" }}
            >
              <div style={{ width: "100%", aspectRatio: "4/5", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Image
                  src="https://g8k6z2mz2pgxmlcl.public.blob.vercel-storage.com/gatravic-uz1JPiCi0Ro3yw65MDRPwgSMMilcfM.jpg"
                  alt="Thursina IIBS"
                  width={400}
                  height={500}
                  className="object-cover rounded w-full h-full"
                  style={{ maxHeight: 400 }}
                />
              </div>
              <div className="p-6 w-full flex-1 flex flex-col justify-center">
                <h3 className="text-xl font-semibold text-purple-900 mb-2">Thursina IIBS</h3>
                <p className="text-gray-700">
                  My boarding school in Malang where I developed leadership and a global mindset.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Section 5: Rotary Surabaya Persada District 3420 */}
      <section
        ref={(el) => (sectionRefs.current[4] = el)}
        className="min-h-screen flex flex-col justify-center items-center px-4 sm:px-6 py-20 bg-purple-50 relative"
      >
        <div className="max-w-4xl z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-serif font-bold text-purple-900 mb-8">
              Rotary Surabaya Persada — District 3420
            </h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12"
          >
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h3 className="text-2xl font-semibold text-purple-900 mb-4">Club Profile</h3>
              <div className="flex items-baseline mb-4">
                <span className="text-lg text-gray-700">• </span>
                <div className="flex items-baseline">
                  <CountUp end={39} duration={3} className="text-lg text-gray-700 font-semibold" />
                  <span className="text-lg text-gray-700 ml-2">Active Members</span>
                </div>
              </div>
              <p className="text-lg text-gray-700 mb-2">• Focus Areas:</p>
              <ul className="list-disc pl-8 mb-6 text-gray-700">
                <li className="mb-2">Basic Education & Literacy</li>
                <li className="mb-2">Youth Empowerment</li>
                <li className="mb-2">Mother & Child Well-being</li>
              </ul>
              <p className="text-gray-700 italic">
                Rotary Surabaya Persadda has guided me to serve and to grow.
                <br />
                Now, it's my turn to represent with pride.
              </p>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h3 className="text-2xl font-semibold text-purple-900 mb-4">Exchange Statistics</h3>
              <div className="mb-6">
                <p className="text-lg font-medium text-purple-800 mb-2">2022–2023</p>
                <div className="flex justify-between text-gray-700">
                  <p>Inbound Students:</p>
                  <CountUp end={1} duration={2} className="font-semibold" />
                </div>
                <div className="flex justify-between text-gray-700">
                  <p>Outbound Students:</p>
                  <CountUp end={1} duration={2} className="font-semibold" />
                </div>
              </div>
              <div>
                <p className="text-lg font-medium text-purple-800 mb-2">2023–2024</p>
                <div className="flex justify-between text-gray-700">
                  <p>Inbound Students:</p>
                  <CountUp end={4} duration={2} className="font-semibold" />
                </div>
                <div className="flex justify-between text-gray-700">
                  <p>Outbound Students:</p>
                  <CountUp end={4} duration={2} className="font-semibold" />
                </div>
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
            className="flex justify-center"
          >
            <Image
              src="https://g8k6z2mz2pgxmlcl.public.blob.vercel-storage.com/rotary-district-3420.jpg"
              alt="Rotary Logo"
              width={200}
              height={200}
              className="rounded-full shadow-lg"
            />
          </motion.div>
        </div>

        {/* Exchange Growth Chart - Lebih Keren dengan Line Chart & Pie Chart */}
        <div className="bg-white rounded-xl p-8 shadow-lg mt-8 max-w-5xl w-full mx-auto">
          <h3 className="text-2xl font-semibold text-purple-900 mb-4">Exchange Growth Chart</h3>
          <div className="flex flex-col md:flex-row gap-8 items-start justify-center">
            {/* Line Chart */}
            <div className="flex-1 min-w-0">
              <div className="bg-white rounded-lg p-4 shadow w-full">
                <Line
                  data={{
                    labels: ["2022-2023", "2023-2024"],
                    datasets: [
                      {
                        label: "Inbound",
                        data: [1, 4],
                        borderColor: "#a78bfa",
                        backgroundColor: "rgba(167,139,250,0.2)",
                        tension: 0.4,
                        pointBackgroundColor: "#7c3aed",
                        pointBorderColor: "#7c3aed",
                        fill: true,
                      },
                      {
                        label: "Outbound",
                        data: [1, 4],
                        borderColor: "#f472b6",
                        backgroundColor: "rgba(244,114,182,0.2)",
                        tension: 0.4,
                        pointBackgroundColor: "#db2777",
                        pointBorderColor: "#db2777",
                        fill: true,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { display: true, position: "top" as const },
                      tooltip: { enabled: true },
                    },
                    scales: {
                      y: { beginAtZero: true, ticks: { stepSize: 1 } },
                    },
                  }}
                  height={260}
                  width={600}
                />
              </div>
            </div>
            {/* Pie Chart */}
            <div className="flex flex-col items-center justify-center w-full md:w-[340px]">
              <div className="bg-white rounded-lg p-4 shadow w-full flex justify-center">
                <div className="relative" style={{ width: 260, height: 260 }}>
                  <Pie
                    data={{
                      labels: ["Inbound Total", "Outbound Total"],
                      datasets: [
                        {
                          data: [1 + 4, 1 + 4],
                          backgroundColor: ["#a78bfa", "#f472b6"],
                          borderColor: ["#7c3aed", "#db2777"],
                          borderWidth: 2,
                        },
                      ],
                    }}
                    options={{
                      responsive: false,
                      plugins: {
                        legend: { display: true, position: "bottom" as const },
                        tooltip: { enabled: true },
                      },
                    }}
                    width={240}
                    height={240}
                  />
                  {/* Label tengah */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-lg font-bold text-purple-700">Total</span>
                    <span className="text-2xl font-extrabold text-purple-900">{1 + 4 + 1 + 4}</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 text-xs text-gray-500 text-center flex gap-4 justify-center">
                <span className="inline-flex items-center">
                  <span className="inline-block w-3 h-3 rounded-full bg-purple-400 mr-2"></span>Inbound
                </span>
                <span className="inline-flex items-center">
                  <span className="inline-block w-3 h-3 rounded-full bg-pink-400 mr-2"></span>Outbound
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 6: Indonesia: Unity in Diversity */}
      <section
        ref={(el) => (sectionRefs.current[5] = el)}
        className="min-h-screen flex flex-col justify-center items-center px-4 sm:px-6 py-20 bg-white relative"
      >
        <div className="max-w-4xl z-10 w-full">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-serif font-bold text-purple-900 mb-8">Indonesia in Motion</h2>
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-12">
              From temples to rainforests, from batik to gamelan,
              <br />
              we move as one beating heart.
            </p>
          </motion.div>
          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            {/* Gambar Indonesia di kiri */}
            <div className="flex-shrink-0 mb-8 md:mb-0 md:mr-8 w-full md:w-1/3 flex justify-center">
              <img
                src="https://g8k6z2mz2pgxmlcl.public.blob.vercel-storage.com/indonesia-t6KMSWI0Rp5idWRcqyjWTWLpJK5l6d.webp"
                alt="Indonesia Map"
                className="w-60 h-auto object-contain"
                style={{ maxWidth: "240px" }}
                draggable={false}
              />
            </div>
            {/* 3 Box di kanan */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full"
            >
              <div className="bg-purple-50 rounded-xl p-8 shadow-lg transform transition-transform hover:scale-105">
                <div className="text-4xl mb-4">🗺️</div>
                <h3 className="text-xl font-semibold text-purple-900 mb-2">Archipelago Nation</h3>
                <p className="text-gray-700">17,000+ islands spanning three time zones</p>
              </div>
              <div className="bg-purple-50 rounded-xl p-8 shadow-lg transform transition-transform hover:scale-105">
                <div className="text-4xl mb-4">🦅</div>
                <h3 className="text-xl font-semibold text-purple-900 mb-2">Garuda Pancasila</h3>
                <p className="text-gray-700">Symbol of strength and freedom</p>
              </div>
              <div className="bg-purple-50 rounded-xl p-8 shadow-lg transform transition-transform hover:scale-105">
                <div className="text-4xl mb-4">🎭</div>
                <h3 className="text-xl font-semibold text-purple-900 mb-2">Unity in Diversity</h3>
                <p className="text-gray-700">"Bhinneka Tunggal Ika" — our national motto</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section 7: My Hobby */}
      <section
        ref={(el) => (sectionRefs.current[6] = el)}
        className="min-h-screen flex flex-col justify-center items-center px-4 sm:px-6 py-20 bg-white relative"
      >
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('/placeholder.svg?height=1080&width=1920')] bg-cover bg-center opacity-5 transform scale-110"></div>
        </div>
        <div className="max-w-6xl z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-serif font-bold text-purple-900 mb-8">My Hobbies</h2>
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-12">
              I enjoy doing many things that keep my mind sharp, my body active, and my heart happy.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <div className="bg-purple-50 rounded-xl p-8 shadow-lg transform transition-transform hover:scale-105">
              <div className="text-4xl mb-4">🏀</div>
              <h3 className="text-xl font-semibold text-purple-900 mb-2">Basketball</h3>
              <p className="text-gray-700">Playing on the court gives me energy and builds teamwork.</p>
            </div>
            <div className="bg-purple-50 rounded-xl p-8 shadow-lg transform transition-transform hover:scale-105">
              <div className="text-4xl mb-4">🏐</div>
              <h3 className="text-xl font-semibold text-purple-900 mb-2">Volleyball</h3>
              <p className="text-gray-700">I enjoy the thrill and coordination of playing volleyball.</p>
            </div>
            <div className="bg-purple-50 rounded-xl p-8 shadow-lg transform transition-transform hover:scale-105">
              <div className="text-4xl mb-4">🏊‍♂️</div>
              <h3 className="text-xl font-semibold text-purple-900 mb-2">Swimming</h3>
              <p className="text-gray-700">I love the calm and focus I get when I swim.</p>
            </div>
            <div className="bg-purple-50 rounded-xl p-8 shadow-lg transform transition-transform hover:scale-105">
              <div className="text-4xl mb-4">💻</div>
              <h3 className="text-xl font-semibold text-purple-900 mb-2">Coding</h3>
              <p className="text-gray-700">Creating something from logic and creativity is so rewarding.</p>
            </div>
            <div className="bg-purple-50 rounded-xl p-8 shadow-lg transform transition-transform hover:scale-105">
              <div className="text-4xl mb-4">🎬</div>
              <h3 className="text-xl font-semibold text-purple-900 mb-2">Watching Movies</h3>
              <p className="text-gray-700">Movies help me explore emotions, stories, and imagination.</p>
            </div>
            <div className="bg-purple-50 rounded-xl p-8 shadow-lg transform transition-transform hover:scale-105">
              <div className="text-4xl mb-4">🎹</div>
              <h3 className="text-xl font-semibold text-purple-900 mb-2">Playing Piano</h3>
              <p className="text-gray-700">Music is my way to relax and express myself.</p>
            </div>
            <div className="bg-purple-50 rounded-xl p-8 shadow-lg transform transition-transform hover:scale-105">
              <div className="text-4xl mb-4">📷</div>
              <h3 className="text-xl font-semibold text-purple-900 mb-2">Photography</h3>
              <p className="text-gray-700">Capturing moments helps me see beauty in everyday life.</p>
            </div>
            <div className="bg-purple-50 rounded-xl p-8 shadow-lg transform transition-transform hover:scale-105">
              <div className="text-4xl mb-4">🪂</div>
              <h3 className="text-xl font-semibold text-purple-900 mb-2">Paragliding</h3>
              <p className="text-gray-700">Flying through the sky gives me a sense of freedom.</p>
            </div>
            <div className="bg-purple-50 rounded-xl p-8 shadow-lg transform transition-transform hover:scale-105">
              <div className="text-4xl mb-4">✨</div>
              <h3 className="text-xl font-semibold text-purple-900 mb-2">...and many more!</h3>
              <p className="text-gray-700">From reading to exploring new skills — I'm always curious.</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Section 8: Iconic Indonesian Landmarks */}
      <section
        ref={(el) => (sectionRefs.current[7] = el)}
        className="min-h-screen flex flex-col justify-center items-center px-4 sm:px-6 py-20 bg-gradient-to-b from-white to-purple-50 relative"
      >
        <div className="max-w-5xl z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-serif font-bold text-purple-900 mb-8">Landmarks of My Homeland</h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <div className="bg-white rounded-xl overflow-hidden shadow-lg transform transition-transform hover:scale-105">
              <Image
                src="/https://g8k6z2mz2pgxmlcl.public.blob.vercel-storage.com/borobudur-temple-oHpgVDf2DRzqG6eO1PUCes8mX1A0qU.jpg"
                alt="Borobudur Temple"
                width={600}
                height={400}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-purple-900 mb-2">🏯 Borobudur Temple</h3>
                <p className="text-gray-700">Timeless serenity</p>
              </div>
            </div>
            <div className="bg-white rounded-xl overflow-hidden shadow-lg transform transition-transform hover:scale-105">
              <Image
                src="https://g8k6z2mz2pgxmlcl.public.blob.vercel-storage.com/monas-fA2v6rfbEtyzv2g7c0xRd9LxkzCNDr.jpg"
                alt="Monas, Jakarta"
                width={600}
                height={400}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-purple-900 mb-2">🏙️ Monas, Jakarta</h3>
                <p className="text-gray-700">The nation's proud flame</p>
              </div>
            </div>
            <div className="bg-white rounded-xl overflow-hidden shadow-lg transform transition-transform hover:scale-105">
              <Image
                src="https://g8k6z2mz2pgxmlcl.public.blob.vercel-storage.com/bromo-y1CNFw89QAXDSGFhkkAuYewvIMuNBq.jpg"
                alt="Mount Bromo"
                width={600}
                height={400}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-purple-900 mb-2">⛰️ Mount Bromo</h3>
                <p className="text-gray-700">Mist and myth at dawn</p>
              </div>
            </div>
            <div className="bg-white rounded-xl overflow-hidden shadow-lg transform transition-transform hover:scale-105">
              <Image
                src="https://g8k6z2mz2pgxmlcl.public.blob.vercel-storage.com/komodo-island-qnpPgNpUbYSUv7xWPRYcQrMRWSYXbB.jpg"
                alt="Komodo Island"
                width={600}
                height={400}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-purple-900 mb-2">🏝️ Komodo Island</h3>
                <p className="text-gray-700">Home of ancient dragons</p>
              </div>
            </div>
            <div className="bg-white rounded-xl overflow-hidden shadow-lg transform transition-transform hover:scale-105">
              <Image
                src="https://g8k6z2mz2pgxmlcl.public.blob.vercel-storage.com/gate-heaven-NZSliMJ4wrmkqR7SKJaaChs4By7mgZ.webp"
                alt="Bali's Gates of Heaven"
                width={600}
                height={400}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-purple-900 mb-2">⛩️ Bali's Gates of Heaven</h3>
                <p className="text-gray-700">Where sky and sea meet</p>
              </div>
            </div>
            <div className="bg-white rounded-xl overflow-hidden shadow-lg transform transition-transform hover:scale-105">
              <Image
                src="https://g8k6z2mz2pgxmlcl.public.blob.vercel-storage.com/prambanan-temple.jpg"
                alt="Prambanan Temple"
                width={600}
                height={400}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-purple-900 mb-2">🛕 Prambanan Temple</h3>
                <p className="text-gray-700">Majestic Hindu architecture</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Section 9: A Taste of Indonesia */}
      <section
        ref={(el) => (sectionRefs.current[8] = el)}
        className="min-h-screen flex flex-col justify-center items-center px-4 sm:px-6 py-20 bg-purple-50 relative"
      >
        <div className="max-w-4xl z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-serif font-bold text-purple-900 mb-8">Traditional Flavors</h2>
            <p className="text-lg md:text-xl text-gray-700 mb-8">
              Food is our universal language — I can't wait to share these tastes with you!
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="flex overflow-x-auto pb-8 space-x-6 snap-x snap-mandatory scrollbar-hide">
              <div className="snap-center shrink-0">
                <div className="w-80 bg-white rounded-xl overflow-hidden shadow-lg">
                  <Image
                    src="https://g8k6z2mz2pgxmlcl.public.blob.vercel-storage.com/nasi-goreng-KSn8TYhs66CKZe4YgG0XwJSfjs6DR5.jpg"
                    alt="Nasi Goreng"
                    width={600}
                    height={400}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-purple-900 mb-2">🍛 Nasi Goreng</h3>
                    <p className="text-gray-700">Indonesia's beloved fried rice</p>
                  </div>
                </div>
              </div>
              <div className="snap-center shrink-0">
                <div className="w-80 bg-white rounded-xl overflow-hidden shadow-lg">
                  <Image
                    src="https://g8k6z2mz2pgxmlcl.public.blob.vercel-storage.com/sate-padang.jpg"
                    alt="Sate Padang"
                    width={600}
                    height={400}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-purple-900 mb-2">🍢 Sate Padang</h3>
                    <p className="text-gray-700">West Sumatran satay with spicy thick sauce</p>
                  </div>
                </div>
              </div>
              <div className="snap-center shrink-0">
                <div className="w-80 bg-white rounded-xl overflow-hidden shadow-lg">
                  <Image
                    src="https://g8k6z2mz2pgxmlcl.public.blob.vercel-storage.com/rendang.jpg"
                    alt="Rendang"
                    width={600}
                    height={400}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-purple-900 mb-2">🥥 Rendang</h3>
                    <p className="text-gray-700">Slow-cooked beef in rich coconut spices</p>
                  </div>
                </div>
              </div>
              <div className="snap-center shrink-0">
                <div className="w-80 bg-white rounded-xl overflow-hidden shadow-lg">
                  <Image
                    src="https://g8k6z2mz2pgxmlcl.public.blob.vercel-storage.com/es-cendol-SDwY7LGllimqxCvo6falVChRpka7c5.webp"
                    alt="Es Cendol"
                    width={600}
                    height={400}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-purple-900 mb-2">🍹 Es Cendol</h3>
                    <p className="text-gray-700">Sweet iced dessert with pandan jelly</p>
                  </div>
                </div>
              </div>
              <div className="snap-center shrink-0">
                <div className="w-80 bg-white rounded-xl overflow-hidden shadow-lg">
                  <Image
                    src="https://g8k6z2mz2pgxmlcl.public.blob.vercel-storage.com/soto.jpg"
                    alt="Soto"
                    width={600}
                    height={400}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-purple-900 mb-2">🍲 Soto</h3>
                    <p className="text-gray-700">Aromatic Indonesian soup with turmeric</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-gradient-to-r from-purple-50 to-transparent w-12 h-full"></div>
            <div className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-gradient-to-l from-purple-50 to-transparent w-12 h-full"></div>
          </motion.div>
        </div>
      </section>

      {/* Section 9: My Scrapbook */}
      <section
        ref={(el) => (sectionRefs.current[9] = el)}
        className="min-h-screen flex flex-col justify-center items-center px-4 sm:px-6 py-20 bg-white relative"
      >
        <div className="max-w-5xl z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-7xl md:text-8xl font-serif font-bold text-purple-900 mb-8">My Scrapbook</h2>
            <p className="text-xl md:text-2xl text-gray-700 leading-relaxed mb-12">
              Memories from home — taped Polaroids of family, school life, and small joys.
              <br />A playful scrapbook of moments that shaped me...
              <br />
              Get to know the person behind the journey.
            </p>
          </motion.div>

          {/* Family & Friends Photos */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-semibold text-purple-900 mb-6 text-center">Personal Memories</h3>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-16">
              {/* School Memory */}
              <div className="relative bg-white p-3 shadow-lg transform rotate-[1deg] hover:rotate-0 transition-all duration-300">
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-4 bg-gray-300 opacity-80"></div>
                <Image
                  src="https://g8k6z2mz2pgxmlcl.public.blob.vercel-storage.com/i2aspo-1-bjTTnrxLXyrePuI2ySnvBXmYQyvPjo.jpg"
                  alt="School memory"
                  width={400}
                  height={400}
                  className="w-full h-auto"
                />
                <p className="mt-2 text-center text-sm text-gray-600 font-handwriting">School memory</p>
              </div>
              {/* Family Polaroid (besar, 3 foto vertikal) */}
              <div className="relative bg-white p-5 shadow-lg transform rotate-[-3deg] hover:rotate-0 transition-all duration-300 flex flex-col items-center"
                style={{ minWidth: 0, width: "100%", maxWidth: 340 }}
              >
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-5 bg-gray-300 opacity-80"></div>
                <div className="flex flex-col gap-3">
                  <Image
                    src="https://g8k6z2mz2pgxmlcl.public.blob.vercel-storage.com/fam1-oW0ASyvvxJtpHhBvLxowopjIgClv5n.jpg"
                    alt="Family moment 1"
                    width={180}
                    height={180}
                    className="rounded w-40 h-40 object-cover"
                  />
                  <Image
                    src="https://g8k6z2mz2pgxmlcl.public.blob.vercel-storage.com/fam2-uhTGEYOiLuJ7DM0hRPayAxOQs48XeM.jpg"
                    alt="Family moment 2"
                    width={180}
                    height={180}
                    className="rounded w-40 h-40 object-cover"
                  />
                  <Image
                    src="https://g8k6z2mz2pgxmlcl.public.blob.vercel-storage.com/fam3-0lx6rUC9wy2CoJdfJ6h4jWPqCbh7qH.jpg"
                    alt="Family moment 3"
                    width={180}
                    height={180}
                    className="rounded w-40 h-40 object-cover"
                  />
                </div>
                <p className="mt-3 text-center text-base text-gray-600 font-handwriting">With family</p>
              </div>
              {/* Friend Memory */}
              <div className="relative bg-white p-3 shadow-lg transform rotate-[2deg] hover:rotate-0 transition-all duration-300">
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-4 bg-gray-300 opacity-80"></div>
                <Image
                  src="https://g8k6z2mz2pgxmlcl.public.blob.vercel-storage.com/wyf-2.jpg"
                  alt="My friend"
                  width={400}
                  height={400}
                  className="w-full h-auto"
                />
                <p className="mt-2 text-center text-sm text-gray-600 font-handwriting">My friend</p>
              </div>
              {/* Spacer (empty) */}
              <div className="hidden sm:block" />
            </div>
          </motion.div>

          {/* Indonesia in my lens */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-semibold text-purple-900 mb-6 text-center">Indonesia in my lens</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {[
                {
                  src: "https://g8k6z2mz2pgxmlcl.public.blob.vercel-storage.com/bali-sunset-dHque2bsG8TI4tJgjRAqp0dwgAEzk9.jpg",
                  caption: "Sunset at Bali",
                },
                {
                  src: "https://g8k6z2mz2pgxmlcl.public.blob.vercel-storage.com/jakarta-bOtZZnAMEGmyeV0HxUJ6EVyNE0t2vw.jpg",
                  caption: "Jakarta cityscape",
                },
                {
                  src: "https://g8k6z2mz2pgxmlcl.public.blob.vercel-storage.com/village.jpg",
                  caption: "Village life",
                },
                {
                  src: "https://g8k6z2mz2pgxmlcl.public.blob.vercel-storage.com/dance-XJcfgQju6Lq7wVYAoZa1SGF8svH8uX.jpg",
                  caption: "Traditional dance",
                },
                {
                  src: "https://g8k6z2mz2pgxmlcl.public.blob.vercel-storage.com/local%20market-ba9P06f25yFEXpOJYstoIl4qmViKaa.JPG",
                  caption: "Local market",
                },
                {
                  src: "https://g8k6z2mz2pgxmlcl.public.blob.vercel-storage.com/raja%20amapt.jpg",
                  caption: "Island hopping",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="relative bg-white p-3 shadow-lg transform hover:scale-105 transition-all duration-300"
                  style={{ transform: `rotate(${Math.random() * 6 - 3}deg)` }}
                >
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-4 bg-gray-300 opacity-80"></div>
                  <Image
                    src={item.src}
                    alt={item.caption}
                    width={400}
                    height={400}
                    className="w-full h-auto"
                  />
                  <p className="mt-2 text-center text-sm text-gray-600 font-handwriting">
                    {item.caption}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Section 10: Closing: Thank You */}
      <section
        ref={(el) => (sectionRefs.current[10] = el)}
        className="min-h-screen flex flex-col justify-center items-center px-4 sm:px-6 py-20 bg-gradient-to-b from-white to-purple-50 relative"
      >
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('/placeholder.svg?height=1080&width=1920')] bg-cover bg-center opacity-10 transform scale-110"></div>
        </div>
        <div className="max-w-4xl z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl sm:text-7xl md:text-8xl font-serif font-bold text-purple-900 mb-8">Thank You</h2>
            <p className="text-xl md:text-2xl text-gray-700 leading-relaxed mb-12">
              To bla bla bla bla bla bla bla:
              <br />
              Thank you bla bla bla bla bla.
              <br />I cbla bla bla bla bla bla.
            </p>
            <p className="text-lg md:text-xl text-purple-700 italic">
              — Alif Sinaga
              <br />
              Rotary Youth Exchange Student 2025
            </p>
          </motion.div>
        </div>
      </section>
    </main>
  )
}
