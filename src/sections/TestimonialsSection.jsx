import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useEffect, useEffectEvent, useRef } from 'react'
import Reveal from '../components/Reveal.jsx'
import SectionHeading from '../components/SectionHeading.jsx'
import {
  getJudgeMeShopDomain,
  isJudgeMeEnabled,
  loadJudgeMeScript,
} from '../lib/reviews.js'

function TestimonialsSection() {
  const sliderRef = useRef(null)
  const hasJudgeMe = isJudgeMeEnabled()

  const scrollCards = (direction) => {
    const slider = sliderRef.current

    if (!slider) {
      return
    }

    const scrollAmount = Math.min(slider.clientWidth * 0.88, 420)

    slider.scrollBy({
      left: scrollAmount * direction,
      behavior: 'smooth',
    })
  }

  const advanceSlider = useEffectEvent(() => {
    const slider = sliderRef.current

    if (!slider) {
      return
    }

    const maxScrollLeft = slider.scrollWidth - slider.clientWidth - 12

    if (slider.scrollLeft >= maxScrollLeft) {
      slider.scrollTo({ left: 0, behavior: 'smooth' })
      return
    }

    scrollCards(1)
  })

  useEffect(() => {
    if (!hasJudgeMe) return undefined

    loadJudgeMeScript()

    const intervalId = window.setInterval(() => {
      advanceSlider()
    }, 5200)

    return () => window.clearInterval(intervalId)
  }, [hasJudgeMe])

  if (!hasJudgeMe) {
    return null
  }

  return (
    <section className="section-spacing bg-white">
      <div className="section-shell">
        <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow="Reviews"
            title="Loved for the finish, chosen for the simplicity"
            description="Customer feedback that reflects the cleaner ELURA experience: refined product, easy navigation, and premium presentation."
          />

          <div className="hidden items-center gap-2 sm:flex">
            <button
              type="button"
              onClick={() => scrollCards(-1)}
              className="icon-button border border-black/8"
              aria-label="Scroll reviews left"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => scrollCards(1)}
              className="icon-button border border-black/8"
              aria-label="Scroll reviews right"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div
          ref={sliderRef}
          className="no-scrollbar -mx-1 flex snap-x snap-mandatory gap-5 overflow-x-auto px-1 pb-2 scroll-smooth"
        >
          <Reveal className="min-w-full flex-[0_0_100%] snap-start">
            <div
              className="jdgm-carousel-wrapper rounded-[8px] bg-white p-1"
              data-widget-name="review_carousel"
              data-shop-domain={getJudgeMeShopDomain()}
            />
          </Reveal>
        </div>
      </div>
    </section>
  )
}

export default TestimonialsSection
