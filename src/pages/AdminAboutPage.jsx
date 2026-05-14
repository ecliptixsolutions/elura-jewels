import { useEffect, useState } from 'react'
import axios from 'axios'

import {
  doc,
  getDoc,
  setDoc,
} from 'firebase/firestore'

import { db } from '../lib/firebase'

function AdminAboutPage() {
  const [loading, setLoading] = useState(false)

  const [mediaType, setMediaType] =
    useState('image')

  const [file, setFile] = useState(null)

  const [preview, setPreview] =
    useState('')

  const [url, setUrl] = useState('')

  useEffect(() => {
    loadAbout()
  }, [])

  const loadAbout = async () => {
    try {
      const snapshot = await getDoc(
        doc(db, 'cms', 'about'),
      )

      if (snapshot.exists()) {
        const data = snapshot.data()

        setMediaType(data.type)
        setUrl(data.url)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const uploadToCloudinary = async (
    file,
    resourceType = 'image',
  ) => {
    const formData = new FormData()

    formData.append('file', file)

    formData.append(
      'upload_preset',
      import.meta.env
        .VITE_CLOUDINARY_UPLOAD_PRESET,
    )

    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${
        import.meta.env
          .VITE_CLOUDINARY_CLOUD_NAME
      }/${resourceType}/upload`,
      formData,
    )

    return response.data.secure_url
  }

  const saveAbout = async () => {
    try {
      setLoading(true)

      let mediaUrl = url

      if (file) {
        mediaUrl =
          await uploadToCloudinary(
            file,
            mediaType === 'video'
              ? 'video'
              : 'image',
          )
      }

      await setDoc(doc(db, 'cms', 'about'), {
        type: mediaType,
        url: mediaUrl,
      })

      alert('About section saved.')
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="section-spacing">
      <div className="section-shell">

        <p className="section-eyebrow">
          ABOUT CMS
        </p>

        <h1 className="mt-3 text-5xl">
          About ELURA Management
        </h1>

        <div className="mt-12 rounded-[28px] border border-black/8 bg-white p-8">

          <div className="rounded-[20px] border border-black/8 bg-[#faf8f4] p-5">

            <p className="text-sm font-semibold">
              Supported Formats
            </p>

            <p className="mt-2 text-sm text-muted">
              PNG, JPG, JPEG, WEBP, MP4
            </p>

            <p className="mt-4 text-sm font-semibold">
              Real Section Size
            </p>

            <p className="mt-2 text-sm text-muted">
              1100 × 700
            </p>

          </div>

          <div className="mt-6 flex items-center gap-8">

            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={mediaType === 'image'}
                onChange={() =>
                  setMediaType('image')
                }
              />

              Image
            </label>

            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={mediaType === 'video'}
                onChange={() =>
                  setMediaType('video')
                }
              />

              Video
            </label>

          </div>

          <input
            type="file"
            accept={
              mediaType === 'image'
                ? 'image/*'
                : 'video/*'
            }
            className="mt-6"
            onChange={(e) => {
              const selected =
                e.target.files[0]

              setFile(selected)

              setPreview(
                URL.createObjectURL(selected),
              )
            }}
          />

          {(preview || url) && (
            <div className="mt-8 overflow-hidden rounded-[28px] border border-black/8 bg-[#f5f1ea]">

              <div className="aspect-[11/7] overflow-hidden">

                {mediaType === 'image' ? (
                  <img
                    src={preview || url}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <video
                    src={preview || url}
                    controls
                    className="h-full w-full object-cover"
                  />
                )}

              </div>

            </div>
          )}

          <button
            onClick={saveAbout}
            disabled={loading}
            className="btn-primary mt-8"
          >
            {loading
              ? 'Saving...'
              : 'Save About Section'}
          </button>

        </div>

      </div>
    </div>
  )
}

export default AdminAboutPage