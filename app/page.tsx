'use client';

import { useState, useCallback, useEffect, useRef } from 'react'; // Hooks React
import Image from 'next/image'; // Optimasi gambar Next.js
import { motion, useAnimation, AnimatePresence } from 'framer-motion'; // Animasi
import { MapWrapper } from '@/components/map-wrapper'; // Komponen peta custom (buatanmu)
import { CountUp } from '@/components/count-up'; // Komponen penghitung animasi (buatanmu)
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js'; // Chart.js dan elemennya
import { Line, Pie } from 'react-chartjs-2'; // Wrapper React untuk Chart.js

// Register Chart.js agar semua jenis chart bisa dipakai (WAJIB!)
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement, // Penting untuk Pie chart!
  Tooltip,
  Legend
);

export default function Home() {
  const [activeSection, setActiveSection] = useState(0);
  const [nameToggle, setNameToggle] = useState(false);
  const [parallaxBromo, setParallaxBromo] = useState(1);
  const [parallaxOther, setParallaxOther] = useState(1);
  const [showOrientationAlert, setShowOrientationAlert] = useState(false);
  const [showRotaryFocusImg, setShowRotaryFocusImg] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [modalImageSrc, setModalImageSrc] = useState('');
  const [modalImageAlt, setModalImageAlt] = useState('');
  const nameControls = useAnimation();
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
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

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "ArrowDown" && activeSection < sectionRefs.current.length - 1) {
      sectionRefs.current[activeSection + 1]?.scrollIntoView({ behavior: "auto" }) // langsung lompat
      setActiveSection((prev) => prev + 1)
    } else if (e.key === "ArrowUp" && activeSection > 0) {
      sectionRefs.current[activeSection - 1]?.scrollIntoView({ behavior: "auto" }) // langsung lompat
      setActiveSection((prev) => prev - 1)
    }
  }, [activeSection])

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [activeSection, handleKeyDown])

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

  const youthOrgs = [
    {
      title: "Rotaract Club of Surabaya Persada",
      date: "Chartered on July 10, 2019",
      year: 2019,
    },
    {
      title: "Interact Club of Surabaya Persada",
      date: "Chartered on September 7, 2019",
      year: 2019,
    },
    {
      title: "Rotaract Club of Universitas Katolik Dharma Cendika",
      date: "Chartered on June 22, 2022",
      year: 2022,
    },
  ]
  const timelineYears = [2019, 2020, 2021, 2022, 2023, 2024]
  const [timelineStep, setTimelineStep] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setTimelineStep((prev) => (prev >= youthOrgs.length ? 0 : prev + 1))
    }, 1200)
    return () => clearInterval(interval)
  }, [youthOrgs.length])

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

      {/* Logo Parallax di Pojok Kanan Atas */}
<div
  className="absolute top-6 right-6 sm:top-10 sm:right-10 z-10 transform-gpu motion-safe:animate-float-slow opacity-70"
>
  <div className="flex gap-4 items-center">
    <img
      src="https://g8k6z2mz2pgxmlcl.public.blob.vercel-storage.com/united%20%20for%20good-mtjSIycaRfkPQIldLHDZOcLdfb1TjV.png"
      alt="Unite for Good"
      className="w-20 sm:w-28 lg:w-32 pointer-events-none select-none"
    />
    <img
      src="https://g8k6z2mz2pgxmlcl.public.blob.vercel-storage.com/rotrary%20d3420-CDkhjW0nRxChx7VHNrw42ZBULp8TTE.jpg"
      alt="Rotary Logo"
      className="w-20 sm:w-28 lg:w-32 pointer-events-none select-none"
    />
    <img
      src="https://g8k6z2mz2pgxmlcl.public.blob.vercel-storage.com/interact_SuPer-IvHa9HeGwnsXCvRyTtGrMYt7UDwCy3.png"
      alt="Rotary Logo"
      className="w-20 sm:w-28 lg:w-32 pointer-events-none select-none"
    />
  </div>
