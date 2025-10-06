"use client"

import { useEffect } from "react"
import { useMap } from "react-leaflet"

export function FixSize() {
  const map = useMap()

  useEffect(() => {
    // Fix size on mount
    map.invalidateSize()

    // Fix size on window resize
    const handleResize = () => {
      map.invalidateSize()
    }

    window.addEventListener('resize', handleResize)
    
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [map])

  return null
}






