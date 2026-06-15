import { useEffect, useState } from 'react'
import axios from 'axios'

import useUnsavedChanges from '../hooks/useUnsavedChanges.js'
import { saveCmsDoc, subscribeCmsDoc } from '../lib/cms.js'

const emptyBanner = {
  type: 'image',
  file: null,
  preview: '',
  url: '',
  heading: '',
  description: '',
  buttonText: '',
  buttonLink: '',
  label: '',
  overlayStrength: 28,
  textAlignment: 'left',
}

const heroFallback = {
  rotational: true,
  banners: [emptyBanner],
}

function AdminBannersPage() {
  const [isRotational, setIsRotational] = useState(true)
  const [loading, setLoading] = useState(false)
  const [banners, setBanners] = useState([emptyBanner])
  const [dirty, setDirty] = useState(false)
  const [error, setError] = useState('')

  useUnsavedChanges(dirty)

  useEffect(() => {
    const unsubscribe = subscribeCmsDoc(
      'hero',
      heroFallback,
      (data) => {
        setIsRotational(Boolean(data.rotational))
        setBanners(
          data.banners?.length
            ? data.banners.map((banner) => ({
                ...emptyBanner,
                ...banner,
                file: null,
                preview: '',
              }))
            : [emptyBanner],
        )
      },
    )

    return unsubscribe
  }, [])

  const updateBanner = (index, field, value) => {
    setDirty(true)
    setBanners((current) =>
      current.map((banner, bannerIndex) =>
        bannerIndex === index ? { ...banner, [field]: value } : banner,
      ),
    )
  }

  const handleFileChange = (index, file) => {
    if (!file) return
    const isVideo = banners[index].type === 'video'
    const validType = isVideo ? file.type === 'video/mp4' : file.type.startsWith('image/')
    const maximumSize = isVideo ? 25 * 1024 * 1024 : 8 * 1024 * 1024

    if (!validType || file.size > maximumSize) {
      setError(`Select a valid ${isVideo ? 'MP4 under 25 MB' : 'image under 8 MB'}.`)
      return
    }

    setError('')
    updateBanner(index, 'file', file)
    updateBanner(index, 'preview', URL.createObjectURL(file))
  }

  const addBanner = () => {
    setDirty(true)
    setBanners((current) => (current.length >= 5 ? current : [...current, { ...emptyBanner }]))
  }

  const removeBanner = (index) => {
    if (!window.confirm(`Remove Hero Slide ${index + 1}?`)) return

    setDirty(true)
    setBanners((current) => current.filter((_, bannerIndex) => bannerIndex !== index))
  }

  const uploadToCloudinary = async (file, resourceType = 'image') => {
    const formData = new FormData()

    formData.append('file', file)
    formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET)

    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`,
      formData,
    )

    return response.data.secure_url
  }

  const saveBanners = async () => {
    const invalidBanner = banners.some(
      (banner) =>
        (!banner.url && !banner.file) ||
        !banner.heading.trim() ||
        Boolean(banner.buttonText.trim()) !== Boolean(banner.buttonLink.trim()),
    )

    if (invalidBanner) {
      setError('Every slide needs media and a headline. Button text and button link must be provided together.')
      return
    }

    setLoading(true)
    setError('')

    try {
      const uploadedBanners = []

      for (const banner of banners) {
        let mediaUrl = banner.url

        if (banner.file) {
          mediaUrl = await uploadToCloudinary(
            banner.file,
            banner.type === 'video' ? 'video' : 'image',
          )
        }

        if (mediaUrl) {
          uploadedBanners.push({
            type: banner.type,
            url: mediaUrl,
            heading: banner.heading.trim(),
            description: banner.description.trim(),
            buttonText: banner.buttonText.trim(),
            buttonLink: banner.buttonLink.trim(),
            label: banner.label.trim(),
            overlayStrength: Number(banner.overlayStrength || 28),
            textAlignment: banner.textAlignment,
          })
        }
      }

      await saveCmsDoc('hero', {
        rotational: isRotational,
        banners: uploadedBanners,
      })

      setDirty(false)
      window.alert('Hero banners saved successfully.')
    } catch (error) {
      window.alert(error.message || 'Failed to save hero banners.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="section-spacing">
      <div className="section-shell">
        <p className="section-eyebrow">Homepage CMS</p>
        <h1 className="mt-3 text-5xl">Hero Banner Management</h1>
        <p className="mt-4 max-w-3xl text-muted">
          Manage homepage hero media, text, calls to action, overlay strength, and slide alignment.
        </p>
        {error ? <p className="mt-6 rounded-[8px] bg-red-50 p-4 text-sm text-red-700">{error}</p> : null}

        <div className="mt-12 rounded-[8px] border border-black/8 bg-white p-8">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={isRotational}
              onChange={(event) => {
                setIsRotational(event.target.checked)
                setDirty(true)
              }}
            />
            <span className="text-sm font-medium">Enable rotational hero banner</span>
          </label>

          <div className="mt-10 space-y-8">
            {banners.map((banner, index) => (
              <div key={`hero-${index}`} className="rounded-[8px] border border-black/8 p-6">
                <div className="flex items-center justify-between gap-4">
                  <h2 className="text-2xl">Hero Slide {index + 1}</h2>
                  {banners.length > 1 ? (
                    <button type="button" onClick={() => removeBanner(index)} className="text-sm text-red-600">
                      Remove
                    </button>
                  ) : null}
                </div>

                <div className="mt-6 grid gap-6 lg:grid-cols-2">
                  <div className="space-y-5">
                    <div className="flex gap-6">
                      {['image', 'video'].map((type) => (
                        <label key={type} className="flex items-center gap-2 text-sm capitalize">
                          <input
                            type="radio"
                            checked={banner.type === type}
                            onChange={() => updateBanner(index, 'type', type)}
                          />
                          {type}
                        </label>
                      ))}
                    </div>

                    <input
                      type="file"
                      accept={banner.type === 'image' ? 'image/png,image/jpeg,image/jpg,image/webp' : 'video/mp4'}
                      onChange={(event) => handleFileChange(index, event.target.files?.[0])}
                    />

                    {(banner.preview || banner.url) ? (
                      <div className="overflow-hidden rounded-[8px] bg-linen">
                        {banner.type === 'image' ? (
                          <img
                            src={banner.preview || banner.url}
                            alt=""
                            className="aspect-video w-full object-cover"
                          />
                        ) : (
                          <video
                            src={banner.preview || banner.url}
                            controls
                            className="aspect-video w-full object-cover"
                          />
                        )}
                      </div>
                    ) : null}
                  </div>

                  <div className="grid gap-5">
                    <input value={banner.label} onChange={(event) => updateBanner(index, 'label', event.target.value)} className="input-shell" placeholder="Slide label" />
                    <input value={banner.heading} onChange={(event) => updateBanner(index, 'heading', event.target.value)} className="input-shell" placeholder="Headline" />
                    <textarea value={banner.description} onChange={(event) => updateBanner(index, 'description', event.target.value)} className="input-shell min-h-24 resize-none" placeholder="Description" />
                    <div className="grid gap-5 sm:grid-cols-2">
                      <input value={banner.buttonText} onChange={(event) => updateBanner(index, 'buttonText', event.target.value)} className="input-shell" placeholder="Button text" />
                      <input value={banner.buttonLink} onChange={(event) => updateBanner(index, 'buttonLink', event.target.value)} className="input-shell" placeholder="Button link" />
                    </div>
                    <div className="grid gap-5 sm:grid-cols-2">
                      <label className="text-sm text-muted">
                        Overlay strength
                        <input
                          type="range"
                          min="0"
                          max="80"
                          value={banner.overlayStrength}
                          onChange={(event) => updateBanner(index, 'overlayStrength', event.target.value)}
                          className="mt-3 w-full"
                        />
                      </label>
                      <select value={banner.textAlignment} onChange={(event) => updateBanner(index, 'textAlignment', event.target.value)} className="input-shell">
                        <option value="left">Left</option>
                        <option value="center">Center</option>
                        <option value="right">Right</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {isRotational && banners.length < 5 ? (
            <button type="button" onClick={addBanner} className="btn-secondary mt-8">
              Add Slide
            </button>
          ) : null}

          <button type="button" onClick={saveBanners} disabled={loading || !dirty} className="btn-primary mt-8">
            {loading ? 'Saving...' : dirty ? 'Save Hero Banners' : 'Saved'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default AdminBannersPage
