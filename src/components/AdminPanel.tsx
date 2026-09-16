import React, { useState, useRef, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  RotateCcw, 
  IndianRupee, 
  Upload, 
  Car as CarIcon, 
  CheckCircle2, 
  AlertTriangle,
  Search,
  Settings,
  Phone,
  MessageCircle,
  MapPin,
  Clock,
  Save,
  CheckCircle,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  User,
  ExternalLink,
  Sliders,
  AlertCircle,
  Sparkles,
  Building2
} from 'lucide-react';
import { useCars } from '../context/CarContext';
import { Car, FuelType, TransmissionType, BodyType, CarStatus, DealershipSettings } from '../types';
import { formatIndianRupees, formatPriceLakh, formatKM } from '../utils/formatters';
import { POPULAR_BRANDS } from '../data/sampleCars';
import { CENTRAL_DEALERSHIP_CONFIG } from '../config/dealership';

const PRESET_SAMPLE_IMAGES = [
  'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1541348263662-e0c8de4259ba?auto=format&fit=crop&w=1200&q=80'
];

export const FORM_BRANDS = [
  'Maruti Suzuki',
  'Hyundai',
  'Tata',
  'Mahindra',
  'Toyota',
  'Honda',
  'Kia',
  'Volkswagen',
  'Renault',
  'Skoda',
  'Nissan',
  'Ford',
  'MG',
  'Other'
];

export const LOCATION_SUGGESTIONS = [
  'Ambasamudram Showroom, TN',
  'Cheranmahadevi, TN',
  'Tirunelveli, TN',
  'Tenkasi, TN',
  'Alangulam, TN'
];

