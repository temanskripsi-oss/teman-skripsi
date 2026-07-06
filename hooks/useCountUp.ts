'use client'
import { useEffect, useRef, useState } from 'react'

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function useCountUp(target: number, duration = 1500) {
  const ref = useRef<HTMLElement | null>(null)
  const [value, setValue] = useState(() => (prefersReducedMotion() ? target : 0))
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el || prefersReducedMotion()) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true
          const start = performance.now()
          const tick = (now: number) => {
            const progress = Math.min((now - start) / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            setValue(Math.round(target * eased))
            if (progress < 1) requestAnimationFrame(tick)
          }
          requestAnimationFrame(tick)
          observer.disconnect()
        }
      },
      { threshold: 0.2 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [target, duration])

  return { ref, value }
}
