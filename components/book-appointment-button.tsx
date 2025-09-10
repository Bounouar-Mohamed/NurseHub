'use client'

import { Button } from "@/components/ui/button"
import { useState, useRef, useCallback } from "react"

interface BookAppointmentButtonProps {
  className?: string
  variant?: "default" | "ghost" | "outline"
  fullWidth?: boolean
}

export function BookAppointmentButton({ 
  className = "", 
  variant = "default",
  fullWidth = false
}: BookAppointmentButtonProps) {
  const [showTooltip, setShowTooltip] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const buttonRef = useRef<HTMLButtonElement>(null)
  const animationFrameRef = useRef<number | null>(null)

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
    }
    
    animationFrameRef.current = requestAnimationFrame(() => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    })
  }, [])

  const handleMouseEnter = useCallback(() => {
    console.log('🖱️ Mouse entered - showing tooltip')
    setShowTooltip(true)
  }, [])

  const handleMouseLeave = useCallback(() => {
    console.log('🖱️ Mouse left - hiding tooltip')
    setShowTooltip(false)
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
    }
  }, [])

  return (
    <>
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
      >
        <Button
          ref={buttonRef}
          disabled
          className={`${className} ${fullWidth ? 'w-full' : ''} cursor-not-allowed opacity-50`}
          variant={variant}
          onClick={(e) => e.preventDefault()}
        >
          Book Appointment
        </Button>
      </div>
      
      {showTooltip && (
        <div
          className="fixed z-[99999] pointer-events-none bg-black text-white px-2 py-1 rounded shadow-lg transition-all duration-75 ease-out"
          style={{
            left: mousePosition.x - 45,
            top: mousePosition.y + 5,
            transform: 'translate3d(0, 0, 0)',
            willChange: 'transform',
            fontSize: '10px',
            whiteSpace: 'nowrap',
            border: '1px solid rgba(255,255,255,0.2)',
          }}
        >
          Coming Soon
        </div>
      )}
      {console.log('🔍 Tooltip state:', showTooltip, 'Position:', mousePosition)}
    </>
  )
} 