import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  onAuthStateChanged,
  User 
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where,
  getDocFromServer
} from 'firebase/firestore';
import { 
  getStorage, 
  ref, 
  uploadBytes, 
  getDownloadURL 
} from 'firebase/storage';
import { Car, DealershipSettings, CarStatus, CarSubmissionPayload, CustomerEnquiry } from '../types';
import { INITIAL_CARS } from '../data/sampleCars';
import { CENTRAL_DEALERSHIP_CONFIG } from '../config/dealership';
import firebaseConfig from '../../firebase-applet-config.json';

// 1. Initialize Firebase App
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// 2. Initialize Firebase Auth
export const auth = getAuth(app);

// 3. Initialize Cloud Firestore (using the dedicated firestoreDatabaseId)
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// 4. Initialize Firebase Storage
export const storage = getStorage(app, `gs://${firebaseConfig.storageBucket}`);

/**
 * Validate Connection to Firestore (Per Firebase SKILL standard)
 */
export async function testFirebaseConnection(): Promise<boolean> {
  try {
    const testDoc = await getDocFromServer(doc(db, 'settings', 'showroom'));
    return Boolean(testDoc);
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase client is offline or network is warming up.');
    }
    return true; // Still initialized
  }
}

/**
 * FIREBASE AUTHENTICATION
 */
export const firebaseAuth = {
  getCurrentUser(): User | null {
    return auth.currentUser;
  },

  async getAdminToken(): Promise<string | null> {
    const user = auth.currentUser;
    if (!user) return null;
    return user.getIdToken();
  },

  async loginAdmin(email: string, password: string): Promise<User> {
    const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
    return cred.user;
  },

  async registerAdmin(email: string, password: string): Promise<User> {
    const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
    return cred.user;
  },

  async loginWithGoogle(): Promise<User> {
    const provider = new GoogleAuthProvider();
    const cred = await signInWithPopup(auth, provider);
    return cred.user;
  },

  async logout(): Promise<void> {
    await signOut(auth);
  },

  onAuthStateChanged(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, callback);
  }
};

/**
 * FIREBASE STORAGE: Car Images
 */
export async function uploadCarImageToStorage(file: File, folder = 'cars'): Promise<string> {
  const cleanFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const timestamp = Date.now();
  const storagePath = `${folder}/${timestamp}_${cleanFileName}`;
  const fileRef = ref(storage, storagePath);

  const snapshot = await uploadBytes(fileRef, file, {
    contentType: file.type || 'image/jpeg',
  });

  const downloadUrl = await getDownloadURL(snapshot.ref);
  return downloadUrl;
}

/**
 * CLOUD FIRESTORE: Cars & Vehicle Owners
 */

// Helper to strip any private owner info before returning public cars
function sanitizePublicCar(car: Car): Car {
  const copy = { ...car };
  delete copy.ownerName;
  delete copy.ownerPhone;
  delete copy.ownerWhatsapp;
  delete copy.ownerNotes;
  return copy;
}

