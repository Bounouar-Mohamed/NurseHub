"use client"

import React, { useMemo, memo, useEffect, useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { BookAppointmentButton } from "./book-appointment-button"

const HeroSection = memo(function HeroSection() {
  // ✅ Debug logs pour confirmer que ce n'est pas un remount React
  useEffect(() => {
    console.log('🔍 HeroSection MOUNT')
    return () => console.log('🔍 HeroSection UNMOUNT')
  }, [])

  // États pour le tooltip "Coming Soon"
  const [showTooltip, setShowTooltip] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const animationFrameRef = useRef<number | null>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  // Handlers optimisés pour le tooltip
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
    }

    animationFrameRef.current = requestAnimationFrame(() => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    })
  }, [])

  const handleMouseEnter = useCallback(() => {
    setShowTooltip(true)
  }, [])

  const handleMouseLeave = useCallback(() => {
    setShowTooltip(false)
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
    }
  }, [])

  // Mémoiser le pattern de grille pour éviter la régénération
  const GRID_SIZE = 24 // Taille d'une cellule de la grille
  const COLS = Math.ceil(1220 / GRID_SIZE) // Nombre de colonnes basé sur la largeur du viewBox
  const ROWS = Math.ceil(810 / GRID_SIZE)  // Nombre de lignes basé sur la hauteur du viewBox

  const GridPattern = useMemo(() => {
    return (
      <pattern
        id="grid-pattern"
        width={GRID_SIZE}
        height={GRID_SIZE}
        patternUnits="userSpaceOnUse"
      >
        <line
          x1="0"
          y1="0"
          x2={GRID_SIZE}
          y2="0"
          stroke="hsl(var(--foreground))"
          strokeOpacity="0.04"
          strokeWidth="1"
        />
        <line
          x1="0"
          y1="0"
          x2="0"
          y2={GRID_SIZE}
          stroke="hsl(var(--foreground))"
          strokeOpacity="0.04"
          strokeWidth="1"
        />
      </pattern>
    )
  }, [])

  // Générer des positions alignées sur la grille pour les rectangles animés (optimisé)
  const animatedRects = useMemo(() => {
    const rects = []
    const numRects = 12 // Réduit de 15 à 12 pour de meilleures performances
    const usedPositions = new Set() // Pour éviter les doublons

    while (rects.length < numRects) {
      const col = Math.floor(Math.random() * COLS)
      const row = Math.floor(Math.random() * ROWS)
      const posKey = `${col},${row}`

      if (!usedPositions.has(posKey)) {
        usedPositions.add(posKey)
        const x = col * GRID_SIZE
        const y = row * GRID_SIZE
        const delay = Math.random() * 2 // Réduit de 5 à 3 secondes pour plus de fluidité
        rects.push({ x, y, delay })
      }
    }
    return rects
  }, [])

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Image en haut à droite de la page */}
      <div className="absolute top-0 right-20 z-10 hidden lg:block">
        <Image
          src="/images/DoctorNurseHubV2.png"
          alt="Doctor Nurse Hub"
          width={430}
          height={220}
          priority={true}
          loading="eager"
          style={{
            willChange: 'auto',
            backfaceVisibility: 'hidden',
          }}
        />
      </div>

      <div className="absolute inset-0 z-0">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 1220 810"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden="true"
        >
          <defs>
            {GridPattern}
            <linearGradient
              id="hero-gradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="hsl(var(--foreground))" stopOpacity="0.05" />
              <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.1" />
            </linearGradient>
            <filter id="blur-effect" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="50" />
            </filter>
          </defs>

          {/* Fond avec grille */}
          <rect width="100%" height="100%" fill="url(#grid-pattern)" />

          {/* Rectangles animés alignés sur la grille */}
          {animatedRects.map((rect, index) => (
            <g key={index}>
              <rect
                x={rect.x}
                y={rect.y}
                width={GRID_SIZE}
                height={GRID_SIZE}
                fill="#78FCD6"
                opacity="0"
              >
                <animate
                  attributeName="opacity"
                  values="0;0.3;0"
                  dur="3s"
                  begin={`${rect.delay}s`}
                  repeatCount="indefinite"
                  calcMode="spline"
                  keySplines="0.4 0 0.2 1; 0.4 0 0.2 1"
                />
                <animate
                  attributeName="fill"
                  values="#78FCD6;#78FCD6;#78FCD6"
                  dur="3s"
                  begin={`${rect.delay}s`}
                  repeatCount="indefinite"
                  calcMode="spline"
                  keySplines="0.4 0 0.2 1; 0.4 0 0.2 1"
                />
              </rect>
            </g>
          ))}

          {/* Gradient et effets de flou pré-calculés */}
          <circle
            cx="80%"
            cy="20%"
            r="300"
            fill="url(#hero-gradient)"
            filter="url(#blur-effect)"
            opacity="0.7"
          >
            <animate
              attributeName="r"
              values="300;320;300"
              dur="6s"
              repeatCount="indefinite"
              calcMode="spline"
              keySplines="0.4 0 0.2 1; 0.4 0 0.2 1"
            />
          </circle>
          <circle
            cx="20%"
            cy="70%"
            r="250"
            fill="url(#hero-gradient)"
            filter="url(#blur-effect)"
            opacity="0.5"
          >
            <animate
              attributeName="r"
              values="250;270;250"
              dur="5s"
              repeatCount="indefinite"
              calcMode="spline"
              keySplines="0.4 0 0.2 1; 0.4 0 0.2 1"
            />
          </circle>
        </svg>
      </div>

      <div className="flex-1 flex items-center justify-center relative">
        <div className="container mx-auto px-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            {/* Image centrée sur mobile */}
            <div className="flex justify-center lg:hidden mb-8">
              <Image
                src="/images/DoctorNurseHubV2.png"
                alt="Doctor Nurse Hub"
                width={300}
                height={154}
                priority={true}
                loading="eager"
                style={{
                  willChange: 'auto',
                  backfaceVisibility: 'hidden',
                }}
              />
            </div>

            {/* Contenu à gauche */}
            <div className="text-left lg:w-1/2">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
                Exceptional Healthcare,<br className="hidden md:block" />
                Centered Around You
              </h1>

              <p className="text-xl text-muted-foreground max-w-2xl lg:max-w-none mb-8">
                Get expert nursing care at home or online. NurseHub offers a seamless, premium healthcare experience
                tailored to your needs in Dubai.
              </p>

              <div className="hidden md:block">
                <BookAppointmentButton
                  className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-[99px] font-medium shadow-[0px_0px_0px_4px_rgba(120,252,214,0.13)]"
                />
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
})

export { HeroSection }