export const AdminPanel: React.FC = () => {
  const { 
    cars: publicCars, 
    adminCars,
    pendingCount,
    settings,
    adminLoggedIn,
    adminUser,
    enquiries,
    loginAdminWithEmail,
    registerAdminWithEmail,
    loginAdminWithGoogle,
    logoutAdmin,
    approveCarSubmission,
    rejectCarSubmission,
    updateSettings,
    addCar, 
    updateCar, 
    deleteCar, 
    markCarAsSold,
    restoreCarToAvailable,
    toggleCarStatus, 
    quickUpdatePrice, 
    resetToSampleData, 
    setSelectedCar,
    setActivePage,
    uploadPhoto,
    updateEnquiryStatus,
    deleteEnquiry
  } = useCars();

  // Firebase Auth Login Gate State
  const [adminEmail, setAdminEmail] = useState('drmohammedareef@gmail.com');
  const [adminPassword, setAdminPassword] = useState('');
  const [authMode, setAuthMode] = useState<'signin' | 'register'>('signin');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loggingIn, setLoggingIn] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Tab State
  const [activeAdminTab, setActiveAdminTab] = useState<'submissions' | 'inventory' | 'enquiries' | 'settings'>('submissions');
  const [submissionFilter, setSubmissionFilter] = useState<'all' | 'pending' | 'available' | 'rejected' | 'sold'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'available' | 'sold' | 'pending' | 'rejected'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCarId, setEditingCarId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [quickPriceEditId, setQuickPriceEditId] = useState<string | null>(null);
  const [quickPriceValue, setQuickPriceValue] = useState<string>('');
  const [rejectionModalId, setRejectionModalId] = useState<string | null>(null);
  const [rejectionReasonText, setRejectionReasonText] = useState('');
  const [enquiryFilter, setEnquiryFilter] = useState<'all' | 'new' | 'contacted' | 'closed'>('all');
  const [enquirySearch, setEnquirySearch] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cars to display in Admin view: if logged in, use full adminCars, otherwise empty
  const workingCars = adminLoggedIn ? adminCars : publicCars;

  // Form State for Add / Edit Car
  const [formData, setFormData] = useState({
    brand: 'Maruti Suzuki',
    model: '',
    variant: '',
    manufacturingYear: 2021,
    registrationYear: 2021,
    price: 650000,
    kilometers: 35000,
    fuelType: 'Petrol' as FuelType,
    transmission: 'Manual' as TransmissionType,
    bodyType: 'Hatchback' as BodyType,
    location: 'Ambasamudram Showroom, TN',
    owners: '1st Owner' as '1st Owner' | '2nd Owner' | '3rd Owner',
    registrationState: 'TN-72 (Tirunelveli)',
    insuranceValidity: 'Comprehensive valid for 1 year',
    mileage: '21.0 kmpl',
    engine: '1197 cc',
    color: 'Polar White',
    status: 'available' as CarStatus,
    featured: false,
    rtoCode: 'TN-72-AB-1234',
    description: '',
    images: [] as string[],
    featuresString: 'Touchscreen Infotainment, Power Steering, ABS with EBD, Dual Airbags, Reverse Camera',
    newImageUrl: '',
    // Private owner fields
    ownerName: '',
    ownerPhone: '',
    ownerWhatsapp: '',
    ownerNotes: '',
  });

  // Settings Form State
  const [settingsForm, setSettingsForm] = useState<DealershipSettings>({ ...settings });

  useEffect(() => {
    setSettingsForm({ ...settings });
  }, [settings]);

  // Handle Firebase Admin Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setLoggingIn(true);
    let success = false;
    if (authMode === 'signin') {
      success = await loginAdminWithEmail(adminEmail, adminPassword);
    } else {
      success = await registerAdminWithEmail(adminEmail, adminPassword);
    }
    setLoggingIn(false);
    if (!success) {
      setLoginError(
        authMode === 'signin' 
          ? 'Firebase sign-in failed. Please check credentials or sign in with Google.' 
          : 'Firebase registration failed. If email/password provider is disabled in Firebase Console, use Google Sign-In.'
      );
    } else {
      setAdminPassword('');
    }
  };

  const handleGoogleSignIn = async () => {
    setLoginError(null);
    setLoggingIn(true);
    const success = await loginAdminWithGoogle();
    setLoggingIn(false);
    if (!success) {
      setLoginError('Google Sign-In was cancelled or failed.');
    }
  };

  // Stats calculation
  const totalCars = workingCars.length;
  const availableCars = workingCars.filter((c) => c.status === 'available').length;
  const soldCars = workingCars.filter((c) => c.status === 'sold').length;
  const pendingCars = workingCars.filter((c) => c.status === 'pending');
  const rejectedCars = workingCars.filter((c) => c.status === 'rejected').length;
  const totalValuation = workingCars
    .filter((c) => c.status === 'available')
    .reduce((acc, c) => acc + c.price, 0);

  // Filter cars in inventory table
  const filteredCars = workingCars.filter((car) => {
    const matchesSearch =
      car.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      car.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      car.variant.toLowerCase().includes(searchQuery.toLowerCase()) ||
      car.registrationState.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (car.ownerName && car.ownerName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (car.location && car.location.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || car.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const openAddModal = () => {
    setEditingCarId(null);
    setFormData({
      brand: 'Maruti Suzuki',
      model: '',
      variant: '',
      manufacturingYear: 2021,
      registrationYear: 2021,
      price: 600000,
      kilometers: 35000,
      fuelType: 'Petrol',
      transmission: 'Manual',
      bodyType: 'Hatchback',
      location: settings.shortAddress || 'Ambasamudram Showroom, TN',
      owners: '1st Owner',
      registrationState: 'TN-72 (Tirunelveli)',
      insuranceValidity: 'Comprehensive valid',
      mileage: '20.5 kmpl',
      engine: '1197 cc',
      color: 'White',
      status: 'available',
      featured: false,
      rtoCode: 'TN-72-AB-1234',
      description: 'Single owner car verified by AM Cars Ambai. Showroom condition with verified documents.',
      images: [PRESET_SAMPLE_IMAGES[0], PRESET_SAMPLE_IMAGES[1]],
      featuresString: 'Air Conditioning, Power Steering, ABS with EBD, Central Locking, Dual Airbags',
      newImageUrl: '',
      ownerName: '',
      ownerPhone: '',
      ownerWhatsapp: '',
      ownerNotes: '',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (car: Car) => {
    setEditingCarId(car.id);
    setFormData({
      brand: car.brand,
      model: car.model,
      variant: car.variant,
      manufacturingYear: car.manufacturingYear || car.year,
      registrationYear: car.registrationYear || car.year,
      price: car.price,
      kilometers: car.kilometers,
      fuelType: car.fuelType,
      transmission: car.transmission,
      bodyType: car.bodyType,
      location: car.location || settings.shortAddress,
      owners: car.owners,
      registrationState: car.registrationState,
      insuranceValidity: car.insuranceValidity,
      mileage: car.mileage,
      engine: car.engine,
      color: car.color,
      status: car.status,
      featured: Boolean(car.featured),
      rtoCode: car.rtoCode,
      description: car.description,
      images: car.images || [],
      featuresString: (car.features || []).join(', '),
      newImageUrl: '',
      ownerName: car.ownerName || '',
      ownerPhone: car.ownerPhone || '',
      ownerWhatsapp: car.ownerWhatsapp || '',
      ownerNotes: car.ownerNotes || '',
    });
    setIsModalOpen(true);
  };

  const handleSaveCar = async (e: React.FormEvent) => {
    e.preventDefault();
    const features = formData.featuresString
      .split(',')
      .map((f) => f.trim())
      .filter(Boolean);

    const carData = {
      brand: formData.brand,
      model: formData.model.trim(),
      variant: formData.variant.trim(),
      year: Number(formData.manufacturingYear),
      manufacturingYear: Number(formData.manufacturingYear),
      registrationYear: Number(formData.registrationYear),
      price: Number(formData.price),
      kilometers: Number(formData.kilometers),
      fuelType: formData.fuelType,
      transmission: formData.transmission,
      bodyType: formData.bodyType,
      location: formData.location.trim(),
      owners: formData.owners,
      registrationState: formData.registrationState.trim(),
      insuranceValidity: formData.insuranceValidity.trim(),
      mileage: formData.mileage.trim(),
      engine: formData.engine.trim(),
      color: formData.color.trim(),
      status: formData.status,
      featured: formData.featured,
      rtoCode: formData.rtoCode.trim(),
      description: formData.description.trim(),
      images: formData.images.length > 0 ? formData.images : [PRESET_SAMPLE_IMAGES[0]],
      features,
      ownerName: formData.ownerName.trim() || undefined,
      ownerPhone: formData.ownerPhone.trim() || undefined,
      ownerWhatsapp: formData.ownerWhatsapp.trim() || undefined,
      ownerNotes: formData.ownerNotes.trim() || undefined,
    };

    if (editingCarId) {
      await updateCar(editingCarId, carData);
    } else {
      await addCar(carData);
    }

    setIsModalOpen(false);
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhoneDigits = settingsForm.phone.replace(/\D/g, '');
    const cleanWhatsappDigits = settingsForm.whatsapp.replace(/\D/g, '');

    const normalizedPhoneRaw = cleanPhoneDigits.length === 10
      ? `91${cleanPhoneDigits}`
      : (cleanPhoneDigits.startsWith('0') && cleanPhoneDigits.length === 11
          ? `91${cleanPhoneDigits.slice(1)}`
          : cleanPhoneDigits || CENTRAL_DEALERSHIP_CONFIG.phoneRaw);

    const normalizedWhatsappRaw = cleanWhatsappDigits.length === 10
      ? `91${cleanWhatsappDigits}`
      : (cleanWhatsappDigits.startsWith('0') && cleanWhatsappDigits.length === 11
          ? `91${cleanWhatsappDigits.slice(1)}`
          : cleanWhatsappDigits || CENTRAL_DEALERSHIP_CONFIG.whatsappRaw);

    const updated: DealershipSettings = {
      ...settingsForm,
      phone: settingsForm.phone.trim(),
      whatsapp: settingsForm.whatsapp.trim(),
      phoneRaw: normalizedPhoneRaw,
      whatsappRaw: normalizedWhatsappRaw,
      isConfigured: true,
    };

    await updateSettings(updated);
  };

  const handleRestoreDefaultContact = async () => {
    const defaultSettings: DealershipSettings = {
      businessName: CENTRAL_DEALERSHIP_CONFIG.businessName,
      phone: CENTRAL_DEALERSHIP_CONFIG.phone,
      phoneRaw: CENTRAL_DEALERSHIP_CONFIG.phoneRaw,
      whatsapp: CENTRAL_DEALERSHIP_CONFIG.whatsapp,
      whatsappRaw: CENTRAL_DEALERSHIP_CONFIG.whatsappRaw,
      address: CENTRAL_DEALERSHIP_CONFIG.address,
      shortAddress: CENTRAL_DEALERSHIP_CONFIG.shortAddress,
      email: CENTRAL_DEALERSHIP_CONFIG.email,
      businessHoursWeekdays: CENTRAL_DEALERSHIP_CONFIG.businessHoursWeekdays,
      businessHoursSunday: CENTRAL_DEALERSHIP_CONFIG.businessHoursSunday,
      googleMapsUrl: CENTRAL_DEALERSHIP_CONFIG.googleMapsUrl,
      isConfigured: true,
    };

    setSettingsForm(defaultSettings);
    await updateSettings(defaultSettings);
  };

  const handleApprove = async (carId: string) => {
    await approveCarSubmission(carId);
  };

  const handleRejectSubmit = async (carId: string) => {
    await rejectCarSubmission(carId, rejectionReasonText || 'Did not meet showroom condition criteria');
    setRejectionModalId(null);
    setRejectionReasonText('');
  };

  const startQuickPriceEdit = (car: Car) => {
    setQuickPriceEditId(car.id);
    setQuickPriceValue(car.price.toString());
  };

  const saveQuickPrice = async (carId: string) => {
    const val = Number(quickPriceValue);
    if (val && !isNaN(val) && val > 0) {
      await quickUpdatePrice(carId, val);
    }
    setQuickPriceEditId(null);
  };

  // Image helpers
  const handleAddImageUrl = () => {
    if (formData.newImageUrl.trim() && !formData.images.includes(formData.newImageUrl.trim())) {
      setFormData({
        ...formData,
        images: [...formData.images, formData.newImageUrl.trim()],
        newImageUrl: '',
      });
    }
  };

  const handleAddPresetImage = (url: string) => {
    if (!formData.images.includes(url)) {
      setFormData({
        ...formData,
        images: [...formData.images, url],
      });
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index),
    });
  };

  const handleAddSampleBatch = () => {
    setFormData((prev) => ({
      ...prev,
      images: Array.from(new Set([...prev.images, ...PRESET_SAMPLE_IMAGES.slice(0, 4)]))
    }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImage(true);
    try {
      for (const file of Array.from(files) as File[]) {
        try {
          const downloadUrl = await uploadPhoto(file);
          setFormData((prev) => ({
            ...prev,
            images: [...prev.images, downloadUrl],
          }));
        } catch {
          const reader = new FileReader();
          reader.onload = (uploadEvent) => {
            const result = uploadEvent.target?.result as string;
            if (result) {
              setFormData((prev) => ({
                ...prev,
                images: [...prev.images, result],
              }));
            }
          };
          reader.readAsDataURL(file);
        }
      }
    } finally {
      setUploadingImage(false);
      e.target.value = '';
    }
  };

  // ==============================================================
  // 1. LOGIN SCREEN (FIREBASE AUTHENTICATION)
  // ==============================================================
  if (!adminLoggedIn) {
    return (
      <div className="min-h-[85vh] py-16 px-4 flex items-center justify-center">
        <div className="w-full max-w-md rounded-3xl border border-neutral-800 bg-neutral-900/90 p-8 shadow-2xl backdrop-blur-xl">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/15 text-red-400 border border-red-500/30">
            <Lock className="h-8 w-8" />
          </div>

          <div className="text-center mb-6">
            <span className="inline-block rounded-full bg-red-500/10 px-3 py-1 text-xs font-semibold text-red-300 border border-red-500/20 mb-2">
              AM Cars Ambai Administration
            </span>
            <h1 className="font-display text-2xl font-extrabold text-white">
              Firebase Admin Login
            </h1>
            <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
              Authenticate via Firebase Authentication to review owner vehicle submissions, manage Cloud Firestore inventory, and view customer enquiries.
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="grid grid-cols-2 p-1 bg-neutral-950 rounded-xl border border-neutral-800 mb-5">
            <button
              type="button"
              onClick={() => { setAuthMode('signin'); setLoginError(null); }}
              className={`py-2 text-xs font-bold rounded-lg transition-all ${
                authMode === 'signin'
                  ? 'bg-red-600 text-white shadow'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setAuthMode('register'); setLoginError(null); }}
              className={`py-2 text-xs font-bold rounded-lg transition-all ${
                authMode === 'register'
                  ? 'bg-red-600 text-white shadow'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Register Admin
            </button>
          </div>

          {loginError && (
            <div className="mb-4 rounded-xl border border-red-500/40 bg-red-950/40 p-3 text-xs text-red-300 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Admin Email Address
              </label>
              <input
                type="email"
                required
                placeholder="admin@amcarsambai.com"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-3 text-sm text-white placeholder-neutral-500 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                placeholder="Enter Firebase password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-3 text-sm text-white placeholder-neutral-500 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
              />
            </div>

            <button
              type="submit"
              disabled={loggingIn}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 hover:bg-red-500 text-white py-3.5 text-sm font-bold text-neutral-950 shadow-lg transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              <Unlock className="h-4 w-4" />
              <span>
                {loggingIn
                  ? 'Authenticating with Firebase...'
                  : authMode === 'signin'
                  ? 'Sign In to Broker Dashboard'
                  : 'Register Admin Account'}
              </span>
            </button>
          </form>

          {/* Google Sign In Option */}
          <div className="mt-4">
            <div className="relative flex items-center justify-center my-4">
              <div className="border-t border-neutral-800 w-full" />
              <span className="bg-neutral-900 px-2 text-[11px] text-neutral-500 uppercase tracking-wider absolute">
                Or
              </span>
            </div>

            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loggingIn}
              className="w-full inline-flex items-center justify-center gap-2.5 rounded-xl border border-neutral-700 bg-neutral-950 hover:bg-neutral-800 py-3 text-xs font-bold text-white transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z"
                />
                <path
                  fill="#4285F4"
                  d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.1-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15.1s.7 5.4 1.9 7.8l3.7-2.9z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 16c1.8 3.7 5.6 6.3 10.1 6.3z"
                />
              </svg>
              <span>Sign In with Google</span>
            </button>
          </div>

          <div className="mt-4 pt-3 border-t border-neutral-800/80 text-center">
            <p className="text-[11px] text-neutral-500">
              Secured with Firebase Authentication. Project ID: <code className="text-red-400/80">am-cars-ambai</code>
            </p>
          </div>

          <div className="mt-4 text-center">
            <button
              onClick={() => setActivePage('home')}
              className="text-xs text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              ← Back to Customer Showroom
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ==============================================================
  // 2. AUTHENTICATED ADMIN DASHBOARD
  // ==============================================================
  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      {/* Top Header & Session Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800 pb-6">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Firebase Auth Active: {adminUser?.email || 'Admin'}</span>
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/10 px-2.5 py-0.5 text-xs font-semibold text-red-400 border border-red-500/20">
              <span>Cloud Firestore: am-cars-ambai</span>
            </span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white mt-1">
            AM Cars Ambai Broker Dashboard
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={openAddModal}
            id="admin-add-new-car-btn"
            className="inline-flex items-center gap-2 rounded-xl bg-red-600 hover:bg-red-500 text-white px-4 py-2.5 text-xs sm:text-sm font-bold text-neutral-950 shadow-lg shadow-red-950/20 transition-all active:scale-95 cursor-pointer"
          >
            <Plus className="h-4 w-4 stroke-[3]" />
            <span>Add New Car</span>
          </button>

          <button
            onClick={resetToSampleData}
            className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-700 bg-neutral-800 px-3 py-2.5 text-xs font-semibold text-neutral-300 hover:bg-neutral-700 hover:text-white transition-colors"
            title="Reset to default seed cars"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Reset Seed</span>
          </button>

          <button
            onClick={logoutAdmin}
            className="inline-flex items-center gap-1.5 rounded-xl border border-red-500/30 bg-red-950/30 px-3 py-2.5 text-xs font-semibold text-red-300 hover:bg-red-900/50 transition-colors cursor-pointer"
          >
            <Lock className="h-3.5 w-3.5" />
            <span>Sign Out Admin</span>
          </button>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex border-b border-neutral-800 gap-2 overflow-x-auto">
        <button
          onClick={() => setActiveAdminTab('submissions')}
          className={`relative pb-3 px-4 text-sm font-bold transition-all border-b-2 flex items-center gap-2 whitespace-nowrap ${
            activeAdminTab === 'submissions'
              ? 'border-red-500 text-red-400'
              : 'border-transparent text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <Clock className="h-4 w-4" />
          <span>Vehicle Submissions</span>
          {pendingCars.length > 0 && (
            <span className="rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-black text-neutral-950 animate-pulse">
              {pendingCars.length} Pending
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveAdminTab('inventory')}
          className={`relative pb-3 px-4 text-sm font-bold transition-all border-b-2 flex items-center gap-2 whitespace-nowrap ${
            activeAdminTab === 'inventory'
              ? 'border-red-500 text-red-400'
              : 'border-transparent text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <CarIcon className="h-4 w-4" />
          <span>Showroom Inventory ({totalCars})</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('enquiries')}
          className={`relative pb-3 px-4 text-sm font-bold transition-all border-b-2 flex items-center gap-2 whitespace-nowrap ${
            activeAdminTab === 'enquiries'
              ? 'border-red-500 text-red-400'
              : 'border-transparent text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <MessageCircle className="h-4 w-4" />
          <span>Customer Enquiries ({enquiries.length})</span>
          {enquiries.filter((e) => e.status === 'new').length > 0 && (
            <span className="rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-black text-neutral-950">
              {enquiries.filter((e) => e.status === 'new').length} New
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveAdminTab('settings')}
          id="admin-tab-business-settings"
          className={`relative pb-3 px-4 text-sm font-bold transition-all border-b-2 flex items-center gap-2 whitespace-nowrap ${
            activeAdminTab === 'settings'
              ? 'border-red-500 text-red-400'
              : 'border-transparent text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <Building2 className="h-4 w-4" />
          <span>Business Settings</span>
        </button>
      </div>

      {/* ==============================================================
          TAB 1: VEHICLE SUBMISSIONS & APPROVALS QUEUE
          ============================================================== */}
      {activeAdminTab === 'submissions' && (
        <div className="space-y-6">
          {/* Header Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-neutral-900/60 p-5 rounded-2xl border border-neutral-800">
            <div>
              <h2 className="font-display text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                <span>Vehicle Submissions & Approvals</span>
                <span className="rounded-md bg-red-500/20 px-2 py-0.5 text-xs font-bold text-red-300">
                  {workingCars.length} Total Registered
                </span>
              </h2>
              <p className="text-xs text-neutral-400 mt-1">
                Admin review portal. Review submitted vehicles, privately contact the owner via Phone/WhatsApp, inspect RC and approve to the public website.
              </p>
            </div>
            <div className="text-xs text-neutral-300 flex items-center gap-2 bg-neutral-950 px-3.5 py-2 rounded-xl border border-emerald-500/30 text-emerald-400">
              <Lock className="h-4 w-4 shrink-0" />
              <span>Private Owner Details visible only to Admin</span>
            </div>
          </div>

          {/* Status Filter Chips */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setSubmissionFilter('all')}
              className={`rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${
                submissionFilter === 'all'
                  ? 'bg-red-600 text-white shadow-md shadow-red-950/20'
                  : 'bg-neutral-900 text-neutral-400 border border-neutral-800 hover:text-white'
              }`}
            >
              All Vehicles ({workingCars.length})
            </button>
            <button
              onClick={() => setSubmissionFilter('pending')}
              className={`rounded-xl px-3.5 py-2 text-xs font-bold transition-all flex items-center gap-1.5 ${
                submissionFilter === 'pending'
                  ? 'bg-red-600 text-white shadow-md shadow-red-950/20'
                  : 'bg-neutral-900 text-red-400 border border-neutral-800 hover:text-red-300'
              }`}
            >
              <Clock className="h-3.5 w-3.5" />
              <span>Pending Review ({pendingCars.length})</span>
            </button>
            <button
              onClick={() => setSubmissionFilter('available')}
              className={`rounded-xl px-3.5 py-2 text-xs font-bold transition-all flex items-center gap-1.5 ${
                submissionFilter === 'available'
                  ? 'bg-emerald-500 text-neutral-950 shadow-md shadow-emerald-500/20'
                  : 'bg-neutral-900 text-emerald-400 border border-neutral-800 hover:text-emerald-300'
              }`}
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Approved ({availableCars})</span>
            </button>
            <button
              onClick={() => setSubmissionFilter('rejected')}
              className={`rounded-xl px-3.5 py-2 text-xs font-bold transition-all flex items-center gap-1.5 ${
                submissionFilter === 'rejected'
                  ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
                  : 'bg-neutral-900 text-rose-400 border border-neutral-800 hover:text-rose-300'
              }`}
            >
              <X className="h-3.5 w-3.5" />
              <span>Rejected ({rejectedCars})</span>
            </button>
            <button
              onClick={() => setSubmissionFilter('sold')}
              className={`rounded-xl px-3.5 py-2 text-xs font-bold transition-all flex items-center gap-1.5 ${
                submissionFilter === 'sold'
                  ? 'bg-neutral-300 text-neutral-950 shadow-md'
                  : 'bg-neutral-900 text-neutral-400 border border-neutral-800 hover:text-white'
              }`}
            >
              <Check className="h-3.5 w-3.5" />
              <span>Sold ({soldCars})</span>
            </button>
          </div>

          {/* Submissions List */}
          {(() => {
            const displayed = workingCars.filter((c) => {
              if (submissionFilter === 'all') return true;
              return c.status === submissionFilter;
            });

            if (displayed.length === 0) {
              return (
                <div className="rounded-3xl border border-dashed border-neutral-800 bg-neutral-900/30 p-12 text-center">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-neutral-800 text-neutral-500">
                    <CheckCircle2 className="h-8 w-8 text-emerald-400" />
                  </div>
                  <h3 className="font-display text-lg font-bold text-white">No Vehicles Found</h3>
                  <p className="text-xs text-neutral-400 max-w-md mx-auto mt-1">
                    No vehicles found with status filter: <span className="text-red-400 font-semibold uppercase">{submissionFilter}</span>.
                  </p>
                  <button
                    onClick={() => setSubmissionFilter('all')}
                    className="mt-4 inline-flex items-center gap-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 px-4 py-2 text-xs font-semibold text-white transition-colors"
                  >
                    <span>View All Vehicles</span>
                  </button>
                </div>
              );
            }

            return (
              <div className="space-y-6">
                {displayed.map((car) => {
                  const cleanPhone = (car.ownerPhone || '').replace(/\D/g, '');
                  const cleanWhatsapp = (car.ownerWhatsapp || car.ownerPhone || '').replace(/\D/g, '');
                  const isApproved = car.status === 'available';
                  const isPending = car.status === 'pending';
                  const isRejected = car.status === 'rejected';
                  const isSold = car.status === 'sold';

                  return (
                    <div
                      key={car.id}
                      className={`rounded-3xl border-2 bg-neutral-900/90 p-6 shadow-xl space-y-6 transition-all ${
                        isPending
                          ? 'border-red-500/50 shadow-red-950/10'
                          : isApproved
                          ? 'border-emerald-500/40 shadow-emerald-500/10'
                          : isRejected
                          ? 'border-red-500/30 opacity-85'
                          : 'border-neutral-800 opacity-90'
                      }`}
                    >
                      <div className="flex flex-col lg:flex-row gap-6">
                        {/* Left: Car Photos */}
                        <div className="w-full lg:w-72 shrink-0 space-y-2">
                          <div className="aspect-video w-full rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-950 relative">
                            <img
                              src={car.images[0] || PRESET_SAMPLE_IMAGES[0]}
                              alt={car.model}
                              className="h-full w-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                            {/* Status Overlay Badge */}
                            <div className="absolute top-2 left-2">
                              {isPending && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-red-600 text-white px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider shadow-md">
                                  <Clock className="h-3 w-3" />
                                  <span>Pending Review</span>
                                </span>
                              )}
                              {isApproved && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500 text-neutral-950 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider shadow-md">
                                  <CheckCircle2 className="h-3 w-3" />
                                  <span>Approved & Live</span>
                                </span>
                              )}
                              {isRejected && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-rose-600 text-white px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider shadow-md">
                                  <X className="h-3 w-3" />
                                  <span>Rejected</span>
                                </span>
                              )}
                              {isSold && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-neutral-700 text-white px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider shadow-md">
                                  <Check className="h-3 w-3" />
                                  <span>Sold</span>
                                </span>
                              )}
                            </div>
                          </div>
                          {car.images.length > 1 && (
                            <div className="flex gap-2 overflow-x-auto pb-1">
                              {car.images.slice(1, 4).map((img, idx) => (
                                <img
                                  key={idx}
                                  src={img}
                                  alt="thumb"
                                  className="h-12 w-16 rounded-lg object-cover border border-neutral-800"
                                  referrerPolicy="no-referrer"
                                />
                              ))}
                            </div>
                          )}
                          <span className="inline-block rounded bg-neutral-800 px-2 py-0.5 text-[10px] font-bold text-neutral-300">
                            {car.images.length} Photos Attached
                          </span>
                        </div>

                        {/* Middle: Specs */}
                        <div className="flex-1 space-y-3">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div>
                              <span className="rounded bg-neutral-800 px-2 py-0.5 text-[10px] font-bold text-red-400 uppercase">
                                {car.brand}
                              </span>
                              <h3 className="font-display text-xl sm:text-2xl font-extrabold text-white mt-0.5">
                                {car.model} {car.variant}
                              </h3>
                            </div>
                            <div className="text-right">
                              <span className="text-xs text-neutral-400">Price</span>
                              <p className="font-display text-xl sm:text-2xl font-extrabold text-red-400">
                                {formatPriceLakh(car.price)}
                              </p>
                              <p className="text-[11px] text-neutral-400 font-mono">
                                ({formatIndianRupees(car.price)})
                              </p>
                            </div>
                          </div>

                          {/* Badges */}
                          <div className="flex flex-wrap gap-2 text-xs">
                            <span className="rounded-lg bg-neutral-800 border border-neutral-700 px-2.5 py-1 text-neutral-300">
                              Mfg: {car.manufacturingYear || car.year}
                            </span>
                            <span className="rounded-lg bg-neutral-800 border border-neutral-700 px-2.5 py-1 text-neutral-300">
                              {formatKM(car.kilometers)}
                            </span>
                            <span className="rounded-lg bg-neutral-800 border border-neutral-700 px-2.5 py-1 text-neutral-300">
                              {car.fuelType} • {car.transmission}
                            </span>
                            <span className="rounded-lg bg-neutral-800 border border-neutral-700 px-2.5 py-1 text-neutral-300">
                              {car.owners}
                            </span>
                            <span className="rounded-lg bg-neutral-800 border border-neutral-700 px-2.5 py-1 text-neutral-300">
                              {car.registrationState} ({car.rtoCode})
                            </span>
                            <span className="rounded-lg bg-neutral-800 border border-neutral-700 px-2.5 py-1 text-neutral-300 flex items-center gap-1">
                              <MapPin className="h-3 w-3 text-red-400" />
                              <span>{car.location}</span>
                            </span>
                          </div>

                          <p className="text-xs text-neutral-300 leading-relaxed bg-neutral-950/60 p-3 rounded-xl border border-neutral-800">
                            {car.description || 'No description provided by owner.'}
                          </p>

                          {car.rejectionReason && (
                            <div className="rounded-xl border border-rose-500/30 bg-rose-950/30 p-2.5 text-xs text-rose-300">
                              <span className="font-bold">Rejection Note:</span> {car.rejectionReason}
                            </div>
                          )}
                        </div>

                        {/* Right: PRIVATE "OWNER DETAILS" SECTION (ADMIN ONLY) */}
                        <div className="w-full lg:w-80 shrink-0 rounded-2xl border-2 border-emerald-500/40 bg-neutral-950/90 p-4 space-y-3">
                          <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                              <Lock className="h-3.5 w-3.5" />
                              <span>Owner Details</span>
                            </div>
                            <span className="rounded bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold text-emerald-300 border border-emerald-500/20">
                              Private Admin Only
                            </span>
                          </div>

                          <div>
                            <span className="text-[11px] text-neutral-400 block">Owner Full Name:</span>
                            <p className="text-sm font-bold text-white flex items-center gap-1.5 mt-0.5">
                              <User className="h-3.5 w-3.5 text-red-400" />
                              <span>{car.ownerName || 'Direct Vehicle Owner'}</span>
                            </p>
                          </div>

                          <div>
                            <span className="text-[11px] text-neutral-400 block">Private Phone Number:</span>
                            <p className="text-sm font-bold text-red-400 flex items-center gap-1.5 font-mono mt-0.5">
                              <Phone className="h-3.5 w-3.5" />
                              <span>{car.ownerPhone || 'Not provided'}</span>
                            </p>
                          </div>

                          {(car.ownerWhatsapp || car.ownerPhone) && (
                            <div>
                              <span className="text-[11px] text-neutral-400 block">Private WhatsApp Number:</span>
                              <p className="text-sm font-bold text-emerald-400 flex items-center gap-1.5 font-mono mt-0.5">
                                <MessageCircle className="h-3.5 w-3.5" />
                                <span>{car.ownerWhatsapp || car.ownerPhone}</span>
                              </p>
                            </div>
                          )}

                          {car.ownerNotes && (
                            <div className="bg-neutral-900 p-2.5 rounded-lg border border-neutral-800">
                              <span className="text-[10px] font-semibold text-red-300 uppercase tracking-wider block">
                                Owner's In-Hand Notes:
                              </span>
                              <p className="text-xs text-neutral-300 mt-1 italic">
                                "{car.ownerNotes}"
                              </p>
                            </div>
                          )}

                          {/* Direct Broker Action Buttons to Contact Owner */}
                          <div className="grid grid-cols-2 gap-2 pt-1">
                            <a
                              href={`tel:${cleanPhone}`}
                              className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 py-2 text-xs font-bold text-white transition-colors"
                            >
                              <Phone className="h-3.5 w-3.5 text-red-400" />
                              <span>Call Owner</span>
                            </a>

                            <a
                              href={`https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(
                                `Vanakkam ${car.ownerName || 'Sir'}, this is AM Cars Ambai regarding your ${car.brand} ${car.model} car submission. We would like to verify the RC details and inspect the vehicle.`
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 py-2 text-xs font-bold text-white transition-colors"
                            >
                              <MessageCircle className="h-3.5 w-3.5 fill-current" />
                              <span>WhatsApp</span>
                            </a>
                          </div>
                          <p className="text-[10px] text-neutral-500 text-center leading-tight">
                            Guaranteed Confidential: Customers will only see AM Cars Ambai ({settings.phone}).
                          </p>
                        </div>
                      </div>

                      {/* Bottom Approval, Rejection & Management Toolbar */}
                      <div className="border-t border-neutral-800 pt-4 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-neutral-400 flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5" />
                            <span>Submitted: {car.submissionDate ? new Date(car.submissionDate).toLocaleDateString('en-IN') : 'Showroom Stock'}</span>
                          </span>
                          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                            isApproved
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : isPending
                              ? 'bg-red-500/20 text-red-300'
                              : isRejected
                              ? 'bg-rose-500/20 text-rose-300'
                              : 'bg-neutral-800 text-neutral-300'
                          }`}>
                            Status: {isApproved ? 'Approved (Live on Website)' : isPending ? 'Pending Review' : isRejected ? 'Rejected' : 'Sold'}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-2.5">
                          <button
                            onClick={() => openEditModal(car)}
                            className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-700 bg-neutral-800 px-3.5 py-2 text-xs font-semibold text-neutral-200 hover:bg-neutral-700 transition-colors"
                          >
                            <Edit3 className="h-3.5 w-3.5" />
                            <span>Edit Details</span>
                          </button>

                          <button
                            onClick={() => setDeleteConfirmId(car.id)}
                            className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-700 bg-neutral-800 px-3 py-2 text-xs font-semibold text-neutral-400 hover:text-rose-300 hover:border-rose-500/40 transition-colors"
                            title="Delete Car"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            <span>Delete</span>
                          </button>

                          {/* Approval / Rejection buttons tailored to status */}
                          {isPending && (
                            <>
                              <button
                                onClick={() => {
                                  setRejectionModalId(car.id);
                                  setRejectionReasonText('');
                                }}
                                className="inline-flex items-center gap-1.5 rounded-xl border border-red-500/30 bg-red-950/40 px-3.5 py-2 text-xs font-semibold text-red-300 hover:bg-red-900/50 transition-colors"
                              >
                                <X className="h-3.5 w-3.5" />
                                <span>Reject Listing</span>
                              </button>

                              <button
                                onClick={() => handleApprove(car.id)}
                                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-5 py-2 text-xs sm:text-sm font-bold text-white shadow-lg shadow-emerald-600/20 transition-all active:scale-95 cursor-pointer"
                              >
                                <Check className="h-4 w-4" />
                                <span>Approve Listing (Publish to Website)</span>
                              </button>
                            </>
                          )}

                          {isApproved && (
                            <>
                              <button
                                onClick={() => markCarAsSold(car.id)}
                                className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-700 bg-neutral-800 px-3.5 py-2 text-xs font-bold text-red-300 hover:bg-neutral-700 transition-colors"
                              >
                                <CheckCircle className="h-3.5 w-3.5" />
                                <span>Mark as SOLD</span>
                              </button>

                              <button
                                onClick={() => {
                                  setRejectionModalId(car.id);
                                  setRejectionReasonText('');
                                }}
                                className="inline-flex items-center gap-1.5 rounded-xl border border-red-500/30 bg-red-950/40 px-3 py-2 text-xs font-semibold text-red-300 hover:bg-red-900/50 transition-colors"
                              >
                                <X className="h-3.5 w-3.5" />
                                <span>Reject / Unpublish</span>
                              </button>
                            </>
                          )}

                          {isRejected && (
                            <button
                              onClick={() => handleApprove(car.id)}
                              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-5 py-2 text-xs sm:text-sm font-bold text-white shadow-lg transition-all active:scale-95"
                            >
                              <Check className="h-4 w-4" />
                              <span>Approve & Publish to Showroom</span>
                            </button>
                          )}

                          {isSold && (
                            <button
                              onClick={() => restoreCarToAvailable(car.id)}
                              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-4 py-2 text-xs font-bold text-white shadow-lg transition-all active:scale-95"
                            >
                              <Check className="h-4 w-4" />
                              <span>Mark as AVAILABLE (Approved)</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })()}
        </div>
      )}

      {/* ==============================================================
          TAB 2: SHOWROOM INVENTORY MANAGEMENT
          ============================================================== */}
      {activeAdminTab === 'inventory' && (
        <div className="space-y-6">
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4">
              <span className="text-xs text-neutral-400">Total Cars</span>
              <p className="font-display text-2xl font-bold text-white mt-1">{totalCars}</p>
            </div>

            <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4">
              <span className="text-xs text-neutral-400">Showroom Available</span>
              <p className="font-display text-2xl font-bold text-emerald-400 mt-1">{availableCars}</p>
            </div>

            <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4">
              <span className="text-xs text-neutral-400">Sold Units</span>
              <p className="font-display text-2xl font-bold text-rose-400 mt-1">{soldCars}</p>
            </div>

            <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4">
              <span className="text-xs text-neutral-400">Stock Valuation</span>
              <p className="font-display text-2xl font-bold text-red-400 mt-1">{formatPriceLakh(totalValuation)}</p>
            </div>
          </div>

          {/* Search & Status Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
              <input
                type="text"
                placeholder="Search brand, model, registration, owner name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-neutral-800 bg-neutral-900 pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-neutral-500 focus:border-red-500 focus:outline-none"
              />
            </div>

            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="rounded-xl border border-neutral-800 bg-neutral-900 px-3.5 py-2.5 text-xs text-white focus:border-red-500 focus:outline-none"
              >
                <option value="all">All Statuses</option>
                <option value="available">Available in Showroom</option>
                <option value="sold">Sold</option>
                <option value="pending">Pending Review</option>
                <option value="rejected">Rejected</option>
              </select>

              <button
                onClick={openAddModal}
                id="inventory-add-new-car-btn"
                className="inline-flex items-center gap-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white px-3.5 py-2.5 text-xs font-bold text-neutral-950 shadow-md transition-all active:scale-95 shrink-0 cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5 stroke-[3]" />
                <span>Add New Car</span>
              </button>
            </div>
          </div>

          {/* Empty State */}
          {filteredCars.length === 0 ? (
            <div className="rounded-3xl border border-neutral-800 bg-neutral-900/40 p-8 text-center">
              <CarIcon className="h-10 w-10 text-neutral-600 mx-auto mb-3" />
              <p className="text-sm font-bold text-white">No cars match your filter</p>
              <p className="text-xs text-neutral-400 mt-1 mb-4">Try clearing your search query or add a new vehicle to the showroom.</p>
              <button
                onClick={openAddModal}
                className="inline-flex items-center gap-2 rounded-xl bg-red-600 hover:bg-red-500 text-white px-4 py-2 text-xs font-bold text-neutral-950 shadow-md"
              >
                <Plus className="h-4 w-4" />
                <span>Add New Car Now</span>
              </button>
            </div>
          ) : (
            <>
              {/* MOBILE CARDS VIEW (< md screens) */}
              <div className="block md:hidden space-y-4">
                {filteredCars.map((car) => {
                  const isSold = car.status === 'sold';
                  const isPending = car.status === 'pending';

                  return (
                    <div
                      key={car.id}
                      className="rounded-2xl border border-neutral-800 bg-neutral-900/70 p-4 space-y-3.5 shadow-lg"
                    >
                      {/* Top Header: Image + Basic Info */}
                      <div className="flex items-start gap-3">
                        <div className="relative h-20 w-28 shrink-0 rounded-xl overflow-hidden border border-neutral-800 bg-neutral-950">
                          <img
                            src={car.images[0] || PRESET_SAMPLE_IMAGES[0]}
                            alt={car.model}
                            className="h-full w-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                          {car.images.length > 1 && (
                            <span className="absolute bottom-1 right-1 rounded-md bg-black/80 px-1.5 py-0.5 text-[9px] font-bold text-white">
                              +{car.images.length - 1} photos
                            </span>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                              {car.brand}
                            </span>
                            {car.status === 'available' && (
                              <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold text-emerald-400 uppercase">
                                Available
                              </span>
                            )}
                            {car.status === 'sold' && (
                              <span className="rounded-full bg-rose-500/15 border border-rose-500/30 px-2 py-0.5 text-[10px] font-bold text-rose-400 uppercase">
                                Sold
                              </span>
                            )}
                            {car.status === 'pending' && (
                              <span className="rounded-full bg-red-500/15 border border-red-500/30 px-2 py-0.5 text-[10px] font-bold text-red-400 uppercase">
                                Pending Review
                              </span>
                            )}
                          </div>

                          <h3 className="text-base font-bold text-white truncate">
                            {car.model}
                          </h3>
                          <p className="text-xs text-neutral-400 truncate">{car.variant}</p>

                          <p className="text-sm font-extrabold text-red-400 mt-1">
                            {formatPriceLakh(car.price)}
                          </p>
                        </div>
                      </div>

                      {/* Specs Row */}
                      <div className="grid grid-cols-2 gap-2 rounded-xl bg-neutral-950/60 p-2.5 text-[11px] text-neutral-300">
                        <div>
                          <span className="text-neutral-500">Mfg / Reg: </span>
                          <span className="font-semibold text-white">
                            {car.manufacturingYear || car.year} {car.registrationYear ? `(${car.registrationYear})` : ''}
                          </span>
                        </div>
                        <div>
                          <span className="text-neutral-500">KM: </span>
                          <span className="font-semibold text-white">{formatKM(car.kilometers)}</span>
                        </div>
                        <div>
                          <span className="text-neutral-500">Fuel: </span>
                          <span className="font-semibold text-white">{car.fuelType}</span>
                        </div>
                        <div>
                          <span className="text-neutral-500">Gearbox: </span>
                          <span className="font-semibold text-white">{car.transmission}</span>
                        </div>
                        <div className="col-span-2 truncate">
                          <span className="text-neutral-500">Location: </span>
                          <span className="text-red-400/90 font-medium">{car.location}</span>
                        </div>
                      </div>

                      {/* Confidential Owner Info (Admin Only) */}
                      {car.ownerName && (
                        <div className="rounded-xl border border-emerald-500/20 bg-emerald-950/20 p-2.5 text-[11px] space-y-1">
                          <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-[10px] uppercase">
                            <Lock className="h-3 w-3" />
                            <span>Private Owner Details (Admin Only)</span>
                          </div>
                          <div className="flex items-center justify-between text-neutral-300">
                            <span className="font-semibold">{car.ownerName}</span>
                            <span className="font-mono text-neutral-400">{car.ownerPhone}</span>
                          </div>
                          {car.ownerNotes && (
                            <p className="text-neutral-400 text-[10px] italic">{car.ownerNotes}</p>
                          )}
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex flex-wrap gap-2 pt-1 border-t border-neutral-800">
                        {isPending ? (
                          <button
                            onClick={() => handleApprove(car.id)}
                            className="flex-1 rounded-xl bg-emerald-600 px-3 py-2 text-xs font-bold text-white hover:bg-emerald-500 shadow-sm"
                          >
                            Approve Listing
                          </button>
                        ) : isSold ? (
                          <button
                            onClick={() => restoreCarToAvailable(car.id)}
                            className="flex-1 rounded-xl bg-emerald-950/60 border border-emerald-500/40 px-3 py-2 text-xs font-bold text-emerald-300 hover:bg-emerald-900/50 transition-colors"
                          >
                            Mark as AVAILABLE
                          </button>
                        ) : (
                          <button
                            onClick={() => markCarAsSold(car.id)}
                            className="flex-1 rounded-xl bg-rose-950/60 border border-rose-500/40 px-3 py-2 text-xs font-bold text-rose-300 hover:bg-rose-900/50 transition-colors"
                          >
                            Mark as SOLD
                          </button>
                        )}

                        <button
                          onClick={() => openEditModal(car)}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-700 bg-neutral-800 px-3 py-2 text-xs font-semibold text-neutral-200 hover:bg-neutral-700 transition-colors"
                        >
                          <Edit3 className="h-3.5 w-3.5 text-red-400" />
                          <span>Edit Car</span>
                        </button>

                        <button
                          onClick={() => setDeleteConfirmId(car.id)}
                          className="inline-flex items-center gap-1 rounded-xl border border-neutral-700 bg-neutral-800 px-2.5 py-2 text-xs font-semibold text-rose-400 hover:bg-rose-950/50 transition-colors"
                          title="Delete Car"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* DESKTOP TABLE VIEW (>= md screens) */}
              <div className="hidden md:block rounded-3xl border border-neutral-800 bg-neutral-900/60 overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="border-b border-neutral-800 bg-neutral-950/80 text-[11px] uppercase tracking-wider text-neutral-400 font-bold">
                      <tr>
                        <th className="py-3 px-4">Vehicle</th>
                        <th className="py-3 px-3">Specs</th>
                        <th className="py-3 px-3">Location & RTO</th>
                        <th className="py-3 px-3">Confidential Owner</th>
                        <th className="py-3 px-3">Price</th>
                        <th className="py-3 px-3">Status</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-800/60">
                      {filteredCars.map((car) => {
                        const isSold = car.status === 'sold';
                        const isPending = car.status === 'pending';
                        const isEditingPrice = quickPriceEditId === car.id;

                        return (
                          <tr key={car.id} className="hover:bg-neutral-800/30 transition-colors">
                            {/* Vehicle Info */}
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-3">
                                <div className="h-12 w-16 shrink-0 rounded-lg overflow-hidden border border-neutral-800 bg-neutral-950">
                                  <img
                                    src={car.images[0] || PRESET_SAMPLE_IMAGES[0]}
                                    alt={car.model}
                                    className="h-full w-full object-cover"
                                    referrerPolicy="no-referrer"
                                  />
                                </div>
                                <div>
                                  <span className="font-bold text-white text-sm">
                                    {car.brand} {car.model}
                                  </span>
                                  <p className="text-xs text-neutral-400">{car.variant}</p>
                                </div>
                              </div>
                            </td>

                            {/* Specs */}
                            <td className="py-3.5 px-3 text-neutral-300">
                              <p className="font-semibold text-white">
                                {car.manufacturingYear || car.year}
                                {car.registrationYear && car.registrationYear !== (car.manufacturingYear || car.year) && (
                                  <span className="text-neutral-500 text-[10px] ml-1">({car.registrationYear} Reg)</span>
                                )}
                              </p>
                              <p className="text-neutral-400">{formatKM(car.kilometers)} • {car.fuelType}</p>
                            </td>

                            {/* Location & RTO */}
                            <td className="py-3.5 px-3">
                              <p className="text-red-400 font-medium">{car.location}</p>
                              <p className="font-mono text-neutral-400">{car.rtoCode || 'TN RTO'}</p>
                            </td>

                            {/* Confidential Owner Info (Admin Only) */}
                            <td className="py-3.5 px-3">
                              {car.ownerName ? (
                                <div className="space-y-0.5">
                                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400">
                                    <Lock className="h-3 w-3" />
                                    <span>{car.ownerName}</span>
                                  </span>
                                  <p className="font-mono text-[11px] text-neutral-400">
                                    {car.ownerPhone}
                                  </p>
                                </div>
                              ) : (
                                <span className="text-neutral-500 text-[11px] italic">
                                  Showroom Stock
                                </span>
                              )}
                            </td>

                            {/* Price (Quick Edit) */}
                            <td className="py-3.5 px-3">
                              {isEditingPrice ? (
                                <div className="flex items-center gap-1">
                                  <input
                                    type="number"
                                    value={quickPriceValue}
                                    onChange={(e) => setQuickPriceValue(e.target.value)}
                                    className="w-24 rounded border border-red-500 bg-neutral-950 px-2 py-1 text-xs text-white"
                                    autoFocus
                                  />
                                  <button
                                    onClick={() => saveQuickPrice(car.id)}
                                    className="rounded bg-emerald-600 p-1 text-white hover:bg-emerald-500"
                                  >
                                    <Check className="h-3.5 w-3.5" />
                                  </button>
                                  <button
                                    onClick={() => setQuickPriceEditId(null)}
                                    className="rounded bg-neutral-800 p-1 text-neutral-400 hover:text-white"
                                  >
                                    <X className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                              ) : (
                                <div
                                  onClick={() => startQuickPriceEdit(car)}
                                  className="cursor-pointer group"
                                  title="Click to edit price"
                                >
                                  <p className="font-bold text-red-400 group-hover:underline">
                                    {formatPriceLakh(car.price)}
                                  </p>
                                </div>
                              )}
                            </td>

                            {/* Status */}
                            <td className="py-3.5 px-3">
                              {car.status === 'available' && (
                                <span className="inline-block rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400 uppercase">
                                  Available
                                </span>
                              )}
                              {car.status === 'sold' && (
                                <span className="inline-block rounded-full bg-rose-500/15 border border-rose-500/30 px-2.5 py-0.5 text-[10px] font-bold text-rose-400 uppercase">
                                  Sold
                                </span>
                              )}
                              {car.status === 'pending' && (
                                <span className="inline-block rounded-full bg-red-500/15 border border-red-500/30 px-2.5 py-0.5 text-[10px] font-bold text-red-400 uppercase">
                                  Pending Review
                                </span>
                              )}
                              {car.status === 'rejected' && (
                                <span className="inline-block rounded-full bg-neutral-800 border border-neutral-700 px-2.5 py-0.5 text-[10px] font-bold text-neutral-400 uppercase">
                                  Rejected
                                </span>
                              )}
                            </td>

                            {/* Actions */}
                            <td className="py-3.5 px-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                {isPending ? (
                                  <button
                                    onClick={() => handleApprove(car.id)}
                                    className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-500"
                                    title="Approve submission"
                                  >
                                    Approve
                                  </button>
                                ) : isSold ? (
                                  <button
                                    onClick={() => restoreCarToAvailable(car.id)}
                                    className="rounded-lg bg-emerald-950/60 border border-emerald-500/40 px-3 py-1.5 text-xs font-bold text-emerald-300 hover:bg-emerald-900/50 transition-colors"
                                  >
                                    Mark as AVAILABLE
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => markCarAsSold(car.id)}
                                    className="rounded-lg bg-rose-950/60 border border-rose-500/40 px-3 py-1.5 text-xs font-bold text-rose-300 hover:bg-rose-900/50 transition-colors"
                                  >
                                    Mark as SOLD
                                  </button>
                                )}

                                <button
                                  onClick={() => openEditModal(car)}
                                  className="inline-flex items-center gap-1 rounded-lg border border-neutral-700 bg-neutral-800 px-2.5 py-1.5 text-xs font-semibold text-neutral-200 hover:bg-neutral-700 hover:text-white transition-colors"
                                  title="Edit Car"
                                >
                                  <Edit3 className="h-3.5 w-3.5 text-red-400" />
                                  <span>Edit Car</span>
                                </button>

                                <button
                                  onClick={() => setDeleteConfirmId(car.id)}
                                  className="inline-flex items-center gap-1 rounded-lg border border-neutral-700 bg-neutral-800 px-2.5 py-1.5 text-xs font-semibold text-rose-400 hover:bg-rose-900/50 hover:text-rose-200 transition-colors"
                                  title="Delete Car"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                  <span>Delete Car</span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* ==============================================================
          TAB 3: CUSTOMER ENQUIRIES (STORED IN CLOUD FIRESTORE)
          ============================================================== */}
      {activeAdminTab === 'enquiries' && (() => {
        const newCount = enquiries.filter((e) => !e.status || e.status === 'new').length;
        const contactedCount = enquiries.filter((e) => e.status === 'contacted').length;
        const closedCount = enquiries.filter((e) => e.status === 'closed').length;

        const filteredEnquiries = enquiries.filter((enquiry) => {
          const matchesFilter =
            enquiryFilter === 'all' ||
            (enquiryFilter === 'new' && (!enquiry.status || enquiry.status === 'new')) ||
            (enquiryFilter === 'contacted' && enquiry.status === 'contacted') ||
            (enquiryFilter === 'closed' && enquiry.status === 'closed');

          const searchLower = enquirySearch.toLowerCase().trim();
          const matchesSearch =
            !searchLower ||
            enquiry.name.toLowerCase().includes(searchLower) ||
            enquiry.phone.includes(searchLower) ||
            (enquiry.carName && enquiry.carName.toLowerCase().includes(searchLower)) ||
            (enquiry.message && enquiry.message.toLowerCase().includes(searchLower));

          return matchesFilter && matchesSearch;
        });

        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-neutral-900/60 p-5 rounded-2xl border border-neutral-800">
              <div>
                <h2 className="font-display text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-red-400" />
                  <span>Customer Enquiries & Test Drive Leads</span>
                  <span className="rounded-md bg-red-500/20 px-2 py-0.5 text-xs font-bold text-red-300">
                    {enquiries.length} Total
                  </span>
                </h2>
                <p className="text-xs text-neutral-400 mt-1">
                  Customer enquiries submitted from car details pages and contact forms. Stored securely in Cloud Firestore and visible strictly to showroom administrators.
                </p>
              </div>
              <div className="text-xs flex items-center gap-2 bg-neutral-950 px-3.5 py-2 rounded-xl border border-emerald-500/30 text-emerald-400">
                <ShieldCheck className="h-4 w-4 shrink-0" />
                <span>Cloud Firestore Admin Access Only</span>
              </div>
            </div>

            {/* Filter and Search Controls */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-neutral-900/40 p-3 rounded-2xl border border-neutral-800/80">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setEnquiryFilter('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    enquiryFilter === 'all'
                      ? 'bg-red-600 text-white shadow-sm'
                      : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                  }`}
                >
                  All Leads ({enquiries.length})
                </button>
                <button
                  type="button"
                  onClick={() => setEnquiryFilter('new')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    enquiryFilter === 'new'
                      ? 'bg-red-600 text-white shadow-sm'
                      : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                  }`}
                >
                  <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                  <span>New ({newCount})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setEnquiryFilter('contacted')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    enquiryFilter === 'contacted'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                  }`}
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Contacted ({contactedCount})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setEnquiryFilter('closed')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    enquiryFilter === 'closed'
                      ? 'bg-neutral-700 text-white shadow-sm'
                      : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
                  }`}
                >
                  Closed ({closedCount})
                </button>
              </div>

              {/* Search Bar */}
              <div className="relative min-w-[220px]">
                <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search customer, phone, car..."
                  value={enquirySearch}
                  onChange={(e) => setEnquirySearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:border-red-500 focus:outline-none"
                />
              </div>
            </div>

            {filteredEnquiries.length === 0 ? (
              <div className="rounded-3xl border border-neutral-800 bg-neutral-900/40 p-12 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-neutral-800 text-neutral-400">
                  <MessageCircle className="h-7 w-7" />
                </div>
                <h3 className="font-display text-lg font-bold text-white mb-1">
                  {enquiries.length === 0 ? 'No Customer Enquiries Yet' : 'No Enquiries Matching Filter'}
                </h3>
                <p className="text-xs text-neutral-400 max-w-md mx-auto leading-relaxed">
                  {enquiries.length === 0
                    ? 'When customers submit an inquiry through any car details page or contact form, their name, phone, interested car, and message will appear here in real time.'
                    : 'Try clearing the search query or changing the status filter to see other enquiries.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredEnquiries.map((enquiry) => {
                  const cleanPhone = enquiry.phone.replace(/\D/g, '');
                  const isNew = !enquiry.status || enquiry.status === 'new';
                  const isContacted = enquiry.status === 'contacted';
                  const isClosed = enquiry.status === 'closed';

                  const createdDate = enquiry.createdAt
                    ? new Date(enquiry.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : 'Recent';

                  return (
                    <div
                      key={enquiry.id}
                      className={`rounded-2xl border p-5 space-y-4 transition-colors ${
                        isNew
                          ? 'border-red-500/40 bg-neutral-900/90 shadow-md'
                          : isContacted
                          ? 'border-blue-500/30 bg-neutral-900/70'
                          : 'border-neutral-800 bg-neutral-900/50 opacity-80'
                      }`}
                    >
                      {/* Header: Customer Name, Status Badge, Date & Time */}
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-display text-base sm:text-lg font-bold text-white">
                              {enquiry.name}
                            </h4>
                            <span className="rounded-full bg-red-500/15 border border-red-500/30 px-2 py-0.5 text-[10px] font-bold text-red-300 uppercase">
                              {enquiry.enquiryType || 'Car Enquiry'}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 text-[11px] text-neutral-400 mt-1">
                            <Clock className="h-3 w-3 text-neutral-500" />
                            <span>{createdDate}</span>
                          </div>
                        </div>

                        {/* Status Badge */}
                        <div>
                          {isNew && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-red-500/20 border border-red-500/40 px-2.5 py-1 text-[11px] font-bold text-red-300 shadow-sm">
                              <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
                              NEW
                            </span>
                          )}
                          {isContacted && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/20 border border-blue-500/40 px-2.5 py-1 text-[11px] font-bold text-blue-300 shadow-sm">
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              CONTACTED
                            </span>
                          )}
                          {isClosed && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-neutral-800 border border-neutral-700 px-2.5 py-1 text-[11px] font-semibold text-neutral-400">
                              CLOSED
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Customer Phone */}
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-neutral-400">Customer Phone:</span>
                        <a
                          href={`tel:+91${cleanPhone}`}
                          className="font-bold text-red-400 hover:text-red-300 tracking-wide"
                        >
                          +91 {cleanPhone}
                        </a>
                      </div>

                      {/* Interested Car */}
                      <div className="rounded-xl bg-neutral-950 p-3 border border-neutral-800 text-xs flex items-center gap-2.5">
                        <CarIcon className="h-4 w-4 text-red-400 shrink-0" />
                        <div className="min-w-0">
                          <span className="text-[10px] text-neutral-400 uppercase font-semibold block">
                            Interested Car
                          </span>
                          <span className="font-bold text-white truncate block">
                            {enquiry.carName || 'General Dealership Enquiry'}
                          </span>
                        </div>
                      </div>

                      {/* Message */}
                      <div className="rounded-xl bg-neutral-950/70 p-3 border border-neutral-800/80 text-xs">
                        <span className="text-[10px] text-neutral-400 uppercase font-semibold block mb-1">
                          Message
                        </span>
                        <p className="text-neutral-200 leading-relaxed italic">
                          "{enquiry.message || 'No additional message.'}"
                        </p>
                      </div>

                      {/* Action Buttons: Call Customer, WhatsApp Customer, Mark as Contacted */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-neutral-800">
                        <div className="flex flex-wrap items-center gap-2">
                          {/* Call Customer Button */}
                          <a
                            href={`tel:+91${cleanPhone}`}
                            className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-700 bg-neutral-800 hover:bg-neutral-700 hover:border-red-500/50 px-3 py-2 text-xs font-bold text-white transition-all cursor-pointer active:scale-95"
                            title={`Call ${enquiry.name} at +91 ${cleanPhone}`}
                          >
                            <Phone className="h-3.5 w-3.5 text-red-400" />
                            <span>Call Customer</span>
                          </a>

                          {/* WhatsApp Customer Button */}
                          <a
                            href={`https://wa.me/91${cleanPhone}?text=${encodeURIComponent(`Hi ${enquiry.name}, greetings from ${settings.businessName} regarding your enquiry for ${enquiry.carName || 'the car'}. How can we assist you with test drives, pricing, or financing?`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-3 py-2 text-xs font-bold text-white transition-all cursor-pointer shadow-sm active:scale-95"
                            title={`Send WhatsApp message to ${enquiry.name}`}
                          >
                            <MessageCircle className="h-3.5 w-3.5 fill-current" />
                            <span>WhatsApp Customer</span>
                          </a>

                          {/* Mark as Contacted Button */}
                          <button
                            type="button"
                            onClick={() => updateEnquiryStatus(enquiry.id, isContacted ? 'new' : 'contacted')}
                            className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition-all cursor-pointer border active:scale-95 ${
                              isContacted
                                ? 'bg-blue-950/60 border-blue-500/40 text-blue-300 hover:bg-blue-900/60'
                                : 'bg-red-500/20 border-red-500/50 text-red-300 hover:bg-red-500/30'
                            }`}
                          >
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            <span>{isContacted ? 'Marked as Contacted ✓' : 'Mark as Contacted'}</span>
                          </button>
                        </div>

                        {/* Status dropdown & Delete */}
                        <div className="flex items-center gap-1.5 ml-auto">
                          <select
                            value={enquiry.status || 'new'}
                            onChange={(e) => updateEnquiryStatus(enquiry.id, e.target.value as any)}
                            className="text-[11px] font-bold rounded-lg px-2 py-1 bg-neutral-950 border border-neutral-800 text-neutral-300 focus:outline-none cursor-pointer"
                          >
                            <option value="new">New</option>
                            <option value="contacted">Contacted</option>
                            <option value="closed">Closed</option>
                          </select>

                          <button
                            type="button"
                            onClick={() => deleteEnquiry(enquiry.id)}
                            className="p-1.5 text-neutral-500 hover:text-red-400 rounded-lg transition-colors cursor-pointer"
                            title="Delete Enquiry"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })()}

      {/* ==============================================================
          TAB 4: CENTRAL BUSINESS SETTINGS
          ============================================================== */}
      {activeAdminTab === 'settings' && (
        <div className="space-y-6" id="central-business-settings-section">
          {/* Header & Cloud Firestore Sync Status */}
          <div className="rounded-3xl border border-neutral-800 bg-neutral-900/80 p-6 sm:p-8 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-5">
              <div>
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-500/20 text-red-400">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <h2 className="font-display text-xl sm:text-2xl font-bold text-white">
                    Central Business Settings
                  </h2>
                </div>
                <p className="text-xs text-neutral-400 mt-1.5 max-w-2xl">
                  One central control section for the official AM Cars Ambai phone number and WhatsApp number. All Call Now and WhatsApp buttons across the entire website (Home, Car Listings, Car Details Modal, Contact, and Footer) immediately use these configured numbers.
                </p>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-center">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-3 py-1 text-xs font-semibold text-emerald-400">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  Synced with Cloud Firestore
                </span>
              </div>
            </div>

            {/* Current Active Configuration Preview Bar */}
            <div className="rounded-2xl border border-red-500/30 bg-neutral-950 p-4 sm:p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-red-400 flex items-center gap-1.5">
                  <CheckCircle className="h-3.5 w-3.5" />
                  Currently Live Across Website
                </span>
                <span className="text-[10px] text-neutral-400 font-mono">
                  Cloud Doc: settings/showroom
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
                {/* Live Call Now */}
                <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-3">
                  <p className="text-[10px] font-semibold text-neutral-400 uppercase">Live "Call Now" Phone</p>
                  <p className="text-sm font-bold text-white mt-0.5">{settings.phone}</p>
                  <a
                    href={`tel:+${settings.phoneRaw}`}
                    className="inline-flex items-center gap-1 text-[11px] text-red-400 hover:text-red-300 mt-1 font-medium"
                    title="Test call link"
                  >
                    <Phone className="h-3 w-3" />
                    <span>Test Dialer</span>
                  </a>
                </div>

                {/* Live WhatsApp */}
                <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-3">
                  <p className="text-[10px] font-semibold text-neutral-400 uppercase">Live "WhatsApp" Chat</p>
                  <p className="text-sm font-bold text-emerald-400 mt-0.5">{settings.whatsapp}</p>
                  <a
                    href={`https://wa.me/${settings.whatsappRaw}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] text-emerald-400 hover:text-emerald-300 mt-1 font-medium"
                    title="Test WhatsApp chat"
                  >
                    <MessageCircle className="h-3 w-3 fill-current" />
                    <span>Test WhatsApp</span>
                  </a>
                </div>

                {/* Live Showroom City */}
                <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-3">
                  <p className="text-[10px] font-semibold text-neutral-400 uppercase">Dealership Location</p>
                  <p className="text-xs font-semibold text-white mt-0.5 line-clamp-2">{settings.shortAddress}</p>
                  <span className="text-[10px] text-neutral-500 mt-1 block">Tirunelveli District</span>
                </div>

                {/* Privacy Guarantee */}
                <div className="rounded-xl border border-blue-500/20 bg-blue-950/20 p-3">
                  <div className="flex items-center gap-1.5 text-blue-300 text-[10px] font-bold uppercase">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    <span>Owner Privacy Protected</span>
                  </div>
                  <p className="text-[11px] text-blue-200/80 mt-1 leading-tight">
                    Car seller phones are never revealed to buyers or substituted for AM Cars numbers.
                  </p>
                </div>
              </div>
            </div>

            {/* Edit Settings Form */}
            <form onSubmit={handleSaveSettings} className="space-y-6 pt-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Phone Number */}
                <div className="rounded-2xl border border-red-500/40 bg-red-500/5 p-4 space-y-2">
                  <label htmlFor="admin-business-phone-input" className="block text-xs font-bold text-red-300">
                    AM Cars Showroom Phone ("Call Now") *
                  </label>
                  <input
                    id="admin-business-phone-input"
                    type="text"
                    required
                    value={settingsForm.phone}
                    onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                    placeholder="+91 63838 04575"
                    className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3.5 py-2.5 text-sm font-semibold text-white focus:border-red-500 focus:outline-none"
                  />
                  <p className="text-[11px] text-neutral-400">
                    Enter the exact phone number for AM Cars Ambai (e.g. <strong>+91 63838 04575</strong> or <strong>63838 04575</strong>). All "Call Now" buttons across Home, Car Listings, Details modal, and Footer will dial this number.
                  </p>
                </div>

                {/* WhatsApp Number */}
                <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/5 p-4 space-y-2">
                  <label htmlFor="admin-business-whatsapp-input" className="block text-xs font-bold text-emerald-300">
                    AM Cars Showroom WhatsApp Number ("WhatsApp") *
                  </label>
                  <input
                    id="admin-business-whatsapp-input"
                    type="text"
                    required
                    value={settingsForm.whatsapp}
                    onChange={(e) => setSettingsForm({ ...settingsForm, whatsapp: e.target.value })}
                    placeholder="+91 63838 04575"
                    className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3.5 py-2.5 text-sm font-semibold text-white focus:border-emerald-500 focus:outline-none"
                  />
                  <p className="text-[11px] text-neutral-400">
                    Enter the exact WhatsApp number for AM Cars Ambai (e.g. <strong>+91 63838 04575</strong> or <strong>63838 04575</strong>). All "WhatsApp" enquiry buttons will route customer chats here.
                  </p>
                </div>

                {/* Business Name */}
                <div>
                  <label htmlFor="admin-business-name-input" className="block text-xs font-semibold text-neutral-300 mb-1.5">
                    Official Business / Dealership Name *
                  </label>
                  <input
                    id="admin-business-name-input"
                    type="text"
                    required
                    value={settingsForm.businessName}
                    onChange={(e) => setSettingsForm({ ...settingsForm, businessName: e.target.value })}
                    className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3.5 py-2.5 text-sm text-white focus:border-red-500 focus:outline-none"
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="admin-business-email-input" className="block text-xs font-semibold text-neutral-300 mb-1.5">
                    Showroom Email Address
                  </label>
                  <input
                    id="admin-business-email-input"
                    type="email"
                    value={settingsForm.email}
                    onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })}
                    className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3.5 py-2.5 text-sm text-white focus:border-red-500 focus:outline-none"
                  />
                </div>

                {/* Address */}
                <div className="md:col-span-2">
                  <label htmlFor="admin-business-address-input" className="block text-xs font-semibold text-neutral-300 mb-1.5">
                    Full Showroom Address
                  </label>
                  <textarea
                    id="admin-business-address-input"
                    rows={2}
                    value={settingsForm.address}
                    onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                    className="w-full rounded-xl border border-neutral-700 bg-neutral-950 p-3 text-sm text-white focus:border-red-500 focus:outline-none"
                  />
                </div>

                {/* Short Address */}
                <div>
                  <label htmlFor="admin-business-short-address" className="block text-xs font-semibold text-neutral-300 mb-1.5">
                    Short Location Tag (Header & Badges)
                  </label>
                  <input
                    id="admin-business-short-address"
                    type="text"
                    value={settingsForm.shortAddress}
                    onChange={(e) => setSettingsForm({ ...settingsForm, shortAddress: e.target.value })}
                    className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3.5 py-2.5 text-sm text-white focus:border-red-500 focus:outline-none"
                  />
                </div>

                {/* Google Maps URL */}
                <div>
                  <label htmlFor="admin-business-maps-url" className="block text-xs font-semibold text-neutral-300 mb-1.5">
                    Google Maps URL
                  </label>
                  <input
                    id="admin-business-maps-url"
                    type="url"
                    value={settingsForm.googleMapsUrl}
                    onChange={(e) => setSettingsForm({ ...settingsForm, googleMapsUrl: e.target.value })}
                    className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3.5 py-2.5 text-sm text-white focus:border-red-500 focus:outline-none"
                  />
                </div>

                {/* Weekday Hours */}
                <div>
                  <label htmlFor="admin-business-hours-weekdays" className="block text-xs font-semibold text-neutral-300 mb-1.5">
                    Weekday Showroom Hours
                  </label>
                  <input
                    id="admin-business-hours-weekdays"
                    type="text"
                    value={settingsForm.businessHoursWeekdays}
                    onChange={(e) => setSettingsForm({ ...settingsForm, businessHoursWeekdays: e.target.value })}
                    className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3.5 py-2.5 text-sm text-white focus:border-red-500 focus:outline-none"
                  />
                </div>

                {/* Sunday Hours */}
                <div>
                  <label htmlFor="admin-business-hours-sunday" className="block text-xs font-semibold text-neutral-300 mb-1.5">
                    Sunday Showroom Hours
                  </label>
                  <input
                    id="admin-business-hours-sunday"
                    type="text"
                    value={settingsForm.businessHoursSunday}
                    onChange={(e) => setSettingsForm({ ...settingsForm, businessHoursSunday: e.target.value })}
                    className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3.5 py-2.5 text-sm text-white focus:border-red-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-neutral-800">
                <button
                  type="submit"
                  id="admin-save-business-settings-btn"
                  className="inline-flex items-center gap-2 rounded-xl bg-red-600 hover:bg-red-500 text-white px-6 py-3 text-sm font-bold text-neutral-950 shadow-lg shadow-red-950/20 transition-all active:scale-95 cursor-pointer"
                >
                  <Save className="h-4 w-4" />
                  <span>Save Business Settings to Cloud Firestore</span>
                </button>

                <button
                  type="button"
                  id="admin-restore-default-contact-btn"
                  onClick={handleRestoreDefaultContact}
                  className="inline-flex items-center gap-2 rounded-xl border border-neutral-700 bg-neutral-800 hover:bg-neutral-700 px-4 py-2.5 text-xs font-semibold text-neutral-300 hover:text-white transition-colors cursor-pointer"
                  title="Restore AM Cars Ambai official contact details (+91 63838 04575)"
                >
                  <RotateCcw className="h-3.5 w-3.5 text-red-400" />
                  <span>Restore Default AM Cars Contact (+91 63838 04575)</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==============================================================
          DELETE CONFIRMATION MODAL
          ============================================================== */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-neutral-800 bg-neutral-900 p-6 text-center shadow-2xl">
            <AlertTriangle className="h-10 w-10 text-rose-500 mx-auto mb-3" />
            <h3 className="font-display text-lg font-bold text-white">Delete Car Listing?</h3>
            <p className="text-xs text-neutral-400 mt-2">
              Are you sure you want to permanently remove this car from the database? This action cannot be undone.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="rounded-xl border border-neutral-700 bg-neutral-800 px-4 py-2 text-xs font-semibold text-neutral-300 hover:bg-neutral-700"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await deleteCar(deleteConfirmId);
                  setDeleteConfirmId(null);
                }}
                className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white hover:bg-rose-500"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==============================================================
          REJECTION MODAL
          ============================================================== */}
      {rejectionModalId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-neutral-800 bg-neutral-900 p-6 shadow-2xl space-y-4">
            <h3 className="font-display text-lg font-bold text-white flex items-center gap-2">
              <X className="h-5 w-5 text-red-400" />
              <span>Reject Submission</span>
            </h3>
            <p className="text-xs text-neutral-400">
              Provide a private note on why this vehicle submission was rejected (e.g. document mismatch, price too high, mechanical defect).
            </p>
            <textarea
              rows={3}
              placeholder="e.g. Vehicle has minor accident history on front chassis; owner unwilling to adjust price."
              value={rejectionReasonText}
              onChange={(e) => setRejectionReasonText(e.target.value)}
              className="w-full rounded-xl border border-neutral-700 bg-neutral-950 p-3 text-xs text-white placeholder-neutral-500 focus:border-red-500 focus:outline-none"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setRejectionModalId(null)}
                className="rounded-xl border border-neutral-700 bg-neutral-800 px-4 py-2 text-xs font-semibold text-neutral-300 hover:bg-neutral-700"
              >
                Cancel
              </button>
              <button
                onClick={() => handleRejectSubmit(rejectionModalId)}
                className="rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-500"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==============================================================
          ADD / EDIT CAR MODAL (MOBILE FRIENDLY & COMPLETE)
          ============================================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-2 sm:p-4 overflow-y-auto">
          <div className="w-full max-w-3xl my-auto rounded-3xl border border-neutral-800 bg-neutral-900 shadow-2xl overflow-hidden flex flex-col max-h-[94vh]">
            {/* Modal Header */}
            <div className="sticky top-0 bg-neutral-900/95 backdrop-blur border-b border-neutral-800 px-5 sm:px-6 py-4 flex items-center justify-between z-10">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/15 text-red-400 border border-red-500/30">
                  <CarIcon className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-display text-lg sm:text-xl font-bold text-white">
                    {editingCarId ? 'Edit Car Listing' : 'Add New Car to Showroom'}
                  </h2>
                  <p className="text-[11px] sm:text-xs text-neutral-400">
                    Live inventory for AM Cars Ambai. Appears on Available Cars immediately.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-xl p-2 text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors"
                aria-label="Close dialog"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form onSubmit={handleSaveCar} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
              {/* 1. CAR PHOTOS (MULTIPLE) */}
              <div className="rounded-2xl border border-neutral-800 bg-neutral-950/60 p-4 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <label className="text-xs font-bold text-white uppercase tracking-wider">
                      Car Photos (Multiple) *
                    </label>
                    <span className="rounded-full bg-red-500/15 text-red-400 border border-red-500/30 px-2 py-0.5 text-[10px] font-bold">
                      {formData.images.length} added
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <label className={`inline-flex cursor-pointer items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                      uploadingImage 
                        ? 'bg-red-500/20 border border-red-500/50 text-red-300 pointer-events-none' 
                        : 'bg-red-600 hover:bg-red-500 text-white text-neutral-950 shadow-sm active:scale-95'
                    }`}>
                      <Upload className={`h-3.5 w-3.5 stroke-[2.5] ${uploadingImage ? 'animate-bounce' : ''}`} />
                      <span>{uploadingImage ? 'Uploading to Storage...' : 'Upload from Phone / PC'}</span>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        disabled={uploadingImage}
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>

                    <button
                      type="button"
                      onClick={handleAddSampleBatch}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-700 bg-neutral-800 hover:bg-neutral-700 px-2.5 py-1.5 text-xs font-semibold text-neutral-200 transition-colors"
                    >
                      <Sparkles className="h-3 w-3 text-red-400" />
                      <span>Use Sample Photos</span>
                    </button>
                  </div>
                </div>

                {/* Paste URL Input Bar */}
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="Or paste direct image URL (https://...)"
                    value={formData.newImageUrl}
                    onChange={(e) => setFormData({ ...formData, newImageUrl: e.target.value })}
                    className="flex-1 rounded-xl border border-neutral-800 bg-neutral-900 px-3.5 py-2 text-xs text-white placeholder-neutral-500 focus:border-red-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddImageUrl}
                    className="rounded-xl border border-neutral-700 bg-neutral-800 px-3.5 py-2 text-xs font-bold text-white hover:bg-neutral-700 transition-colors"
                  >
                    Add URL
                  </button>
                </div>

                {/* Photo Previews Strip */}
                {formData.images.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                    {formData.images.map((img, i) => (
                      <div
                        key={i}
                        className="group relative aspect-video rounded-xl overflow-hidden border border-neutral-800 bg-neutral-900 shadow-md"
                      >
                        <img
                          src={img}
                          alt={`Car photo ${i + 1}`}
                          className="h-full w-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        {i === 0 && (
                          <span className="absolute bottom-1.5 left-1.5 rounded-md bg-red-500 px-1.5 py-0.5 text-[9px] font-black text-neutral-950 uppercase tracking-tight shadow">
                            ★ Cover Photo
                          </span>
                        )}
                        <span className="absolute top-1.5 left-1.5 rounded-md bg-black/70 px-1.5 py-0.5 text-[9px] font-bold text-white">
                          #{i + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(i)}
                          className="absolute top-1.5 right-1.5 rounded-lg bg-black/80 hover:bg-rose-600 p-1 text-neutral-300 hover:text-white transition-colors"
                          title="Remove photo"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-neutral-500 italic py-2 text-center">
                    No photos added yet. Upload from device, paste an image link, or tap "Use Sample Photos".
                  </p>
                )}
              </div>

              {/* 2. SPECIFICATIONS GRID */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-neutral-300 uppercase tracking-wider border-b border-neutral-800 pb-1">
                  Vehicle Specifications & Pricing
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
                  {/* Brand */}
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">
                      Brand *
                    </label>
                    <select
                      value={formData.brand}
                      onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                      className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-2 text-xs text-white focus:border-red-500 focus:outline-none"
                    >
                      {FORM_BRANDS.map((b) => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>

                  {/* Model */}
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">
                      Model *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Swift, Creta, Nexon"
                      value={formData.model}
                      onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                      className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-2 text-xs text-white placeholder-neutral-500 focus:border-red-500 focus:outline-none"
                    />
                  </div>

                  {/* Variant */}
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">
                      Variant
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. VXi, 1.5 SX Executive"
                      value={formData.variant}
                      onChange={(e) => setFormData({ ...formData, variant: e.target.value })}
                      className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-2 text-xs text-white placeholder-neutral-500 focus:border-red-500 focus:outline-none"
                    />
                  </div>

                  {/* Manufacturing Year */}
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">
                      Manufacturing Year *
                    </label>
                    <input
                      type="number"
                      required
                      min={2000}
                      max={2026}
                      value={formData.manufacturingYear}
                      onChange={(e) => setFormData({ ...formData, manufacturingYear: Number(e.target.value) })}
                      className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-2 text-xs text-white focus:border-red-500 focus:outline-none"
                    />
                  </div>

                  {/* Registration Year */}
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">
                      Registration Year *
                    </label>
                    <input
                      type="number"
                      required
                      min={2000}
                      max={2026}
                      value={formData.registrationYear}
                      onChange={(e) => setFormData({ ...formData, registrationYear: Number(e.target.value) })}
                      className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-2 text-xs text-white focus:border-red-500 focus:outline-none"
                    />
                  </div>

                  {/* Kilometres */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-semibold text-neutral-300">
                        Kilometres *
                      </label>
                      <span className="text-[11px] font-bold text-red-400">
                        {formatKM(formData.kilometers)}
                      </span>
                    </div>
                    <input
                      type="number"
                      required
                      min={0}
                      step={500}
                      placeholder="e.g. 35000"
                      value={formData.kilometers}
                      onChange={(e) => setFormData({ ...formData, kilometers: Number(e.target.value) })}
                      className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-2 text-xs text-white focus:border-red-500 focus:outline-none"
                    />
                  </div>

                  {/* Fuel Type */}
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">
                      Fuel Type *
                    </label>
                    <select
                      value={formData.fuelType}
                      onChange={(e) => setFormData({ ...formData, fuelType: e.target.value as FuelType })}
                      className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-2 text-xs text-white focus:border-red-500 focus:outline-none"
                    >
                      <option value="Petrol">Petrol</option>
                      <option value="Diesel">Diesel</option>
                      <option value="CNG">CNG</option>
                      <option value="Electric">Electric</option>
                    </select>
                  </div>

                  {/* Transmission */}
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">
                      Transmission *
                    </label>
                    <select
                      value={formData.transmission}
                      onChange={(e) => setFormData({ ...formData, transmission: e.target.value as TransmissionType })}
                      className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-2 text-xs text-white focus:border-red-500 focus:outline-none"
                    >
                      <option value="Manual">Manual</option>
                      <option value="Automatic">Automatic</option>
                    </select>
                  </div>

                  {/* Price */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-semibold text-neutral-300">
                        Price (₹) *
                      </label>
                      <span className="text-[11px] font-bold text-red-400">
                        {formatPriceLakh(formData.price)}
                      </span>
                    </div>
                    <input
                      type="number"
                      required
                      min={10000}
                      step={5000}
                      placeholder="e.g. 650000"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                      className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-2 text-xs text-white font-bold text-red-300 focus:border-red-500 focus:outline-none"
                    />
                  </div>

                  {/* Status */}
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">
                      Showroom Status *
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as CarStatus })}
                      className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-2 text-xs text-white focus:border-red-500 focus:outline-none"
                    >
                      <option value="available">Available in Showroom</option>
                      <option value="sold">Mark as SOLD</option>
                    </select>
                  </div>
                </div>

                {/* Location with Quick Chips */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-neutral-300">
                    Location *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ambasamudram Showroom, TN"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3.5 py-2 text-xs text-white placeholder-neutral-500 focus:border-red-500 focus:outline-none"
                  />
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="text-[10px] text-neutral-500">Quick suggestions:</span>
                    {LOCATION_SUGGESTIONS.map((loc) => (
                      <button
                        key={loc}
                        type="button"
                        onClick={() => setFormData({ ...formData, location: loc })}
                        className={`rounded-lg px-2 py-0.5 text-[10px] font-medium transition-colors ${
                          formData.location === loc
                            ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                            : 'bg-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-700'
                        }`}
                      >
                        {loc.split(',')[0]}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 3. DESCRIPTION */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-neutral-300">
                  Vehicle Description *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Comprehensive inspection condition, vehicle history, documentation, insurance validity, interior quality, and maintenance notes..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-950 p-3 text-xs text-white placeholder-neutral-500 focus:border-red-500 focus:outline-none"
                />
              </div>

              {/* 4. CONFIDENTIAL OWNER SECTION (ADMIN ONLY - NEVER EXPOSED) */}
              <div className="rounded-2xl border border-emerald-500/30 bg-neutral-950/70 p-4 sm:p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
                    <Lock className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                      Confidential Owner Information (Private Admin Record)
                    </h4>
                    <p className="text-[11px] text-neutral-400">
                      Guaranteed Privacy: Customers will NEVER see owner name or phone number. Customers will only see AM Cars Ambai ({settings.phone}).
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-400 mb-1">
                      Vehicle Owner Name (Private)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. M. Senthil Kumar"
                      value={formData.ownerName}
                      onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                      className="w-full rounded-xl border border-neutral-800 bg-neutral-900 px-3 py-2 text-xs text-white placeholder-neutral-600 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-400 mb-1">
                      Owner Private Phone (Private)
                    </label>
                    <input
                      type="text"
                      placeholder="10-digit phone number"
                      value={formData.ownerPhone}
                      onChange={(e) => setFormData({ ...formData, ownerPhone: e.target.value })}
                      className="w-full rounded-xl border border-neutral-800 bg-neutral-900 px-3 py-2 text-xs text-white placeholder-neutral-600 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-400 mb-1">
                      Owner Private WhatsApp (Private)
                    </label>
                    <input
                      type="text"
                      placeholder="10-digit WhatsApp number"
                      value={formData.ownerWhatsapp}
                      onChange={(e) => setFormData({ ...formData, ownerWhatsapp: e.target.value })}
                      className="w-full rounded-xl border border-neutral-800 bg-neutral-900 px-3 py-2 text-xs text-white placeholder-neutral-600 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-400 mb-1">
                      Owner Private Settlement Notes
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Owner expects ₹6.10 Lakhs in-hand; NOC ready from State Bank"
                      value={formData.ownerNotes}
                      onChange={(e) => setFormData({ ...formData, ownerNotes: e.target.value })}
                      className="w-full rounded-xl border border-neutral-800 bg-neutral-900 px-3 py-2 text-xs text-white placeholder-neutral-600 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Sticky Modal Action Footer */}
              <div className="sticky bottom-0 bg-neutral-900/95 backdrop-blur border-t border-neutral-800 pt-4 pb-2 flex items-center justify-end gap-3 z-10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-neutral-700 bg-neutral-800 px-5 py-2.5 text-xs font-semibold text-neutral-300 hover:bg-neutral-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  id="admin-save-car-submit-btn"
                  className="rounded-xl bg-gradient-to-r from-red-500 to-red-400 hover:from-red-400 hover:to-red-300 px-6 py-2.5 text-xs font-black text-neutral-950 shadow-lg shadow-red-950/20 transition-all active:scale-95 cursor-pointer"
                >
                  {editingCarId ? 'Update Car Listing' : 'Publish to Available Cars'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
