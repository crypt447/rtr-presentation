"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { motion, useAnimation, AnimatePresence } from "framer-motion"
import { MapWrapper } from "@/components/map-wrapper"
import { CountUp } from "@/components/count-up"

export default function Home() {
  const [activeSection, setActiveSection] = useState(0)
  const [nameToggle, setNameToggle] = useState(false)
  const nameControls = useAnimation()
  const sectionRefs = useRef<(HTMLElement | null)[]>([])

  // Auto toggle name effect
  useEffect(() => {
    const toggleInterval = setInterval(() => {
      setNameToggle((prev) => !prev)
    }, 5000) // Toggle every 5 seconds

    return () => clearInterval(toggleInterval)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const pageYOffset = window.pageYOffset
      let newActiveSection = 0

      sectionRefs.current.forEach((section, index) => {
        if (section) {
          const sectionTop = section.offsetTop - 100
          if (pageYOffset >= sectionTop) {
            newActiveSection = index
          }
        }
      })

      setActiveSection(newActiveSection)
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

  return (
    <main className="relative">
      {/* Navigation Dots */}
      <div className="fixed right-8 top-1/2 transform -translate-y-1/2 z-50 hidden md:block">
        <div className="flex flex-col gap-4">
          {Array(9)
            .fill(0)
            .map((_, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  activeSection === index ? "bg-purple-600 scale-125" : "bg-gray-300 hover:bg-purple-400"
                }`}
                aria-label={`Go to section ${index + 1}`}
              />
            ))}
        </div>
      </div>

      {/* Social Media Fixed Bar - Using Bootstrap Icons */}
      <div className="fixed left-8 top-1/2 transform -translate-y-1/2 z-50 hidden md:flex flex-col gap-6">
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-purple-600 transition-colors duration-300"
          aria-label="Instagram"
        >
          <i className="bi bi-instagram text-2xl"></i>
        </a>
        <a
          href="https://snapchat.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-purple-600 transition-colors duration-300"
          aria-label="Snapchat"
        >
          <i className="bi bi-snapchat text-2xl"></i>
        </a>
        <a
          href="https://wa.me/1234567890"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-purple-600 transition-colors duration-300"
          aria-label="WhatsApp"
        >
          <i className="bi bi-whatsapp text-2xl"></i>
        </a>
        <a
          href="mailto:alif@example.com"
          className="text-gray-400 hover:text-purple-600 transition-colors duration-300"
          aria-label="Email"
        >
          <i className="bi bi-envelope text-2xl"></i>
        </a>
        <a
          href="https://spotify.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-purple-600 transition-colors duration-300"
          aria-label="Spotify"
        >
          <i className="bi bi-spotify text-2xl"></i>
        </a>
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-purple-600 transition-colors duration-300"
          aria-label="GitHub"
        >
          <i className="bi bi-github text-2xl"></i>
        </a>
      </div>

      {/* Section 1: Opening / Salut */}
      <section
        ref={(el) => (sectionRefs.current[0] = el)}
        className="min-h-screen flex flex-col justify-center items-center relative overflow-hidden bg-gradient-to-b from-purple-50 to-white px-4 sm:px-6"
      >
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('/placeholder.svg?height=1080&width=1920')] bg-cover bg-center opacity-10 transform scale-110"></div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center z-10 max-w-4xl"
        >
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-serif font-bold text-purple-900 mb-6">
            Salut. Je m&apos;appelle{" "}
            <span className="relative inline-block min-w-[180px] min-h-[80px]">
              <AnimatePresence mode="wait">
                {nameToggle ? (
                  <motion.span
                    key="name1"
                    className="absolute inset-0 flex items-center justify-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                  >
                    Alif
                  </motion.span>
                ) : (
                  <motion.span
                    key="name2"
                    className="absolute inset-0 flex items-center justify-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
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

      {/* Section 2: From Rotary Surabaya to Rotary Morbecque */}
<section
  ref={(el) => (sectionRefs.current[1] = el)}
  className="min-h-screen flex flex-col justify-center items-center px-4 sm:px-6 py-20 bg-white relative"
>
  <div className="absolute inset-0 overflow-hidden">
    <div className="absolute top-0 left-0 w-full h-full bg-[url('/placeholder.svg?height=1080&width=1920')] bg-cover bg-center opacity-5 transform scale-110"></div>
  </div>
  <div className="max-w-4xl z-10">
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="text-center mb-16"
    >
      <h2 className="text-4xl sm:text-5xl font-serif font-bold text-purple-900 mb-8">A Glimpse into My Journey</h2>
      <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
        I was born in Medan, raised in Jakarta, and currently study in Malang.  
        <br />
        My life has taken me across many places in Indonesia.  
        <br />
        Each one has shaped who I am with unique memories and valuable lessons.
      </p>
    </motion.div>

    {/* Interactive Map */}
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.3 }}
      viewport={{ once: true }}
      className="mt-8 mb-16"
    >
      <h3 className="text-2xl font-semibold text-purple-900 mb-6 text-center flex items-center justify-center gap-2">
        <i className="bi bi-globe text-2xl text-purple-600"></i>
        My Life Journey
      </h3>
      <div className="w-full h-[400px] bg-purple-50 rounded-xl overflow-hidden shadow-lg">
        <MapWrapper />
      </div>
    </motion.div>

    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.6 }}
      viewport={{ once: true }}
      className="grid grid-cols-1 md:grid-cols-2 gap-8"
    >
      <div className="bg-purple-50 rounded-xl overflow-hidden shadow-lg transform transition-transform hover:scale-105">
        <Image
          src="/placeholder.svg?height=400&width=600"
          alt="Rotary Surabaya"
          width={600}
          height={400}
          className="w-full h-64 object-cover"
        />
        <div className="p-6">
          <h3 className="text-xl font-semibold text-purple-900 mb-2">Rotary Surabaya</h3>
          <p className="text-gray-700">
            Where my Rotary journey began — guided by mentors who believed in my dreams.
          </p>
        </div>
      </div>
      <div className="bg-purple-50 rounded-xl overflow-hidden shadow-lg transform transition-transform hover:scale-105">
        <Image
          src="/placeholder.svg?height=400&width=600"
          alt="Rotary Morbecque"
          width={600}
          height={400}
          className="w-full h-64 object-cover"
        />
        <div className="p-6">
          <h3 className="text-xl font-semibold text-purple-900 mb-2">Rotary Morbecque</h3>
          <p className="text-gray-700">
            My future home in France — a new chapter filled with discovery, friendship, and growth.
          </p>
        </div>
      </div>
    </motion.div>
  </div>
</section>

      {/* Rest of the sections remain unchanged except for icons */}
      {/* Section 3: My Family & My School */}
      <section
        ref={(el) => (sectionRefs.current[2] = el)}
        className="min-h-screen flex flex-col justify-center items-center px-4 sm:px-6 py-20 bg-gradient-to-b from-white to-purple-50 relative"
      >
        <div className="max-w-4xl z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-serif font-bold text-purple-900 mb-8">My World Back Home</h2>
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
              I was born and raised in Surabaya — the City of Heroes.
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
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            <div className="bg-white rounded-xl overflow-hidden shadow-lg transform transition-transform hover:scale-105">
              <Image
                src="/placeholder.svg?height=400&width=600"
                alt="Family life"
                width={600}
                height={400}
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-purple-900 mb-2">Family Life</h3>
                <p className="text-gray-700">
                  Moments of joy, learning, and togetherness with my loving family in Surabaya.
                </p>
              </div>
            </div>
            <div className="bg-white rounded-xl overflow-hidden shadow-lg transform transition-transform hover:scale-105">
              <Image
                src="/placeholder.svg?height=400&width=600"
                alt="Thursina IIBS"
                width={600}
                height={400}
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-purple-900 mb-2">Thursina IIBS</h3>
                <p className="text-gray-700">
                  My boarding school in Malang where I developed leadership and a global mindset.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Section 4: Rotary Surabaya Persadda District 3420 */}
      <section
        ref={(el) => (sectionRefs.current[3] = el)}
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
              Rotary Surabaya Persadda — District 3420
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
              src="/placeholder.svg?height=200&width=200"
              alt="Rotary Logo"
              width={200}
              height={200}
              className="rounded-full shadow-lg"
            />
          </motion.div>
        </div>
      </section>

      {/* Section 5: Indonesia: Unity in Diversity */}
      <section
        ref={(el) => (sectionRefs.current[4] = el)}
        className="min-h-screen flex flex-col justify-center items-center px-4 sm:px-6 py-20 bg-white relative"
      >
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('/placeholder.svg?height=1080&width=1920')] bg-cover bg-center opacity-5 transform scale-110"></div>
        </div>
        <div className="max-w-4xl z-10">
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
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
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
      </section>

      {/* Section 6: My Hobby */}
<section
  ref={(el) => (sectionRefs.current[4] = el)}
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

      {/* Section 6: Iconic Indonesian Landmarks */}
      <section
        ref={(el) => (sectionRefs.current[5] = el)}
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
                src="/placeholder.svg?height=400&width=600"
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
                src="/placeholder.svg?height=400&width=600"
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
                src="/placeholder.svg?height=400&width=600"
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
                src="/placeholder.svg?height=400&width=600"
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
                src="/placeholder.svg?height=400&width=600"
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
                src="/placeholder.svg?height=400&width=600"
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

      {/* Section 7: A Taste of Indonesia */}
      <section
        ref={(el) => (sectionRefs.current[6] = el)}
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
              <div className="snap-center shrink-0 first:pl-8 last:pr-8">
                <div className="w-80 bg-white rounded-xl overflow-hidden shadow-lg">
                  <Image
                    src="/placeholder.svg?height=400&width=600"
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
                    src="/placeholder.svg?height=400&width=600"
                    alt="Satay"
                    width={600}
                    height={400}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-purple-900 mb-2">🍢 Satay</h3>
                    <p className="text-gray-700">Skewers of smoky meat and peanut sauce</p>
                  </div>
                </div>
              </div>
              <div className="snap-center shrink-0">
                <div className="w-80 bg-white rounded-xl overflow-hidden shadow-lg">
                  <Image
                    src="/placeholder.svg?height=400&width=600"
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
                    src="/placeholder.svg?height=400&width=600"
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
                    src="/placeholder.svg?height=400&width=600"
                    alt="Soto Ayam"
                    width={600}
                    height={400}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-purple-900 mb-2">🍲 Soto Ayam</h3>
                    <p className="text-gray-700">Aromatic chicken soup with turmeric</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-gradient-to-r from-purple-50 to-transparent w-12 h-full"></div>
            <div className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-gradient-to-l from-purple-50 to-transparent w-12 h-full"></div>
          </motion.div>
        </div>
      </section>

      {/* Section 8: My Scrapbook */}
      <section
        ref={(el) => (sectionRefs.current[7] = el)}
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
            <h2 className="text-4xl sm:text-5xl font-serif font-bold text-purple-900 mb-8">A Glimpse Into My World</h2>
            <p className="text-lg md:text-xl text-gray-700 mb-12">
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
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16">
              <div className="relative bg-white p-3 shadow-lg transform rotate-[-2deg] hover:rotate-0 transition-all duration-300">
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-4 bg-gray-300 opacity-80"></div>
                <Image
                  src="/placeholder.svg?height=400&width=400&text=Family"
                  alt="With family"
                  width={400}
                  height={400}
                  className="w-full h-auto"
                />
                <p className="mt-2 text-center text-sm text-gray-600 font-handwriting">With family</p>
              </div>
              <div className="relative bg-white p-3 shadow-lg transform rotate-[1deg] hover:rotate-0 transition-all duration-300">
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-4 bg-gray-300 opacity-80"></div>
                <Image
                  src="/placeholder.svg?height=400&width=400&text=School"
                  alt="School memory"
                  width={400}
                  height={400}
                  className="w-full h-auto"
                />
                <p className="mt-2 text-center text-sm text-gray-600 font-handwriting">School memory</p>
              </div>
              <div className="relative bg-white p-3 shadow-lg transform rotate-[2deg] hover:rotate-0 transition-all duration-300">
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-4 bg-gray-300 opacity-80"></div>
                <Image
                  src="/placeholder.svg?height=400&width=400&text=Friends"
                  alt="My friend"
                  width={400}
                  height={400}
                  className="w-full h-auto"
                />
                <p className="mt-2 text-center text-sm text-gray-600 font-handwriting">My friend</p>
              </div>
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
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="relative bg-white p-3 shadow-lg transform hover:scale-105 transition-all duration-300"
                  style={{ transform: `rotate(${Math.random() * 6 - 3}deg)` }}
                >
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-4 bg-gray-300 opacity-80"></div>
                  <Image
                    src={`/placeholder.svg?height=400&width=400&text=Indonesia ${i + 1}`}
                    alt={`Indonesia scene ${i + 1}`}
                    width={400}
                    height={400}
                    className="w-full h-auto"
                  />
                  <p className="mt-2 text-center text-sm text-gray-600 font-handwriting">
                    {
                      [
                        "Sunset at Bali",
                        "Jakarta cityscape",
                        "Village life",
                        "Traditional dance",
                        "Local market",
                        "Island hopping",
                      ][i]
                    }
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Section 9: Closing: Thank You */}
      <section
        ref={(el) => (sectionRefs.current[8] = el)}
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

          {/* Social Media Links (Mobile) - Using Bootstrap Icons */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-6 md:hidden mt-12"
          >
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-purple-600 transition-colors duration-300"
              aria-label="Instagram"
            >
              <i className="bi bi-instagram text-2xl"></i>
            </a>
            <a
              href="https://snapchat.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-purple-600 transition-colors duration-300"
              aria-label="Snapchat"
            >
              <i className="bi bi-snapchat text-2xl"></i>
            </a>
            <a
              href="https://wa.me/1234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-purple-600 transition-colors duration-300"
              aria-label="WhatsApp"
            >
              <i className="bi bi-whatsapp text-2xl"></i>
            </a>
            <a
              href="mailto:alif@example.com"
              className="text-gray-400 hover:text-purple-600 transition-colors duration-300"
              aria-label="Email"
            >
              <i className="bi bi-envelope text-2xl"></i>
            </a>
            <a
              href="https://spotify.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-purple-600 transition-colors duration-300"
              aria-label="Spotify"
            >
              <i className="bi bi-spotify text-2xl"></i>
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-purple-600 transition-colors duration-300"
              aria-label="GitHub"
            >
              <i className="bi bi-github text-2xl"></i>
            </a>
          </motion.div>
        </div>
      </section>
    </main>
  )
}
