import { useEffect, useState } from 'react'

import axios from 'axios'

import {
  doc,
  getDoc,
  setDoc,
} from 'firebase/firestore'

import { db } from '../lib/firebase'

function AdminBannersPage() {
  const [isRotational, setIsRotational] =
    useState(false)

  const [loading, setLoading] =
    useState(false)

  const [banners, setBanners] = useState([
    {
      type: 'image',
      file: null,
      preview: '',
      url: '',
    },
  ])

  useEffect(() => {
    loadBanners()
  }, [])

  const loadBanners = async () => {
    try {
      const snapshot = await getDoc(
        doc(db, 'heroBanners', 'homepageHero'),
      )

      if (snapshot.exists()) {
        const data = snapshot.data()

        setIsRotational(
          data.rotational || false,
        )

        setBanners(data.banners || [])
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleTypeChange = (
    index,
    type,
  ) => {
    const updated = [...banners]

    updated[index].type = type

    setBanners(updated)
  }

  const handleFileChange = (
    index,
    file,
  ) => {
    if (!file) return

    const updated = [...banners]

    updated[index].file = file

    updated[index].preview =
      URL.createObjectURL(file)

    setBanners(updated)
  }

  const addBanner = () => {
    if (banners.length >= 5) return

    setBanners([
      ...banners,
      {
        type: 'image',
        file: null,
        preview: '',
        url: '',
      },
    ])
  }

  const removeBanner = (index) => {
    const updated = banners.filter(
      (_, i) => i !== index,
    )

    setBanners(updated)
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

  const saveBanners = async () => {
    try {
      setLoading(true)

      const uploadedBanners = []

      for (const banner of banners) {
        let mediaUrl = banner.url

        if (banner.file) {
          mediaUrl =
            await uploadToCloudinary(
              banner.file,
              banner.type === 'video'
                ? 'video'
                : 'image',
            )
        }

        uploadedBanners.push({
          type: banner.type,
          url: mediaUrl,
        })
      }

      await setDoc(
        doc(
          db,
          'heroBanners',
          'homepageHero',
        ),
        {
          rotational: isRotational,
          banners: uploadedBanners,
        },
      )

      alert(
        'Hero banners saved successfully.',
      )
    } catch (error) {
      console.log(error)

      alert('Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="section-spacing">
      <div className="section-shell">

        <p className="section-eyebrow">
          HOMEPAGE CMS
        </p>

        <h1 className="mt-3 text-5xl">
          Hero Banner Management
        </h1>

        <p className="mt-4 max-w-3xl text-muted">
          Upload luxury homepage hero
          banners, cinematic visuals,
          responsive imagery, motion
          videos, and rotational slides.
        </p>

        <div className="mt-12 rounded-[28px] border border-black/8 bg-white p-8">

          {/* TOGGLE */}
          <label className="flex items-center gap-3">

            <input
              type="checkbox"
              checked={isRotational}
              onChange={(event) =>
                setIsRotational(
                  event.target.checked,
                )
              }
            />

            <span className="text-sm font-medium">
              Enable Rotational Hero
              Banner
            </span>

          </label>

          {/* BANNERS */}
          <div className="mt-10 space-y-8">

            {banners.map(
              (banner, index) => (
                <div
                  key={index}
                  className="rounded-[24px] border border-black/8 p-8"
                >

                  <div className="flex items-center justify-between">

                    <h2 className="text-2xl">
                      Hero Banner{' '}
                      {index + 1}
                    </h2>

                    {banners.length >
                      1 && (
                      <button
                        onClick={() =>
                          removeBanner(
                            index,
                          )
                        }
                        className="text-sm text-red-500"
                      >
                        Remove
                      </button>
                    )}

                  </div>

                  {/* TYPE */}
                  <div className="mt-6 flex gap-8">

                    <label className="flex items-center gap-2">

                      <input
                        type="radio"
                        checked={
                          banner.type ===
                          'image'
                        }
                        onChange={() =>
                          handleTypeChange(
                            index,
                            'image',
                          )
                        }
                      />

                      <span className="text-sm">
                        Image
                      </span>

                    </label>

                    <label className="flex items-center gap-2">

                      <input
                        type="radio"
                        checked={
                          banner.type ===
                          'video'
                        }
                        onChange={() =>
                          handleTypeChange(
                            index,
                            'video',
                          )
                        }
                      />

                      <span className="text-sm">
                        Video
                      </span>

                    </label>

                  </div>

                  {/* NOTE CARD */}
                  <div className="mt-8 rounded-[18px] border border-black/8 bg-[#faf8f4] p-4">

                    <p className="text-sm font-semibold">
                      Supported Formats
                    </p>

                    <p className="mt-2 text-sm text-muted">
                      PNG, JPG, JPEG,
                      WEBP, MP4
                    </p>

                    <p className="mt-4 text-sm font-semibold">
                      Recommended Sizes
                    </p>

                    <div className="mt-2 space-y-1 text-sm text-muted">

                      <p>
                        Desktop:
                        1920 × 1080
                      </p>

                      <p>
                        Tablet:
                        1400 × 1200
                      </p>

                      <p>
                        Mobile:
                        1080 × 1350
                      </p>

                    </div>

                  </div>

                  {/* FILE */}
                  <div className="mt-6">

                    <p className="text-sm font-medium">
                      Upload Banner{' '}
                      {
                        banner.type
                      }
                    </p>

                    <input
                      type="file"
                      accept={
                        banner.type ===
                        'image'
                          ? 'image/png,image/jpeg,image/jpg,image/webp'
                          : 'video/mp4'
                      }
                      className="mt-4"
                      onChange={(e) =>
                        handleFileChange(
                          index,
                          e.target
                            .files[0],
                        )
                      }
                    />

                  </div>

                  {/* LIVE PREVIEW */}
                  {(banner.preview ||
                    banner.url) && (
                    <div className="mt-8 overflow-hidden rounded-[24px] border border-black/8 bg-[#f4efe7]">

                      <div className="relative aspect-[16/9] overflow-hidden">

                        {banner.type ===
                        'image' ? (
                          <img
                            src={
                              banner.preview ||
                              banner.url
                            }
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <video
                            src={
                              banner.preview ||
                              banner.url
                            }
                            controls
                            className="h-full w-full object-cover"
                          />
                        )}

                      </div>

                    </div>
                  )}

                </div>
              ),
            )}

          </div>

          {/* ADD */}
          {isRotational &&
            banners.length < 5 && (
              <button
                onClick={addBanner}
                className="mt-8 rounded-full border border-black/10 px-6 py-3 text-sm"
              >
                Add Banner
              </button>
            )}

          {/* SAVE */}
          <button
            onClick={saveBanners}
            disabled={loading}
            className="btn-primary mt-10"
          >
            {loading
              ? 'Saving...'
              : 'Save Hero Banners'}
          </button>

        </div>

      </div>
    </div>
  )
}

export default AdminBannersPage