import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'

import {
  doc,
  onSnapshot,
} from 'firebase/firestore'

import { db } from '../lib/firebase'

import Reveal from '../components/Reveal.jsx'
import SectionHeading from '../components/SectionHeading.jsx'

function BrandStorySection({ story }) {
  const [aboutMedia, setAboutMedia] =
    useState(null)

  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, 'cms', 'about'),
      (snapshot) => {
        if (snapshot.exists()) {
          setAboutMedia(snapshot.data())
        }
      },
    )

    return () => unsubscribe()
  }, [])

  return (
    <section className="section-spacing">
      <div className="section-shell">

        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">

          <Reveal>

            <div className="overflow-hidden rounded-[18px]">

              {aboutMedia?.type === 'video' ? (
                <video
                  src={aboutMedia?.url}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="h-full min-h-[34rem] w-full object-cover"
                />
              ) : (
                <img
                  src={aboutMedia?.url || story.image}
                  alt={story.title}
                  className="h-full min-h-[34rem] w-full object-cover"
                />
              )}

            </div>

          </Reveal>

          <Reveal delay={120}>

            <SectionHeading
              eyebrow="About ELURA"
              title={story.title}
              description={story.body[0]}
            />

            <div className="space-y-5 text-base text-muted sm:text-lg">
              <p>{story.body[1]}</p>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">

              {story.features.map(
                (feature, index) => (
                  <div
                    key={index}
                    className="rounded-[16px] bg-white/55 px-5 py-4 text-sm text-muted"
                  >
                    {feature}
                  </div>
                ),
              )}

            </div>

            <Link
              to="/about"
              className="line-link mt-8"
            >
              Learn More
            </Link>

          </Reveal>

        </div>

      </div>
    </section>
  )
}

export default BrandStorySection