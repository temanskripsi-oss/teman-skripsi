'use client'
import { useEffect, useState } from 'react'

export function useActiveSection(sectionIds: string[]) {
  const [active, setActive] = useState(sectionIds[0] ?? '')

  useEffect(() => {
    const sections = sectionIds
      .map(id => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)

    if (sections.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]) setActive(visible[0].target.id)
      },
      { rootMargin: '-96px 0px -60% 0px', threshold: 0 }
    )

    sections.forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [sectionIds])

  return active
}
