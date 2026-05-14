import { useEffect, useState } from 'react'

import {
  doc,
  getDoc,
} from 'firebase/firestore'

import { db } from '../lib/firebase'

import {
  collectionCards,
  brandStory,
  heroSlides,
  promoBanners,
  testimonials,
} from '../data/siteData.js'

import BrandStorySection from '../sections/BrandStorySection.jsx'
import CategorySection from '../sections/CategorySection.jsx'
import FinalCtaSection from '../sections/FinalCtaSection.jsx'
import HeroSection from '../sections/HeroSection.jsx'
import ProductSection from '../sections/ProductSection.jsx'
import TestimonialsSection from '../sections/TestimonialsSection.jsx'

import { useStore } from '../context/StoreContext.jsx'

function HomePage() {
  const { homeFeaturedProducts } = useStore()

  const [heroData, setHeroData] =
    useState(heroSlides)

  const [collectionsData, setCollectionsData] =
    useState(collectionCards)

  const [aboutData, setAboutData] =
    useState(brandStory)

  const [ctaData, setCtaData] =
    useState(promoBanners)

  useEffect(() => {
    loadCmsData()
  }, [])

  const loadCmsData = async () => {
    try {
      /*
      =========================================
      HERO BANNERS
      =========================================
      */
      const heroSnapshot = await getDoc(
        doc(db, 'cms', 'heroBanners'),
      )

      if (heroSnapshot.exists()) {
        const heroCms =
          heroSnapshot.data()

        if (
          heroCms?.banners?.length
        ) {
          const mappedHero =
            heroCms.banners
              .filter(
                (item) =>
                  item?.url,
              )
              .map(
                (
                  item,
                  index,
                ) => ({
                  id:
                    item.id ||
                    index + 1,

                  image:
                    item.url,

                  video:
                    item.video || '',

                  heading:
                    item.heading || '',

                  subtext:
                    item.subtext || '',

                  label:
                    item.label || '',

                  ctaLabel:
                    item.ctaLabel || '',

                  ctaHref:
                    item.ctaHref || '',

                  mobileObjectPosition:
                    item.mobileObjectPosition ||
                    'center center',

                  desktopObjectPosition:
                    item.desktopObjectPosition ||
                    'center center',
                }),
              )

          if (
            mappedHero.length
          ) {
            setHeroData(
              mappedHero,
            )
          }
        }
      }

      /*
      =========================================
      COLLECTIONS
      =========================================
      */
      const collectionsSnapshot =
        await getDoc(
          doc(
            db,
            'cms',
            'collections',
          ),
        )

      if (
        collectionsSnapshot.exists()
      ) {
        const collectionsCms =
          collectionsSnapshot.data()

        if (
          collectionsCms?.items
            ?.length
        ) {
          const mappedCollections =
            collectionsCms.items
              .filter(
                (item) =>
                  item?.url,
              )
              .map(
                (
                  item,
                  index,
                ) => ({
                  id:
                    item.key ||
                    index + 1,

                  title:
                    item.title || '',

                  subtitle:
                    item.subtitle || '',

                  image:
                    item.url,

                  video:
                    item.video || '',

                  href:
                    item.href || '',
                }),
              )

          if (
            mappedCollections.length
          ) {
            setCollectionsData(
              mappedCollections,
            )
          }
        }
      }

      /*
      =========================================
      ABOUT SECTION
      =========================================
      */
      const aboutSnapshot =
        await getDoc(
          doc(
            db,
            'cms',
            'aboutSection',
          ),
        )

      if (
        aboutSnapshot.exists()
      ) {
        const aboutCms =
          aboutSnapshot.data()

        setAboutData({
          image:
            aboutCms.image ||
            '',

          title:
            aboutCms.title ||
            '',

          body:
            aboutCms.body ||
            [],

          features:
            aboutCms.features ||
            [],
        })
      }

      /*
      =========================================
      CTA BANNERS
      =========================================
      */
      const ctaSnapshot =
        await getDoc(
          doc(
            db,
            'cms',
            'ctaBanners',
          ),
        )

      if (ctaSnapshot.exists()) {
        const ctaCms =
          ctaSnapshot.data()

        if (
          ctaCms?.banners
            ?.length
        ) {
          const mappedCta =
            ctaCms.banners
              .filter(
                (item) =>
                  item?.url,
              )
              .map(
                (
                  item,
                  index,
                ) => ({
                  id:
                    item.id ||
                    index + 1,

                  image:
                    item.url,

                  video:
                    item.video || '',

                  heading:
                    item.heading || '',

                  subtext:
                    item.subtext || '',

                  label:
                    item.label || '',

                  ctaLabel:
                    item.ctaLabel || '',

                  ctaHref:
                    item.ctaHref || '',
                }),
              )

          if (
            mappedCta.length
          ) {
            setCtaData(
              mappedCta,
            )
          }
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <HeroSection
        slides={heroData}
      />

      <CategorySection
        cards={
          collectionsData
        }
      />

      <ProductSection
        products={
          homeFeaturedProducts
        }
      />

      <BrandStorySection
        story={aboutData}
      />

      <TestimonialsSection
        testimonials={
          testimonials
        }
      />

      <FinalCtaSection
        banners={ctaData}
      />
    </>
  )
}

export default HomePage