import { Car, DealershipSettings } from '../types';
import { DEFAULT_DEALERSHIP_SETTINGS } from '../services/storage';
import { CENTRAL_DEALERSHIP_CONFIG } from '../config/dealership';

export const DEALERSHIP_INFO = {
  name: CENTRAL_DEALERSHIP_CONFIG.businessName,
  phone: CENTRAL_DEALERSHIP_CONFIG.phone,
  phoneDisplay: CENTRAL_DEALERSHIP_CONFIG.phoneDisplay,
  phoneRaw: CENTRAL_DEALERSHIP_CONFIG.phoneRaw,
  whatsappDisplay: CENTRAL_DEALERSHIP_CONFIG.whatsappDisplay,
  whatsappRaw: CENTRAL_DEALERSHIP_CONFIG.whatsappRaw,
  address: CENTRAL_DEALERSHIP_CONFIG.address,
  hoursWeekdays: CENTRAL_DEALERSHIP_CONFIG.businessHoursWeekdays,
  hoursSunday: CENTRAL_DEALERSHIP_CONFIG.businessHoursSunday,
};

/**
 * Formats price in Indian Lakhs format or standard Indian comma notation.
 * e.g. 650000 -> ₹6.50 Lakh
 */
export function formatPriceLakh(price: number): string {
  if (price >= 10000000) {
    const crore = (price / 10000000).toFixed(2);
    return `₹${crore} Cr`;
  }
  if (price >= 100000) {
    const lakh = (price / 100000).toFixed(2);
    return `₹${lakh} Lakh`;
  }
  return formatIndianRupees(price);
}

/**
 * Standard Indian Rupee number formatting with commas
 * e.g. 650000 -> ₹6,50,000
 */
export function formatIndianRupees(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Formats kilometers with comma
 * e.g. 45000 -> 45,000 km
 */
export function formatKM(km: number): string {
  return `${new Intl.NumberFormat('en-IN').format(km)} km`;
}

/**
 * Calculates estimated monthly EMI for used car loan
 * Default: 20% down payment, 11% interest rate, 48 months
 */
export function calculateEstimatedEMI(
  price: number,
  downPaymentPercent: number = 20,
  tenureMonths: number = 48,
  annualInterestRate: number = 11.5
): number {
  const principal = price * (1 - downPaymentPercent / 100);
  const monthlyRate = annualInterestRate / 12 / 100;
  if (monthlyRate === 0) return Math.round(principal / tenureMonths);
  const emi =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
    (Math.pow(1 + monthlyRate, tenureMonths) - 1);
  return Math.round(emi);
}

function normalizeWhatsappDigits(raw: string): string {
  const digits = (raw || '').replace(/\D/g, '');
  if (digits.length === 10) {
    return `91${digits}`;
  }
  if (digits.startsWith('0') && digits.length === 11) {
    return `91${digits.slice(1)}`;
  }
  return digits || CENTRAL_DEALERSHIP_CONFIG.whatsappRaw;
}

function normalizePhoneDialer(raw: string): string {
  const digits = (raw || '').replace(/\D/g, '');
  if (digits.length === 10) {
    return `tel:+91${digits}`;
  }
  if (digits.startsWith('91') && digits.length === 12) {
    return `tel:+${digits}`;
  }
  if (digits.startsWith('0') && digits.length === 11) {
    return `tel:+91${digits.slice(1)}`;
  }
  return `tel:+${digits || CENTRAL_DEALERSHIP_CONFIG.phoneRaw}`;
}

/**
 * Generates WhatsApp URL with pre-filled enquiry for a specific car using current dealership settings.
 * Format specifically aligns with user's prompt requirement:
 * "Hi AM Cars Ambai, I am interested in [CAR NAME]. Is this car still available?"
 */
export function getCarWhatsAppUrl(
  car: Car,
  settings?: DealershipSettings
): string {
  const businessName = settings?.businessName || CENTRAL_DEALERSHIP_CONFIG.businessName;
  const whatsappRaw = normalizeWhatsappDigits(settings?.whatsappRaw || settings?.whatsapp || CENTRAL_DEALERSHIP_CONFIG.whatsappRaw);

  const carName = `${car.brand} ${car.model} ${car.variant} (${car.year})`;
  
  const text = `Hi ${businessName}, I am interested in ${carName}. Is this car still available?
  
• Price: ${formatPriceLakh(car.price)} (${formatIndianRupees(car.price)})
• Kilometres: ${formatKM(car.kilometers)} | ${car.fuelType} | ${car.transmission}
• Location: ${car.location || 'Ambasamudram Showroom'}
• Registration: ${car.registrationState} (${car.rtoCode})

Please let me know if I can see the vehicle or schedule a test drive.`;

  return `https://wa.me/${whatsappRaw}?text=${encodeURIComponent(text)}`;
}

/**
 * Generates General WhatsApp enquiry URL with current dealership settings
 */
export function getGeneralWhatsAppUrl(
  message?: string,
  settings?: DealershipSettings
): string {
  const businessName = settings?.businessName || CENTRAL_DEALERSHIP_CONFIG.businessName;
  const whatsappRaw = normalizeWhatsappDigits(settings?.whatsappRaw || settings?.whatsapp || CENTRAL_DEALERSHIP_CONFIG.whatsappRaw);

  const defaultText = `Hi ${businessName}, I am looking for a certified pre-owned car in Ambasamudram / Tirunelveli district. Please share currently available cars and price details.`;

  return `https://wa.me/${whatsappRaw}?text=${encodeURIComponent(message || defaultText)}`;
}

/**
 * Generates Phone Dialer link using current dealership settings
 * All calls route directly to AM Cars Ambai business phone
 */
export function getPhoneCallUrl(
  settings?: DealershipSettings
): string {
  return normalizePhoneDialer(settings?.phoneRaw || settings?.phone || CENTRAL_DEALERSHIP_CONFIG.phoneRaw);
}
