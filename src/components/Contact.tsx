import React, { useState } from 'react'
import { Mail, Phone, MapPin, Linkedin, Instagram, Twitter, MessageSquare, Send } from 'lucide-react'

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      // Store form submission in Supabase
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
        alert('There was an error sending your message. Please try again.')
      } else {
        setFormData({ name: '', email: '', subject: '', message: '' })
        alert('Thank you for your message! Miran will get back to you soon.')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('There was an error sending your message. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      value: "contact@miransafiny.com",
      link: "mailto:contact@miransafiny.com"
    },
    {
      icon: Phone,
      title: "WhatsApp Business",
      value: "+964 750 123 4567",
      link: "https://wa.me/9647501234567"
    },
    {
      icon: MapPin,
      title: "Location",
      value: "Erbil, Kurdistan Region, Iraq",
      link: "#"
    }
  ]

  const socialLinks = [
    {
      icon: Linkedin,
      name: "LinkedIn",
      url: "https://linkedin.com/in/miransafiny",
      color: "blue"
    },
    {
      icon: Instagram,
      name: "Instagram",
      url: "https://instagram.com/miransafiny",
      color: "pink"
    },
    {
      icon: Twitter,
      name: "Twitter",
      url: "https://twitter.com/miran_marketing",
      color: "sky"
    },
    {
      icon: MessageSquare,
      name: "WhatsApp",
      url: "https://wa.me/9647501234567",
      color: "emerald"
    }
  ]

  return (
    <section id="contact" className="py-20 bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">Get In Touch</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-amber-500 to-amber-600 mx-auto mb-8"></div>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Ready to discuss partnerships, consultations, or media opportunities? 
            Let's connect and explore how we can work together.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Information */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-2xl shadow-2xl">
              <h3 className="text-2xl font-bold text-white mb-6">Contact Information</h3>
              
              <div className="space-y-6 mb-8">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="bg-amber-500/20 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                      <info.icon className="h-6 w-6 text-amber-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-1">{info.title}</h4>
                      {info.link === "#" ? (
                        <p className="text-slate-300">{info.value}</p>
                      ) : (
                        <a href={info.link} className="text-amber-400 hover:text-amber-300 transition-colors duration-200">
                          {info.value}
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <h4 className="font-semibold text-white mb-4">Follow Miran</h4>
                <div className="flex space-x-4">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.url}
                      className="bg-amber-500/20 hover:bg-amber-500/30 w-12 h-12 rounded-lg flex items-center justify-center transition-all duration-300 transform hover:scale-110"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <social.icon className="h-6 w-6 text-amber-400" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-white to-slate-50 p-8 rounded-2xl shadow-2xl border border-slate-200">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Send a Message</h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors duration-200 bg-white shadow-sm"
                      placeholder="Your full name"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors duration-200 bg-white shadow-sm"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-slate-700 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors duration-200 bg-white shadow-sm"
                    placeholder="What's this about?"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors duration-200 resize-vertical bg-white shadow-sm"
                    placeholder="Tell Miran about your project, partnership idea, or inquiry..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 disabled:from-amber-400 disabled:to-amber-500 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <Send className="ml-2 h-5 w-5" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Contact