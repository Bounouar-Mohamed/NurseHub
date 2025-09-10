"use client"

import React, { useState, memo } from "react"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"

export const PricingSection = memo(function PricingSection() {
  const [isAnnual, setIsAnnual] = useState(true)

  const pricingPlans = [
    {
      name: "Single Consultation",
      monthlyPrice: "150 AED",
      annualPrice: "150 AED",
      description: "Perfect for a one-time need or a first consultation.",
      features: [
        "30-minute teleconsultation",
        "E-prescription included",
        "Patient record access",
        "Personalized advice",
      ],
      buttonText: "Book Now",
      buttonClass: "bg-black/30 text-white hover:bg-black/90",
      featureTitle: "Includes:",
    },
    {
      name: "Monthly Care",
      monthlyPrice: "450 AED",
      annualPrice: "450 AED",
      description: "For regular and proactive health monitoring.",
      features: [
        "2 teleconsultations/month",
        "7-day priority access",
        "Dedicated nurse follow-up",
        "Treatment alerts & reminders",
        "Evolving care plan",
      ],
      buttonText: "Choose Plan",
      buttonClass: "bg-white text-dark hover:bg-gray-100",
      popular: true,
      featureTitle: "Everything in Single, plus:",
    },
    {
      name: "Family Package",
      monthlyPrice: "800 AED",
      annualPrice: "800 AED",
      description: "Peace of mind for your entire family.",
      features: [
        "All Monthly Care features, for up to 4 members",
        "Pediatric consultations included",
        "One home visit per quarter",
        "Family care coordination",
      ],
      buttonText: "Contact Us",
      buttonClass: "bg-secondary text-secondary-foreground hover:bg-secondary/90",
      featureTitle: "Everything in Monthly, plus:",
    },
  ]

  return (
    <section className="w-full px-5 overflow-hidden flex flex-col justify-start items-center my-0 py-8 md:py-4">
      <div className="self-stretch relative flex flex-col justify-center items-center gap-6 py-0">
        <div className="flex flex-col justify-start items-center gap-4">
          <h2 className="text-center text-foreground text-4xl md:text-5xl font-semibold leading-tight md:leading-[40px]">
            Plans Tailored to Your Needs
          </h2>
          <p className="self-stretch text-center text-muted-foreground text-sm font-medium leading-tight">
            Whether for a one-time consultation or comprehensive monitoring, we have the right plan for you.
          </p>
        </div>
      </div>
      <div className="self-stretch px-5 flex flex-col md:flex-row justify-center items-start gap-4 md:gap-6 mt-[7.5rem] w-full max-w-7xl mx-auto gpu-accelerated">
        {pricingPlans.map((plan) => (
          <div
            key={plan.name}
            className={`flex-1 p-4 overflow-hidden rounded-xl flex flex-col justify-start items-start gap-6 ${plan.popular ? "bg-primary shadow-[0px_4px_8px_-2px_rgba(0,0,0,0.10)]" : "bg-muted/50"}`}
            style={plan.popular ? {} : { outline: "1px solid hsl(var(--border))", outlineOffset: "-1px" }}
          >
            <div className="self-stretch flex flex-col justify-start items-start gap-6">
              <div className="self-stretch flex flex-col justify-start items-start gap-8">
                <div
                  className={`w-full h-5 text-sm font-medium leading-tight ${plan.popular ? "text-primary-foreground" : "text-foreground"}`}
                >
                  {plan.name}
                  {plan.popular && (
                    <div className="ml-2 px-2 overflow-hidden rounded-full justify-center items-center gap-2.5 inline-flex mt-0 py-0.5 bg-gradient-to-b from-primary-light/50 to-primary-light bg-white">
                      <div className="text-center text-primary-foreground text-xs font-normal leading-tight break-words">
                        Popular
                      </div>
                    </div>
                  )}
                </div>
                <div className="self-stretch flex flex-col justify-start items-start gap-1">
                  <div className="flex justify-start items-center gap-1.5">
                    <div
                      className={`relative h-10 flex items-center text-3xl font-medium leading-10 ${plan.popular ? "text-primary-foreground" : "text-foreground"}`}
                    >
                      {isAnnual ? plan.annualPrice : plan.monthlyPrice}
                    </div>
                    <div
                      className={`text-center text-sm font-medium leading-tight ${plan.popular ? "text-primary-foreground/70" : "text-muted-foreground"}`}
                    >
                      /month
                    </div>
                  </div>
                  <div
                    className={`self-stretch text-sm font-medium leading-tight ${plan.popular ? "text-primary-foreground/70" : "text-muted-foreground"}`}
                  >
                    {plan.description}
                  </div>
                </div>
              </div>
              <Button
                className={`self-stretch px-5 py-2 rounded-[40px] flex justify-center items-center ${plan.buttonClass}`}
              >
                <div className="px-1.5 flex justify-center items-center gap-2">
                  <span className="text-center text-sm font-medium leading-tight">{plan.buttonText}</span>
                </div>
              </Button>
            </div>
            <div className="self-stretch flex flex-col justify-start items-start gap-4">
              <div
                className={`self-stretch text-sm font-medium leading-tight ${plan.popular ? "text-primary-foreground/70" : "text-muted-foreground"}`}
              >
                {plan.featureTitle}
              </div>
              <div className="self-stretch flex flex-col justify-start items-start gap-3">
                {plan.features.map((feature) => (
                  <div key={feature} className="self-stretch flex justify-start items-center gap-2">
                    <div className="w-4 h-4 flex items-center justify-center">
                      <Check
                        className={`w-full h-full ${plan.popular ? "text-primary-foreground" : "text-muted-foreground"}`}
                        strokeWidth={2}
                      />
                    </div>
                    <div
                      className={`leading-tight font-normal text-sm text-left ${plan.popular ? "text-primary-foreground" : "text-muted-foreground"}`}
                    >
                      {feature}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
})
