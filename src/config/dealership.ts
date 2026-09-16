/**
 * CENTRAL DEALERSHIP & BROKERAGE CONFIGURATION
 * ============================================
 * Edit this file to update the business contact details across the entire application.
 * All customer-facing "Call Now" buttons, WhatsApp links, headers, car details modals,
 * and footers read from this central configuration and the synced dealership settings.
 */

export interface DealershipConfig {
  businessName: string;
  phone: string;            // Business Phone Number: 6383804575
  phoneRaw: string;         // Plain digits for tel: links: 916383804575
  phoneDisplay: string;     // Display format e.g. "6383804575"
  phoneFormatted: string;   // Country code display e.g. "+91 63838 04575"
  whatsapp: string;         // Business WhatsApp Number: 6383804575
  whatsappRaw: string;      // 10 or 12 digit international format e.g. "916383804575"
  whatsappDisplay: string;  // Display format e.g. "6383804575"
  whatsappFormatted: string;// Country code display e.g. "+91 63838 04575"
  address: string;
  shortAddress: string;
  email: string;
  businessHoursWeekdays: string;
  businessHoursSunday: string;
  googleMapsUrl: string;
}

export const CENTRAL_DEALERSHIP_CONFIG: DealershipConfig = {
  businessName: 'AM Cars Ambai',
  phone: '6383804575',
  phoneRaw: '916383804575',
  phoneDisplay: '6383804575',
  phoneFormatted: '+91 63838 04575',
  whatsapp: '6383804575',
  whatsappRaw: '916383804575',
  whatsappDisplay: '6383804575',
  whatsappFormatted: '+91 63838 04575',
  address: 'Main Road, Near Old Bus Stand, Railway Feeder Road, Ambasamudram (Ambai), Tirunelveli District, Tamil Nadu - 627401',
  shortAddress: 'Ambasamudram, Tirunelveli Dist, Tamil Nadu',
  email: 'amcarsambai@gmail.com',
  businessHoursWeekdays: 'Mon - Sat: 9:00 AM – 8:30 PM',
  businessHoursSunday: 'Sunday: 10:00 AM – 5:00 PM',
  googleMapsUrl: 'https://maps.google.com/?q=Ambasamudram+Tamil+Nadu',
};
