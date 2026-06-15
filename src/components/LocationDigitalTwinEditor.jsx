import { Eye, EyeOff, ImagePlus, Plus, Trash2 } from 'lucide-react'
import {
  createCard,
  createImage,
  locationSectionKeys,
} from '../data/locationDigitalTwin.js'

const labelFor = (key) =>
  key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (value) => value.toUpperCase())

const updateAt = (items = [], index, field, value) =>
  items.map((item, itemIndex) =>
    itemIndex === index
      ? {
          ...item,
          [field]: value,
        }
      : item,
  )

const removeAt = (items = [], index) =>
  items
    .filter((_, itemIndex) => itemIndex !== index)
    .map((item, sortOrder) => ({
      ...item,
      sortOrder,
    }))

function Field({ label, children }) {
  return (
    <label className="text-sm text-muted">
      {label}
      {children}
    </label>
  )
}

function TextInput({ value, onChange, placeholder = '' }) {
  return (
    <input
      value={value || ''}
      onChange={(event) => onChange(event.target.value)}
      className="input-shell mt-2"
      placeholder={placeholder}
    />
  )
}

function NumberInput({ value, onChange, min = 0 }) {
  return (
    <input
      type="number"
      min={min}
      value={Number(value || 0)}
      onChange={(event) => onChange(Number(event.target.value))}
      className="input-shell mt-2"
    />
  )
}

