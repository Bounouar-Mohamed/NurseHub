import type React from "react"
import { Video, Mic, PhoneOff, ScreenShare } from "lucide-react"
import Image from "next/image"
import { useEffect, memo, useMemo } from "react"

// ✅ Déclare un type clair pour l'icône
type IconType = React.ComponentType<{ size?: number; className?: string }>

// ✅ Styles factorisés hors composant pour éviter les re-créations
const controlsBarStyle: React.CSSProperties = {
  height: "50px",
  background: "var(--tele-background-color)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "16px",
  borderTop: "1px solid var(--tele-border-color)",
}

const videoContainerStyle: React.CSSProperties = {
  flex: 1,
  position: "relative",
  background: "#e0e0e0"
}

const cardStyle: React.CSSProperties = {
  width: "340px",
  height: "220px",
  borderRadius: "12px",
  background: "var(--tele-card-background)",
  border: "1px solid var(--tele-border-color)",
  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
}

// ✅ Mémorise le bouton de contrôle
const ControlButton = memo(function ControlButton({
  Icon, size = 20, className
}: { Icon: IconType; size?: number; className?: string }) {
  return (
    <button
      className={className}
      style={{
        background: "transparent",
        border: "none",
        color: "var(--tele-text-color)",
        cursor: "pointer",
      }}
    >
      <Icon size={size} />
    </button>
  )
})

// ✅ Mémorise le bouton de fin d'appel
const EndCallButton = memo(function EndCallButton() {
  return (
    <button
      style={{
        background: "#e53e3e",
        border: "none",
        color: "white",
        cursor: "pointer",
        borderRadius: "50%",
        width: "36px",
        height: "36px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <PhoneOff size={18} />
    </button>
  )
})

// ✅ Mémorise la barre de contrôles
const ControlsBar = memo(function ControlsBar() {
  // ✅ Debug log pour confirmer la stabilité de la barre de contrôles
  useEffect(() => {
    console.log('🔍 ControlsBar MOUNT')
    return () => console.log('🔍 ControlsBar UNMOUNT')
  }, [])

  return (
    <div style={controlsBarStyle}>
      <ControlButton Icon={Mic} />
      <ControlButton Icon={Video} />
      <EndCallButton />
      <ControlButton Icon={ScreenShare} />
    </div>
  )
})

const TeleconsultationView: React.FC = memo(function TeleconsultationView() {
  // ✅ Debug logs pour confirmer que ce n'est pas un remount React
  useEffect(() => {
    console.log('🔍 TeleconsultationView MOUNT')
    return () => console.log('🔍 TeleconsultationView UNMOUNT')
  }, [])
  
  // ✅ Évite de recréer des objets inline
  const themeVars = useMemo(() => ({
    "--tele-primary-color": "hsl(var(--primary))",
    "--tele-background-color": "hsl(var(--background))",
    "--tele-card-background": "hsl(var(--card))",
    "--tele-text-color": "hsl(var(--foreground))",
    "--tele-text-secondary": "hsl(var(--muted-foreground))",
    "--tele-border-color": "hsl(var(--border))",
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
      aria-label="Teleconsultation interface showing a doctor on a video call with patient controls."
    >
      <div style={cardStyle}>
        <div style={videoContainerStyle}>
          <Image
            src="/images/teleconsultation.png"
            alt="Doctor on video call"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 340px"
            priority
            loading="eager"
            style={{ 
              objectFit: "cover",
              willChange: 'auto',
              backfaceVisibility: 'hidden',
            }}
          />
        </div>
        <ControlsBar />
      </div>
    </div>
  )
})

export default TeleconsultationView