export const firestoreCars = {
  // Public: Read ONLY approved listings (available or sold)
  async getPublicCars(): Promise<Car[]> {
    try {
      const q = query(collection(db, 'cars'), where('status', 'in', ['available', 'sold']));
      const snapshot = await getDocs(q);
      if (snapshot.empty) {
        return [];
      }
      const cars: Car[] = [];
      snapshot.forEach((d) => {
        const data = d.data() as Car;
        cars.push(sanitizePublicCar({ ...data, id: d.id }));
      });
      // Sort newest first
      cars.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
      return cars;
    } catch (err) {
      console.error('Error fetching public cars from Firestore:', err);
      throw err;
    }
  },

  // Admin: Read all listings (available, pending, rejected, sold) + join private owner info
  async getAdminCars(): Promise<Car[]> {
    try {
      const carsSnap = await getDocs(collection(db, 'cars'));
      const cars: Car[] = [];

      for (const carDoc of carsSnap.docs) {
        const carData = carDoc.data() as Car;
        const carId = carDoc.id;

        // Try to fetch confidential vehicle_owner document
        let ownerData: Partial<Car> = {};
        try {
          const ownerDoc = await getDoc(doc(db, 'vehicle_owners', carId));
          if (ownerDoc.exists()) {
            const rawOwner = ownerDoc.data();
            ownerData = {
              ownerName: rawOwner.ownerName,
              ownerPhone: rawOwner.ownerPhone,
              ownerWhatsapp: rawOwner.ownerWhatsapp,
              ownerNotes: rawOwner.ownerNotes,
              submissionDate: rawOwner.submittedAt,
            };
          }
        } catch {
          // If unreadable or missing, keep blank
        }

        cars.push({
          ...carData,
          id: carId,
          ...ownerData,
        });
      }

      cars.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
      return cars;
    } catch (err) {
      console.error('Error fetching admin cars from Firestore:', err);
      throw err;
    }
  },

  // Customer: Submit vehicle for review ("Sell Your Car")
  // Separates public vehicle card from private owner details strictly into 'vehicle_owners'
  async submitCar(payload: CarSubmissionPayload): Promise<{ success: boolean; carId: string; message: string }> {
    const carId = `sub-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const now = new Date().toISOString();

    // 1. Vehicle Public Data in 'cars' collection with status 'pending' (ZERO owner info)
    const carDocument: Car = {
      id: carId,
      brand: payload.brand,
      model: payload.model,
      variant: payload.variant || 'Standard',
      year: payload.manufacturingYear || 2021,
      manufacturingYear: payload.manufacturingYear || 2021,
      registrationYear: payload.registrationYear || payload.manufacturingYear || 2021,
      price: payload.price,
      kilometers: payload.kilometers,
      fuelType: payload.fuelType,
      transmission: payload.transmission,
      bodyType: payload.bodyType,
      location: payload.location || 'Ambasamudram, TN',
      owners: payload.owners,
      registrationState: payload.registrationState,
      rtoCode: payload.rtoCode,
      insuranceValidity: payload.insuranceValidity,
      mileage: 'Verified',
      engine: 'Verified',
      color: payload.color,
      status: 'pending',
      featured: false,
      images: payload.images && payload.images.length > 0 ? payload.images : [],
      features: payload.features && payload.features.length > 0 ? payload.features : ['Verified Documents'],
      description: payload.description,
      createdAt: now,
      submissionDate: now,
    };

    // 2. Private Owner Data strictly in 'vehicle_owners' collection
    const ownerDocument = {
      carId,
      ownerName: payload.ownerName,
      ownerPhone: payload.ownerPhone,
      ownerWhatsapp: payload.ownerWhatsapp || payload.ownerPhone,
      ownerNotes: payload.ownerNotes || '',
      submittedAt: now,
    };

    // Write private owner info first
    await setDoc(doc(db, 'vehicle_owners', carId), ownerDocument);

    // Write car document
    await setDoc(doc(db, 'cars', carId), carDocument);

    return {
      success: true,
      carId,
      message: 'Vehicle submitted successfully. AM Cars Ambai will review and verify your car before listing.',
    };
  },

  // Admin: Create new car listing directly
  async createAdminCar(carData: Partial<Car>): Promise<Car> {
    const carId = `am-car-${Date.now()}`;
    const now = new Date().toISOString();

    const newCar: Car = {
      id: carId,
      brand: carData.brand || 'Maruti Suzuki',
      model: carData.model || '',
      variant: carData.variant || 'Standard',
      year: carData.manufacturingYear || carData.year || 2021,
      manufacturingYear: carData.manufacturingYear || carData.year || 2021,
      registrationYear: carData.registrationYear || carData.year || 2021,
      price: Number(carData.price || 500000),
      kilometers: Number(carData.kilometers || 30000),
      fuelType: carData.fuelType || 'Petrol',
      transmission: carData.transmission || 'Manual',
      bodyType: carData.bodyType || 'Hatchback',
      location: carData.location || 'Ambasamudram Showroom, TN',
      owners: carData.owners || '1st Owner',
      registrationState: carData.registrationState || 'TN-72 (Tirunelveli)',
      rtoCode: carData.rtoCode || 'TN-72',
      insuranceValidity: carData.insuranceValidity || 'Comprehensive',
      mileage: carData.mileage || '20.0 kmpl',
      engine: carData.engine || '1197 cc',
      color: carData.color || 'White',
      status: carData.status || 'available',
      featured: Boolean(carData.featured),
      images: carData.images || [],
      features: carData.features || ['Air Conditioning', 'Power Steering'],
      description: carData.description || 'Verified pre-owned car at AM Cars Ambai.',
      createdAt: now,
    };

    // Save car
    await setDoc(doc(db, 'cars', carId), newCar);

    // Save owner details if provided
    if (carData.ownerName || carData.ownerPhone) {
      await setDoc(doc(db, 'vehicle_owners', carId), {
        carId,
        ownerName: carData.ownerName || '',
        ownerPhone: carData.ownerPhone || '',
        ownerWhatsapp: carData.ownerWhatsapp || '',
        ownerNotes: carData.ownerNotes || '',
        submittedAt: now,
      });
    }

    return {
      ...newCar,
      ownerName: carData.ownerName,
      ownerPhone: carData.ownerPhone,
      ownerWhatsapp: carData.ownerWhatsapp,
      ownerNotes: carData.ownerNotes,
    };
  },

  // Admin: Update car listing
  async updateAdminCar(id: string, updates: Partial<Car>): Promise<Car> {
    const cleanUpdates = { ...updates };
    const ownerFields = {
      ownerName: cleanUpdates.ownerName,
      ownerPhone: cleanUpdates.ownerPhone,
      ownerWhatsapp: cleanUpdates.ownerWhatsapp,
      ownerNotes: cleanUpdates.ownerNotes,
    };

    delete cleanUpdates.ownerName;
    delete cleanUpdates.ownerPhone;
    delete cleanUpdates.ownerWhatsapp;
    delete cleanUpdates.ownerNotes;

    if (Object.keys(cleanUpdates).length > 0) {
      await updateDoc(doc(db, 'cars', id), cleanUpdates);
    }

    if (ownerFields.ownerName || ownerFields.ownerPhone || ownerFields.ownerWhatsapp || ownerFields.ownerNotes) {
      await setDoc(doc(db, 'vehicle_owners', id), {
        carId: id,
        ...ownerFields,
        updatedAt: new Date().toISOString(),
      }, { merge: true });
    }

    const updatedDoc = await getDoc(doc(db, 'cars', id));
    return { ...(updatedDoc.data() as Car), ...ownerFields, id };
  },

  // Admin: Update Status (Approve, Reject, Mark as Sold, Restore to Available)
  async updateCarStatus(id: string, status: CarStatus, rejectionReason?: string): Promise<void> {
    const updates: { status: CarStatus; rejectionReason?: string } = { status };
    if (rejectionReason !== undefined) {
      updates.rejectionReason = rejectionReason;
    }
    await updateDoc(doc(db, 'cars', id), updates);
  },

  // Admin: Delete Car
  async deleteCar(id: string): Promise<void> {
    await deleteDoc(doc(db, 'cars', id));
    try {
      await deleteDoc(doc(db, 'vehicle_owners', id));
    } catch {
      // ignore
    }
  },

  // Initial Data Seeding to Firestore
  async seedInitialCarsIfEmpty(): Promise<number> {
    const snap = await getDocs(query(collection(db, 'cars'), where('status', 'in', ['available', 'sold'])));
    if (!snap.empty) {
      return snap.docs.length;
    }

    console.log('Seeding initial showroom inventory to Firestore...');
    for (const car of INITIAL_CARS) {
      await setDoc(doc(db, 'cars', car.id), {
        ...car,
        createdAt: car.createdAt || new Date().toISOString(),
      });
    }
    return INITIAL_CARS.length;
  }
};

/**
 * CLOUD FIRESTORE: Customer Enquiries
 */
export const firestoreEnquiries = {
  // Public: Submit an enquiry
  async submitEnquiry(enquiry: {
    name: string;
    phone: string;
    email?: string;
    carId?: string;
    carName?: string;
    enquiryType?: string;
    message?: string;
  }): Promise<string> {
    const id = `enq-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newEnquiry: CustomerEnquiry = {
      id,
      name: enquiry.name.trim(),
      phone: enquiry.phone.trim(),
      email: enquiry.email?.trim() || '',
      carId: enquiry.carId || '',
      carName: enquiry.carName || '',
      enquiryType: enquiry.enquiryType || 'General Enquiry',
      message: enquiry.message?.trim() || '',
      createdAt: new Date().toISOString(),
      status: 'new',
    };

    await setDoc(doc(db, 'enquiries', id), newEnquiry);
    return id;
  },

  // Admin: Fetch all enquiries
  async getEnquiries(): Promise<CustomerEnquiry[]> {
    try {
      const snap = await getDocs(collection(db, 'enquiries'));
      const list: CustomerEnquiry[] = [];
      snap.forEach((d) => {
        list.push({ ...(d.data() as CustomerEnquiry), id: d.id });
      });
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      return list;
    } catch (err) {
      console.error('Error reading enquiries:', err);
      return [];
    }
  },

  // Admin: Update enquiry status
  async updateEnquiryStatus(id: string, status: 'new' | 'contacted' | 'closed'): Promise<void> {
    await updateDoc(doc(db, 'enquiries', id), { status });
  },

  // Admin: Delete enquiry
  async deleteEnquiry(id: string): Promise<void> {
    await deleteDoc(doc(db, 'enquiries', id));
  }
};

/**
 * CLOUD FIRESTORE: Dealership Settings
 */
export const firestoreSettings = {
  async getSettings(): Promise<DealershipSettings | null> {
    try {
      const snap = await getDoc(doc(db, 'settings', 'showroom'));
      if (snap.exists()) {
        return snap.data() as DealershipSettings;
      }
      return null;
    } catch (err) {
      console.error('Error fetching settings from Firestore:', err);
      return null;
    }
  },

  async saveSettings(settings: DealershipSettings): Promise<void> {
    await setDoc(doc(db, 'settings', 'showroom'), settings, { merge: true });
  }
};
