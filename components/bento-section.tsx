"use client"

import React, { memo, useMemo, useEffect } from "react"
import TeleconsultationView from "./bento/teleconsultation-view"
import SecureMedicalRecord from "./bento/secure-medical-record"
import EasyBooking from "./bento/easy-booking"
import HomeCareServices from "./bento/home-care-services"
import HealthMonitoring from "./bento/health-monitoring"
import EPrescription from "./bento/e-prescription"

interface BentoCardProps {
  title: string;
  description: string;
  Component: React.ComponentType;
}

// ✅ Mémorisation individuelle des composants pour éviter le re-mount
const MemoizedTeleconsultationView = memo(TeleconsultationView)
const MemoizedSecureMedicalRecord = memo(SecureMedicalRecord)
const MemoizedEasyBooking = memo(EasyBooking)
const MemoizedHomeCareServices = memo(HomeCareServices)
const MemoizedHealthMonitoring = memo(HealthMonitoring)
const MemoizedEPrescription = memo(EPrescription)

// ✅ Figer CARDS hors composant pour éviter les recréations
const CARDS = [
  {
    title: "Secure Medical Records",
    description: "Your health data, protected and accessible.",
    Component: MemoizedSecureMedicalRecord,
  },
  {
    title: "Easy Booking",
    description: "Schedule care with a few taps.",
    Component: MemoizedEasyBooking,
  },
  {
    title: "Home Care Services",
    description: "Professional care in your comfort zone.",
    Component: MemoizedHomeCareServices,
  },
  {
    title: "Health Monitoring",
    description: "Track your progress in real-time.",
    Component: MemoizedHealthMonitoring,
  },
  {
    title: "Teleconsultation",
    description: "Expert advice, anywhere, anytime.",
    Component: MemoizedTeleconsultationView,
  },
  {
    title: "E-Prescription",
    description: "Digital prescriptions made simple.",
    Component: MemoizedEPrescription,
  },
] as const

const BentoCard = memo(({ title, description, Component }: BentoCardProps) => {
  // ✅ Debug log pour tracer les mount/unmount des cartes
  useEffect(() => {
    console.log('🟩 MOUNT BentoCard:', title)
    return () => console.log('🟥 UNMOUNT BentoCard:', title)
  }, [title])

  return (
    <div className="overflow-hidden rounded-2xl border border-border flex flex-col justify-start items-start relative bg-card">
    {/* ✅ Remplacement du backdrop-blur par un effet CSS optimisé */}
    <div
      className="absolute inset-0 rounded-2xl bg-white/5"
      style={{
        background: "rgba(255, 255, 255, 0.05)",
        // ❌ Supprimé backdropFilter qui cause les problèmes
        // ✅ Utilisation d'un background simple pour la performance
      }}
    />
    <div className="absolute inset-0 bg-gradient-to-br from-black/5 to-transparent rounded-2xl" />

    <div className="self-stretch p-6 flex flex-col justify-start items-start gap-2 relative z-20">
      <div className="self-stretch flex flex-col justify-start items-start gap-1.5">
        <p className="self-stretch text-foreground text-lg font-normal leading-7">
          {title} <br />
          <span className="text-muted-foreground">{description}</span>
        </p>
      </div>
    </div>
    <div className="self-stretch h-72 relative z-20">
      <Component />
    </div>
  </div>
  )
})

export const BentoSection = memo(function BentoSection() {
  // ✅ Debug log pour tracer les mount/unmount de la grille
  useEffect(() => {
    console.log('🟦 MOUNT Grid')
    return () => console.log('🟥 UNMOUNT Grid')
  }, [])

  // ✅ Utilise CARDS figé hors composant (aucune nouvelle référence)
  const cards = CARDS

  return (
    <section className="w-full px-5 flex flex-col justify-center items-center overflow-visible bg-transparent">
      <div className="w-full py-8 md:py-16 relative flex flex-col justify-start items-start gap-6">
        <div className="w-[200px] h-[400px] md:w-[300px] md:h-[600px] lg:w-[547px] lg:h-[938px] absolute top-[200px] md:top-[400px] lg:top-[614px] left-[20px] md:left-[50px] lg:left-[80px] origin-top-left rotate-[-33.39deg] bg-primary/10 blur-[50px] md:blur-[80px] lg:blur-[130px] z-0" />
        <div className="self-stretch py-8 md:py-14 flex flex-col justify-center items-center gap-2 z-10">
          <div className="flex flex-col justify-start items-center gap-4">
            <h2 className="w-full max-w-3xl text-center text-foreground text-4xl md:text-6xl font-semibold leading-tight md:leading-[66px]">
              A Connected & Personalized Care Experience
            </h2>
            <p className="w-full max-w-2xl text-center text-muted-foreground text-lg md:text-xl font-medium leading-relaxed">
              Explore how NurseHub uses technology to deliver outstanding care that's convenient, secure, and always
              responsive to your needs.
            </p>
          </div>
        </div>
        <div className="self-stretch grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10 z-10">
          {cards.map((card) => (
            <BentoCard key={card.title} {...card} />
          ))}
        </div>
      </div>
    </section>
  )
})
