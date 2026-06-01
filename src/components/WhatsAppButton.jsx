const whatsappUrl =
  'https://wa.me/447440482483?text=Hi%20I%20am%20interested%20in%20your%20jewelry'

function WhatsAppButton() {
  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-7 right-5 z-[55] inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_14px_32px_rgba(0,0,0,0.18)] transition hover:scale-105 sm:bottom-5"
    >
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
        alt="WhatsApp"
        width="55"
        height="55"
      />
    </a>
  )
}

export default WhatsAppButton