function VisibilityToggle({ checked, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold ${
        checked ? 'bg-emerald text-white' : 'bg-red-50 text-red-600'
      }`}
    >
      {checked ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
      {checked ? 'Visible' : 'Hidden'}
    </button>
  )
}

function ImageEditor({ image, index, onChange, onRemove }) {
  return (
    <article className="rounded-[8px] border border-black/8 bg-linen/35 p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-semibold text-ink">Image {index + 1}</p>
        <div className="flex items-center gap-2">
          <VisibilityToggle checked={image.visibility !== false} onChange={(value) => onChange('visibility', value)} />
          <button type="button" onClick={onRemove} className="icon-button" aria-label="Remove image">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mt-5 grid gap-5 md:grid-cols-2">
        <Field label="Image URL">
          <TextInput value={image.image} onChange={(value) => onChange('image', value)} />
        </Field>
        <Field label="Alt text">
          <TextInput value={image.alt} onChange={(value) => onChange('alt', value)} />
        </Field>
        <Field label="Caption">
          <TextInput value={image.caption} onChange={(value) => onChange('caption', value)} />
        </Field>
        <Field label="Overlay text">
          <TextInput value={image.overlayText} onChange={(value) => onChange('overlayText', value)} />
        </Field>
        <Field label="Badge">
          <TextInput value={image.badge} onChange={(value) => onChange('badge', value)} />
        </Field>
        <Field label="Sort order">
          <NumberInput value={image.sortOrder} onChange={(value) => onChange('sortOrder', value)} />
        </Field>
      </div>
    </article>
  )
}

function CardEditor({ card, index, onChange, onRemove }) {
  return (
    <article className="rounded-[8px] border border-black/8 bg-white p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-semibold text-ink">Card {index + 1}</p>
        <div className="flex items-center gap-2">
          <VisibilityToggle checked={card.visibility !== false} onChange={(value) => onChange('visibility', value)} />
          <button type="button" onClick={onRemove} className="icon-button" aria-label="Remove card">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mt-5 grid gap-5 md:grid-cols-2">
        <Field label="Title">
          <TextInput value={card.title} onChange={(value) => onChange('title', value)} />
        </Field>
        <Field label="Icon">
          <TextInput value={card.icon} onChange={(value) => onChange('icon', value)} placeholder="Gem, MapPin, ShieldCheck" />
        </Field>
        <Field label="Image URL">
          <TextInput value={card.image} onChange={(value) => onChange('image', value)} />
        </Field>
        <Field label="Link">
          <TextInput value={card.link} onChange={(value) => onChange('link', value)} />
        </Field>
        <Field label="Sort order">
          <NumberInput value={card.sortOrder} onChange={(value) => onChange('sortOrder', value)} />
        </Field>
        <label className="text-sm text-muted md:col-span-2">
          Description
          <textarea
            value={card.description || ''}
            onChange={(event) => onChange('description', event.target.value)}
            className="input-shell mt-2 min-h-24 resize-y"
          />
        </label>
      </div>
    </article>
  )
}

function SectionEditor({ sectionKey, section, onChange }) {
  const updateField = (field, value) => {
    onChange({
      ...section,
      [field]: value,
    })
  }

  const updateImage = (index, field, value) => {
    updateField('images', updateAt(section.images || [], index, field, value))
  }

  const updateCard = (index, field, value) => {
    updateField('cards', updateAt(section.cards || [], index, field, value))
  }

  return (
    <section className="rounded-[8px] border border-black/8 bg-white p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="section-eyebrow">{labelFor(sectionKey)}</p>
          <h3 className="mt-2 text-3xl">{section.heading || 'Untitled section'}</h3>
        </div>
        <VisibilityToggle checked={section.visibility !== false} onChange={(value) => updateField('visibility', value)} />
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <Field label="Heading">
          <TextInput value={section.heading} onChange={(value) => updateField('heading', value)} />
        </Field>
        <Field label="Subheading">
          <TextInput value={section.subheading} onChange={(value) => updateField('subheading', value)} />
        </Field>
        <Field label="Background">
          <TextInput value={section.background} onChange={(value) => updateField('background', value)} placeholder="ivory, white, linen, mist, ink" />
        </Field>
        <Field label="Order">
          <NumberInput value={section.order} onChange={(value) => updateField('order', value)} />
        </Field>
        <label className="text-sm text-muted md:col-span-2">
          Description
          <textarea
            value={section.description || ''}
            onChange={(event) => updateField('description', event.target.value)}
            className="input-shell mt-2 min-h-24 resize-y"
          />
        </label>
      </div>

      <div className="mt-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h4 className="text-2xl">Images</h4>
          <button
            type="button"
            onClick={() => updateField('images', [...(section.images || []), createImage({ sortOrder: section.images?.length || 0 })])}
            className="btn-secondary gap-2 px-5 py-2.5"
          >
            <ImagePlus className="h-4 w-4" />
            Add Image
          </button>
        </div>
        <div className="mt-4 grid gap-4">
          {(section.images || []).map((image, index) => (
            <ImageEditor
              key={`${sectionKey}-image-${index}`}
              image={image}
              index={index}
              onChange={(field, value) => updateImage(index, field, value)}
              onRemove={() => updateField('images', removeAt(section.images || [], index))}
            />
          ))}
        </div>
      </div>

      <div className="mt-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h4 className="text-2xl">Cards</h4>
          <button
            type="button"
            onClick={() => updateField('cards', [...(section.cards || []), createCard({ sortOrder: section.cards?.length || 0 })])}
            className="btn-secondary gap-2 px-5 py-2.5"
          >
            <Plus className="h-4 w-4" />
            Add Card
          </button>
        </div>
        <div className="mt-4 grid gap-4">
          {(section.cards || []).map((card, index) => (
            <CardEditor
              key={`${sectionKey}-card-${index}`}
              card={card}
              index={index}
              onChange={(field, value) => updateCard(index, field, value)}
              onRemove={() => updateField('cards', removeAt(section.cards || [], index))}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

function LocationDigitalTwinEditor({ value, onChange }) {
  const content = value || {}
  const sections = content.sections || {}

  const updateRootSection = (key, section) => {
    onChange({
      ...content,
      [key]: section,
    })
  }

  const updateSection = (key, section) => {
    onChange({
      ...content,
      sections: {
        ...sections,
        [key]: section,
      },
    })
  }

  return (
    <div className="grid gap-6">
      <SectionEditor
        sectionKey="header"
        section={content.header || {}}
        onChange={(section) => updateRootSection('header', section)}
      />

      {locationSectionKeys.map((key) => (
        <SectionEditor
          key={key}
          sectionKey={key}
          section={sections[key] || {}}
          onChange={(section) => updateSection(key, section)}
        />
      ))}

      <SectionEditor
        sectionKey="footer"
        section={content.footer || {}}
        onChange={(section) => updateRootSection('footer', section)}
      />
    </div>
  )
}

export default LocationDigitalTwinEditor
