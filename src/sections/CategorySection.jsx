import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'

import {
  doc,
  onSnapshot,
} from 'firebase/firestore'

import { db } from '../lib/firebase'

import Reveal from '../components/Reveal.jsx'
import SectionHeading from '../components/SectionHeading.jsx'

function CategorySection({ cards: fallbackCards = [] }) {
  const [cards, setCards] = useState(fallbackCards)

  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, 'cms', 'collections'),
      (snapshot) => {
        if (snapshot.exists()) {
          const cmsCards = snapshot.data().items || []

          if (cmsCards.length) {
            setCards(cmsCards)
          }
        }
      },
    )

    return () => unsubscribe()
  }, [])

  if (!cards.length) return null

  return (
    <section className="section-spacing" id="home-collections">
      <div className="section-shell">

        <SectionHeading
          eyebrow="Collections"
          title="Explore Our Collections"
          description="A clearer, more product-led collection layout with soft imagery, restrained styling, and easy paths into the shop."
        />

        <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">

          {/* LARGE CARD */}
          <Reveal className="lg:row-span-2">

            <Link
              to="/shop"
              className="group block overflow-hidden rounded-[18px]"
            >

              <div className="overflow-hidden rounded-[18px]">

                {cards[0]?.type !== 'video' ? (
                  <img
                    src={cards[0]?.url || cards[0]?.image}
                    alt={`${cards[0]?.title || 'Luxury jewellery collection'} by ELURA Jewels`}
                    loading="lazy"
                    decoding="async"
                    width="880"
                    height="680"
                    className="h-[34rem] w-full object-cover transition duration-700 group-hover:scale-[1.03]"
                  />
                ) : (
                  <video
                    src={cards[0]?.url}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="h-[34rem] w-full object-cover transition duration-700 group-hover:scale-[1.03]"
                  />
                )}

              </div>

              <div className="space-y-2 px-1 py-6 sm:px-2 sm:py-7">

                <h3 className="text-3xl sm:text-4xl">
                  {cards[0]?.title}
                </h3>

              </div>

            </Link>

          </Reveal>

          {/* SMALL CARDS */}
          <div className="grid gap-5">

            {cards.slice(1).map((card, index) => (
              <Reveal
                key={index}
                delay={index * 80}
              >

                <Link
                  to="/shop"
                  className="group block overflow-hidden rounded-[18px]"
                >

                  <div className="overflow-hidden rounded-[18px]">

                    {card.type !== 'video' ? (
                      <img
                        src={card.url || card.image}
                        alt={`${card.title || 'Luxury jewellery collection'} by ELURA Jewels`}
                        loading="lazy"
                        decoding="async"
                        width="640"
                        height="360"
                        className="h-72 w-full object-cover transition duration-700 group-hover:scale-[1.03]"
                      />
                    ) : (
                      <video
                        src={card.url}
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="h-72 w-full object-cover transition duration-700 group-hover:scale-[1.03]"
                      />
                    )}

                  </div>

                  <div className="space-y-2 px-1 py-5">

                    <h3 className="text-2xl">
                      {card.title}
                    </h3>

                  </div>

                </Link>

              </Reveal>
            ))}

          </div>

        </div>

      </div>
    </section>
  )
}

export default CategorySection
