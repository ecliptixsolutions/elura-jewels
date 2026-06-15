import {
  doc,
  getDoc,
  onSnapshot,
  serverTimestamp,
  setDoc,
  writeBatch,
} from 'firebase/firestore'

import { db, hasFirebaseConfig } from './firebase.js'

const CMS_DOCS = {
  announcement: ['cms', 'announcementBar'],
  about: ['cms', 'about'],
  careGuide: ['cms', 'careGuide'],
  cartDrawer: ['cms', 'cartDrawer'],
  collections: ['cms', 'collections'],
  conversion: ['cms', 'conversion'],
  ctaBanners: ['cms', 'ctaBanners'],
  hero: ['cms', 'heroBanners'],
  locationTwin: ['cms', 'locationTwin'],
  newsletter: ['cms', 'newsletterPopup'],
  socialMedia: ['cms', 'socialMedia'],
}

const canUseFirestore = () => Boolean(db && hasFirebaseConfig)

const getCmsDocRef = (key) => {
  const path = CMS_DOCS[key]

  if (!path) {
    throw new Error(`Unknown CMS document: ${key}`)
  }

  if (!canUseFirestore()) {
    return null
  }

  return doc(db, ...path)
}

const getCmsDocData = async (key, fallback) => {
  const ref = getCmsDocRef(key)

  if (!ref) {
    return fallback
  }

  try {
    const snapshot = await getDoc(ref)

    return snapshot.exists() ? { ...fallback, ...snapshot.data() } : fallback
  } catch (error) {
    console.error(`Failed to load CMS document "${key}"`, error)
    return fallback
  }
}

const subscribeCmsDoc = (key, fallback, onChange, onError) => {
  let ref = null

  try {
    ref = getCmsDocRef(key)
  } catch (error) {
    onError?.(error)
    onChange(fallback)
    return () => {}
  }

  if (!ref) {
    onChange(fallback)
    return () => {}
  }

  return onSnapshot(
    ref,
    (snapshot) => {
      onChange(snapshot.exists() ? { ...fallback, ...snapshot.data() } : fallback)
    },
    (error) => {
      onError?.(error)
      onChange(fallback)
    },
  )
}

const saveCmsDoc = async (key, value) => {
  const ref = getCmsDocRef(key)

  if (!ref) {
    throw new Error('Firebase CMS is not configured.')
  }

  await setDoc(
    ref,
    {
      ...value,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  )
}

const saveCmsDocsBatch = async (entries) => {
  if (!canUseFirestore()) {
    throw new Error('Firebase CMS is not configured.')
  }

  const batch = writeBatch(db)

  entries.forEach(([key, value]) => {
    const ref = getCmsDocRef(key)

    batch.set(
      ref,
      {
        ...value,
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    )
  })

  await batch.commit()
}

export {
  canUseFirestore,
  getCmsDocData,
  saveCmsDoc,
  saveCmsDocsBatch,
  subscribeCmsDoc,
}
