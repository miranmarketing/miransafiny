import React, { useState } from 'react'
import { Mail, Phone, MapPin, Linkedin, Instagram, Facebook, MessageSquare, Send } from 'lucide-react'
import { supabase } from '../lib/supabase'

const ACCENT = '#007BFF' // Miran blue

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [toast, setToast] = useState<{ type: 'ok' | 'err'; text: string } | null>(null)

  const showMessageBox = (message: string, isSuccess: boolean) => {
    // keep your helper but style it to match site + auto-dismiss
    setToast({ type: isSuccess ? 'ok' : 'err', text: message })
    setTimeout(() => setToast(null), 3500)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const { error } = await supabase
        .from('contact_submissions')
        .insert([{
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
          created_at: new Date().toISOString()
        }])

      if (error) {
        console.error('Error submitting form:', error)
        showMessageBox('There was an error sending your message. Please try again.', false)
      } else {
        setFormData({ name: '', email: '', subject: '', message: '' })
        showMessageBox('Thank you! We’ll get back to you soon.', true)
      }
    } catch (err) {
      console.error('Error:', err)
      showMessageBox('There was an error sending your message. Please try again.', false)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setFormData({ ...formData, [e.target.name]: e.target.value })

  const contactInfo = [
    { icon: Mail,  title: 'Email',              value: 'info@miransafiny.com',        link: 'mailto:info@miransafiny.com' },
    { icon: Phone, title: 'WhatsApp Business',  value: '+964 750 445 9704',           link: 'https://wa.me/9647504459704' },
    { icon: MapPin,title: 'Location',           value: 'Erbil, Kurdistan Region, Iraq', link: '#' }
  ]

  const socialLinks = [
    { icon: Linkedin,      name: 'LinkedIn', url: 'https://www.linkedin.com/in/miran-safiny-48b375229/' },
    { icon: Instagram,     name: 'Instagram',url: 'https://instagram.com/miran.safiny' },
    { icon: Facebook,      name: 'Facebook', url: 'https://www.facebook.com/Miransafiny' },
    { icon: MessageSquare, name: 'WhatsApp', url: 'https://wa.me/9647504459704' }
  ]

  return (
    <section id="contact" className="relative bg-black text-white py-24">
      {/* Accent glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(60rem 30rem at 20% -10%, #040404 60%), radial-gradient(40rem 24rem at 90% 10%, #040404, transparent 60%)'
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Heading */}
        <div className="mb-14">
          <div className="relative inline-block">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight">GET IN TOUCH</h2>
            <span
              className="absolute left-0 -bottom-1 h-[6px] w-0 animate-[wipe_900ms_ease-out_forwards]"
              style={{ background: ACCENT }}
            />
          </div>
          <p className="mt-6 text-white/80 max-w-2xl">
            Partnerships, consultations, or media opportunities — let’s connect and build something meaningful.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Info Card */}
          <div className="lg:col-span-1">
            <div className="relative rounded-0xl border border-white/10 bg-white/[0.01] p-8 overflow-hidden">
              <span className="absolute top-0 left-0 h-[2px] w-16" style={{ background: ACCENT }} />
              <span className="absolute bottom-0 right-0 h-[2px] w-16" style={{ background: ACCENT }} />

              <h3 className="text-2xl font-extrabold tracking-tight mb-6">Contact Information</h3>

              <div className="space-y-6 mb-8">
                {contactInfo.map((info, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div
                      className="h-12 w-12 rounded-0xl border border-white/10 bg-white/[0.01] flex items-center justify-center"
                      style={{ boxShadow: '0 0 0 2px rgba(255,255,255,0.04), inset 0 0 0 1px rgba(255,255,255,0.06)' }}
                    >
                      <info.icon className="h-6 w-6" style={{ color: ACCENT }} />
                    </div>
                    <div>
                      <div className="font-semibold">{info.title}</div>
                      {info.link === '#' ? (
                        <p className="text-white/70">{info.value}</p>
                      ) : (
                        <a
                          href={info.link}
                          className="text-white/90 hover:text-white"
                          style={{ textDecorationColor: ACCENT, textDecorationThickness: 2, textUnderlineOffset: 4 }}
                        >
                          {info.value}
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <h4 className="font-semibold mb-4">Follow</h4>
                <div className="flex gap-3">
                  {socialLinks.map((s, i) => (
                    <a
                      key={i}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative h-12 w-12  border border-white/10 bg-white/[0.04] flex items-center justify-center transition-transform duration-200 hover:-translate-y-0.5"
                    >
                      <s.icon className="h-6 w-6 text-white/90 group-hover:text-white transition-colors" />
                      <span
                        className="absolute inset-0  opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ boxShadow: `inset 0 0 0 2px ${ACCENT}` }}
                      />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Form Card */}
          <div className="lg:col-span-2">
            <div className="relative  border border-white/10 bg-white/[0.01] p-8 md:p-10">
              <span className="absolute top-0 left-0 h-[2px] w-20" style={{ background: ACCENT }} />
              <span className="absolute bottom-0 right-0 h-[2px] w-20" style={{ background: ACCENT }} />

              <h3 className="text-2xl font-extrabold tracking-tight mb-6">Send a Message</h3>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm text-white/70 mb-2">Full Name</label>
                    <input
                      id="name" name="name" type="text" required value={formData.name} onChange={handleChange}
                      className="w-full px-4 py-3  bg-black/40 border border-white/10 text-white placeholder-white/40
                                 focus:outline-none focus:ring-4 focus:ring-[color:var(--accent)]/20 focus:border-[color:var(--accent)]"
                      style={{ ['--accent' as any]: ACCENT }}
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm text-white/70 mb-2">Email Address</label>
                    <input
                      id="email" name="email" type="email" required value={formData.email} onChange={handleChange}
                      className="w-full px-4 py-3  bg-black/40 border border-white/10 text-white placeholder-white/40
                                 focus:outline-none focus:ring-4 focus:ring-[color:var(--accent)]/20 focus:border-[color:var(--accent)]"
                      style={{ ['--accent' as any]: ACCENT }}
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm text-white/70 mb-2">Subject</label>
                  <input
                    id="subject" name="subject" type="text" required value={formData.subject} onChange={handleChange}
                    className="w-full px-4 py-3  bg-black/40 border border-white/10 text-white placeholder-white/40
                               focus:outline-none focus:ring-4 focus:ring-[color:var(--accent)]/20 focus:border-[color:var(--accent)]"
                    style={{ ['--accent' as any]: ACCENT }}
                    placeholder="What’s this about?"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm text-white/70 mb-2">Message</label>
                  <textarea
                    id="message" name="message" rows={6} required value={formData.message} onChange={handleChange}
                    className="w-full px-4 py-3  bg-black/40 border border-white/10 text-white placeholder-white/40 resize-vertical
                               focus:outline-none focus:ring-4 focus:ring-[color:var(--accent)]/20 focus:border-[color:var(--accent)]"
                    style={{ ['--accent' as any]: ACCENT }}
                    placeholder="Tell Miran about your project, partnership idea, or inquiry…"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full  font-semibold py-4 px-6 flex items-center justify-center gap-2
                             text-black transition-transform duration-300 hover:scale-[1.01] disabled:opacity-60"
                  style={{
                    backgroundImage: `linear-gradient(90deg, ${ACCENT}, #35d7ff)`,
                    boxShadow: '0 10px 30px #040404'
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black/70" />
                      Sending…
                    </>
                  ) : (
                    <>
                      Send Message
                      <Send className="h-5 w-5" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Toast (site style) */}
      <div
        role="status"
        aria-live="polite"
        className="pointer-events-none fixed inset-0 flex items-start justify-center pt-6 md:pt-10"
      >
        {toast && (
          <div
            className="pointer-events-auto px-5 py-4 rounded-0xl border shadow-2xl"
            style={{
              background: toast.type === 'ok' ? 'rgba(0,191,238,0.1)' : 'rgba(255,60,60,0.08)',
              borderColor: toast.type === 'ok' ? 'rgba(0,191,238,0.35)' : 'rgba(255,60,60,0.35)',
              color: toast.type === 'ok' ? '#eafaff' : '#ffecec',
              backdropFilter: 'blur(8px)'
            }}
          >
            {toast.text}
          </div>
        )}
      </div>

      {/* Local styles */}
      <style>{`
        @keyframes wipe { from { width: 0 } to { width: 100% } }
      `}</style>
    </section>
  )
}

export default Contact
