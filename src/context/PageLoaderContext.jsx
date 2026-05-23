// FILE: src/context/PageLoaderContext.jsx

/* eslint-disable react-refresh/only-export-components */

import {
  createContext,
  useContext,
  useState,
} from 'react'

const PageLoaderContext =
  createContext()

function PageLoaderProvider({
  children,
}) {

  const [
    isPageLoading,
    setIsPageLoading,
  ] = useState(false)

  return (
    <PageLoaderContext.Provider
      value={{
        isPageLoading,
        setIsPageLoading,
      }}
    >
      {children}
    </PageLoaderContext.Provider>
  )
}

const usePageLoader = () => {

  const context =
    useContext(
      PageLoaderContext,
    )

  if (!context) {
    throw new Error(
      'usePageLoader must be used inside PageLoaderProvider',
    )
  }

  return context
}

export {
  PageLoaderProvider,
  usePageLoader,
}
