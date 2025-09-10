"use client"

import { BentoSection } from "@/components/bento-section"
import { CTASection } from "@/components/cta-section"
import { FAQSection } from "@/components/faq-section"
import { FooterSection } from "@/components/footer-section"
import { HeroSection } from "@/components/hero-section"
import { PricingSection } from "@/components/pricing-section"
import { useEffect, memo } from "react"
import { useAssetPersistence } from "@/hooks/useAssetPersistence"

// ✅ Mémoriser la page principale pour éviter les re-renders
const LandingPage = memo(function LandingPage() {
  // ✅ Hook pour maintenir les assets en mémoire
  useAssetPersistence()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <>
      <main className="flex min-h-screen flex-col bg-background">
        <HeroSection />
        <div className="container mx-auto px-4">
          <section id="services-section" className="py-16">
            <BentoSection />
          </section>
          <section id="pricing-section" className="py-16">
            <PricingSection />
          </section>
          <section id="faq-section" className="py-16">
            <FAQSection />
          </section>
          <section id="cta-section" className="py-16">
            <CTASection />
          </section>
        </div>
        <FooterSection />
      </main>
    </>
  )
})

export default LandingPage
