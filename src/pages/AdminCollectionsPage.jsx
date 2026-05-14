import { useEffect, useState } from 'react'
import axios from 'axios'

import {
  doc,
  getDoc,
  setDoc,
} from 'firebase/firestore'

import { db } from '../lib/firebase'

const collections = [
  {
    key: 'necklaces',
    title: 'Necklace & Sets',
    size: '830 × 980',
  },
  {
    key: 'earrings',
    title: 'Earrings',
    size: '640 × 430',
  },
  {
    key: 'rings',
    title: 'Rings',
    size: '640 × 430',
  },
  {
    key: 'bangles',
    title: 'Bangles',
    size: '640 × 430',
  },
  {
    key: 'bracelets',
    title: 'Bracelets',
    size: '640 × 430',
  },
]

function AdminCollectionsPage() {
  const [loading, setLoading] =
    useState(false)

  const [items, setItems] = useState(
    collections.map((item) => ({
      ...item,
      type: 'image',
      file: null,
      preview: '',
      url: '',
    })),
  )

  useEffect(() => {
    loadCollections()
  }, [])

  const loadCollections = async () => {
    try {
      const snapshot = await getDoc(
        doc(db, 'cms', 'collections'),
      )

      if (snapshot.exists()) {
        const data = snapshot.data()

        const mergedItems =
          collections.map(
            (defaultItem, index) => ({
              ...defaultItem,
              ...(data.items?.[index] || {}),
              file: null,
              preview: '',
            }),
          )

        setItems(mergedItems)
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

  const handleFileChange = (
    index,
    file,
  ) => {
    if (!file) return

    const updated = [...items]

    updated[index].file = file

    updated[index].preview =
      URL.createObjectURL(file)

    setItems(updated)
  }

  const removeMedia = (index) => {
    const updated = [...items]

    updated[index].file = null
    updated[index].preview = ''
    updated[index].url = ''

    setItems(updated)
  }

  const saveCollections = async () => {
    try {
      setLoading(true)

      const updatedItems =
        await Promise.all(
          items.map(async (item) => {
            let mediaUrl = item.url

            if (item.file) {
              mediaUrl =
                await uploadToCloudinary(
                  item.file,
                  item.type === 'video'
                    ? 'video'
                    : 'image',
                )
            }

            return {
              key: item.key,
              title: item.title,
              size: item.size,
              type: item.type,
              url: mediaUrl,
            }
          }),
        )

      await setDoc(
        doc(db, 'cms', 'collections'),
        {
          items: updatedItems,
        },
      )

      alert(
        'Collections saved successfully.',
      )

      loadCollections()
    } catch (error) {
      console.log(error)

      alert('Failed to save collections.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="section-spacing">
      <div className="section-shell">

        <p className="section-eyebrow">
          COLLECTIONS CMS
        </p>

        <h1 className="mt-3 text-5xl">
          Collections Management
        </h1>

        <div className="mt-12 grid gap-8 lg:grid-cols-2">

          {items.map((item, index) => (
            <div
              key={item.key}
              className="rounded-[28px] border border-black/8 bg-white p-8"
            >

              <h2 className="text-3xl">
                {item.title}
              </h2>

              {/* INFO CARD */}
              <div className="mt-8 rounded-[20px] border border-black/8 bg-[#faf8f4] p-5">

                <p className="text-sm font-semibold">
                  Supported Formats
                </p>

                <p className="mt-2 text-sm text-muted">
                  PNG, JPG, JPEG, WEBP,
                  MP4
                </p>

                <p className="mt-4 text-sm font-semibold">
                  Real Section Size
                </p>

                <p className="mt-2 text-sm text-muted">
                  {item.size}
                </p>

              </div>

              {/* TYPE */}
              <div className="mt-6 flex items-center gap-8">

                <label className="flex items-center gap-2">

                  <input
                    type="radio"
                    checked={
                      item.type === 'image'
                    }
                    onChange={() => {
                      const updated = [
                        ...items,
                      ]

                      updated[index].type =
                        'image'

                      setItems(updated)
                    }}
                  />

                  Image

                </label>

                <label className="flex items-center gap-2">

                  <input
                    type="radio"
                    checked={
                      item.type === 'video'
                    }
                    onChange={() => {
                      const updated = [
                        ...items,
                      ]

                      updated[index].type =
                        'video'

                      setItems(updated)
                    }}
                  />

                  Video

                </label>

              </div>

              {/* FILE INPUT */}
              <div className="mt-6">

                <p className="mb-3 text-sm font-medium">
                  Upload Media
                </p>

                <input
                  type="file"
                  accept={
                    item.type === 'image'
                      ? 'image/*'
                      : 'video/*'
                  }
                  onChange={(e) =>
                    handleFileChange(
                      index,
                      e.target.files?.[0],
                    )
                  }
                />

              </div>

              {/* PREVIEW */}
              {(item.preview ||
                item.url) && (
                <div className="mt-8 overflow-hidden rounded-[24px] border border-black/8 bg-[#f5f1ea]">

                  <div
                    className={`overflow-hidden ${
                      index === 0
                        ? 'aspect-[5/6]'
                        : 'aspect-[3/2]'
                    }`}
                  >

                    {item.type ===
                    'image' ? (
                      <img
                        src={
                          item.preview ||
                          item.url
                        }
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <video
                        src={
                          item.preview ||
                          item.url
                        }
                        controls
                        className="h-full w-full object-cover"
                      />
                    )}

                  </div>

                </div>
              )}

              {/* BUTTONS */}
              <div className="mt-6 flex gap-4">

                <label className="cursor-pointer rounded-full border border-black/10 px-5 py-2 text-sm transition hover:bg-black hover:text-white">

                  Change Media

                  <input
                    type="file"
                    accept={
                      item.type ===
                      'image'
                        ? 'image/*'
                        : 'video/*'
                    }
                    className="hidden"
                    onChange={(e) =>
                      handleFileChange(
                        index,
                        e.target.files?.[0],
                      )
                    }
                  />

                </label>

                <button
                  type="button"
                  onClick={() =>
                    removeMedia(index)
                  }
                  className="rounded-full border border-red-200 px-5 py-2 text-sm text-red-500 transition hover:bg-red-50"
                >
                  Remove Media
                </button>

              </div>

            </div>
          ))}

        </div>

        {/* SAVE BUTTON */}
        <button
          onClick={saveCollections}
          disabled={loading}
          className="btn-primary mt-10"
        >
          {loading
            ? 'Saving...'
            : 'Save Collections'}
        </button>

      </div>
    </div>
  )
}

export default AdminCollectionsPage