</div>


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
                src="https://g8k6z2mz2pgxmlcl.public.blob.vercel-storage.com/surabaya%20night-w3wSDJ5uoj8kfpFSoPKxYNBOWALh2k.jpg"
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
                src="https://g8k6z2mz2pgxmlcl.public.blob.vercel-storage.com/morbecque%20night-E1pGcqPYEws6TODrHaiZWR6dTbIQEQ.avif"
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
                  Moments of joy, learning, and togetherness with my loving family in Indonesia.
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
      {/* Club Profile */}
      <div className="bg-white rounded-xl p-8 shadow-lg">
        <h3 className="text-2xl font-semibold text-purple-900 mb-4">Club Profile</h3>
        <p className="text-lg text-gray-700 mb-2">• Established: May 15, 2019</p>
        <div className="flex items-baseline mb-4">
          <span className="text-lg text-gray-700">• </span>
          <div className="flex items-baseline">
            <CountUp end={45} duration={3} className="text-lg text-gray-700 font-semibold" />
            <span className="text-lg text-gray-700 ml-2">Active Members</span>
          </div>
        </div>

        {/* Rotary Focus Design (No Image) */}
        <div className="my-8 flex flex-col items-center">
          <span className="mb-4 text-sm text-purple-700 font-semibold">Rotary Areas of Focus</span>
          <div className="relative w-[340px] h-[340px] flex items-center justify-center mb-4">
            {/* Center */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-purple-600 text-white font-bold rounded-full flex items-center justify-center shadow-lg" style={{ width: 110, height: 110 }}>
              <span className="text-center text-lg">Rotary<br />Focus</span>
            </div>
            {/* 7 Focus Areas */}
            {[
              { icon: "🕊️", label: "Peace & Conflict" },
              { icon: "🩺", label: "Disease Prevention" },
              { icon: "💧", label: "Water & Sanitation" },
              { icon: "👩‍👧", label: "Maternal & Child Health" },
              { icon: "📚", label: "Education & Literacy" },
              { icon: "🌱", label: "Community Dev." },
              { icon: "🌳", label: "Environment" },
            ].map((item, i, arr) => {
              const angle = (i / arr.length) * 2 * Math.PI - Math.PI / 2
              const radius = 135
              const x = Math.cos(angle) * radius + 170
              const y = Math.sin(angle) * radius + 170
              return (
                <div
                  key={item.label}
                  className="absolute flex flex-col items-center"
                  style={{
                    left: x - 40,
                    top: y - 40,
                    width: 80,
                    height: 80,
                  }}
                >
                  <div className="bg-white border-2 border-purple-300 rounded-full w-14 h-14 flex items-center justify-center text-2xl shadow">
                    {item.icon}
                  </div>
                  <span className="text-xs text-purple-800 text-center mt-1 font-semibold leading-tight">{item.label}</span>
                </div>
              )
            })}
          </div>
          {/* Button to preview original picture */}
          <button
            className="px-4 py-2 bg-purple-600 text-white rounded-lg shadow hover:bg-purple-700 transition mb-2"
            onClick={() => setShowRotaryFocusImg(true)}
            type="button"
          >
            View Original Picture
          </button>
          {/* Modal Preview */}
          {showRotaryFocusImg && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
              <div className="bg-white rounded-xl shadow-2xl p-4 max-w-lg w-full flex flex-col items-center relative">
                <button
                  className="absolute top-2 right-2 text-gray-500 hover:text-purple-700 text-2xl"
                  onClick={() => setShowRotaryFocusImg(false)}
                  aria-label="Close"
                  type="button"
                >
                  &times;
                </button>
                <Image
                  src="https://g8k6z2mz2pgxmlcl.public.blob.vercel-storage.com/rotary%20focus%20area-T6PGMUCGC4gE1FtpuSF87gnpWdiGQB.jpg"
                  alt="Rotary Areas of Focus"
                  width={600}
                  height={400}
                  className="rounded-lg shadow-lg"
                  style={{ maxWidth: 500, height: "auto" }}
                />
              </div>
            </div>
          )}
        </div>

        <p className="text-gray-700 italic">
          Rotary Surabaya Persada has guided me to serve and to grow.
          <br />
          Now, it's my turn to represent with pride.
        </p>
      </div>

      {/* Exchange Statistics */}
<div className="p-4 rounded-xl bg-white shadow">
  <h2 className="text-xl font-semibold text-purple-800 mb-2">Exchange Statistics</h2>

  <div className="text-gray-800 mb-4">
    <p><strong>2022–2023</strong></p>
    <p>Inbound Students: 1</p>
    <p>Outbound Students: 1</p>

    <p className="mt-3"><strong>2023–2024</strong></p>
    <p>Inbound Students: 4</p>
    <p>Outbound Students: 4</p>
  </div>

  {/* Garis pembatas */}
  <hr className="border-t border-gray-300 my-4" />

  {/* Judul Fokus Area */}
