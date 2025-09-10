import type React from "react"
import { Syringe, HeartPulse, Stethoscope, Bandage } from "lucide-react"
import { memo, useMemo, useEffect } from "react"

type IconType = React.ComponentType<{ size?: number; className?: string }>
type Service = { Icon: IconType; name: string }

const SERVICES: readonly Service[] = [
  { Icon: Syringe, name: "Injections & IV" },
  { Icon: HeartPulse, name: "Post-Op Follow-up" },
  { Icon: Bandage, name: "Wound Care" },
  { Icon: Stethoscope, name: "Health Check-up" },
] as const

const ServiceItem = memo(function ServiceItem({ Icon, name }: Service) {
  // ✅ Debug log pour tracer les mount/unmount des icônes
  useEffect(() => {
    console.log('🔍 ServiceItem MOUNT:', name)
    return () => console.log('🔍 ServiceItem UNMOUNT:', name)
  }, [name])

  return (
    <div
      style={{
        padding: "12px",
        background: "hsl(var(--muted) / 0.5)",
        borderRadius: "8px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        color: "var(--care-text-color)",
        border: "1px solid var(--care-border-color)",
      }}
    >
      <Icon size={20} />
      <span style={{ fontSize: "12px", fontWeight: 500, textAlign: "center" }}>{name}</span>
    </div>
  )
})

const HomeCareServices: React.FC = memo(function HomeCareServices() {
  // ✅ Debug log pour tracer les mount/unmount du composant principal
  useEffect(() => {
    console.log('🔍 HomeCareServices MOUNT')
    return () => console.log('🔍 HomeCareServices UNMOUNT')
  }, [])

  const themeVars = useMemo(() => ({
    "--care-primary-color": "hsl(var(--primary))",
    "--care-background-color": "hsl(var(--background))",
    "--care-card-background": "hsl(var(--card))",
    "--care-text-color": "hsl(var(--foreground))",
    "--care-text-secondary": "hsl(var(--muted-foreground))",
    "--care-border-color": "hsl(var(--border))",
  } as React.CSSProperties), [])

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
      aria-label="Home care services interface showing a list of available treatments."
    >
      <div
        style={{
          width: "340px",
          height: "220px",
          borderRadius: "12px",
          background: "var(--care-card-background)",
          border: "1px solid var(--care-border-color)",
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
          overflow: "hidden",
          padding: "16px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <h3 style={{ fontSize: "16px", fontWeight: 600, color: "var(--care-text-color)" }}>Home Care Services</h3>
        <p style={{ fontSize: "12px", color: "var(--care-text-secondary)", marginTop: "4px" }}>
          Our expert nurses, at your home.
        </p>
        <div style={{ marginTop: "16px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          {SERVICES.map((service) => (
            <ServiceItem key={service.name} {...service} />
          ))}
        </div>
      </div>
    </div>
  )
})

export default HomeCareServices
