// FILE: src/pages/HomePage.jsx

import { useCallback, useEffect, useState } from 'react'

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

import SEO from '../components/SEO.jsx'
import BrandStorySection from '../sections/BrandStorySection.jsx'
import CategorySection from '../sections/CategorySection.jsx'
import FinalCtaSection from '../sections/FinalCtaSection.jsx'
import HeroSection from '../sections/HeroSection.jsx'
import ProductSection from '../sections/ProductSection.jsx'
import TestimonialsSection from '../sections/TestimonialsSection.jsx'
import { pageSeo } from '../seo/seoConfig.js'
import {
  breadcrumbSchema,
  jewelryStoreSchema,
  organizationSchema,
  websiteSchema,
} from '../seo/structuredData.js'

import { useStore } from '../context/StoreContext.jsx'

function HomePage() {

  const { homeFeaturedProducts } =
    useStore()

  /*
  =========================================
  IMPORTANT
  START WITH LOCAL HERO
  SO WEBSITE NEVER BREAKS
  =========================================
  */
  const [heroData, setHeroData] =
    useState(heroSlides)

  const [collectionsData, setCollectionsData] =
    useState(collectionCards)

  const [aboutData, setAboutData] =
    useState(brandStory)

  const [ctaData, setCtaData] =
    useState(promoBanners)

  const loadCmsData = useCallback(async () => {

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

                  /*
                  =========================================
                  HEROSECTION FORMAT
                  =========================================
                  */
                  type:
                    item.type ||
                    'image',

                  url:
                    item.url,

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

          /*
          =========================================
          UPDATE HERO ONLY IF VALID
          =========================================
          */
          if (
            mappedHero.length > 0
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

      if (
        ctaSnapshot.exists()
      ) {

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

      console.log(
        'CMS ERROR:',
        error,
      )
    }
  }, [])

  useEffect(() => {

    const loadTask =
      window.requestIdleCallback
        ? window.requestIdleCallback(() => {
            loadCmsData()
          })
        : window.setTimeout(() => {
            loadCmsData()
          }, 0)

    return () => {
      if (window.cancelIdleCallback && typeof loadTask === 'number') {
        window.cancelIdleCallback(loadTask)
        return
      }

      window.clearTimeout(loadTask)
    }

  }, [loadCmsData])

  /*
  =========================================
  WEBSITE
  =========================================
  */
  return (

    <div className="animate-fadeIn">

      <SEO
        {...pageSeo.home}
        canonicalPath="/"
        preloadImages={[heroSlides[0]?.image]}
        structuredData={[
          organizationSchema('/'),
          jewelryStoreSchema('/'),
          websiteSchema(),
          breadcrumbSchema([
            {
              name: 'Home',
              path: '/',
            },
          ]),
        ]}
      />

      {/* HERO */}
      <HeroSection
        slides={heroData}
      />

      {/* COLLECTIONS */}
      <CategorySection
        cards={
          collectionsData
        }
      />

      {/* PRODUCTS */}
      <ProductSection
        products={
          homeFeaturedProducts
        }
      />

      {/* ABOUT */}
      <BrandStorySection
        story={aboutData}
      />

      {/* TESTIMONIALS */}
      <TestimonialsSection
        testimonials={
          testimonials
        }
      />

      {/* CTA */}
      <FinalCtaSection
        banners={ctaData}
      />

    </div>
  )
}

export default HomePage