<h4 className="text-lg font-semibold text-purple-800 mb-2">
  🎯 Focus Areas of Rotary Surabaya Persada
</h4>

<ul className="ml-4 text-gray-800 space-y-2">

  {/* Literacy */}
  <li className="flex gap-2 items-start">
    📚 <span className="flex flex-col gap-2">
      <strong>Basic Education & Literacy</strong>
      <img
        src="https://g8k6z2mz2pgxmlcl.public.blob.vercel-storage.com/literacy%20rotary-ddV9mzlPRg23d4Gx2W6bv4ElyLnXmH.jpg"
        alt="Literacy Rotary"
        className="w-32 h-32 object-cover rounded-lg shadow-md cursor-pointer hover:scale-105 transition"
        onClick={() => {
          setModalImageSrc("https://g8k6z2mz2pgxmlcl.public.blob.vercel-storage.com/literacy%20rotary-ddV9mzlPRg23d4Gx2W6bv4ElyLnXmH.jpg")
          setModalImageAlt("Basic Education & Literacy")
          setShowImageModal(true)
        }}
      />
    </span>
  </li>

  {/* Youth Empowerment */}
  <li className="flex gap-2 items-start">
    👧 <span>
      <strong>Youth Empowerment</strong><br />
      <span className="ml-5 block">
        Rotary Surabaya Persada actively supports youth through:
        <ul className="list-disc list-inside text-sm mt-1 ml-2 space-y-4">

          {/* LTEP */}
          <li className="flex items-center gap-4">
            <span className="min-w-[220px]">📌 <strong>LTEP</strong> (Long-Term Exchange Program)</span>
            <img
              src="https://g8k6z2mz2pgxmlcl.public.blob.vercel-storage.com/RYE-text-color-EN22_20220718-002-xvjGSRStnwD1t1CT6CQfygOHPUPJIO.png"
              alt="LTEP Rotary Youth Exchange"
              className="w-24 h-24 object-contain rounded-lg shadow-md cursor-pointer hover:scale-105 transition"
              onClick={() => {
                setModalImageSrc("https://g8k6z2mz2pgxmlcl.public.blob.vercel-storage.com/RYE-text-color-EN22_20220718-002-xvjGSRStnwD1t1CT6CQfygOHPUPJIO.png");
                setModalImageAlt("LTEP Rotary Youth Exchange");
                setShowImageModal(true);
              }}
            />
          </li>

          {/* STEP */}
          <li className="flex items-center gap-4">
            <span className="min-w-[220px]">📌 <strong>STEP</strong> – Face-to-Face & Camp programs</span>
            <img
              src="https://g8k6z2mz2pgxmlcl.public.blob.vercel-storage.com/RYE-text-color-EN22_20220718-002-xvjGSRStnwD1t1CT6CQfygOHPUPJIO.png"
              alt="STEP Rotary Youth Exchange"
              className="w-24 h-24 object-contain rounded-lg shadow-md cursor-pointer hover:scale-105 transition"
              onClick={() => {
                setModalImageSrc("https://g8k6z2mz2pgxmlcl.public.blob.vercel-storage.com/RYE-text-color-EN22_20220718-002-xvjGSRStnwD1t1CT6CQfygOHPUPJIO.png");
                setModalImageAlt("STEP Rotary Youth Exchange");
                setShowImageModal(true);
              }}
            />
          </li>

          {/* Clubs */}
          {[
            {
              label: "Rotaract Club Surabaya Persada",
              src: "https://g8k6z2mz2pgxmlcl.public.blob.vercel-storage.com/Logo_Creator__print%20%283%29-TFDVvy9yDeqEtTyxNoHRk6zlS8u2h2.jpeg",
              alt: "Rotaract Surabaya Persada",
            },
            {
              label: "Rotaract Club UKDC",
              src: "https://g8k6z2mz2pgxmlcl.public.blob.vercel-storage.com/rac%20ukdc-QSsKfqTzyGFCrMsYsT0gJ9se27YoN4.png",
              alt: "Rotaract UKDC",
            },
            {
              label: "Interact Club Surabaya Persada",
              src: "https://g8k6z2mz2pgxmlcl.public.blob.vercel-storage.com/interact_SuPer-IvHa9HeGwnsXCvRyTtGrMYt7UDwCy3.png",
              alt: "Interact Surabaya Persada",
            },
          ].map((item, index) => (
            <li key={index} className="flex items-center gap-4">
              <span className="min-w-[220px]">📌 <strong>{item.label}</strong></span>
              <img
                src={item.src}
                alt={item.alt}
                className="w-24 h-24 object-contain rounded-lg shadow-md cursor-pointer hover:scale-105 transition"
                onClick={() => {
                  setModalImageSrc(item.src);
                  setModalImageAlt(item.alt);
                  setShowImageModal(true);
                }}
              />
            </li>
          ))}
        </ul>
      </span>
    </span>
  </li>

  {/* Maternal & Child Health */}
  <li className="flex gap-2 items-start">
                👧 <span>
                  <strong>Youth Empowerment</strong><br />
                  <span className="ml-5 block">
                    Rotary Surabaya Persada actively supports youth through:
                    <ul className="list-disc list-inside text-sm mt-1 ml-2 space-y-4">
                      {[
                        {
                          label: "📌 LTEP (Long-Term Exchange Program)",
                          src: "https://g8k6z2mz2pgxmlcl.public.blob.vercel-storage.com/RYE-text-color-EN22_20220718-002-xvjGSRStnwD1t1CT6CQfygOHPUPJIO.png",
                          alt: "LTEP Rotary Youth Exchange"
                        },
                        {
                          label: "📌 STEP – Face-to-Face & Camp programs",
                          src: "https://g8k6z2mz2pgxmlcl.public.blob.vercel-storage.com/RYE-text-color-EN22_20220718-002-xvjGSRStnwD1t1CT6CQfygOHPUPJIO.png",
                          alt: "STEP Rotary Youth Exchange"
                        },
                        {
                          label: "📌 Rotaract Club Surabaya Persada",
                          src: "https://g8k6z2mz2pgxmlcl.public.blob.vercel-storage.com/Logo_Creator__print%20%283%29-TFDVvy9yDeqEtTyxNoHRk6zlS8u2h2.jpeg",
                          alt: "Rotaract Surabaya Persada"
                        },
                        {
                          label: "📌 Rotaract Club UKDC",
                          src: "https://g8k6z2mz2pgxmlcl.public.blob.vercel-storage.com/rac%20ukdc-QSsKfqTzyGFCrMsYsT0gJ9se27YoN4.png",
                          alt: "Rotaract UKDC"
                        },
                        {
                          label: "📌 Interact Club Surabaya Persada",
                          src: "https://g8k6z2mz2pgxmlcl.public.blob.vercel-storage.com/interact_SuPer-IvHa9HeGwnsXCvRyTtGrMYt7UDwCy3.png",
                          alt: "Interact Surabaya Persada"
                        }
                      ].map((item, index) => (
                        <li key={index} className="flex items-center gap-4">
                          <span className="min-w-[220px]">{item.label}</span>
                          <img
                            src={item.src}
                            alt={item.alt}
                            className="w-24 h-24 object-contain rounded-lg shadow-md cursor-pointer hover:scale-105 transition"
                            onClick={() => {
                              setModalImageSrc(item.src);
                              setModalImageAlt(item.alt);
                              setShowImageModal(true);
                            }}
                          />
                        </li>
                      ))}
                    </ul>
                  </span>
                </span>
              </li>

              <li className="flex gap-2 items-start">
                👶 <span><strong>Maternal & Child Health</strong></span>
              </li>
            </ul>

            <hr className="border-t border-gray-300 my-4" />

            <h4 className="text-lg font-semibold text-purple-800 mb-1">Family Rotary Involvement</h4>
            <p className="text-gray-800">
              My mother has been an active Rotarian with <strong>Rotary Club of Surabaya Persada</strong> since <strong>2024 – Present</strong>.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Global Modal Image Viewer */}
      {showImageModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex justify-center items-center">
          <div className="relative bg-white rounded-xl p-4 max-w-lg w-full">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-purple-700 text-2xl"
              onClick={() => setShowImageModal(false)}
              aria-label="Close"
            >
              &times;
            </button>
            <img src={modalImageSrc} alt={modalImageAlt} className="rounded-lg w-full h-auto shadow" />
          </div>
        </div>
      )}
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
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, amount: 0.3 }}
  className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full"
  variants={{
    visible: {
      transition: {
        staggerChildren: 0.3,
      },
    },
  }}
