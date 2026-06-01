import {
  ArrowLeft,
  ArrowRight,
} from 'lucide-react'

import { Link } from 'react-router-dom'

import {
  useEffect,
  useEffectEvent,
  useState,
} from 'react'

function HeroSection({ slides = [] }) {

  const [activeIndex, setActiveIndex] =
    useState(0)

  const isRotational =
    slides.length > 1
  const activeSlide =
    slides[activeIndex] || slides[0]
  const alignmentClasses = {
    left: 'items-center justify-start text-left',
    center: 'items-center justify-center text-center',
    right: 'items-center justify-end text-right',
  }

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

    const intervalId =
      window.setInterval(() => {
        advanceSlide()
      }, 5000)

    return () =>
      window.clearInterval(
        intervalId,
      )
  }, [
    slides.length,
    isRotational,
  ])

  if (!slides.length) return null

  return (
    <section className="relative">

      {/* MAIN HERO CONTAINER */}
      <div
        className="
          relative overflow-hidden bg-[#f8f5f0]

          h-[56vh]
          min-h-[430px]

          sm:mx-4
          sm:rounded-[18px]

          sm:h-[48vh]
          sm:min-h-[440px]

          md:h-[56vh]
          md:min-h-[560px]

          lg:h-[62vh]
          lg:min-h-[580px]

          xl:h-[68vh]
          xl:min-h-[640px]

          2xl:h-[72vh]
          2xl:min-h-[700px]
        "
      >

        {slides.map(
          (
            slide,
            index,
          ) => {
            const isActive =
              index === activeIndex
            const mediaSource =
              slide.image || slide.url
            const overlayStrength = Number(slide.overlayStrength ?? 28)

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
                {mediaSource && (
                  <img
                    src={mediaSource}
                    alt={
                      slide.heading
                        ? `${slide.heading} by ELURA Jewels`
                        : 'Luxury jewellery by ELURA Jewels'
                    }
                    loading={index === 0 ? 'eager' : 'lazy'}
                    fetchPriority={index === 0 ? 'high' : 'auto'}
                    decoding="async"
                    width="1600"
                    height="1000"
                    style={{
                      objectPosition:
                        slide.desktopObjectPosition ||
                        slide.objectPosition ||
                        'center center',
                    }}
                    className={`h-full w-full object-cover transition-transform duration-[7000ms] ${
                      isActive
                        ? 'scale-105'
                        : 'scale-100'
                    }`}
                  />
                )}

                {/* VIDEO */}
                {slide.video && (
                  <video
                    src={
                      slide.video
                    }
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="h-full w-full object-cover"
                  />
                )}

                {/* OVERLAYS */}
                <div
                  className="absolute inset-0"
                  style={{
                    background: `rgba(0, 0, 0, ${Math.min(Math.max(overlayStrength, 0), 80) / 100})`,
                  }}
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-white/5" />

              </div>
            )
          },
        )}

        {/* SLIDER CONTROLS */}
        {isRotational &&
          slides.length >
            1 && (
            <div className="section-shell absolute inset-x-0 bottom-4 z-20 flex items-center justify-center md:bottom-6 md:justify-between">

              {/* DOTS */}
              <div className="flex items-center gap-2 max-md:mt-4">

                {slides.map(
                  (
                    _,
                    index,
                  ) => (
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
              <div className="hidden gap-2 md:flex">

                <button
                  type="button"
                  onClick={() =>
                    setActiveIndex(
                      (
                        current,
                      ) =>
                        current ===
                        0
                          ? slides.length -
                            1
                          : current -
                            1,
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
                      (
                        current,
                      ) =>
                        (current +
                          1) %
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

      <div
        className={`section-shell pointer-events-none absolute inset-x-0 top-0 z-10 flex h-full max-md:pb-20 md:max-[1199px]:pb-24 ${
          alignmentClasses[activeSlide?.textAlignment] || alignmentClasses.left
        }`}
      >
        <div className="max-w-2xl pt-8 text-white max-md:flex max-md:max-w-[min(100%,22rem)] max-md:flex-col max-md:items-start max-md:justify-center md:max-[1199px]:max-w-xl md:max-[1199px]:pb-24">
          {activeSlide?.label ? (
            <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-gold sm:tracking-[0.42em]">
              {activeSlide.label}
            </p>
          ) : null}

          {activeSlide?.heading ? (
            <h1 className="mt-3 max-w-3xl text-[clamp(1.9rem,8vw,2.55rem)] leading-[1.08] text-white sm:mt-5 sm:text-[clamp(2.35rem,6vw,3.5rem)] md:max-[1199px]:text-[clamp(3rem,5.2vw,3.75rem)] min-[1200px]:text-7xl">
              {activeSlide.heading}
            </h1>
          ) : null}

          {activeSlide?.subtext ? (
            <p className="mt-3 max-w-xl text-sm leading-6 text-white/88 sm:mt-4 sm:text-base sm:leading-7 min-[1200px]:text-lg min-[1200px]:leading-8">
              {activeSlide.subtext}
            </p>
          ) : null}

          {activeSlide?.ctaHref && activeSlide?.ctaLabel ? (
            <Link
              to={activeSlide.ctaHref}
              className="btn-primary pointer-events-auto mt-5 mb-9 bg-white text-ink hover:text-ink sm:mt-6 md:mb-10 min-[1200px]:mt-8 min-[1200px]:mb-0"
            >
              {activeSlide.ctaLabel}
            </Link>
          ) : null}
        </div>
      </div>

    </section>
  )
}

export default HeroSection
