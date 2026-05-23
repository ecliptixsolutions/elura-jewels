function SectionHeading({ eyebrow, title, description, align = 'left', as = 'h2' }) {
  const alignment =
    align === 'center'
      ? 'mx-auto max-w-3xl text-center items-center'
      : 'max-w-3xl text-left'
  const HeadingTag = as

  return (
    <div className={`mb-10 flex flex-col gap-4 ${alignment}`}>
      {eyebrow ? <span className="section-eyebrow">{eyebrow}</span> : null}
      <div className="w-full space-y-4">
        <HeadingTag className="max-w-full break-words text-3xl sm:text-4xl lg:text-5xl">
          {title}
        </HeadingTag>
        {description ? (
          <p className="max-w-full break-words text-base text-muted sm:text-lg">{description}</p>
        ) : null}
      </div>
    </div>
  )
}

export default SectionHeading