>
  {[
    {
      icon: "🛵",
      title: "Motorbikes Outnumber Cars!",
      text: "Over 120 million motorcycles shape Indonesia’s unique urban flow, unlike anywhere in Europe.",
    },
    {
      icon: "⛴️",
      title: "Island-Hopping Daily Routine",
      text: "With 17,000+ islands, boats and ferries are essential for daily commutes.",
    },
    {
      icon: "🌆",
      title: "24/7 Urban Energy",
      text: "Cities buzz nonstop — markets, street food, and nightlife keep the streets alive around the clock.",
    },
  ].map(({ icon, title, text }, i) => (
    <motion.div
      key={i}
      className="bg-purple-50 rounded-xl p-8 shadow-lg cursor-pointer"
      variants={{
        hidden: { opacity: 0, y: 40, scale: 0.95 },
        visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: "easeOut" } },
      }}
      whileHover={{ scale: 1.07, boxShadow: "0 10px 20px rgba(128, 90, 213, 0.4)" }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <div className="text-5xl mb-6">{icon}</div>
      <h3 className="text-2xl font-semibold text-purple-900 mb-3">{title}</h3>
      <p className="text-gray-700 text-lg">{text}</p>
    </motion.div>
  ))}
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
      {/* Basketball */}
      <div className="bg-purple-50 rounded-xl p-8 shadow-lg transform transition-transform hover:scale-105">
        <div className="text-4xl mb-4">🏀</div>
        <h3 className="text-xl font-semibold text-purple-900 mb-2">Basketball</h3>
        <p className="text-gray-700">I'm part of my high school’s core team. Basketball keeps me energized and sharp.</p>
      </div>

      {/* Volleyball */}
      <div className="bg-purple-50 rounded-xl p-8 shadow-lg transform transition-transform hover:scale-105">
        <div className="text-4xl mb-4">🏐</div>
        <h3 className="text-xl font-semibold text-purple-900 mb-2">Volleyball</h3>
        <p className="text-gray-700">I play as a middle blocker and spiker. It's a role that requires strategy, strength, and quick reflexes.</p>
      </div>

      {/* Swimming */}
      <div className="bg-purple-50 rounded-xl p-8 shadow-lg transform transition-transform hover:scale-105">
        <div className="text-4xl mb-4">🏊‍♂️</div>
        <h3 className="text-xl font-semibold text-purple-900 mb-2">Swimming</h3>
        <p className="text-gray-700">My favorite strokes are breaststroke and freestyle. Swimming keeps me grounded and refreshed.</p>
      </div>

      {/* Coding */}
      <div className="bg-purple-50 rounded-xl p-8 shadow-lg transform transition-transform hover:scale-105">
        <div className="text-4xl mb-4">💻</div>
        <h3 className="text-xl font-semibold text-purple-900 mb-2">Coding</h3>
        <p className="text-gray-700">For me, coding is a space where logic meets creativity — it's how I build, explore, and express ideas through technology.</p>
      </div>

      {/* Watching Movies */}
      <div className="bg-purple-50 rounded-xl p-8 shadow-lg transform transition-transform hover:scale-105">
        <div className="text-4xl mb-4">🎬</div>
        <h3 className="text-xl font-semibold text-purple-900 mb-2">Watching Movies</h3>
        <p className="text-gray-700">I love action, adventure, thriler, sci-fi, mystery, romance, and rom-coms — basically everything except horror and boring films!</p>
      </div>

      {/* Playing Piano */}
      <div className="bg-purple-50 rounded-xl p-8 shadow-lg transform transition-transform hover:scale-105">
        <div className="text-4xl mb-4">🎹</div>
        <h3 className="text-xl font-semibold text-purple-900 mb-2">Playing Piano</h3>
        <p className="text-gray-700">I practice on an upright piano. Music helps me focus, relax, and express emotions beyond words.</p>
      </div>

      {/* Photography */}
      <div className="bg-purple-50 rounded-xl p-8 shadow-lg transform transition-transform hover:scale-105">
        <div className="text-4xl mb-4">📷</div>
        <h3 className="text-xl font-semibold text-purple-900 mb-2">Photography</h3>
        <p className="text-gray-700">
          I enjoy experimenting with bulb mode to create stunning light trail shots, and I love using the panning technique to capture motion creatively.
          Macro photography is also one of my favorites — revealing the beauty in the smallest details.
        </p>
      </div>

      {/* Paragliding */}
      <div className="bg-purple-50 rounded-xl p-8 shadow-lg transform transition-transform hover:scale-105">
        <div className="text-4xl mb-4">🪂</div>
        <h3 className="text-xl font-semibold text-purple-900 mb-2">Paragliding</h3>
        <p className="text-gray-700">
          Soaring through the air with a paraglider gives me an unmatched feeling of freedom. It's not just a hobby — it's a moment where I feel completely alive and connected to the sky.
        </p>
      </div>

      {/* And Many More */}
      <div className="bg-purple-50 rounded-xl p-8 shadow-lg transform transition-transform hover:scale-105">
        <div className="text-4xl mb-4">✨</div>
        <h3 className="text-xl font-semibold text-purple-900 mb-2">...and many more!</h3>
        <p className="text-gray-700">From reading to exploring new skills — I'm always curious and eager to learn something new.</p>
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
                src="https://g8k6z2mz2pgxmlcl.public.blob.vercel-storage.com/borobudur-temple-oHpgVDf2DRzqG6eO1PUCes8mX1A0qU.jpg"
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
                <div className="flex flex-col gap-2">
                  <Image
                    src="https://g8k6z2mz2pgxmlcl.public.blob.vercel-storage.com/i2aspo-1-bjTTnrxLXyrePuI2ySnvBXmYQyvPjo.jpg"
                    alt="Competitions X Memory"
                    width={400}
                    height={400}
                    className="w-full aspect-square object-cover rounded"
                  />
                  <Image
                    src="https://g8k6z2mz2pgxmlcl.public.blob.vercel-storage.com/wyf-4-HRneAvVagJq94UOdTzZQFBA6wLmTEq.jpg"
                    alt="School memory"
                    width={400}
                    height={400}
                    className="w-full aspect-square object-cover rounded"
                  />
                  <Image
                    src="https://g8k6z2mz2pgxmlcl.public.blob.vercel-storage.com/wyf-3-zG3DMmpGS7DiZT9m7gvwr717yB48Fh.jpg"
                    alt="School memory"
                    width={400}
                    height={400}
                    className="w-full aspect-square object-cover rounded"
                  />
                </div>
                <p className="mt-2 text-center text-sm text-gray-600 font-handwriting">School memory</p>
              </div>
              {/* Family Polaroid */}
              <div className="relative bg-white p-5 shadow-lg transform rotate-[-3deg] hover:rotate-0 transition-all duration-300 flex flex-col items-center"
                style={{ minWidth: 0, width: "100%", maxWidth: 340 }}
              >
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-5 bg-gray-300 opacity-80"></div>
                <div className="flex flex-col gap-2 w-full">
                  <Image
                    src="https://g8k6z2mz2pgxmlcl.public.blob.vercel-storage.com/fam1-oW0ASyvvxJtpHhBvLxowopjIgClv5n.jpg"
                    alt="Family moment 1"
                    width={400}
                    height={400}
                    className="w-full aspect-square object-cover rounded"
                  />
                  <Image
                    src="https://g8k6z2mz2pgxmlcl.public.blob.vercel-storage.com/fam2-uhTGEYOiLuJ7DM0hRPayAxOQs48XeM.jpg"
                    alt="Family moment 2"
                    width={400}
                    height={400}
                    className="w-full aspect-square object-cover rounded"
                  />
                  <Image
                    src="https://g8k6z2mz2pgxmlcl.public.blob.vercel-storage.com/fam3-0lx6rUC9wy2CoJdfJ6h4jWPqCbh7qH.jpg"
                    alt="Family moment 3"
                    width={400}
                    height={400}
                    className="w-full aspect-square object-cover rounded"
                  />
                </div>
                <p className="mt-3 text-center text-base text-gray-600 font-handwriting">With Family</p>
              </div>
              {/* Friend Memory */}
              <div className="relative bg-white p-3 shadow-lg transform rotate-[2deg] hover:rotate-0 transition-all duration-300">
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-4 bg-gray-300 opacity-80"></div>
                <div className="flex flex-col gap-2">
                  <Image
                    src="https://g8k6z2mz2pgxmlcl.public.blob.vercel-storage.com/wyf-2.jpg"
                    alt="My friend"
                    width={400}
                    height={400}
                    className="w-full aspect-square object-cover rounded"
                  />
                  <Image
                    src="https://g8k6z2mz2pgxmlcl.public.blob.vercel-storage.com/i2aspo-3-TcrsBCJFAIahVFMzgJMU4A6uFrdshb.jpg"
                    alt="My friend"
                    width={400}
                    height={400}
                    className="w-full aspect-square object-cover rounded"
                  />
                  <Image
                    src="https://g8k6z2mz2pgxmlcl.public.blob.vercel-storage.com/aug-2-TFs3zmYOAo2obL29UuaOyWPzhuaQEk.jpg"
                    alt="School event"
                    width={400}
                    height={400}
                    className="w-full aspect-square object-cover rounded"
                  />
                </div>
                <p className="mt-2 text-center text-sm text-gray-600 font-handwriting">My Friend</p>
              </div>
              {/* New Memory Card */}
              <div className="relative bg-white p-3 shadow-lg transform rotate-[-2deg] hover:rotate-0 transition-all duration-300">
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-4 bg-gray-300 opacity-80"></div>
                <div className="flex flex-col gap-2">
                  <Image
                    src="https://g8k6z2mz2pgxmlcl.public.blob.vercel-storage.com/aug-1-LEAfX0netme66jcRPmVg0ZhP17CQ5w.jpg"
                    alt="August moment"
                    width={400}
                    height={400}
                    className="w-full aspect-square object-cover rounded"
                  />
                  <Image
                    src="https://g8k6z2mz2pgxmlcl.public.blob.vercel-storage.com/i2aspo-2-zus6Lm0s3ANt6MUHWOAMnxurKts3wx.jpg"
                    alt="School event"
                    width={400}
                    height={400}
                    className="w-full aspect-square object-cover rounded"
                  />
                  <Image
                    src="https://g8k6z2mz2pgxmlcl.public.blob.vercel-storage.com/wyf-1.jpg"
                    alt="My friend"
                    width={400}
                    height={400}
                    className="w-full aspect-square object-cover rounded"
                  />
                </div>
                <p className="mt-2 text-center text-sm text-gray-600 font-handwriting">School + Event</p>
              </div>
              {/* Spacer (empty) */}
              <div className="hidden sm:block" />
            </div>
          </motion.div>

          {/* Indonesia through my lens */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-semibold text-purple-900 mb-6 text-center">Indonesia through my lens</h3>
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

  <div className="max-w-6xl w-full z-10 relative">
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="mb-16"
    >
      <div className="flex flex-col lg:flex-row items-center lg:items-start gap-10 text-left">
        {/* Foto Kiri */}
        <div className="flex-shrink-0 relative">
          <img
            src="https://g8k6z2mz2pgxmlcl.public.blob.vercel-storage.com/me-rM1nnLT7IJG1kDd5HRzk4gI7c9FaSL.jpg"
            alt="Alif Cryptovan Sinaga"
            className="w-40 sm:w-52 md:w-60 lg:w-72 rounded-full shadow-xl ring-4 ring-purple-200"
          />
          {/* Dekorasi kecil */}
          <div className="absolute -top-4 -right-4 text-3xl animate-bounce">✨</div>
        </div>

        {/* Teks Kanan */}
        <div className="flex flex-col justify-start lg:w-2/3 relative">
          {/* Gradient Behind Merci Beaucoup */}
          <h2 className="text-6xl sm:text-8xl md:text-9xl font-serif font-bold text-purple-900 mb-6 relative z-10">
            <span className="relative inline-block">
              <span className="absolute inset-0 bg-gradient-to-r from-pink-200 via-purple-100 to-pink-200 rounded-lg blur-sm opacity-40 -z-10"></span>
              Merci Beaucoup
            </span>
          </h2>

          <p className="text-lg sm:text-xl text-gray-700 leading-relaxed mb-6">
            I hope this gave you a glimpse of who I am and what matters to me.
            <br />
            I'm excited to meet new people, make friends, and grow through this journey.
            <br />
            Let’s learn from each other and create meaningful experiences together.
          </p>
          <p className="text-lg sm:text-xl text-purple-700 italic">
            — Alif Cryptovan Sinaga
            <br />
            Rotary Youth Exchange Student 2025
          </p>
        </div>
      </div>
    </motion.div>
  </div>
</section>
    </main>
  )
}
