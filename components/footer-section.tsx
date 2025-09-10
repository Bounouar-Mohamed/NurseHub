"use client"

import { Twitter, Github, Linkedin } from "lucide-react"

export function FooterSection() {
  return (
    <footer className="w-full px-5 py-10 md:py-[70px] snap-end snap-always">
      <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-8 md:gap-0">
        {/* Left Section: Logo, Description, Social Links */}
        <div className="flex flex-col justify-start items-start gap-8 p-4 md:p-8">
          <div className="flex gap-3 items-stretch justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="160"
              height="40"
              fill="none"
              viewBox="0 0 252 63"
            >
              <path
                fill="#000"
                d="M59.84 53.842V30.639h4.98v22.617q0 2.109 2.11 3.516a5.74 5.74 0 0 0 3.105.878v4.922q-5.624 0-8.672-4.394-1.523-2.227-1.523-4.336m12.773 8.73V57.65q3.165 0 4.63-2.52.525-.937.526-1.874V30.639h4.981v23.203q0 2.754-2.52 5.449-3.046 3.223-7.617 3.281m14.825-.293V30.58h4.98v4.336q1.524-2.578 4.57-3.809 1.64-.645 3.223-.644h1.055l-1.172 4.805q-3.224.058-5.742 3.457-1.934 2.695-1.934 5.566v17.988zm15.878-8.32 4.629-.879q0 2.637 2.754 4.16 1.348.645 2.578.703v4.63q-5.683 0-8.496-4.102-1.465-2.169-1.465-4.512m.293-14.414q0-5.333 4.864-7.91 2.343-1.23 4.687-1.23v4.57q-2.695 0-4.16 2.226-.762 1.114-.762 2.344 0 1.874 2.93 3.047 2.226.937 8.613 2.46 3.985.822 5.684 3.926.879 1.641.879 3.692 0 5.625-4.512 8.32-2.637 1.582-6.035 1.582v-4.629q2.695 0 4.512-1.875 1.289-1.347 1.289-3.164 0-2.343-4.629-3.75-1.172-.351-3.75-.996-2.754-.645-3.985-1.055-4.452-1.757-5.39-5.331a10.3 10.3 0 0 1-.235-2.227m12.129-4.512v-4.629q5.04 0 8.145 3.75 1.933 2.402 1.933 5.04l-4.628.761q0-3.222-3.516-4.512-1.055-.41-1.934-.41m14.063 18.574v-14.53q.058-2.697 2.578-5.333 3.047-3.105 7.383-3.164v4.629q-2.812 0-4.395 2.46-.644 1.056-.644 1.935v3.984h13.125v-3.985q0-2.636-2.696-3.867a5.8 5.8 0 0 0-2.519-.586v-4.57q4.042 0 7.207 2.871 2.637 2.52 2.695 5.567v9.316h-17.812v5.273q0 1.641 1.875 3.047 1.523 1.055 3.222 1.055v4.57q-5.331 0-8.379-4.336-1.64-2.284-1.64-4.336m12.832 8.672V57.65q3.516 0 5.273-3.047.352-.645.528-1.23l4.16 1.524q-1.055 4.043-4.805 6.093-2.402 1.29-5.156 1.29m28.711 0V21.264h5.097v17.87h5.274v4.981h-5.274V62.28zm13.301-18.164v-4.98h5.214V21.264h5.157v41.015h-5.157V44.115zm14.941 9.727V30.639h4.98v22.617q0 2.109 2.11 3.516a5.74 5.74 0 0 0 3.105.878v4.922q-5.625 0-8.672-4.394-1.523-2.227-1.523-4.336m12.773 8.73V57.65q3.165 0 4.629-2.52.528-.937.528-1.874V30.639h4.98v23.203q0 2.754-2.519 5.449-3.048 3.223-7.618 3.281m14.766-.293V20.854h5.039v41.425zm7.91 0v-4.746h4.629q2.286 0 3.867-2.05.762-1.056.762-1.993V39.31q0-1.757-1.934-3.105-1.289-.879-2.636-.879h-4.688V30.58h4.688q4.688 0 7.617 3.926 1.7 2.285 1.758 4.57v14.531q0 2.695-2.344 5.391-2.871 3.223-7.149 3.281zM53.413 46.76q0 4.4-1.92 7.92t-5.28 5.6q-3.36 2-7.84 2-2.989-.002-5.516-.894v-8.344a8 8 0 0 0 1.756 1.477 7.27 7.27 0 0 0 3.76 1.04q2 0 3.68-1.04t2.64-2.8q1.04-1.759 1.04-3.92v-7.612a4.998 4.998 0 0 0 0-8.851V5.319h7.68zm-37.84-42.4q3.094 0 5.673.958v8.288a7.9 7.9 0 0 0-1.833-1.487 7.4 7.4 0 0 0-3.84-1.04 7.4 7.4 0 0 0-3.84 1.04 8.05 8.05 0 0 0-2.72 2.8q-.96 1.76-.96 3.92v12.498a4.998 4.998 0 0 0 0 8.848V61.32H.373V19.88q0-4.4 1.92-7.92t5.36-5.52q3.441-2.08 7.92-2.08m15.28 43.44q0 .135.004.268v12.437q-.203-.11-.404-.226-3.36-2.08-5.28-5.6t-1.92-7.92v-5.997h7.6zm-7.28-41.36q3.44 2 5.36 5.519t1.92 7.92v10.883h-7.6V18.84q0-.167-.007-.33V6.249q.166.093.327.19"
              />
              <path
                fill="#78FCD6"
                d="M30.852 60.502a15.19 15.19 0 0 1-7.582-13.146V40.73h7.582zM23.248 6.248a14.47 14.47 0 0 1 7.607 12.74v11.77h-7.607zM10.331 39.621a3.954 3.954 0 1 1 0-7.908h33.123a3.954 3.954 0 1 1 0 7.908z"
              />
            </svg>

          </div>
          <p className="text-foreground/90 text-sm font-medium leading-[18px] text-left">
            Your health, our excellence.
          </p>
          <div className="flex justify-start items-start gap-3">
            <a href="#" aria-label="Twitter" className="w-4 h-4 flex items-center justify-center">
              <Twitter className="w-full h-full text-muted-foreground" />
            </a>
            <a href="#" aria-label="GitHub" className="w-4 h-4 flex items-center justify-center">
              <Github className="w-full h-full text-muted-foreground" />
            </a>
            <a href="#" aria-label="LinkedIn" className="w-4 h-4 flex items-center justify-center">
              <Linkedin className="w-full h-full text-muted-foreground" />
            </a>
          </div>
        </div>
        {/* Right Section: Product, Company, Resources */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-12 p-4 md:p-8 w-full md:w-auto">
          <div className="flex flex-col justify-start items-start gap-3">
            <h3 className="text-muted-foreground text-sm font-medium leading-5">Our Services</h3>
            <div className="flex flex-col justify-end items-start gap-2">
              <a href="#services-section" className="text-foreground text-sm font-normal leading-5 hover:underline">
                Teleconsultation
              </a>
              <a href="#services-section" className="text-foreground text-sm font-normal leading-5 hover:underline">
                Home Care
              </a>
              <a href="#pricing-section" className="text-foreground text-sm font-normal leading-5 hover:underline">
                Pricing
              </a>
              <a href="#testimonials-section" className="text-foreground text-sm font-normal leading-5 hover:underline">
                Testimonials
              </a>
            </div>
          </div>
          <div className="flex flex-col justify-start items-start gap-3">
            <h3 className="text-muted-foreground text-sm font-medium leading-5">Company</h3>
            <div className="flex flex-col justify-center items-start gap-2">
              <a href="#" className="text-foreground text-sm font-normal leading-5 hover:underline">
                About us
              </a>
              <a href="#" className="text-foreground text-sm font-normal leading-5 hover:underline">
                Our team
              </a>
              <a href="#" className="text-foreground text-sm font-normal leading-5 hover:underline">
                Careers
              </a>
              <a href="#" className="text-foreground text-sm font-normal leading-5 hover:underline">
                Brand
              </a>
              <a href="#" className="text-foreground text-sm font-normal leading-5 hover:underline">
                Contact
              </a>
            </div>
          </div>
          <div className="flex flex-col justify-start items-start gap-3">
            <h3 className="text-muted-foreground text-sm font-medium leading-5">Resources</h3>
            <div className="flex flex-col justify-center items-start gap-2">
              <a href="#" className="text-foreground text-sm font-normal leading-5 hover:underline">
                Terms of use
              </a>
              <a href="#" className="text-foreground text-sm font-normal leading-5 hover:underline">
                API Reference
              </a>
              <a href="#" className="text-foreground text-sm font-normal leading-5 hover:underline">
                Documentation
              </a>
              <a href="#" className="text-foreground text-sm font-normal leading-5 hover:underline">
                Community
              </a>
              <a href="#" className="text-foreground text-sm font-normal leading-5 hover:underline">
                Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
