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
    <section className="bg-slate-50/70 py-16 sm:py-24 border-t border-neutral-200/80" id="contact-section">
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1 text-xs font-bold text-emerald-800 mb-3">
            <Phone className="h-3.5 w-3.5 text-emerald-600" />
            <span>DIRECT SHOWROOM CONTACT</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-neutral-900 tracking-tight uppercase">
            Get in Touch
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-neutral-600">
            Visit our pre-owned automotive showroom in Ambasamudram, or reach us directly via call or WhatsApp for vehicle inquiries, pricing, and instant test drives.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Contact Details & Info Cards */}
          <div className="lg:col-span-5 space-y-5">
            {/* Phone & WhatsApp Card */}
            <div className="rounded-3xl border border-neutral-200 bg-white p-6 sm:p-7 space-y-4 shadow-md">
              <h3 className="font-display text-base font-bold text-neutral-900 flex items-center gap-2">
                <Phone className="h-4 w-4 text-emerald-600" />
                <span>Showroom Hotlines</span>
              </h3>

              <div className="space-y-3">
                {/* Call Now Button */}
                <a
                  href={getPhoneCallUrl(settings)}
                  className="flex items-center justify-between rounded-2xl border border-neutral-200 bg-neutral-50/60 p-4 hover:border-emerald-500 hover:bg-emerald-50/30 transition-all group"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 group-hover:scale-105 transition-transform">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[10px] text-neutral-500 uppercase font-bold tracking-wider">Direct Call</p>
                      <p className="font-display font-extrabold text-neutral-900 text-base">{settings.phone}</p>
                    </div>
                  </div>
                  <span className="rounded-xl bg-neutral-900 group-hover:bg-emerald-600 group-hover:text-white px-3.5 py-1.5 text-xs font-bold text-white transition-colors">
                    Call Now
                  </span>
                </a>

                {/* WhatsApp Chat Button */}
                <a
                  href={getGeneralWhatsAppUrl('', settings)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4 hover:border-emerald-400 hover:bg-emerald-50 transition-all group"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-600 text-white group-hover:scale-105 transition-transform">
                      <MessageCircle className="h-5 w-5 fill-current" />
                    </div>
                    <div>
                      <p className="text-[10px] text-emerald-800 uppercase font-bold tracking-wider">Official WhatsApp</p>
                      <p className="font-display font-extrabold text-neutral-900 text-base">{settings.whatsapp}</p>
                    </div>
                  </div>
                  <span className="rounded-xl bg-emerald-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-xs">
                    WhatsApp
                  </span>
                </a>
              </div>
            </div>

            {/* Address & Hours Card */}
            <div className="rounded-3xl border border-neutral-200 bg-white p-6 sm:p-7 space-y-4 shadow-md">
              <h3 className="font-display text-base font-bold text-neutral-900 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-emerald-600" />
                <span>Showroom Location & Timings</span>
              </h3>

              <div className="space-y-3 text-xs sm:text-sm">
                <div className="flex items-start gap-3 rounded-2xl border border-neutral-100 bg-neutral-50 p-4">
                  <MapPin className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-neutral-900 text-sm">{settings.businessName} Showroom</p>
                    <p className="text-neutral-600 mt-1 leading-relaxed text-xs">
                      {settings.address}
                    </p>
                    <a
                      href={settings.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2.5 inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800"
                    >
                      <span>Get Directions in Google Maps</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-2xl border border-neutral-100 bg-neutral-50 p-4">
                  <Clock className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-neutral-900 text-xs uppercase tracking-wider">Showroom Hours</p>
                    <div className="mt-1 space-y-0.5 text-xs text-neutral-600">
                      <p><span className="font-semibold text-neutral-800">Monday - Saturday:</span> {settings.businessHoursWeekdays}</p>
                      <p><span className="font-semibold text-neutral-800">Sunday:</span> {settings.businessHoursSunday}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Quick Enquiry Form */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl border border-neutral-200 bg-white p-6 sm:p-8 lg:p-10 shadow-lg">
              <div className="mb-6">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800 mb-2">
                  <Sparkles className="h-3 w-3 text-emerald-600" />
                  <span>Prompt Response Guarantee</span>
                </span>
                <h3 className="font-display text-2xl font-extrabold text-neutral-900">
                  Send Showroom Enquiry
                </h3>
                <p className="text-xs sm:text-sm text-neutral-500 mt-1">
                  Leave your details and our team will get back to you with vehicle pricing, inspection reports, and available offers.
                </p>
              </div>

              {submitted ? (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center space-y-4">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-md">
                    <CheckCircle2 className="h-7 w-7" />
                  </div>
                  <div>
                    <h4 className="font-display text-lg font-bold text-neutral-900">Enquiry Received!</h4>
                    <p className="text-xs sm:text-sm text-neutral-600 mt-1 max-w-md mx-auto">
                      Thank you, {formData.name}. Opening WhatsApp chat with our AM Cars Ambai team now...
                    </p>
                  </div>
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
                    className="inline-flex items-center gap-2 rounded-xl bg-neutral-900 px-5 py-2.5 text-xs font-bold text-white hover:bg-neutral-800"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Anand Kumar"
                        className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-xs sm:text-sm text-neutral-900 placeholder-neutral-400 focus:border-emerald-600 focus:bg-white focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">
                        Phone Number (10 Digits) *
                      </label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-neutral-500">
                          +91
                        </span>
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={handlePhoneChange}
                          placeholder="9876543210"
                          className="w-full rounded-xl border border-neutral-200 bg-neutral-50 py-2.5 pl-12 pr-4 text-xs sm:text-sm text-neutral-900 placeholder-neutral-400 focus:border-emerald-600 focus:bg-white focus:outline-none"
                        />
                      </div>
                      {phoneError && (
                        <p className="mt-1 text-[11px] text-red-600">{phoneError}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">
                        I Want To
                      </label>
                      <select
                        value={formData.enquiryType}
                        onChange={(e) => setFormData({ ...formData, enquiryType: e.target.value as any })}
                        className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-xs sm:text-sm text-neutral-900 focus:border-emerald-600 focus:bg-white focus:outline-none"
                      >
                        <option value="Buy Car">Buy a Pre-Owned Car</option>
                        <option value="Sell Car">Sell My Car (Brokerage)</option>
                        <option value="Finance & EMI">Enquire About Car Finance / EMI</option>
                        <option value="Test Drive">Book Showroom Test Drive</option>
                        <option value="RC Transfer">RC Transfer & Documentation</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">
                        Vehicle of Interest (Optional)
                      </label>
                      <input
                        type="text"
                        value={formData.carName}
                        onChange={(e) => setFormData({ ...formData, carName: e.target.value })}
                        placeholder="e.g. Creta Diesel, Thar, Swift"
                        className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-xs sm:text-sm text-neutral-900 placeholder-neutral-400 focus:border-emerald-600 focus:bg-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">
                      Message or Specific Questions
                    </label>
                    <textarea
                      rows={3}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell us what you're looking for, budget, preferred year, or inspection questions..."
                      className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-xs sm:text-sm text-neutral-900 placeholder-neutral-400 focus:border-emerald-600 focus:bg-white focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 py-3.5 text-xs sm:text-sm font-bold text-white shadow-md shadow-emerald-600/25 transition-all active:scale-98 cursor-pointer uppercase tracking-wider"
                  >
                    <Send className="h-4 w-4" />
                    <span>Submit & Open WhatsApp Conversation</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
