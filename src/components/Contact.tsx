import React, { useMemo, useState } from 'react'
import { Mail, Phone, MapPin, Linkedin, Instagram, Facebook, MessageSquare, Send } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { supabase } from '../lib/supabase'

const ACCENT = '#007BFF'
const accentFieldStyle: React.CSSProperties = { '--accent': ACCENT } as React.CSSProperties

const Contact: React.FC = () => {
  const { t } = useTranslation()
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [toast, setToast] = useState<{ type: 'ok' | 'err'; text: string } | null>(null)

  const contactInfo = useMemo(
    () => [
      { icon: Mail, titleKey: 'contact.email' as const, value: 'info@miransafiny.com', link: 'mailto:info@miransafiny.com' },
      { icon: Phone, titleKey: 'contact.whatsapp' as const, value: '+964 750 445 9704', link: 'https://wa.me/9647504459704' },
      { icon: MapPin, titleKey: 'contact.location' as const, valueKey: 'contact.locationValue' as const, link: '#' },
    ],
    []
  )

  const showMessageBox = (message: string, isSuccess: boolean) => {
    setToast({ type: isSuccess ? 'ok' : 'err', text: message })
    setTimeout(() => setToast(null), 3500)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const { error } = await supabase.from('contact_submissions').insert([
        {
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
          created_at: new Date().toISOString(),
        },
      ])

      if (error) {
        console.error('Error submitting form:', error)
        showMessageBox(t('contact.error'), false)
      } else {
        setFormData({ name: '', email: '', subject: '', message: '' })
        showMessageBox(t('contact.success'), true)
      }
    } catch (err) {
      console.error('Error:', err)
      showMessageBox(t('contact.error'), false)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setFormData({ ...formData, [e.target.name]: e.target.value })

  const socialLinks = [
    { icon: Linkedin, name: 'LinkedIn', url: 'https://www.linkedin.com/in/miran-safiny-48b375229/' },
    { icon: Instagram, name: 'Instagram', url: 'https://instagram.com/miran.safiny' },
    { icon: Facebook, name: 'Facebook', url: 'https://www.facebook.com/Miransafiny' },
    { icon: MessageSquare, name: 'WhatsApp', url: 'https://wa.me/9647504459704' },
  ]

  return (
    <section id="contact" className="relative bg-black text-white py-24">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(60rem 30rem at 20% -10%, #040404 60%), radial-gradient(40rem 24rem at 90% 10%, #040404, transparent 60%)',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="mb-14">
          <div className="relative inline-block">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight">{t('contact.heading')}</h2>
            <span
              className="absolute left-0 -bottom-1 h-[6px] w-0 animate-[wipe_900ms_ease-out_forwards]"
              style={{ background: ACCENT }}
            />
          </div>
          <p className="mt-6 text-white/80 max-w-2xl">{t('contact.sub')}</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="relative rounded-0xl border border-white/10 bg-white/[0.01] p-8 overflow-hidden">
              <span className="absolute top-0 left-0 h-[2px] w-16" style={{ background: ACCENT }} />
              <span className="absolute bottom-0 right-0 h-[2px] w-16" style={{ background: ACCENT }} />

              <h3 className="text-2xl font-extrabold tracking-tight mb-6">{t('contact.infoTitle')}</h3>

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
                      <div className="font-semibold">{t(info.titleKey)}</div>
                      {info.link === '#' ? (
                        <p className="text-white/70">{'valueKey' in info ? t(info.valueKey) : info.value}</p>
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
                <h4 className="font-semibold mb-4">{t('contact.follow')}</h4>
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

          <div className="lg:col-span-2">
            <div className="relative  border border-white/10 bg-white/[0.01] p-8 md:p-10">
              <span className="absolute top-0 left-0 h-[2px] w-20" style={{ background: ACCENT }} />
              <span className="absolute bottom-0 right-0 h-[2px] w-20" style={{ background: ACCENT }} />

              <h3 className="text-2xl font-extrabold tracking-tight mb-6">{t('contact.formTitle')}</h3>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm text-white/70 mb-2">
                      {t('contact.fullName')}
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3  bg-black/40 border border-white/10 text-white placeholder-white/40
                                 focus:outline-none focus:ring-4 focus:ring-[color:var(--accent)]/20 focus:border-[color:var(--accent)]"
                      style={accentFieldStyle}
                      placeholder={t('contact.namePh')}
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm text-white/70 mb-2">
                      {t('contact.emailLabel')}
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3  bg-black/40 border border-white/10 text-white placeholder-white/40
                                 focus:outline-none focus:ring-4 focus:ring-[color:var(--accent)]/20 focus:border-[color:var(--accent)]"
                      style={accentFieldStyle}
                      placeholder={t('contact.emailPh')}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm text-white/70 mb-2">
                    {t('contact.subject')}
                  </label>
                  <input
                    id="subject"
                    name="subject"
                    type="text"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3  bg-black/40 border border-white/10 text-white placeholder-white/40
                               focus:outline-none focus:ring-4 focus:ring-[color:var(--accent)]/20 focus:border-[color:var(--accent)]"
                    style={accentFieldStyle}
                    placeholder={t('contact.subjectPh')}
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm text-white/70 mb-2">
                    {t('contact.message')}
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    required
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3  bg-black/40 border border-white/10 text-white placeholder-white/40 resize-vertical
                               focus:outline-none focus:ring-4 focus:ring-[color:var(--accent)]/20 focus:border-[color:var(--accent)]"
                    style={accentFieldStyle}
                    placeholder={t('contact.messagePh')}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full  font-semibold py-4 px-6 flex items-center justify-center gap-2
                             text-black transition-transform duration-300 hover:scale-[1.01] disabled:opacity-60"
                  style={{
                    backgroundImage: `linear-gradient(90deg, ${ACCENT}, #35d7ff)`,
                    boxShadow: '0 10px 30px #040404',
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black/70" />
                      {t('contact.sending')}
                    </>
                  ) : (
                    <>
                      {t('contact.send')}
                      <Send className="h-5 w-5" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

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
              backdropFilter: 'blur(8px)',
            }}
          >
            {toast.text}
          </div>
        )}
      </div>

      <style>{`
        @keyframes wipe { from { width: 0 } to { width: 100% } }
      `}</style>
    </section>
  )
}

export default Contact
