import React, { useState } from 'react';
import { 
  Phone, 
  MessageCircle, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle2, 
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { useCars } from '../context/CarContext';
import { getGeneralWhatsAppUrl, getPhoneCallUrl } from '../utils/formatters';
import { ContactFormData } from '../types';

export const ContactSection: React.FC = () => {
  const { settings, submitCustomerEnquiry } = useCars();
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    phone: '',
    email: '',
    carName: '',
    enquiryType: 'Buy Car',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [phoneError, setPhoneError] = useState('');

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
    setFormData((prev) => ({ ...prev, phone: val }));
    if (val.length > 0 && val.length < 10) {
      setPhoneError('Please enter a valid 10-digit Indian phone number');
    } else {
      setPhoneError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.phone.length !== 10) {
      setPhoneError('Please enter a valid 10-digit phone number');
      return;
    }

    setSubmitted(true);

    try {
      await submitCustomerEnquiry({
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        enquiryType: formData.enquiryType,
        carName: formData.carName,
        message: formData.message,
      });
    } catch (err) {
      console.warn('Enquiry logged, proceeding with WhatsApp notification:', err);
    }

    const whatsappText = `Hi ${settings.businessName},
New website enquiry from ${formData.name}:
• Type: ${formData.enquiryType}
• Phone: +91 ${formData.phone}
${formData.carName ? `• Interested Car: ${formData.carName}\n` : ''}${formData.message ? `• Message: ${formData.message}\n` : ''}`;

    const sanitizedWhatsapp = (settings.whatsappRaw || settings.whatsapp || '').replace(/\D/g, '');
    const targetWhatsapp = sanitizedWhatsapp.length === 10 
      ? `91${sanitizedWhatsapp}` 
      : (sanitizedWhatsapp.startsWith('0') && sanitizedWhatsapp.length === 11 
          ? `91${sanitizedWhatsapp.slice(1)}` 
          : sanitizedWhatsapp || '916383804575');

    setTimeout(() => {
      window.open(
        `https://wa.me/${targetWhatsapp}?text=${encodeURIComponent(whatsappText)}`,
        '_blank'
      );
    }, 1000);
  };

  return (
    <section className="relative overflow-hidden py-16 sm:py-24 bg-neutral-950 border-t border-neutral-900" id="contact-section">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-red-600/10 blur-[130px] pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 rounded-full border border-red-600/30 bg-red-600/10 px-3.5 py-1 text-xs font-bold text-red-400 mb-3">
            <Phone className="h-3.5 w-3.5 text-red-500" />
            <span>DIRECT SHOWROOM CONTACT</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight uppercase">
            CONTACT <span className="text-red-500">AM CARS AMBAI</span>
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-neutral-400">
            Visit our pre-owned automotive showroom in Ambasamudram, or reach us directly via call or WhatsApp for vehicle inquiries, pricing, and instant test drives.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Contact Details & Info Cards */}
          <div className="lg:col-span-5 space-y-4">
            {/* Phone & WhatsApp Card */}
            <div className="rounded-3xl border border-neutral-800 bg-neutral-900/70 p-6 space-y-4 backdrop-blur-md">
              <h3 className="font-display text-base font-bold text-white flex items-center gap-2">
                <Phone className="h-4 w-4 text-red-500" />
                <span>Showroom Hotlines</span>
              </h3>

              <div className="space-y-3">
                {/* Call Now Button */}
                <a
                  href={getPhoneCallUrl(settings)}
                  className="flex items-center justify-between rounded-2xl border border-neutral-800 bg-neutral-950 p-4 hover:border-red-600/50 hover:bg-neutral-900 transition-all group shadow-inner"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-600/10 border border-red-600/30 text-red-500 group-hover:scale-105 transition-transform">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[10px] text-neutral-400 uppercase font-bold tracking-wider">Direct Call</p>
                      <p className="font-display font-extrabold text-white text-base">{settings.phone}</p>
                    </div>
                  </div>
                  <span className="rounded-xl bg-neutral-800 group-hover:bg-red-600 group-hover:text-white px-3 py-1.5 text-xs font-bold text-neutral-300 transition-colors">
                    Call Now
                  </span>
                </a>

                {/* WhatsApp Chat Button */}
                <a
                  href={getGeneralWhatsAppUrl('', settings)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-4 hover:border-emerald-500/60 hover:bg-emerald-950/40 transition-all group"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 group-hover:scale-105 transition-transform">
                      <MessageCircle className="h-5 w-5 fill-current" />
                    </div>
                    <div>
                      <p className="text-[10px] text-emerald-400 uppercase font-bold tracking-wider">Official WhatsApp</p>
                      <p className="font-display font-extrabold text-white text-base">{settings.whatsapp}</p>
                    </div>
                  </div>
                  <span className="rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white shadow">
                    WhatsApp
                  </span>
                </a>
              </div>
            </div>

            {/* Address & Hours Card */}
            <div className="rounded-3xl border border-neutral-800 bg-neutral-900/70 p-6 space-y-4 backdrop-blur-md">
              <h3 className="font-display text-base font-bold text-white flex items-center gap-2">
                <MapPin className="h-4 w-4 text-red-500" />
                <span>Showroom Location & Timings</span>
              </h3>

              <div className="space-y-3 text-xs sm:text-sm">
                <div className="flex items-start gap-3 rounded-2xl border border-neutral-800 bg-neutral-950 p-4">
                  <MapPin className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-white text-sm">{settings.businessName} Showroom</p>
                    <p className="text-neutral-400 mt-1 leading-relaxed text-xs">
                      {settings.address}
                    </p>
                    <a
                      href={settings.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2.5 inline-flex items-center gap-1.5 text-xs font-bold text-red-400 hover:text-red-300"
                    >
                      <span>Open Directions in Google Maps</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-2xl border border-neutral-800 bg-neutral-950 p-4">
                  <Clock className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-white text-sm">Working Hours</p>
                    <p className="text-neutral-300 mt-0.5 text-xs font-medium">{settings.businessHoursWeekdays}</p>
                    <p className="text-neutral-400 text-xs mt-0.5">{settings.businessHoursSunday}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Google Maps / Directions Card */}
            <div className="relative overflow-hidden rounded-3xl border border-neutral-800 bg-neutral-900/70 p-2">
              <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-neutral-950 flex flex-col items-center justify-center p-6 text-center border border-neutral-800">
                <div className="h-12 w-12 rounded-xl bg-red-600/20 border border-red-600/40 flex items-center justify-center text-red-500 mb-2 shadow-inner">
                  <MapPin className="h-6 w-6" />
                </div>
                <h4 className="font-bold text-white text-sm">{settings.shortAddress}</h4>
                <p className="text-xs text-neutral-400 max-w-xs mt-1">
                  Ambasamudram, Tirunelveli District, Tamil Nadu
                </p>
                <a
                  href={settings.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-neutral-900 border border-neutral-700 px-4 py-2 text-xs font-bold text-white hover:border-red-500 hover:bg-neutral-800 transition-all"
                >
                  <span>Get Driving Directions</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          </div>

          {/* Customer Enquiry Form */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl border border-neutral-800 bg-neutral-900/80 p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
              <h3 className="font-display text-2xl font-black text-white mb-1 uppercase tracking-tight">
                SEND AN ENQUIRY
              </h3>
              <p className="text-xs sm:text-sm text-neutral-400 mb-6">
                Tell us what car you're looking for or your budget. Our showroom advisor will reach out directly on WhatsApp or phone.
              </p>

              {submitted ? (
                <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/30 p-8 text-center space-y-3">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                    <CheckCircle2 className="h-8 w-8" />
                  </div>
                  <h4 className="font-display text-xl font-bold text-white">
                    Thank You, {formData.name}!
                  </h4>
                  <p className="text-sm text-neutral-300 max-w-md mx-auto">
                    Your enquiry has been received. Our team at {settings.businessName} will call or WhatsApp you at{' '}
                    <strong className="text-white font-semibold">+91 {formData.phone}</strong> shortly.
                  </p>
                  <div className="pt-3">
                    <button
                      onClick={() => {
                        setSubmitted(false);
                        setFormData({
                          name: '',
                          phone: '',
                          email: '',
                          carName: '',
                          enquiryType: 'Buy Car',
                          message: '',
                        });
                      }}
                      className="rounded-xl border border-neutral-700 bg-neutral-800 px-5 py-2.5 text-xs font-bold text-neutral-200 hover:bg-neutral-700 cursor-pointer"
                    >
                      Send Another Enquiry
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Enquiry Type Selector */}
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-2">
                      I Want To:
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {(['Buy Car', 'Test Drive', 'Finance / Loan', 'Sell / Exchange'] as const).map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setFormData((prev) => ({ ...prev, enquiryType: type }))}
                          className={`rounded-xl py-2.5 px-3 text-xs font-bold transition-all cursor-pointer text-center ${
                            formData.enquiryType === type
                              ? 'bg-red-600 text-white shadow-md shadow-red-950/40'
                              : 'bg-neutral-950 border border-neutral-800 text-neutral-300 hover:bg-neutral-800'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Name */}
                    <div>
                      <label className="block text-xs font-bold text-neutral-300 mb-1">
                        Your Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                        placeholder="e.g. Anandha Kumar"
                        className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3.5 py-3 text-sm text-white placeholder-neutral-500 focus:border-red-500 focus:outline-none"
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-xs font-bold text-neutral-300 mb-1">
                        Mobile Number (WhatsApp) <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-neutral-400">
                          +91
                        </span>
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={handlePhoneChange}
                          placeholder="10-digit mobile number"
                          className="w-full rounded-xl border border-neutral-800 bg-neutral-950 pl-11 pr-3.5 py-3 text-sm text-white placeholder-neutral-500 focus:border-red-500 focus:outline-none"
                        />
                      </div>
                      {phoneError && (
                        <p className="text-[11px] text-red-400 mt-1">{phoneError}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Car interested in */}
                    <div>
                      <label className="block text-xs font-bold text-neutral-300 mb-1">
                        Car Interested In (Optional)
                      </label>
                      <input
                        type="text"
                        value={formData.carName}
                        onChange={(e) => setFormData((prev) => ({ ...prev, carName: e.target.value }))}
                        placeholder="e.g. Swift Dzire, Creta, or budget under 6L"
                        className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3.5 py-3 text-sm text-white placeholder-neutral-500 focus:border-red-500 focus:outline-none"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-xs font-bold text-neutral-300 mb-1">
                        Email Address (Optional)
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                        placeholder="name@example.com"
                        className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3.5 py-3 text-sm text-white placeholder-neutral-500 focus:border-red-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-xs font-bold text-neutral-300 mb-1">
                      Message / Special Requests
                    </label>
                    <textarea
                      rows={3}
                      value={formData.message}
                      onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
                      placeholder="Tell us any specific requirements, preferred fuel type, transmission, or budget..."
                      className="w-full rounded-xl border border-neutral-800 bg-neutral-950 p-3 text-sm text-white placeholder-neutral-500 focus:border-red-500 focus:outline-none resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full flex items-center justify-center gap-2 rounded-xl bg-red-600 py-4 px-6 text-sm font-extrabold uppercase tracking-wider text-white shadow-xl shadow-red-950/40 hover:bg-red-500 transition-all active:scale-95 cursor-pointer"
                    >
                      <Send className="h-4 w-4" />
                      <span>SUBMIT ENQUIRY & CHAT ON WHATSAPP</span>
                    </button>
                    <p className="text-[11px] text-center text-neutral-400 mt-2">
                      Submitting connects directly to {settings.businessName} WhatsApp ({settings.whatsapp}).
                    </p>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
