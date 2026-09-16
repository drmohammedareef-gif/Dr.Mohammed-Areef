export type FuelType = 'Petrol' | 'Diesel' | 'CNG' | 'Electric';
export type TransmissionType = 'Manual' | 'Automatic';
export type BodyType = 'Hatchback' | 'Sedan' | 'SUV' | 'MUV';
export type CarStatus = 'available' | 'sold' | 'pending' | 'rejected';

export interface Car {
  id: string;
  brand: string;
  model: string;
  variant: string;
  year: number; // Manufacturing Year (kept for compatibility)
  manufacturingYear?: number;
  registrationYear?: number;
  price: number; // in Indian Rupees (INR)
  kilometers: number;
  fuelType: FuelType;
  transmission: TransmissionType;
  bodyType: BodyType;
  location?: string; // e.g. "Ambasamudram, TN" or "Tirunelveli, TN"
  owners: '1st Owner' | '2nd Owner' | '3rd Owner';
  registrationState: string; // e.g. "TN-72 (Tirunelveli)" or "TN-76 (Tenkasi)"
  insuranceValidity: string;
  mileage: string; // e.g. "22.5 kmpl"
  engine: string; // e.g. "1197 cc"
  color: string;
  status: CarStatus;
  featured?: boolean;
  images: string[];
  features: string[];
  description: string;
  rtoCode: string;
  contactPhone?: string; // Optional custom phone for this vehicle (AM Cars)
  contactWhatsapp?: string; // Optional custom WhatsApp for this vehicle (AM Cars)
  createdAt: string;

  // Private owner details (STORED ON BACKEND ONLY - NEVER EXPOSED TO PUBLIC CUSTOMERS)
  ownerName?: string;
  ownerPhone?: string;
  ownerWhatsapp?: string;
  ownerNotes?: string;
  submissionDate?: string;
  rejectionReason?: string;
}

export interface DealershipSettings {
  businessName: string;
  phone: string; // Business Phone Number e.g. "6383804575"
  phoneRaw: string; // Digits for tel: dialer e.g. "916383804575"
  whatsapp: string; // Business WhatsApp Number e.g. "6383804575"
  whatsappRaw: string; // Digits for wa.me e.g. "916383804575"
  address: string;
  shortAddress: string;
  googleMapsUrl: string;
  businessHoursWeekdays: string;
  businessHoursSunday: string;
  email: string;
  isConfigured: boolean; // True once the owner inputs real numbers in Admin Settings
}

export interface FilterState {
  search: string;
  brand: string;
  model: string;
  priceRange: string; // 'all' | 'under3' | '3to6' | '6to10' | 'above10'
  year: string; // 'all' | '2023+' | '2021-2022' | '2019-2020' | 'older'
  fuelType: string;
  transmission: string;
  bodyType: string;
  location: string; // 'all' or specific location
  status: string; // 'all' | 'available' | 'sold'
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'year-desc' | 'km-asc';
}

export interface ContactFormData {
  name: string;
  phone: string;
  email?: string;
  carId?: string;
  carName?: string;
  enquiryType: 'Buy Car' | 'Test Drive' | 'Finance / Loan' | 'Sell / Exchange';
  message: string;
}

export interface CarSubmissionPayload {
  brand: string;
  model: string;
  variant: string;
  manufacturingYear: number;
  registrationYear: number;
  price: number;
  kilometers: number;
  fuelType: FuelType;
  transmission: TransmissionType;
  bodyType: BodyType;
  location: string;
  owners: '1st Owner' | '2nd Owner' | '3rd Owner';
  registrationState: string;
  rtoCode: string;
  insuranceValidity: string;
  color: string;
  description: string;
  images: string[];
  features: string[];
  // Private owner contact details
  ownerName: string;
  ownerPhone: string;
  ownerWhatsapp?: string;
  ownerNotes?: string;
}

export interface CustomerEnquiry {
  id: string;
  name: string;
  phone: string;
  email?: string;
  carId?: string;
  carName?: string;
  enquiryType?: string;
  message?: string;
  createdAt: string;
  status?: 'new' | 'contacted' | 'closed';
}

export type ActivePage = 'home' | 'cars' | 'sell' | 'about' | 'contact' | 'admin';

