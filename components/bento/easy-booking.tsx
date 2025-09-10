import type React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { memo, useMemo, useEffect } from "react"

// ✅ Déclare un type clair pour l'icône
type IconType = React.ComponentType<{ size?: number; className?: string }>

// ✅ Définis les données EN DEHORS du composant (identité stable)
const DAYS = Object.freeze(["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"])
const DATES = Object.freeze(Array.from({ length: 35 }, (_, i) => i - 1)) // for a 5-week grid

// ✅ Mémorise le bouton de navigation
const NavButton = memo(function NavButton({ Icon }: { Icon: IconType }) {
  return (
    <button
      style={{
        background: "transparent",
        border: "none",
        color: "var(--booking-text-secondary)",
        cursor: "pointer",
      }}
    >
      <Icon size={20} />
    </button>
  )
})

const EasyBooking: React.FC = memo(function EasyBooking() {
  // ✅ Debug logs pour confirmer que ce n'est pas un remount React
  useEffect(() => {
    console.log('🔍 EasyBooking MOUNT')
    return () => console.log('🔍 EasyBooking UNMOUNT')
  }, [])
  
  // ✅ Évite de recréer des objets inline
  const themeVars = useMemo<React.CSSProperties>(() => ({
    "--booking-primary-color": "hsl(var(--primary))",
    "--booking-background-color": "hsl(var(--background))",
    "--booking-card-background": "hsl(var(--card))",
    "--booking-text-color": "hsl(var(--foreground))",
    "--booking-text-secondary": "hsl(var(--muted-foreground))",
    "--booking-border-color": "hsl(var(--border))",
  }), [])

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        ...themeVars,
      }}
      role="img"
      aria-label="Easy appointment booking interface showing a calendar with availabilities."
    >
      <div
        style={{
          width: "340px",
          height: "220px",
          borderRadius: "12px",
          background: "var(--booking-card-background)",
          border: "1px solid var(--booking-border-color)",
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
          overflow: "hidden",
          padding: "12px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 4px" }}>
          <NavButton Icon={ChevronLeft} />
          <span style={{ fontWeight: 500, color: "var(--booking-text-color)" }}>August 2025</span>
          <NavButton Icon={ChevronRight} />
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            marginTop: "8px",
            textAlign: "center",
            fontSize: "12px",
          }}
        >
          {DAYS.map((day) => (
            <div key={day} style={{ color: "var(--booking-text-secondary)", padding: "4px 0" }}>
              {day}
            </div>
          ))}
          {DATES.map((date, i) => {
            const isCurrentMonth = date > 0 && date < 32
            const isAvailable = isCurrentMonth && [12, 15, 22].includes(date)
            const isSelected = isCurrentMonth && date === 15
            return (
              <div
                key={i}
                style={{
                  padding: "4px 0",
                  color: isCurrentMonth ? "var(--booking-text-color)" : "var(--booking-text-secondary)",
                  opacity: isCurrentMonth ? 1 : 0.3,
                  background: isSelected ? "var(--booking-primary-color)" : "transparent",
                  color: isSelected ? "hsl(var(--primary-foreground))" : "inherit",
                  borderRadius: "50%",
                  width: "28px",
                  height: "28px",
                  margin: "auto",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  border: isAvailable && !isSelected ? `1px solid var(--booking-primary-color)` : "none",
                }}
              >
                {isCurrentMonth ? date : ""}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
})

export default EasyBooking
