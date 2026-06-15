import { useEffect, useState } from 'react'
import axios from 'axios'

import useUnsavedChanges from '../hooks/useUnsavedChanges.js'
import { getCmsDocData, saveCmsDoc } from '../lib/cms.js'

function AdminCTAPage() {
  const [rotationEnabled, setRotationEnabled] =
    useState(false)

  const [loading, setLoading] =
    useState(false)

  const [banners, setBanners] = useState([
    {
      type: 'image',

      file: null,

      preview: '',

      url: '',

      label: '',

      heading: '',

      subtext: '',

      ctaLabel: '',

      ctaHref: '',
    },
  ])
  const [dirty, setDirty] = useState(false)
  const [error, setError] = useState('')

  useUnsavedChanges(dirty)

  useEffect(() => {
    loadCTA()
  }, [])

  const loadCTA = async () => {
    try {
      const data = await getCmsDocData('ctaBanners', null)

      if (data) {
        setRotationEnabled(
          data.rotationEnabled || false,
        )

        if (
          data?.banners?.length
        ) {
          setBanners(data.banners)
        }
      }
    } catch (error) {
      window.alert(error.message || 'Failed to load CTA settings.')
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

    const isVideo = banners[index].type === 'video'
    const validType = isVideo ? file.type === 'video/mp4' : file.type.startsWith('image/')
    const maximumSize = isVideo ? 25 * 1024 * 1024 : 8 * 1024 * 1024

    if (!validType || file.size > maximumSize) {
      setError(`Select a valid ${isVideo ? 'MP4 under 25 MB' : 'image under 8 MB'}.`)
      return
    }

    setDirty(true)
    setError('')
    const updated = [...banners]

    updated[index].file = file

    updated[index].preview =
      URL.createObjectURL(file)

    setBanners(updated)
  }

  const handleInputChange = (
    index,
    field,
    value,
  ) => {
    setDirty(true)
    const updated = [...banners]

    updated[index][field] =
      value

    setBanners(updated)
  }

  const addBanner = () => {
    if (banners.length >= 4) {
      alert(
        'Maximum 4 CTA banners allowed.',
      )

      return
    }

    setDirty(true)
    setBanners([
      ...banners,

      {
        type: 'image',

        file: null,

        preview: '',

        url: '',

        label: '',

        heading: '',

        subtext: '',

        ctaLabel: '',

        ctaHref: '',
      },
    ])
  }

  const removeBanner = (
    index,
  ) => {
    if (!window.confirm(`Remove CTA Banner ${index + 1}?`)) return

    setDirty(true)
    const updated =
      banners.filter(
        (_, i) =>
          i !== index,
      )

    setBanners(updated)
  }

  const saveCTA = async () => {
    const invalidBanner = banners.some(
      (banner) =>
        (!banner.url && !banner.file) ||
        !banner.heading.trim() ||
        Boolean(banner.ctaLabel.trim()) !== Boolean(banner.ctaHref.trim()),
    )

    if (invalidBanner) {
      setError('Every CTA banner needs media and a heading. Button text and link must be provided together.')
      return
    }

    try {
      setLoading(true)
      setError('')

      const updated = []

      for (const banner of banners) {
        let mediaUrl =
          banner.url

        if (banner.file) {
          mediaUrl =
            await uploadToCloudinary(
              banner.file,
              banner.type ===
                'video'
                ? 'video'
                : 'image',
            )
        }

        updated.push({
          type:
            banner.type,

          url: mediaUrl,

          label:
            banner.label,

          heading:
            banner.heading,

          subtext:
            banner.subtext,

          ctaLabel:
            banner.ctaLabel,

          ctaHref:
            banner.ctaHref,
        })
      }

      await saveCmsDoc('ctaBanners', {
        rotationEnabled,

        banners: updated,
      })

      setDirty(false)
      alert(
        'CTA Banners saved successfully.',
      )
    } catch {
      window.alert('Failed to save CTA settings.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="section-spacing">
      <div className="section-shell">

        <p className="section-eyebrow">
          CTA CMS
        </p>

        <h1 className="mt-3 text-5xl">
          CTA Banner Management
        </h1>
        {error ? <p className="mt-6 rounded-[8px] bg-red-50 p-4 text-sm text-red-700">{error}</p> : null}

        <div className="mt-12 rounded-[28px] border border-black/8 bg-white p-8">

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={
                rotationEnabled
              }
              onChange={(e) =>
                {
                  setRotationEnabled(e.target.checked)
                  setDirty(true)
                }
              }
            />

            Enable Rotational CTA Banner
          </label>

          <div className="mt-10 space-y-8">

            {banners.map(
              (
                banner,
                index,
              ) => (
                <div
                  key={index}
                  className="rounded-[24px] border border-black/8 p-8"
                >

                  <div className="flex items-center justify-between">

                    <h2 className="text-2xl">
                      CTA Banner{' '}
                      {index + 1}
                    </h2>

                    {banners.length >
                      1 && (
                      <button
                        type="button"
                        onClick={() =>
                          removeBanner(
                            index,
                          )
                        }
                        className="rounded-full border border-red-200 px-5 py-2 text-sm text-red-500"
                      >
                        Remove
                      </button>
                    )}

                  </div>

                  <div className="mt-8 rounded-[20px] border border-black/8 bg-[#faf8f4] p-5">

                    <p className="text-sm font-semibold">
                      Real Section
                      Size
                    </p>

                    <p className="mt-2 text-sm text-muted">
                      1400 × 520
                    </p>

                    <p className="mt-5 text-sm font-semibold">
                      Layout
                    </p>

                    <p className="mt-2 text-sm text-muted">
                      Left Side →
                      Text
                    </p>

                    <p className="text-sm text-muted">
                      Right Side →
                      Image
                    </p>

                  </div>

                  <div className="mt-8 grid gap-5 md:grid-cols-2">

                    <div>
                      <p className="text-sm font-medium">
                        Small Label
                      </p>

                      <input
                        type="text"
                        value={
                          banner.label
                        }
                        onChange={(
                          e,
                        ) =>
                          handleInputChange(
                            index,
                            'label',
                            e.target
                              .value,
                          )
                        }
                        className="mt-2 w-full rounded-[14px] border border-black/10 px-4 py-3 outline-none"
                        placeholder="EVERYDAY LUXURY"
                      />
                    </div>

                    <div>
                      <p className="text-sm font-medium">
                        Button Text
                      </p>

                      <input
                        type="text"
                        value={
                          banner.ctaLabel
                        }
                        onChange={(
                          e,
                        ) =>
                          handleInputChange(
                            index,
                            'ctaLabel',
                            e.target
                              .value,
                          )
                        }
                        className="mt-2 w-full rounded-[14px] border border-black/10 px-4 py-3 outline-none"
                        placeholder="Example: Shop Now / Explore Collection / Discover More"
                      />

                      <p className="mt-2 text-xs text-muted">
                        You can write any button text here.
                      </p>
                    </div>

                  </div>

                  <div className="mt-5">
                    <p className="text-sm font-medium">
                      Main Heading
                    </p>

                    <textarea
                      rows="3"
                      value={
                        banner.heading
                      }
                      onChange={(
                        e,
                      ) =>
                        handleInputChange(
                          index,
                          'heading',
                          e.target
                            .value,
                        )
                      }
                      className="mt-2 w-full rounded-[14px] border border-black/10 px-4 py-4 outline-none"
                      placeholder="Pieces to wear often and keep close"
                    />
                  </div>

                  <div className="mt-5">
                    <p className="text-sm font-medium">
                      Small
                      Paragraph
                    </p>

                    <textarea
                      rows="3"
                      value={
                        banner.subtext
                      }
                      onChange={(
                        e,
                      ) =>
                        handleInputChange(
                          index,
                          'subtext',
                          e.target
                            .value,
                        )
                      }
                      className="mt-2 w-full rounded-[14px] border border-black/10 px-4 py-4 outline-none"
                      placeholder="A clean versatile jewellery collection."
                    />
                  </div>

                  <div className="mt-5">
                    <p className="text-sm font-medium">
                      Button Link
                    </p>

                    <input
                      type="text"
                      value={
                        banner.ctaHref
                      }
                      onChange={(
                        e,
                      ) =>
                        handleInputChange(
                          index,
                          'ctaHref',
                          e.target
                            .value,
                        )
                      }
                      className="mt-2 w-full rounded-[14px] border border-black/10 px-4 py-3 outline-none"
                      placeholder="/shop"
                    />
                  </div>

                  <div className="mt-8 flex items-center gap-8">

                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        checked={
                          banner.type ===
                          'image'
                        }
                        onChange={() => {
                          const updated =
                            [
                              ...banners,
                            ]

                          updated[
                            index
                          ].type =
                            'image'

                          setBanners(
                            updated,
                          )
                        }}
                      />

                      Image
                    </label>

                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        checked={
                          banner.type ===
                          'video'
                        }
                        onChange={() => {
                          const updated =
                            [
                              ...banners,
                            ]

                          updated[
                            index
                          ].type =
                            'video'

                          setBanners(
                            updated,
                          )
                        }}
                      />

                      Video
                    </label>

                  </div>

                  <input
                    type="file"
                    accept={
                      banner.type ===
                      'image'
                        ? 'image/*'
                        : 'video/*'
                    }
                    className="mt-6"
                    onChange={(e) =>
                      handleFileChange(
                        index,
                        e.target
                          .files[0],
                      )
                    }
                  />

                  {(banner.preview ||
                    banner.url) && (
                    <div className="mt-8 overflow-hidden rounded-[28px] border border-black/8 bg-[#f5f1ea]">

                      <div className="aspect-[21/8] overflow-hidden">

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

          <div className="mt-10 flex flex-wrap gap-4">

            <button
              type="button"
              onClick={
                addBanner
              }
              className="rounded-full border border-black/10 px-6 py-3"
            >
              Add Banner
            </button>

            <button
              onClick={saveCTA}
              disabled={loading || !dirty}
              className="btn-primary"
            >
              {loading
                ? 'Saving...'
                : dirty ? 'Save CTA Banners' : 'Saved'}
            </button>

          </div>

        </div>

      </div>
    </div>
  )
}

export default AdminCTAPage
