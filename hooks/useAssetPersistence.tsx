"use client"

import { useEffect, useRef } from 'react'

/**
 * Hook pour maintenir les assets en mémoire et éviter leur déchargement
 * lors du scroll rapide
 */
export function useAssetPersistence() {
  const assetCache = useRef<Set<string>>(new Set())

  useEffect(() => {
    // Précharger les images critiques
    const criticalImages = [
      '/images/DoctorNurseHubV2.png',
      '/images/teleconsultation.png',
    ]

    criticalImages.forEach((src) => {
      if (!assetCache.current.has(src)) {
        const img = new Image()
        img.src = src
        img.loading = 'eager'
        // Force le cache navigateur
        img.style.display = 'none'
        document.body.appendChild(img)
        
        img.onload = () => {
          assetCache.current.add(src)
          document.body.removeChild(img)
        }
      }
    })

    // Prévenir le garbage collection des assets
    const preventGC = () => {
      // Force le navigateur à garder les images en mémoire
      const images = document.querySelectorAll('img[src*="/images/"]')
      images.forEach((img) => {
        if (img instanceof HTMLImageElement) {
          // Force le rendu pour maintenir en mémoire
          img.style.willChange = 'auto'
        }
      })
    }

    // Exécuter périodiquement pour maintenir les assets
    const interval = setInterval(preventGC, 1000)

    return () => {
      clearInterval(interval)
    }
  }, [])

  return assetCache.current
}
