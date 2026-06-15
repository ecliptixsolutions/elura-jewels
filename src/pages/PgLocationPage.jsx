import { useEffect, useState } from 'react'
import LocationDigitalTwinRenderer from '../components/LocationDigitalTwinRenderer.jsx'
import { emptyLocationDigitalTwin } from '../data/locationDigitalTwin.js'
import { subscribeCmsDoc } from '../lib/cms.js'

function PgLocationPage() {
  const [content, setContent] = useState(emptyLocationDigitalTwin)

  useEffect(() => {
    const unsubscribe = subscribeCmsDoc(
      'locationTwin',
      emptyLocationDigitalTwin,
      setContent,
    )

    return unsubscribe
  }, [])

  return <LocationDigitalTwinRenderer content={content} />
}

export default PgLocationPage
