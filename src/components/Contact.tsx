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
            {/* CHANGED: left-0 -> start-0 */}
            <span
              className="absolute start-0 -bottom-1 h-[6px] w-0 animate-[wipe_900ms_ease-out_forwards]"
              style={{ background: ACCENT }}
            />
          </div>
          <p className="mt-6 text-white/80 max-w-2xl">{t('contact.sub')}</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="relative rounded-0xl border border-white/10 bg-white/[0.01] p-8 overflow-hidden">
              {/* CHANGED: left-0 -> start-0 */}
              <span className="absolute top-0 start-0 h-[2px] w-[12%]" style={{ backgroundColor: ACCENT }} />
              
              <h3 className="text-xl font-bold mb-8 uppercase tracking-wider">{t('contact.infoTitle')}</h3>
              <div className="space-y-8">
                {contactInfo.map((item, i) => (
                  <div key={i} className="flex items-start">
                    <item.icon className="w-5 h-5 mt-1 text-[#007BFF]" />
                    {/* CHANGED: ml-4 -> ms-4 */}
                    <div className="ms-4">
                      <p className="text-sm text-gray-500 uppercase tracking-wider mb-1">{t(item.titleKey)}</p>
                      {item.link !== '#' ? (
                        <a href={item.link} className="text-white/90 hover:text-white transition-colors">
                          {item.valueKey ? t(item.valueKey) : item.value}
                        </a>
                      ) : (
                        <p className="text-white/90">{item.valueKey ? t(item.valueKey) : item.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-12 pt-8 border-t border-white/10">
                <p className="text-sm text-gray-500 uppercase tracking-wider mb-4">{t('contact.follow')}</p>
                <div className="flex gap-4">
                  {socialLinks.map((social) => (
                    <a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 bg-white/5 hover:bg-[#007BFF] transition-colors rounded-none text-white"
                      title={social.name}
                    >
                      <social.icon className="w-5 h-5" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="relative rounded-0xl border border-white/10 bg-white/[0.01] p-8">
              {/* CHANGED: left-0 -> start-0 */}
              <span className="absolute top-0 start-0 h-[2px] w-[12%]" style={{ backgroundColor: ACCENT }} />
              <h3 className="text-xl font-bold mb-8 uppercase tracking-wider">{t('contact.formTitle')}</h3>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">{t('contact.fullName')}</label>
                    <input
                      required
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder={t('contact.namePh')}
                      className="w-full bg-white/5 border border-white/10 px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#007BFF] transition-colors"
                      style={accentFieldStyle}
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">{t('contact.emailLabel')}</label>
                    <input
                      required
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder={t('contact.emailPh')}
                      className="w-full bg-white/5 border border-white/10 px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#007BFF] transition-colors"
                      style={accentFieldStyle}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">{t('contact.subject')}</label>
                  <input
                    required
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder={t('contact.subjectPh')}
                    className="w-full bg-white/5 border border-white/10 px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#007BFF] transition-colors"
                    style={accentFieldStyle}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">{t('contact.message')}</label>
                  <textarea
                    required
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder={t('contact.messagePh')}
                    rows={4}
                    className="w-full bg-white/5 border border-white/10 px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#007BFF] transition-colors resize-none"
                    style={accentFieldStyle}
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group flex items-center justify-center w-full sm:w-auto bg-[#007BFF] text-white px-8 py-3 font-bold uppercase tracking-wider hover:bg-[#0056b3] transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? t('contact.sending') : t('contact.send')}
                  {/* CHANGED: ml-2 -> ms-2 */}
                  <Send className="w-4 h-4 ms-2 group-hover:translate-x-1 transition-transform" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {toast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-fade-in-up">
          <div
            className={`px-6 py-3 font-bold tracking-wide uppercase text-sm border ${
              toast.type === 'ok' ? 'bg-green-500/10 border-green-500/50 text-green-400' : 'bg-red-500/10 border-red-500/50 text-red-400'
            }`}
          >
            {toast.text}
          </div>
        </div>
      )}
    </section>
  )
}

export default Contact