import React, { useState } from 'react'
import { Mail, Phone, MapPin, Linkedin, Instagram, Twitter, MessageSquare, Send } from 'lucide-react'
import { supabase } from '../lib/supabase' // Assuming supabase is correctly imported and configured

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Custom message box function to replace alert()
  const showMessageBox = (message: string, isSuccess: boolean) => {
    const messageBox = document.createElement('div');
    messageBox.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: ${isSuccess ? '#013328' : '#CC8B65'};
      color: ${isSuccess ? '#E3DCD2' : '#100C0D'};
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
      z-index: 1000;
      text-align: center;
      font-family: 'Inter', sans-serif;
      max-width: 80%;
    `;
    messageBox.innerHTML = `
      <p class="text-lg font-bold mb-2">${isSuccess ? 'Success!' : 'Error!'}</p>
      <p class="mb-4">${message}</p>
      <button onclick="this.parentNode.remove()" style="
        background-color: ${isSuccess ? '#CC8B65' : '#100C0D'};
        color: ${isSuccess ? '#100C0D' : '#E3DCD2'};
        padding: 8px 16px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-weight: bold;
      ">Close</button>
    `;
    document.body.appendChild(messageBox);
  };

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
        showMessageBox('There was an error sending your message. Please try again.', false);
      } else {
        setFormData({ name: '', email: '', subject: '', message: '' })
        showMessageBox('Thank you for your message! Miran will get back to you soon.', true);
      }
    } catch (error) {
      console.error('Error:', error)
      showMessageBox('There was an error sending your message. Please try again.', false);
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
      color: "blue" // These will be overridden by the new palette
    },
    {
      icon: Instagram,
      name: "Instagram",
      url: "https://instagram.com/miransafiny",
      color: "pink" // These will be overridden by the new palette
    },
    {
      icon: Twitter,
      name: "Twitter",
      url: "https://twitter.com/miran_marketing",
      color: "sky" // These will be overridden by the new palette
    },
    {
      icon: MessageSquare,
      name: "WhatsApp",
      url: "https://wa.me/9647501234567",
      color: "emerald" // These will be overridden by the new palette
    }
  ]

  return (
    // Updated section background to match the dark theme
    <section id="contact" className="py-20 bg-[#100C0D] text-[#E3DCD2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          {/* Updated heading text color */}
          <h2 className="text-4xl font-bold text-[#E3DCD2] mb-4">Get In Touch</h2>
          {/* Updated divider color to accent */}
          <div className="w-24 h-1 bg-[#CC8B65] mx-auto mb-8"></div>
          {/* Updated paragraph text color */}
          <p className="text-lg text-[#E3DCD2]/80 max-w-2xl mx-auto">
            Ready to discuss partnerships, consultations, or media opportunities? 
            Let's connect and explore how we can work together.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Information */}
          <div className="lg:col-span-1">
            {/* Updated contact info card background and shadow */}
            <div className="bg-gradient-to-br from-[#013328] to-[#100C0D] p-8 rounded-2xl shadow-2xl">
              {/* Updated heading text color */}
              <h3 className="text-2xl font-bold text-[#E3DCD2] mb-6">Contact Information</h3>
              
              <div className="space-y-6 mb-8">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    {/* Updated icon background and color */}
                    <div className="bg-[#CC8B65]/20 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                      <info.icon className="h-6 w-6 text-[#CC8B65]" />
                    </div>
                    <div>
                      {/* Updated title and value text colors */}
                      <h4 className="font-semibold text-[#E3DCD2] mb-1">{info.title}</h4>
                      {info.link === "#" ? (
                        <p className="text-[#E3DCD2]/80">{info.value}</p>
                      ) : (
                        <a href={info.link} className="text-[#CC8B65] hover:text-[#CC8B65]/80 transition-colors duration-200">
                          {info.value}
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div>
                {/* Updated social links heading text color */}
                <h4 className="font-semibold text-[#E3DCD2] mb-4">Follow Miran</h4>
                <div className="flex space-x-4">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.url}
                      // Updated social icon background and hover colors
                      className="bg-[#CC8B65]/20 hover:bg-[#CC8B65]/30 w-12 h-12 rounded-lg flex items-center justify-center transition-all duration-300 transform hover:scale-110"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {/* Updated social icon color */}
                      <social.icon className="h-6 w-6 text-[#CC8B65]" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            {/* Updated form card background, shadow, and border */}
            <div className="bg-[#013328] p-8 rounded-2xl shadow-2xl border border-[#CC8B65]/30">
              {/* Updated form heading text color */}
              <h3 className="text-2xl font-bold text-[#E3DCD2] mb-6">Send a Message</h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    {/* Updated label text color */}
                    <label htmlFor="name" className="block text-sm font-medium text-[#E3DCD2]/80 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      // Updated input field styling for dark theme
                      className="w-full px-4 py-3 border border-[#CC8B65]/30 rounded-lg focus:ring-2 focus:ring-[#CC8B65] focus:border-[#CC8B65] transition-colors duration-200 bg-[#100C0D] text-[#E3DCD2] shadow-sm placeholder-[#E3DCD2]/50"
                      placeholder="Your full name"
                    />
                  </div>
                  
                  <div>
                    {/* Updated label text color */}
                    <label htmlFor="email" className="block text-sm font-medium text-[#E3DCD2]/80 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      // Updated input field styling for dark theme
                      className="w-full px-4 py-3 border border-[#CC8B65]/30 rounded-lg focus:ring-2 focus:ring-[#CC8B65] focus:border-[#CC8B65] transition-colors duration-200 bg-[#100C0D] text-[#E3DCD2] shadow-sm placeholder-[#E3DCD2]/50"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                <div>
                  {/* Updated label text color */}
                  <label htmlFor="subject" className="block text-sm font-medium text-[#E3DCD2]/80 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    // Updated input field styling for dark theme
                    className="w-full px-4 py-3 border border-[#CC8B65]/30 rounded-lg focus:ring-2 focus:ring-[#CC8B65] focus:border-[#CC8B65] transition-colors duration-200 bg-[#100C0D] text-[#E3DCD2] shadow-sm placeholder-[#E3DCD2]/50"
                    placeholder="What's this about?"
                  />
                </div>

                <div>
                  {/* Updated label text color */}
                  <label htmlFor="message" className="block text-sm font-medium text-[#E3DCD2]/80 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    // Updated textarea styling for dark theme
                    className="w-full px-4 py-3 border border-[#CC8B65]/30 rounded-lg focus:ring-2 focus:ring-[#CC8B65] focus:border-[#CC8B65] transition-colors duration-200 resize-vertical bg-[#100C0D] text-[#E3DCD2] shadow-sm placeholder-[#E3DCD2]/50"
                    placeholder="Tell Miran about your project, partnership idea, or inquiry..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  // Updated button gradient and text colors for dark theme
                  className="w-full bg-gradient-to-r from-[#CC8B65] to-[#CC8B65]/80 hover:from-[#CC8B65]/80 hover:to-[#CC8B65] disabled:from-[#CC8B65]/50 disabled:to-[#CC8B65]/60 text-[#100C0D] font-semibold py-4 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#100C0D] mr-2"></div>
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
