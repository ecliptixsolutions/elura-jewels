function PageLoader() {

  return (

    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#f8f5f0]">

      <div className="flex flex-col items-center">

        <img
          src="/elura-logo-mark.webp"
          alt="ELURA"
          width="128"
          height="128"
          className="h-20 w-20 object-contain"
        />

        <p className="mt-5 font-serif text-4xl tracking-[0.18em] text-gold animate-pulse">
          ELURA
        </p>

        <div className="mt-6 h-[2px] w-28 overflow-hidden rounded-full bg-black/10">

          <div className="loader-bar h-full w-full bg-gold" />

        </div>

      </div>

    </div>
  )
}

export default PageLoader
