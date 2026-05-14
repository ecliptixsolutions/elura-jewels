import {
  ArrowLeft,
  ArrowRight,
} from 'lucide-react'

import {
  useEffect,
  useEffectEvent,
  useState,
} from 'react'

import {
  doc,
  onSnapshot,
} from 'firebase/firestore'

import { db } from '../lib/firebase'

function HeroSection() {
  const [slides, setSlides] = useState([])

  const [activeIndex, setActiveIndex] =
    useState(0)

  const [isRotational, setIsRotational] =
    useState(false)

  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, 'heroBanners', 'homepageHero'),
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data()

          setSlides(data.banners || [])

          setIsRotational(
            data.rotational || false,
          )
        }
      },
    )

    return () => unsubscribe()
  }, [])

  const advanceSlide = useEffectEvent(() => {
    if (!slides.length) return

    setActiveIndex(
      (current) =>
        (current + 1) % slides.length,
    )
  })

  useEffect(() => {
    if (!isRotational) return

    if (slides.length <= 1) return

    const intervalId = window.setInterval(() => {
      advanceSlide()
    }, 5000)

    return () =>
      window.clearInterval(intervalId)
  }, [slides.length, isRotational])

  if (!slides.length) return null

  return (
    <section className="relative">

      {/* MAIN HERO CONTAINER */}
      <div
        className="
          relative overflow-hidden bg-[#f8f5f0]

          h-[34vh]
          min-h-[280px]

          sm:mx-4
          sm:rounded-[18px]

          sm:h-[48vh]
          sm:min-h-[420px]

          md:h-[56vh]
          md:min-h-[520px]

          lg:h-[62vh]
          lg:min-h-[580px]

          xl:h-[68vh]
          xl:min-h-[640px]

          2xl:h-[72vh]
          2xl:min-h-[700px]
        "
      >

        {slides.map((slide, index) => {
          const isActive =
            index === activeIndex

          return (
            <div
              key={index}
              className={`absolute inset-0 transition duration-1000 ${
                isActive
                  ? 'opacity-100'
                  : 'pointer-events-none opacity-0'
              }`}
            >

              {/* IMAGE */}
              {slide.type === 'image' && (
                <img
                  src={slide.url}
                  alt=""
                  className={`h-full w-full object-cover transition-transform duration-[7000ms] ${
                    isActive
                      ? 'scale-105'
                      : 'scale-100'
                  }`}
                />
              )}

              {/* VIDEO */}
              {slide.type === 'video' && (
                <video
                  src={slide.url}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="h-full w-full object-cover"
                />
              )}

              {/* OVERLAYS */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-black/5 to-transparent" />

              <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-white/5" />

            </div>
          )
        })}

        {/* SLIDER CONTROLS */}
        {isRotational &&
          slides.length > 1 && (
            <div className="section-shell absolute inset-x-0 bottom-6 z-20 flex items-center justify-between">

              {/* DOTS */}
              <div className="flex items-center gap-2">

                {slides.map(
                  (_, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() =>
                        setActiveIndex(
                          index,
                        )
                      }
                      className={`h-1.5 transition ${
                        index ===
                        activeIndex
                          ? 'w-12 bg-gold'
                          : 'w-7 bg-white/60'
                      }`}
                    />
                  ),
                )}

              </div>

              {/* ARROWS */}
              <div className="hidden gap-2 sm:flex">

                <button
                  type="button"
                  onClick={() =>
                    setActiveIndex(
                      (current) =>
                        current === 0
                          ? slides.length -
                            1
                          : current - 1,
                    )
                  }
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/30 text-white transition hover:border-gold hover:text-gold"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setActiveIndex(
                      (current) =>
                        (current + 1) %
                        slides.length,
                    )
                  }
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/30 text-white transition hover:border-gold hover:text-gold"
                >
                  <ArrowRight className="h-4 w-4" />
                </button>

              </div>

            </div>
          )}

      </div>

    </section>
  )
}

export default HeroSection