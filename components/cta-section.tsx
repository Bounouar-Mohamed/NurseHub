"use client"

import React, { memo } from "react"
import { BookAppointmentButton } from "./book-appointment-button"

export const CTASection = memo(function CTASection() {


  return (
    <section className="w-full relative flex flex-col justify-center items-center overflow-hidden px-4 sm:px-6 md:px-8">
      <div className="relative bg-[#78FCD6] border border-[#000000]/10 p-6 sm:p-8 md:p-10 rounded-[20px] sm:rounded-[30px] z-10 flex flex-col justify-start items-center gap-4 sm:gap-6 max-w-4xl mx-auto w-full">
        <div className="flex flex-col justify-start items-center gap-3 sm:gap-4 text-center">
          <h2 className="text-foreground text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-[60px] font-semibold leading-tight break-words max-w-3xl">
            Ready to Take Control of Your Health?
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base md:text-lg font-medium leading-relaxed break-words max-w-2xl">
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
