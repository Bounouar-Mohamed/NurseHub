import type React from "react"
import { FileText, TestTube2, Pill } from "lucide-react"
import { memo, useMemo, useEffect } from "react"

// ✅ Déclare un type clair pour l'icône
type IconType = React.ComponentType<{ size?: number; className?: string }>

type Item = { Icon: IconType; label: string; active?: boolean }

// ✅ Définis le tableau EN DEHORS du composant (identité stable)
const MENU_ITEMS: readonly Item[] = [
  { Icon: FileText, label: "Visit Notes" },
  { Icon: TestTube2, label: "Lab Results", active: true },
  { Icon: Pill, label: "Prescriptions" },
] as const

// ✅ Mémorise la ligne de menu (et évite tout nouvel objet/fonction)
const MenuItem = memo(function MenuItem({ Icon, label, active }: Item) {
  // ✅ Debug log pour confirmer la stabilité
  useEffect(() => {
    console.log('🔍 MenuItem mount:', label)
    return () => console.log('🔍 MenuItem unmount:', label)
  }, [label])

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "8px",
        borderRadius: "6px",
        fontSize: "12px",
        cursor: "pointer",
        background: active ? "var(--record-primary-color)" : "transparent",
        color: active ? "hsl(var(--primary-foreground))" : "var(--record-text-secondary)",
      }}
    >
      <Icon size={16} />
      <span>{label}</span>
    </div>
  )
})

const SecureMedicalRecord: React.FC = memo(function SecureMedicalRecord() {
  // ✅ Évite de recréer des objets inline si tu veux pousser l'optim
  const themeVars = useMemo(() => ({
    "--record-primary-color": "hsl(var(--primary))",
    "--record-background-color": "hsl(var(--background))",
    "--record-card-background": "hsl(var(--card))",
    "--record-text-color": "hsl(var(--foreground))",
    "--record-text-secondary": "hsl(var(--muted-foreground))",
    "--record-border-color": "hsl(var(--border))",
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
      aria-label="Secure medical record interface showing a list of documents and a preview of lab results."
    >
      <div
        style={{
          width: "340px",
          height: "220px",
          borderRadius: "12px",
          background: "var(--record-card-background)",
          border: "1px solid var(--record-border-color)",
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
          overflow: "hidden",
          display: "flex",
        }}
      >
        <div
          style={{
            width: "140px",
            background: "hsl(var(--muted) / 0.5)",
            borderRight: "1px solid var(--record-border-color)",
            padding: "8px",
            display: "flex",
            flexDirection: "column",
            gap: "4px",
          }}
        >
          <p style={{ fontSize: "12px", fontWeight: 500, color: "var(--record-text-color)", padding: "4px 8px" }}>
            My Records
          </p>
          {MENU_ITEMS.map((item) => (
            <MenuItem key={item.label} {...item} />
          ))}
        </div>
        <div
          style={{
            flex: 1,
            padding: "16px",
            fontFamily: "'Geist Mono', monospace",
            fontSize: "10px",
            color: "var(--record-text-color)",
            lineHeight: 1.6,
          }}
        >
          <h3 style={{ fontSize: "14px", fontWeight: 600, marginBottom: "8px" }}>Blood Analysis</h3>
          <p style={{ color: "var(--record-text-secondary)", fontSize: "10px" }}>Date: 2025-08-01</p>
          <div style={{ marginTop: "12px", display: "flex", justifyContent: "space-between" }}>
            <span>Hemoglobin</span> <strong>14.5 g/dL</strong>
          </div>
          <div style={{ marginTop: "4px", display: "flex", justifyContent: "space-between" }}>
            <span>Glucose</span> <strong>95 mg/dL</strong>
          </div>
          <div style={{ marginTop: "4px", display: "flex", justifyContent: "space-between" }}>
            <span>Cholesterol</span> <strong>180 mg/dL</strong>
          </div>
          <div style={{ marginTop: "12px", color: "#22c55e" }}>All values are within normal range.</div>
        </div>
      </div>
    </div>
  )
})

export default SecureMedicalRecord
