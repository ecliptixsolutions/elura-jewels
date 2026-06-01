import {
  doc,
  onSnapshot,
  serverTimestamp,
  setDoc,
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

const subscribeCmsDoc = (key, fallback, onChange, onError) => {
  const ref = getCmsDocRef(key)

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

export {
  canUseFirestore,
  saveCmsDoc,
  subscribeCmsDoc,
}
