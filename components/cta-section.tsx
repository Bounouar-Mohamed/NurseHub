"use client"

import React, { memo } from "react"
import { BookAppointmentButton } from "./book-appointment-button"

export const CTASection = memo(function CTASection() {


  return (
    <section className="w-full relative flex flex-col justify-center items-center overflow-visible">
      <div className="relative bg-[#78FCD6] border border-[#000000]/10 p-10 rounded-[30px] z-10 flex flex-col justify-start items-center gap-6 max-w-4xl mx-auto">
        <div className="flex flex-col justify-start items-center gap-4 text-center">
          <h2 className="text-foreground text-4xl md:text-5xl lg:text-[60px] font-semibold leading-tight md:leading-tight lg:leading-[76px] break-words max-w-3xl">
            Ready to Take Control of Your Health?
          </h2>
          <p className="text-muted-foreground text-sm md:text-base font-medium leading-[18.20px] md:leading-relaxed break-words max-w-2xl">
            Join hundreds of satisfied patients in Dubai who trust NurseHub for accessible, personalized, and quality care.
          </p>
        </div>

        <div className="hidden md:block">
          <BookAppointmentButton
            className="bg-white text-primary-foreground hover:bg-primary/90 px-6 py-2 rounded-full font-medium shadow-none"
          />
        </div>
      </div>
    </section>
  )
})
