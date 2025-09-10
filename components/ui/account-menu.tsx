"use client"

import { Button } from "@/components/ui/button"
import { User } from "lucide-react"
import { useState, useRef, useCallback } from "react"

export function AccountMenu() {
  const [showTooltip, setShowTooltip] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
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
    setShowTooltip(true)
  }, [])

  const handleMouseLeave = useCallback(() => {
    setShowTooltip(false)
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
    }
  }, [])

  return (
    <>
      <Button 
        variant="ghost" 
        size="icon" 
        className="text-foreground shadow-none" 
        onClick={(e) => e.preventDefault()}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
      >
        <User className="h-5 w-5" />
        <span className="sr-only">Account menu</span>
      </Button>
      
      {showTooltip && (
        <div
          className="fixed z-[9999] pointer-events-none bg-black text-primary px-2 py-1 rounded shadow-lg transition-all duration-75 ease-out"
          style={{
            left: mousePosition.x - 70,
            top: mousePosition.y + 5,
            transform: 'translate3d(0, 0, 0)',
            willChange: 'transform',
            fontSize: '10px',
            whiteSpace: 'nowrap',

          }}
        >
          Coming Soon
        </div>
      )}
    </>
  )
} 