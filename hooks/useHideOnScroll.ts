'use client'
import { useEffect, useRef, useState } from 'react'

/** Returns true when the user is scrolling down past `threshold`, false when scrolling up or near top. */
export function useHideOnScroll(threshold = 100) {
  const [hidden, setHidden] = useState(false)
  const lastY = useRef(0)

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      setHidden(y > lastY.current && y > threshold)
      lastY.current = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [threshold])

  return hidden
}
