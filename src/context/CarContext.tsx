import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User } from 'firebase/auth';
import { Car, FilterState, ActivePage, DealershipSettings, CarStatus, CarSubmissionPayload, CustomerEnquiry } from '../types';
import { INITIAL_CARS } from '../data/sampleCars';
import { localStorageService, DEFAULT_DEALERSHIP_SETTINGS } from '../services/storage';
import { 
  firebaseAuth, 
  firestoreCars, 
  firestoreEnquiries, 
  firestoreSettings, 
  uploadCarImageToStorage,
  testFirebaseConnection 
} from '../services/firebase';

interface CarContextType {
  cars: Car[]; // Public cars (available & sold) - NEVER contains ownerName/ownerPhone
  adminCars: Car[]; // Admin full cars (available, pending, sold, rejected) - HAS private owner details
  pendingCount: number;
  selectedCar: Car | null;
  activePage: ActivePage;
  filters: FilterState;
  settings: DealershipSettings;
  adminLoggedIn: boolean;
  adminUser: User | null;
  enquiries: CustomerEnquiry[];
  toastMessage: string | null;
  isLoading: boolean;
  setSelectedCar: (car: Car | null) => void;
  setActivePage: (page: ActivePage) => void;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  resetFilters: () => void;
  submitCarForBrokerReview: (payload: CarSubmissionPayload) => Promise<{ success: boolean; message: string; carId: string }>;
  approveCarSubmission: (id: string) => Promise<void>;
  rejectCarSubmission: (id: string, reason?: string) => Promise<void>;
  addCar: (car: Omit<Car, 'id' | 'createdAt'>) => Promise<void>;
  updateCar: (id: string, updatedCar: Partial<Car>) => Promise<void>;
  deleteCar: (id: string) => Promise<void>;
  markCarAsSold: (id: string) => Promise<void>;
  restoreCarToAvailable: (id: string) => Promise<void>;
  toggleCarStatus: (id: string) => Promise<void>;
  quickUpdatePrice: (id: string, newPrice: number) => Promise<void>;
  updateSettings: (newSettings: DealershipSettings) => Promise<void>;
  resetToSampleData: () => Promise<void>;
  loginAdminWithEmail: (email: string, pass: string) => Promise<boolean>;
  registerAdminWithEmail: (email: string, pass: string) => Promise<boolean>;
  loginAdminWithGoogle: () => Promise<boolean>;
  loginAdmin: (passwordOrEmail: string, pass?: string) => Promise<boolean>;
  logoutAdmin: () => void;
  setAdminLoggedIn: (val: boolean) => void;
  showToast: (msg: string) => void;
  refreshData: () => Promise<void>;
  uploadPhoto: (file: File) => Promise<string>;
  submitCustomerEnquiry: (enquiry: {
    name: string;
    phone: string;
    email?: string;
    carId?: string;
    carName?: string;
    enquiryType?: string;
    message?: string;
  }) => Promise<string>;
  updateEnquiryStatus: (id: string, status: 'new' | 'contacted' | 'closed') => Promise<void>;
  deleteEnquiry: (id: string) => Promise<void>;
}

const initialFilters: FilterState = {
  search: '',
  brand: 'All Brands',
  model: '',
  priceRange: 'all',
  year: 'all',
  fuelType: 'all',
  transmission: 'all',
  bodyType: 'all',
  location: 'all',
  status: 'available',
  sortBy: 'featured',
};

const CarContext = createContext<CarContextType | undefined>(undefined);

