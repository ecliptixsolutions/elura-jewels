import { useEffect } from 'react'

function useUnsavedChanges(isDirty) {
  useEffect(() => {
    if (!isDirty) return undefined

    const handleBeforeUnload = (event) => {
      event.preventDefault()
      event.returnValue = ''
    }
    const handleLinkClick = (event) => {
      const link = event.target.closest('a[href]')

      if (!link || link.target === '_blank' || link.origin !== window.location.origin) return

      if (!window.confirm('You have unsaved changes. Leave this page and discard them?')) {
        event.preventDefault()
        event.stopPropagation()
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    document.addEventListener('click', handleLinkClick, true)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      document.removeEventListener('click', handleLinkClick, true)
    }
  }, [isDirty])
}

export default useUnsavedChanges
