import type React from "react"
import { Pill, Send } from "lucide-react"
import { memo, useMemo, useEffect } from "react"

type IconType = React.ComponentType<{ size?: number; className?: string }>

// ✅ Styles factorisés hors composant pour éviter les re-créations
const headerStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  color: "var(--rx-text-color)",
}

const prescriptionContentStyle: React.CSSProperties = {
  flex: 1,
  marginTop: "12px",
  padding: "12px",
  background: "hsl(var(--muted) / 0.5)",
  borderRadius: "8px",
  border: "1px solid var(--rx-border-color)",
  fontSize: "12px",
  fontFamily: "'Geist Mono', monospace",
  color: "var(--rx-text-secondary)",
}

const sendButtonStyle: React.CSSProperties = {
  marginTop: "12px",
  width: "100%",
  padding: "8px",
  borderRadius: "8px",
  background: "var(--rx-primary-color)",
  color: "var(--rx-primary-foreground)",
  border: "none",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
  fontSize: "14px",
  fontWeight: 500,
}

// ✅ Mémorise le bouton d'envoi
const SendButton = memo(function SendButton() {
  return (
    <button style={sendButtonStyle}>
      <Send size={16} />
      Send to Pharmacy
    </button>
  )
})

const EPrescription: React.FC = memo(function EPrescription() {
  // ✅ Debug log pour tracer les mount/unmount du composant principal
  useEffect(() => {
    console.log('🔍 EPrescription MOUNT')
    return () => console.log('🔍 EPrescription UNMOUNT')
  }, [])

  const themeVars = useMemo(() => ({
    "--rx-primary-color": "hsl(var(--primary))",
    "--rx-background-color": "hsl(var(--background))",
    "--rx-card-background": "hsl(var(--card))",
    "--rx-text-color": "hsl(var(--foreground))",
    "--rx-text-secondary": "hsl(var(--muted-foreground))",
    "--rx-border-color": "hsl(var(--border))",
    "--rx-primary-foreground": "hsl(var(--primary-foreground))",
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
      aria-label="E-prescription interface with medication details and a button to send to the pharmacy."
    >
      <div
        style={{
          width: "340px",
          height: "220px",
          borderRadius: "12px",
          background: "var(--rx-card-background)",
          border: "1px solid var(--rx-border-color)",
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
          overflow: "hidden",
          padding: "16px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={headerStyle}>
          <Pill size={20} />
          <h3 style={{ fontSize: "16px", fontWeight: 600 }}>E-Prescription</h3>
        </div>
        <div style={prescriptionContentStyle}>
          <p>Patient: John Doe</p>
          <p>Date: 2025-08-03</p>
          <br />
          <p style={{ color: "var(--rx-text-color)", fontWeight: 500 }}>1. Amoxicillin 500mg</p>
          <p>Take 1 capsule 3 times a day for 7 days.</p>
          <br />
          <p style={{ color: "var(--rx-text-color)", fontWeight: 500 }}>2. Ibuprofen 400mg</p>
          <p>Take as needed for pain, max 3 per day.</p>
        </div>
        <SendButton />
      </div>
    </div>
  )
})

export default EPrescription