export const CarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Public cars (visible to showroom customers)
  const [cars, setCars] = useState<Car[]>(() => {
    return localStorageService.getCars(INITIAL_CARS).filter((c) => c.status === 'available' || c.status === 'sold');
  });

  // Admin cars (includes pending submissions and private owner info)
  const [adminCars, setAdminCars] = useState<Car[]>([]);
  const [enquiries, setEnquiries] = useState<CustomerEnquiry[]>([]);
  const [settings, setSettings] = useState<DealershipSettings>(() => {
    return localStorageService.getSettings();
  });

  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [activePage, setActivePage] = useState<ActivePage>('home');
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [adminUser, setAdminUser] = useState<User | null>(() => firebaseAuth.getCurrentUser());
  const [adminLoggedIn, setAdminLoggedIn] = useState<boolean>(Boolean(firebaseAuth.getCurrentUser()));
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 4500);
  };

  const resetFilters = () => {
    setFilters(initialFilters);
  };

  // Load public data from Cloud Firestore
  const loadPublicData = useCallback(async () => {
    try {
      // 1. Fetch public cars from Firestore
      let fetchedCars = await firestoreCars.getPublicCars().catch(() => []);
      
      // If Firestore cars collection is empty, seed it with sample cars
      if (fetchedCars.length === 0) {
        try {
          await firestoreCars.seedInitialCarsIfEmpty();
          fetchedCars = await firestoreCars.getPublicCars().catch(() => []);
        } catch (seedErr) {
          console.warn('Could not seed public cars (read-only for unauthenticated):', seedErr);
        }
      }

      if (fetchedCars && fetchedCars.length > 0) {
        setCars(fetchedCars);
        localStorageService.saveCars(fetchedCars);
      }

      // 2. Fetch dealership settings from Firestore
      const fetchedSettings = await firestoreSettings.getSettings().catch(() => null);
      if (fetchedSettings) {
        const cleanPhone = (fetchedSettings.phone || '').replace(/\D/g, '');
        const cleanWhatsapp = (fetchedSettings.whatsapp || '').replace(/\D/g, '');
        if (!cleanPhone.includes('6383804575') || !cleanWhatsapp.includes('6383804575')) {
          const repaired: DealershipSettings = {
            ...fetchedSettings,
            phone: DEFAULT_DEALERSHIP_SETTINGS.phone,
            phoneRaw: DEFAULT_DEALERSHIP_SETTINGS.phoneRaw,
            whatsapp: DEFAULT_DEALERSHIP_SETTINGS.whatsapp,
            whatsappRaw: DEFAULT_DEALERSHIP_SETTINGS.whatsappRaw,
          };
          setSettings(repaired);
          localStorageService.saveSettings(repaired);
          firestoreSettings.saveSettings(repaired).catch(() => {});
        } else {
          setSettings(fetchedSettings);
          localStorageService.saveSettings(fetchedSettings);
        }
      } else {
        // Automatically persist default AM Cars Ambai business contact into Cloud Firestore
        try {
          await firestoreSettings.saveSettings(DEFAULT_DEALERSHIP_SETTINGS);
        } catch (initSettingsErr) {
          console.warn('Could not auto-seed settings in Firestore:', initSettingsErr);
        }
      }
    } catch (err) {
      console.warn('Using local fallback for public data:', err);
    }
  }, []);

  // Load admin data (private owner info, pending submissions, customer enquiries)
  const loadAdminData = useCallback(async () => {
    if (!firebaseAuth.getCurrentUser()) return;
    try {
      const [allCars, allEnquiries] = await Promise.all([
        firestoreCars.getAdminCars().catch((e) => {
          console.error('Error fetching admin cars:', e);
          return [];
        }),
        firestoreEnquiries.getEnquiries().catch((e) => {
          console.error('Error fetching enquiries:', e);
          return [];
        })
      ]);

      if (allCars.length > 0) {
        setAdminCars(allCars);
      }
      setEnquiries(allEnquiries);
    } catch (err) {
      console.warn('Failed to load admin data from Firestore:', err);
    }
  }, []);

  const refreshData = useCallback(async () => {
    setIsLoading(true);
    await loadPublicData();
    if (adminLoggedIn) {
      await loadAdminData();
    }
    setIsLoading(false);
  }, [loadPublicData, loadAdminData, adminLoggedIn]);

  // Listen to Firebase Auth state
  useEffect(() => {
    testFirebaseConnection();

    const unsubscribe = firebaseAuth.onAuthStateChanged(async (user) => {
      setAdminUser(user);
      const isAuth = Boolean(user);
      setAdminLoggedIn(isAuth);

      if (isAuth) {
        await loadAdminData();
      } else {
        setAdminCars([]);
        setEnquiries([]);
      }
    });

    return () => unsubscribe();
  }, [loadAdminData]);

  // Initial load
  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Firebase Authentication: Login with Email & Password
  const loginAdminWithEmail = async (email: string, pass: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const user = await firebaseAuth.loginAdmin(email, pass);
      setAdminUser(user);
      setAdminLoggedIn(true);
      showToast(`Welcome Admin (${user.email || 'Admin'})! Firebase Auth connected.`);
      await loadAdminData();
      return true;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Invalid Admin Credentials';
      showToast(msg);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Firebase Authentication: Register New Admin Account
  const registerAdminWithEmail = async (email: string, pass: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const user = await firebaseAuth.registerAdmin(email, pass);
      setAdminUser(user);
      setAdminLoggedIn(true);
      showToast(`Admin account created & logged in (${user.email})!`);
      await loadAdminData();
      return true;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Registration failed';
      showToast(msg);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Firebase Authentication: Sign in with Google
  const loginAdminWithGoogle = async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      const user = await firebaseAuth.loginWithGoogle();
      setAdminUser(user);
      setAdminLoggedIn(true);
      showToast(`Admin signed in with Google: ${user.email}`);
      await loadAdminData();
      return true;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Google Sign-In failed';
      showToast(msg);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Generic login wrapper (supports password or email+password)
  const loginAdmin = async (passwordOrEmail: string, pass?: string): Promise<boolean> => {
    if (pass) {
      return loginAdminWithEmail(passwordOrEmail, pass);
    }
    // If only one parameter passed, assume admin email drmohammedareef@gmail.com
    return loginAdminWithEmail('drmohammedareef@gmail.com', passwordOrEmail);
  };

  // Firebase Authentication: Logout
  const logoutAdmin = async () => {
    try {
      await firebaseAuth.logout();
      setAdminUser(null);
      setAdminLoggedIn(false);
      setAdminCars([]);
      setEnquiries([]);
      showToast('Signed out of Firebase Admin. Private owner details locked.');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  // Upload Photo to Firebase Storage
  const uploadPhoto = async (file: File): Promise<string> => {
    try {
      const url = await uploadCarImageToStorage(file, 'car-photos');
      showToast('Photo uploaded to Firebase Storage successfully!');
      return url;
    } catch (err) {
      console.error('Storage upload error:', err);
      showToast('Failed to upload image to Firebase Storage.');
      throw err;
    }
  };

  // Submit car for broker review (Customer Flow)
  const submitCarForBrokerReview = async (payload: CarSubmissionPayload) => {
    setIsLoading(true);
    try {
      const result = await firestoreCars.submitCar(payload);
      showToast('Car submitted to AM Cars verification! We will contact you privately.');
      if (adminLoggedIn) {
        await loadAdminData();
      }
      return result;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Submission failed';
      showToast(msg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Approve car submission (Admin Review Flow)
  const approveCarSubmission = async (id: string) => {
    try {
      await firestoreCars.updateCarStatus(id, 'available');
      showToast('Car approved & published to AM Cars showroom stock in Firestore!');
      await refreshData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Approval failed';
      showToast(msg);
    }
  };

  // Reject car submission (Admin Review Flow)
  const rejectCarSubmission = async (id: string, reason?: string) => {
    try {
      await firestoreCars.updateCarStatus(id, 'rejected', reason);
      showToast('Car submission rejected.');
      await refreshData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Rejection failed';
      showToast(msg);
    }
  };

  // Add car directly by admin
  const addCar = async (newCarData: Omit<Car, 'id' | 'createdAt'>) => {
    try {
      await firestoreCars.createAdminCar(newCarData);
      showToast(`Car "${newCarData.brand} ${newCarData.model}" published to Cloud Firestore!`);
      await refreshData();
    } catch (err) {
      console.error('Firestore create error, falling back locally:', err);
      const id = `am-car-${Date.now()}`;
      const newCar: Car = {
        ...newCarData,
        id,
        manufacturingYear: newCarData.manufacturingYear || newCarData.year,
        registrationYear: newCarData.registrationYear || newCarData.year,
        location: newCarData.location || 'Ambasamudram Showroom, TN',
        createdAt: new Date().toISOString(),
      };
      setCars((prev) => [newCar, ...prev]);
      setAdminCars((prev) => [newCar, ...prev]);
      showToast(`Car added to inventory!`);
    }
  };

  // Update car details
  const updateCar = async (id: string, updatedCar: Partial<Car>) => {
    try {
      await firestoreCars.updateAdminCar(id, updatedCar);
      showToast('Vehicle details updated in Cloud Firestore!');
      await refreshData();
    } catch (err) {
      console.error('Firestore update error:', err);
      setCars((prev) =>
        prev.map((c) => (c.id === id ? { ...c, ...updatedCar } : c))
      );
      setAdminCars((prev) =>
        prev.map((c) => (c.id === id ? { ...c, ...updatedCar } : c))
      );
      showToast('Vehicle details updated locally!');
    }
  };

  // Delete car
  const deleteCar = async (id: string) => {
    try {
      await firestoreCars.deleteCar(id);
      showToast('Car removed from Cloud Firestore.');
      await refreshData();
    } catch (err) {
      console.error('Firestore delete error:', err);
      setCars((prev) => prev.filter((c) => c.id !== id));
      setAdminCars((prev) => prev.filter((c) => c.id !== id));
      showToast('Car removed from inventory.');
    }
  };

  // Mark car as sold
  const markCarAsSold = async (id: string) => {
    try {
      await firestoreCars.updateCarStatus(id, 'sold');
      showToast('Car marked as SOLD in Cloud Firestore.');
      await refreshData();
    } catch (err) {
      console.error('Firestore status error:', err);
      setCars((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status: 'sold' } : c))
      );
      setAdminCars((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status: 'sold' } : c))
      );
      showToast('Car marked as SOLD.');
    }
  };

  // Restore car to available
  const restoreCarToAvailable = async (id: string) => {
    try {
      await firestoreCars.updateCarStatus(id, 'available');
      showToast('Car restored to AVAILABLE inventory in Cloud Firestore!');
      await refreshData();
    } catch (err) {
      console.error('Firestore restore error:', err);
      setCars((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status: 'available' } : c))
      );
      setAdminCars((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status: 'available' } : c))
      );
      showToast('Car restored to AVAILABLE!');
    }
  };

  // Toggle status
  const toggleCarStatus = async (id: string) => {
    const target = (adminLoggedIn ? adminCars : cars).find((c) => c.id === id);
    if (!target) return;
    const nextStatus: CarStatus = target.status === 'available' ? 'sold' : 'available';
    if (nextStatus === 'sold') {
      await markCarAsSold(id);
    } else {
      await restoreCarToAvailable(id);
    }
  };

  // Quick update price
  const quickUpdatePrice = async (id: string, newPrice: number) => {
    await updateCar(id, { price: newPrice });
  };

  // Update dealership settings
  const updateSettings = async (newSettings: DealershipSettings) => {
    try {
      await firestoreSettings.saveSettings(newSettings);
      setSettings(newSettings);
      localStorageService.saveSettings(newSettings);
      showToast('Dealership settings saved to Cloud Firestore!');
    } catch (err) {
      console.error('Settings save error:', err);
      setSettings(newSettings);
      localStorageService.saveSettings(newSettings);
      showToast('Settings saved locally!');
    }
  };

  // Reset / Seed sample data into Firestore
  const resetToSampleData = async () => {
    try {
      setIsLoading(true);
      await firestoreCars.seedInitialCarsIfEmpty();
      showToast('Sample inventory verified in Cloud Firestore.');
      await refreshData();
    } catch (err) {
      console.error('Reset error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Customer Enquiries
  const submitCustomerEnquiry = async (enquiry: {
    name: string;
    phone: string;
    email?: string;
    carId?: string;
    carName?: string;
    enquiryType?: string;
    message?: string;
  }): Promise<string> => {
    const id = await firestoreEnquiries.submitEnquiry(enquiry);
    showToast('Your enquiry has been received! AM Cars Ambai will contact you shortly.');
    if (adminLoggedIn) {
      loadAdminData();
    }
    return id;
  };

  const updateEnquiryStatus = async (id: string, status: 'new' | 'contacted' | 'closed') => {
    await firestoreEnquiries.updateEnquiryStatus(id, status);
    setEnquiries((prev) => prev.map((e) => (e.id === id ? { ...e, status } : e)));
    showToast(`Enquiry marked as ${status}.`);
  };

  const deleteEnquiry = async (id: string) => {
    await firestoreEnquiries.deleteEnquiry(id);
    setEnquiries((prev) => prev.filter((e) => e.id !== id));
    showToast('Enquiry deleted.');
  };

  const pendingCount = adminCars.filter((c) => c.status === 'pending').length;

  return (
    <CarContext.Provider
      value={{
        cars,
        adminCars,
        pendingCount,
        selectedCar,
        activePage,
        filters,
        settings,
        adminLoggedIn,
        adminUser,
        enquiries,
        toastMessage,
        isLoading,
        setSelectedCar,
        setActivePage,
        setFilters,
        resetFilters,
        submitCarForBrokerReview,
        approveCarSubmission,
        rejectCarSubmission,
        addCar,
        updateCar,
        deleteCar,
        markCarAsSold,
        restoreCarToAvailable,
        toggleCarStatus,
        quickUpdatePrice,
        updateSettings,
        resetToSampleData,
        loginAdminWithEmail,
        registerAdminWithEmail,
        loginAdminWithGoogle,
        loginAdmin,
        logoutAdmin,
        setAdminLoggedIn,
        showToast,
        refreshData,
        uploadPhoto,
        submitCustomerEnquiry,
        updateEnquiryStatus,
        deleteEnquiry,
      }}
    >
      {children}
    </CarContext.Provider>
  );
};

export const useCars = (): CarContextType => {
  const context = useContext(CarContext);
  if (!context) {
    throw new Error('useCars must be used within a CarProvider');
  }
  return context;
};
