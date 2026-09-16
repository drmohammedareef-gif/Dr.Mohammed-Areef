import { Car, DealershipSettings } from '../types';
import { CENTRAL_DEALERSHIP_CONFIG } from '../config/dealership';

export const STORAGE_KEYS = {
  INVENTORY: 'am_cars_ambai_inventory_v4',
  SETTINGS: 'am_cars_ambai_settings_v5',
};

export const DEFAULT_DEALERSHIP_SETTINGS: DealershipSettings = {
  businessName: CENTRAL_DEALERSHIP_CONFIG.businessName,
  phone: CENTRAL_DEALERSHIP_CONFIG.phone,
  phoneRaw: CENTRAL_DEALERSHIP_CONFIG.phoneRaw,
  whatsapp: CENTRAL_DEALERSHIP_CONFIG.whatsapp,
  whatsappRaw: CENTRAL_DEALERSHIP_CONFIG.whatsappRaw,
  address: CENTRAL_DEALERSHIP_CONFIG.address,
  shortAddress: CENTRAL_DEALERSHIP_CONFIG.shortAddress,
  googleMapsUrl: CENTRAL_DEALERSHIP_CONFIG.googleMapsUrl,
  businessHoursWeekdays: CENTRAL_DEALERSHIP_CONFIG.businessHoursWeekdays,
  businessHoursSunday: CENTRAL_DEALERSHIP_CONFIG.businessHoursSunday,
  email: CENTRAL_DEALERSHIP_CONFIG.email,
  isConfigured: true,
};

/**
 * Storage Service Abstraction
 * Currently implements browser localStorage, but is designed with a clean API
 * so it can be easily swapped for Firebase Firestore or a backend API later.
 */
export interface StorageService {
  getCars(fallback: Car[]): Car[];
  saveCars(cars: Car[]): void;
  getSettings(): DealershipSettings;
  saveSettings(settings: DealershipSettings): void;
  clearAll(): void;
}

export const localStorageService: StorageService = {
  getCars(fallback: Car[]): Car[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.INVENTORY);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Normalize any missing fields
          return parsed.map((c) => ({
            ...c,
            manufacturingYear: c.manufacturingYear || c.year,
            registrationYear: c.registrationYear || c.year,
            location: c.location || 'Ambasamudram, TN',
          }));
        }
      }
    } catch (e) {
      console.error('Failed to load cars from localStorage', e);
    }
    return fallback;
  },

  saveCars(cars: Car[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(cars));
    } catch (e) {
      console.error('Failed to save cars to localStorage', e);
    }
  },

  getSettings(): DealershipSettings {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (data) {
        const parsed: DealershipSettings = { ...DEFAULT_DEALERSHIP_SETTINGS, ...JSON.parse(data) };
        const cleanPhone = (parsed.phone || '').replace(/\D/g, '');
        const cleanWhatsapp = (parsed.whatsapp || '').replace(/\D/g, '');
        // Validate that phone numbers match the official AM Cars number (6383804575)
        if (!cleanPhone.includes('6383804575')) {
          parsed.phone = DEFAULT_DEALERSHIP_SETTINGS.phone;
          parsed.phoneRaw = DEFAULT_DEALERSHIP_SETTINGS.phoneRaw;
        }
        if (!cleanWhatsapp.includes('6383804575')) {
          parsed.whatsapp = DEFAULT_DEALERSHIP_SETTINGS.whatsapp;
          parsed.whatsappRaw = DEFAULT_DEALERSHIP_SETTINGS.whatsappRaw;
        }
        return parsed;
      }
    } catch (e) {
      console.error('Failed to load settings from localStorage', e);
    }
    return DEFAULT_DEALERSHIP_SETTINGS;
  },

  saveSettings(settings: DealershipSettings): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to save settings to localStorage', e);
    }
  },

  clearAll(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.INVENTORY);
      localStorage.removeItem(STORAGE_KEYS.SETTINGS);
    } catch (e) {
      console.error('Failed to clear storage', e);
    }
  },
};
