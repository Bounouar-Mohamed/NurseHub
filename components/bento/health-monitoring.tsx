import type React from "react"
import { Heart, Activity, Droplets } from "lucide-react"

const HealthMonitoring: React.FC = () => {
  const themeVars = {
    "--mon-primary-color": "hsl(var(--primary))",
    "--mon-background-color": "hsl(var(--background))",
    "--mon-card-background": "hsl(var(--card))",
    "--mon-text-color": "hsl(var(--foreground))",
    "--mon-text-secondary": "hsl(var(--muted-foreground))",
    "--mon-border-color": "hsl(var(--border))",
  } as React.CSSProperties

  const metrics = [
    { icon: <Heart size={16} />, label: "Heart Rate", value: "72 bpm", status: "Normal" },
    { icon: <Activity size={16} />, label: "Blood Pressure", value: "120/80", status: "Normal" },
    { icon: <Droplets size={16} />, label: "Blood Sugar", value: "98 mg/dL", status: "Normal" },
  ]

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
      aria-label="Health monitoring dashboard showing heart rate, blood pressure, and blood sugar."
    >
      <div
        style={{
          width: "340px",
          height: "220px",
          borderRadius: "12px",
          background: "var(--mon-card-background)",
          border: "1px solid var(--mon-border-color)",
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
          overflow: "hidden",
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        <h3 style={{ fontSize: "16px", fontWeight: 600, color: "var(--mon-text-color)" }}>Health Monitoring</h3>
        {metrics.map((metric) => (
          <div
            key={metric.label}
            style={{
              padding: "12px",
              background: "hsl(var(--muted) / 0.5)",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              border: "1px solid var(--mon-border-color)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--mon-text-color)" }}>
              {metric.icon}
              <span style={{ fontSize: "12px", fontWeight: 500 }}>{metric.label}</span>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--mon-text-color)" }}>{metric.value}</div>
              <div style={{ fontSize: "10px", color: "#22c55e" }}>{metric.status}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default HealthMonitoring
