import { Link } from 'react-router-dom'

import {
  useEffect,
  useState,
} from 'react'

import {
  doc,
  onSnapshot,
} from 'firebase/firestore'

import { db } from '../lib/firebase'

import Reveal from '../components/Reveal.jsx'

function FinalCtaSection() {
  const [banners, setBanners] =
    useState([])

  const [rotationEnabled, setRotationEnabled] =
    useState(false)

  const [activeIndex, setActiveIndex] =
    useState(0)

  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(
        db,
        'cms',
        'ctaBanners',
      ),
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data()

          setRotationEnabled(
            data.rotationEnabled ||
              false,
          )

          setBanners(
            data.banners || [],
          )
        }
      },
    )

    return () => unsubscribe()
  }, [])

  useEffect(() => {
    if (
      !rotationEnabled
    )
      return

    if (
      banners.length <= 1
    )
      return

    const intervalId =
      window.setInterval(() => {
        setActiveIndex(
          (current) =>
            (current + 1) %
            banners.length,
        )
      }, 4800)

    return () =>
      window.clearInterval(
        intervalId,
      )
  }, [
    banners,
    rotationEnabled,
  ])

  if (!banners.length)
    return null

  return (
    <section className="section-spacing">

      <div className="section-shell">

        <Reveal className="overflow-hidden rounded-[22px]">

          <div className="relative min-h-[420px] overflow-hidden rounded-[22px] bg-[#f7f3ec]">

            {banners.map(
              (
                banner,
                index,
              ) => {
                const isActive =
                  index ===
                  activeIndex

                return (
                  <div
                    key={index}
                    className={`absolute inset-0 transition duration-700 ${
                      isActive
                        ? 'opacity-100'
                        : 'pointer-events-none opacity-0'
                    }`}
                  >

                    <div className="grid h-full lg:grid-cols-[1fr_520px]">

                      {/* LEFT CONTENT */}

                      <div className="flex items-center px-8 py-12 sm:px-12 lg:px-16">

                        <div className="max-w-xl">

                          <p className="section-eyebrow">
                            {banner.label}
                          </p>

                          <h2 className="mt-4 text-4xl leading-tight sm:text-5xl">
                            {
                              banner.heading
                            }
                          </h2>

                          <p className="mt-5 text-base text-muted sm:text-lg">
                            {
                              banner.subtext
                            }
                          </p>

                          <Link
                            to={
                              banner.ctaHref ||
                              '/shop'
                            }
                            className="btn-primary mt-8"
                          >
                            {
                              banner.ctaLabel ||
                              'Shop Now'
                            }
                          </Link>

                        </div>

                      </div>

                      {/* RIGHT MEDIA */}

                      <div className="relative hidden overflow-hidden lg:block">

                        {banner.type ===
                        'video' ? (
                          <video
                            src={
                              banner.url
                            }
                            autoPlay
                            muted
                            loop
                            playsInline
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <img
                            src={
                              banner.url
                            }
                            alt=""
                            className={`h-full w-full object-cover transition-transform duration-[5000ms] ${
                              isActive
                                ? 'scale-105'
                                : 'scale-100'
                            }`}
                          />
                        )}

                      </div>

                    </div>

                  </div>
                )
              },
            )}

            {/* DOTS */}

            {rotationEnabled &&
              banners.length >
                1 && (
                <div className="absolute bottom-8 left-8 z-20 flex gap-2 sm:left-12 lg:left-16">

                  {banners.map(
                    (
                      _,
                      index,
                    ) => (
                      <button
                        key={
                          index
                        }
                        type="button"
                        onClick={() =>
                          setActiveIndex(
                            index,
                          )
                        }
                        className={`h-1.5 transition-all duration-300 ${
                          index ===
                          activeIndex
                            ? 'w-10 bg-gold'
                            : 'w-6 bg-black/20'
                        }`}
                      />
                    ),
                  )}

                </div>
              )}

          </div>

        </Reveal>

      </div>

    </section>
  )
}

export default FinalCtaSection