import { useEffect, useState } from 'react'
import axios from 'axios'

import useUnsavedChanges from '../hooks/useUnsavedChanges.js'
import { brandStory } from '../data/siteData.js'
import { getCmsDocData, saveCmsDoc } from '../lib/cms.js'

const aboutFallback = {
  enabled: true,
  eyebrow: 'About ELURA',
  title: brandStory.title,
  body: brandStory.body,
  features: brandStory.features,
  buttonText: 'Learn More',
  buttonLink: '/about',
  type: 'image',
  url: '',
}

function AdminAboutPage() {
  const [about, setAbout] = useState(aboutFallback)
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState('')
  const [loading, setLoading] = useState(false)
  const [dirty, setDirty] = useState(false)
  const [error, setError] = useState('')

  useUnsavedChanges(dirty)

  useEffect(() => {
    getCmsDocData('about', aboutFallback).then(setAbout)
  }, [])

  const updateAbout = (field, value) => {
    setAbout((current) => ({ ...current, [field]: value }))
    setDirty(true)
  }

  const handleFile = (selected) => {
    if (!selected) return

    const isVideo = about.type === 'video'
    const validType = isVideo ? selected.type === 'video/mp4' : selected.type.startsWith('image/')
    const maximumSize = isVideo ? 25 * 1024 * 1024 : 8 * 1024 * 1024

    if (!validType || selected.size > maximumSize) {
      setError(`Select a valid ${isVideo ? 'MP4 under 25 MB' : 'image under 8 MB'}.`)
      return
    }

    setError('')
    setFile(selected)
    setPreview(URL.createObjectURL(selected))
    setDirty(true)
  }

  const uploadToCloudinary = async (selected) => {
    const formData = new FormData()
    formData.append('file', selected)
    formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET)

    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/${about.type === 'video' ? 'video' : 'image'}/upload`,
      formData,
    )

    return response.data.secure_url
  }

  const saveAbout = async () => {
    if (!about.title.trim() || !about.body.some((paragraph) => paragraph.trim())) {
      setError('About title and at least one paragraph are required.')
      return
    }

    setLoading(true)
    setError('')

    try {
      const mediaUrl = file ? await uploadToCloudinary(file) : about.url

      await saveCmsDoc('about', {
        ...about,
        title: about.title.trim(),
        body: about.body.map((item) => item.trim()).filter(Boolean),
        features: about.features.map((item) => item.trim()).filter(Boolean),
        buttonText: about.buttonText.trim(),
        buttonLink: about.buttonLink.trim(),
        url: mediaUrl,
      })

      setAbout((current) => ({ ...current, url: mediaUrl }))
      setFile(null)
      setPreview('')
      setDirty(false)
      window.alert('About section saved successfully.')
    } catch (saveError) {
      setError(saveError.message || 'Failed to save about section.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="section-spacing">
      <div className="section-shell max-w-5xl">
        <p className="section-eyebrow">About CMS</p>
        <h1 className="mt-3 text-5xl">Homepage About Section</h1>
        <p className="mt-4 max-w-3xl text-muted">
          Manage every visible About section field shown on the homepage.
        </p>

        {error ? <p className="mt-6 rounded-[8px] bg-red-50 p-4 text-sm text-red-700">{error}</p> : null}

        <div className="mt-12 grid gap-8 rounded-[8px] border border-black/8 bg-white p-8">
          <label className="flex items-center gap-3 text-sm font-medium">
            <input type="checkbox" checked={about.enabled !== false} onChange={(event) => updateAbout('enabled', event.target.checked)} />
            Show About section on homepage
          </label>

          <div className="grid gap-5 sm:grid-cols-2">
            <input value={about.eyebrow} onChange={(event) => updateAbout('eyebrow', event.target.value)} className="input-shell" placeholder="Eyebrow" />
            <input value={about.title} onChange={(event) => updateAbout('title', event.target.value)} className="input-shell" placeholder="Heading" />
          </div>

          <textarea
            value={(about.body || []).join('\n\n')}
            onChange={(event) => updateAbout('body', event.target.value.split(/\n\s*\n/))}
            className="input-shell min-h-40 resize-y"
            placeholder="Separate paragraphs with a blank line"
          />
          <textarea
            value={(about.features || []).join('\n')}
            onChange={(event) => updateAbout('features', event.target.value.split('\n'))}
            className="input-shell min-h-32 resize-y"
            placeholder="One feature per line"
          />

          <div className="grid gap-5 sm:grid-cols-2">
            <input value={about.buttonText} onChange={(event) => updateAbout('buttonText', event.target.value)} className="input-shell" placeholder="Button text" />
            <input value={about.buttonLink} onChange={(event) => updateAbout('buttonLink', event.target.value)} className="input-shell" placeholder="Button link" />
          </div>

          <div className="flex gap-6">
            {['image', 'video'].map((type) => (
              <label key={type} className="flex items-center gap-2 text-sm capitalize">
                <input type="radio" checked={about.type === type} onChange={() => updateAbout('type', type)} />
                {type}
              </label>
            ))}
          </div>

          <input type="file" accept={about.type === 'video' ? 'video/mp4' : 'image/*'} onChange={(event) => handleFile(event.target.files?.[0])} />

          {preview || about.url ? (
            about.type === 'video' ? (
              <video src={preview || about.url} controls className="aspect-video w-full rounded-[8px] object-cover" />
            ) : (
              <img src={preview || about.url} alt="About section preview" className="aspect-video w-full rounded-[8px] object-cover" />
            )
          ) : null}

          <button type="button" onClick={saveAbout} disabled={loading || !dirty} className="btn-primary justify-self-start">
            {loading ? 'Saving...' : dirty ? 'Save About Section' : 'Saved'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default AdminAboutPage
