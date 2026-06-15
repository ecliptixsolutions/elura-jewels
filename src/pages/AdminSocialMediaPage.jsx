import { useEffect, useMemo, useState } from 'react'
import { ArrowDown, ArrowUp, Pencil, Plus, Save, Trash2 } from 'lucide-react'

import { SocialPlatformIcon } from '../components/SocialPlatformIcon.jsx'
import { saveCmsDoc, subscribeCmsDoc } from '../lib/cms.js'
import { normalizeSocialPlatform, socialPlatforms } from '../lib/socialPlatforms.js'

const socialMediaFallback = {
  items: [],
}

const emptyForm = {
  platform: '',
  url: '',
  enabled: true,
}

const createId = () => `social-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

function AdminSocialMediaPage() {
  const [items, setItems] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const unsubscribe = subscribeCmsDoc(
      'socialMedia',
      socialMediaFallback,
      (value) => {
        setItems(
          (value.items || [])
            .map((item, index) => ({
              id: item.id || createId(),
              platform: item.platform || '',
              url: item.url || '',
              enabled: item.enabled !== false,
              order: Number.isFinite(Number(item.order)) ? Number(item.order) : index,
            }))
            .sort((a, b) => a.order - b.order),
        )
      },
    )

    return unsubscribe
  }, [])

  const duplicatePlatforms = useMemo(() => {
    const seen = new Set()
    const duplicates = new Set()

    items.forEach((item) => {
      const key = normalizeSocialPlatform(item.platform)

      if (!key) return

      if (seen.has(key)) {
        duplicates.add(key)
      }

      seen.add(key)
    })

    return duplicates
  }, [items])

  const orderedItems = useMemo(
    () => [...items].sort((a, b) => a.order - b.order),
    [items],
  )

  const resetForm = () => {
    setForm(emptyForm)
    setEditingId('')
    setError('')
  }

  const validateItem = (candidate) => {
    if (!candidate.platform) {
      return 'Platform is required.'
    }

    if (!candidate.url.trim()) {
      return 'URL is required.'
    }

    const platformKey = normalizeSocialPlatform(candidate.platform)
    const hasDuplicate = items.some((item) => item.id !== editingId && normalizeSocialPlatform(item.platform) === platformKey)

    if (hasDuplicate) {
      return 'Duplicate platform entries are not allowed.'
    }

    return ''
  }

  const submitForm = (event) => {
    event.preventDefault()

    const candidate = {
      ...form,
      url: form.url.trim(),
    }
    const validationMessage = validateItem(candidate)

    if (validationMessage) {
      setError(validationMessage)
      return
    }

    if (editingId) {
      setItems((current) =>
        current.map((item) =>
          item.id === editingId
            ? {
                ...item,
                ...candidate,
              }
            : item,
        ),
      )
    } else {
      setItems((current) => [
        ...current,
        {
          id: createId(),
          ...candidate,
          order: current.length,
        },
      ])
    }

    resetForm()
  }

  const editItem = (item) => {
    setForm({
      platform: item.platform,
      url: item.url,
      enabled: item.enabled !== false,
    })
    setEditingId(item.id)
    setError('')
  }

  const deleteItem = (id) => {
    const item = items.find((entry) => entry.id === id)

    if (!window.confirm(`Delete ${item?.platform || 'this social link'}?`)) return

    setItems((current) =>
      current
        .filter((item) => item.id !== id)
        .map((item, index) => ({
          ...item,
          order: index,
        })),
    )

    if (editingId === id) {
      resetForm()
    }
  }

  const toggleItem = (id) => {
    setItems((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              enabled: !item.enabled,
            }
          : item,
      ),
    )
  }

  const moveItem = (id, direction) => {
    setItems((current) => {
      const next = [...current].sort((a, b) => a.order - b.order)
      const index = next.findIndex((item) => item.id === id)
      const targetIndex = index + direction

      if (index < 0 || targetIndex < 0 || targetIndex >= next.length) {
        return current
      }

      const [item] = next.splice(index, 1)
      next.splice(targetIndex, 0, item)

      return next.map((entry, order) => ({
        ...entry,
        order,
      }))
    })
  }

  const saveSocialMedia = async () => {
    const hasMissingFields = items.some((item) => !item.platform || !item.url.trim())

    if (hasMissingFields) {
      setError('Every social link needs a platform and URL before saving.')
      return
    }

    if (duplicatePlatforms.size) {
      setError('Duplicate platform entries are not allowed.')
      return
    }

    setLoading(true)
    setError('')

    try {
      await saveCmsDoc('socialMedia', {
        items: orderedItems
          .map((item, order) => ({
            id: item.id,
            platform: item.platform,
            url: item.url.trim(),
            enabled: Boolean(item.enabled),
            order,
          })),
      })

      window.alert('Social media links saved successfully.')
    } catch (saveError) {
      setError(saveError.message || 'Failed to save social media links.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="section-spacing">
      <div className="section-shell">
        <p className="section-eyebrow">Social Media CMS</p>
        <h1 className="mt-3 text-5xl">Social Media</h1>
        <p className="mt-4 max-w-3xl text-muted">
          Manage footer social links. Icons render automatically from the selected platform.
        </p>

        <div className="mt-12 grid gap-8 xl:grid-cols-[0.85fr_1.15fr]">
          <form onSubmit={submitForm} className="rounded-[8px] border border-black/8 bg-white p-8">
            <h2 className="text-3xl">{editingId ? 'Edit Platform' : 'Add Platform'}</h2>

            <div className="mt-6 grid gap-5">
              <label className="text-sm text-muted">
                Platform
                <select
                  value={form.platform}
                  onChange={(event) => setForm((current) => ({ ...current, platform: event.target.value }))}
                  className="input-shell mt-2"
                  required
                >
                  <option value="">Select platform</option>
                  {socialPlatforms.map((platform) => (
                    <option key={platform} value={platform}>
                      {platform}
                    </option>
                  ))}
                </select>
              </label>

              <label className="text-sm text-muted">
                URL
                <input
                  value={form.url}
                  onChange={(event) => setForm((current) => ({ ...current, url: event.target.value }))}
                  className="input-shell mt-2"
                  placeholder="https://"
                  required
                />
              </label>

              <label className="flex items-center gap-3 text-sm font-medium">
                <input
                  type="checkbox"
                  checked={Boolean(form.enabled)}
                  onChange={(event) => setForm((current) => ({ ...current, enabled: event.target.checked }))}
                />
                Enabled
              </label>
            </div>

            {error ? <p className="mt-5 text-sm text-red-600">{error}</p> : null}

            <div className="mt-8 flex flex-wrap gap-3">
              <button type="submit" className="btn-primary gap-2">
                <Plus className="h-4 w-4" />
                {editingId ? 'Update Platform' : 'Add Platform'}
              </button>
              {editingId ? (
                <button type="button" onClick={resetForm} className="btn-secondary">
                  Cancel
                </button>
              ) : null}
            </div>
          </form>

          <section className="rounded-[8px] border border-black/8 bg-white p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="section-eyebrow">Footer Links</p>
                <h2 className="mt-3 text-3xl">Platform Order</h2>
              </div>
              <button type="button" onClick={saveSocialMedia} disabled={loading} className="btn-primary gap-2">
                <Save className="h-4 w-4" />
                {loading ? 'Saving...' : 'Save'}
              </button>
            </div>

            <div className="mt-8 grid gap-4">
              {items.length ? (
                orderedItems.map((item, index) => (
                    <article
                      key={item.id}
                      className="grid gap-4 rounded-[8px] border border-black/8 p-4 sm:grid-cols-[1fr_auto] sm:items-center"
                    >
                      <div className="flex min-w-0 items-center gap-4">
                        <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-linen text-ink">
                          <SocialPlatformIcon platform={item.platform} />
                        </span>
                        <div className="min-w-0">
                          <h3 className="text-xl">{item.platform}</h3>
                          <p className="truncate text-sm text-muted">{item.url}</p>
                          <p className="mt-1 text-xs uppercase tracking-[0.2em] text-muted">
                            {item.enabled ? 'Enabled' : 'Disabled'}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 sm:justify-end">
                        <button type="button" onClick={() => moveItem(item.id, -1)} disabled={index === 0} className="icon-button" aria-label={`Move ${item.platform} up`}>
                          <ArrowUp className="h-4 w-4" />
                        </button>
                        <button type="button" onClick={() => moveItem(item.id, 1)} disabled={index === orderedItems.length - 1} className="icon-button" aria-label={`Move ${item.platform} down`}>
                          <ArrowDown className="h-4 w-4" />
                        </button>
                        <button type="button" onClick={() => toggleItem(item.id)} className="btn-secondary px-4 py-2 text-xs">
                          {item.enabled ? 'Disable' : 'Enable'}
                        </button>
                        <button type="button" onClick={() => editItem(item)} className="icon-button" aria-label={`Edit ${item.platform}`}>
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button type="button" onClick={() => deleteItem(item.id)} className="icon-button" aria-label={`Delete ${item.platform}`}>
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </article>
                  ))
              ) : (
                <p className="text-sm text-muted">No social platforms added.</p>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

export default AdminSocialMediaPage
