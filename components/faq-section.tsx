"use client"

import React, { useState, useCallback, memo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown } from "lucide-react"

interface FAQItemProps {
  question: string
  answer: string
  isOpen: boolean
  onToggle: () => void
}

const FAQItem = memo(({ question, answer, isOpen, onToggle }: FAQItemProps) => {
  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      onToggle();
    },
    [onToggle]
  );

  return (
    <motion.div
      layout
      initial={false}
      className="w-full bg-accent shadow-[0px_2px_4px_rgba(0,0,0,0.05)] overflow-hidden rounded-[10px] outline outline-1 outline-border outline-offset-[-1px] cursor-pointer"
      onClick={handleClick}
      style={{
        willChange: "transform",
        backfaceVisibility: "hidden",
        WebkitFontSmoothing: "subpixel-antialiased",
      }}
    >
      {/* Header */}
      <div className="w-full px-5 py-4 flex justify-between items-center gap-5 text-left">
        <div className="flex-1 text-foreground text-base font-medium leading-6 break-words">{question}</div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="flex justify-center items-center"
        >
          <ChevronDown className="w-6 h-6 text-muted-foreground-dark" />
        </motion.div>
      </div>

      {/* Animated content */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            layout
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="px-5 pb-4 pt-2"
          >
            <div className="text-muted-foreground text-base leading-6 break-words">{answer}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
});
FAQItem.displayName = "FAQItem";

export function FAQSection() {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set())

  const toggleItem = (index: number) => {
    const newOpenItems = new Set(openItems)
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index)
    } else {
      newOpenItems.add(index)
    }
    setOpenItems(newOpenItems)
  }

  const faqData = [
    {
      question: "What services does NurseHub offer?",
      answer: "NurseHub provides a comprehensive range of healthcare services including home nursing care, teleconsultations, health monitoring, and medical record management. Our services are designed to deliver professional healthcare right to your doorstep in Dubai."
    },
    {
      question: "How do I book a nurse?",
      answer: "Booking a nurse is simple through our platform. You can schedule an appointment through our website or mobile app, choose your preferred time slot, and specify your care requirements. Our team will match you with a qualified healthcare professional."
    },
    {
      question: "Are your nurses licensed and qualified?",
      answer: "Yes, all our nurses are fully licensed and qualified professionals. They undergo rigorous screening and are registered with the Dubai Health Authority (DHA). We ensure our team maintains the highest standards of healthcare delivery."
    },
    {
      question: "What areas do you serve in Dubai?",
      answer: "We provide services across all major areas in Dubai, including Downtown Dubai, Dubai Marina, Palm Jumeirah, and surrounding emirates. Contact us to confirm service availability in your specific location."
    }
  ]

  return (
    <section className="w-full px-5 relative flex flex-col justify-center items-center">
      <div className="w-[150px] h-[250px] md:w-[200px] md:h-[350px] lg:w-[300px] lg:h-[500px] absolute top-[50px] md:top-[100px] lg:top-[150px] left-1/2 -translate-x-1/2 origin-top-left rotate-[-33.39deg] bg-primary/10 blur-[50px] md:blur-[75px] lg:blur-[100px] z-0" />
      <div className="self-stretch pt-8 pb-8 md:pt-14 md:pb-14 flex flex-col justify-center items-center gap-2 relative z-10">
        <div className="flex flex-col justify-start items-center gap-4">
          <h2 className="w-full max-w-lg text-center text-foreground text-4xl font-semibold leading-10 break-words">
            Frequently Asked Questions
          </h2>
          <p className="self-stretch text-center text-muted-foreground text-sm font-medium leading-[18.20px] break-words">
            Find answers to your questions about our premium healthcare services in Dubai.
          </p>
        </div>
      </div>
      <div className="w-full max-w-[600px] flex flex-col justify-start items-start gap-4 relative z-10">
        {faqData.map((faq, index) => (
          <FAQItem
            key={index}
            {...faq}
            isOpen={openItems.has(index)}
            onToggle={() => toggleItem(index)}
          />
        ))}
      </div>
    </section>
  )
}
