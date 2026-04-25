'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Mail, Phone, MapPin, Clock } from 'lucide-react'

const WaveDown = ({ fill }: { fill: string }) => (
  <div className="absolute bottom-0 left-0 right-0 leading-none">
    <svg viewBox="0 0 1440 90" preserveAspectRatio="none" className="w-full h-[90px] block">
      <path d="M0,45 C180,90 360,0 540,45 C720,90 900,0 1080,45 C1260,90 1380,20 1440,45 L1440,90 L0,90 Z" fill={fill} />
    </svg>
  </div>
);

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.name && formData.email && formData.message) {
      setIsSubmitted(true)
      setFormData({ name: '', email: '', subject: '', message: '' })
      setTimeout(() => setIsSubmitted(false), 3000)
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      {/* ── Hero banner ── */}
      <section className="relative py-24 px-6 overflow-hidden bg-[#0d1b2a]">
        <div className="absolute inset-0 opacity-20">
          <Image src="/pizza-banner-2.png" alt="Hero" fill className="object-cover" priority />
        </div>
        <span className="absolute top-4 right-[10%] text-3xl opacity-20 select-none">🍕</span>
        <span className="absolute bottom-4 left-[6%] text-2xl opacity-20 select-none">🌯</span>
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <span className="inline-block bg-[#f5a623]/20 text-[#f5a623] text-xs font-bold px-4 py-1.5 rounded-full mb-3 uppercase tracking-wide">Get In Touch</span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-3">Contact <span className="text-[#f5a623]">Us</span></h1>
          <p className="text-white/70 text-base max-w-md mx-auto">We'd love to hear from you — reach out for orders, feedback or anything else.</p>
        </div>
        <WaveDown fill="#ffffff" />
      </section>

      <main className="flex-1 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Contact Information */}
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
                <div className="space-y-4">
                  <Card className="p-4 flex items-start gap-4 hover:bg-card/80 transition-colors">
                    <Phone className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-bold mb-1">Phone</h3>
                      <p className="text-muted-foreground">033 9911 1102</p>
                      <p className="text-muted-foreground">033 9911 1103</p>
                      <p className="text-muted-foreground">Helpline: 033 9911 1107</p>
                    </div>
                  </Card>

                  <Card className="p-4 flex items-start gap-4 hover:bg-card/80 transition-colors">
                    <Mail className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-bold mb-1">Email & Web</h3>
                      <p className="text-muted-foreground">info@pizza1981.com</p>
                      <p className="text-muted-foreground">www.pizza1981.com</p>
                    </div>
                  </Card>

                  <Card className="p-4 flex items-start gap-4 hover:bg-card/80 transition-colors">
                    <MapPin className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-bold mb-1">Address</h3>
                      <p className="text-muted-foreground">
                        Shop No. G-9, Eden Mall<br/>
                        Eden Value Homes, Multan Road<br/>
                        Lahore, Pakistan
                      </p>
                    </div>
                  </Card>

                  <Card className="p-4 flex items-start gap-4 hover:bg-card/80 transition-colors">
                    <Clock className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-bold mb-1">Opening Hours</h3>
                      <p className="text-muted-foreground">Every Day</p>
                      <p className="text-accent font-semibold">4:00 PM – 2:00 AM</p>
                    </div>
                  </Card>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
                
                {isSubmitted && (
                  <div className="mb-4 p-4 bg-accent/20 border border-accent rounded-lg text-accent font-semibold">
                    Thank you! Your message has been sent successfully.
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Name *</label>
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Your name"
                      className="mt-1"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Email *</label>
                    <Input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="your@email.com"
                      className="mt-1"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Subject</label>
                    <Input
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      placeholder="What is this about?"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Message *</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Your message here..."
                      rows={5}
                      className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Send Message
                  </Button>
                </form>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
