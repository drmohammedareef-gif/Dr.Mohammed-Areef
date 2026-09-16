import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Car, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  Phone, 
  MessageCircle, 
  User, 
  Sparkles, 
  ArrowRight, 
  Clock, 
  EyeOff 
} from 'lucide-react';
import { useCars } from '../context/CarContext';
import { BodyType, FuelType, TransmissionType, CarSubmissionPayload } from '../types';
import { formatPriceLakh, formatKM } from '../utils/formatters';

const POPULAR_BRANDS = [
  'Maruti Suzuki',
  'Hyundai',
  'Tata',
  'Toyota',
  'Mahindra',
  'Honda',
  'Kia',
  'Volkswagen',
  'Renault',
  'Ford',
  'Nissan',
  'Other',
];

const PRESET_SUBMISSION_PHOTOS = [
  'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80',
];

const QUICK_LOCATIONS = [
  'Ambasamudram, TN',
  'Tirunelveli, TN',
  'Tenkasi, TN',
  'Cheranmahadevi, TN',
  'Kallidaikurichi, TN',
];

export const SellCarSection: React.FC<{ onNavigateToCars?: () => void; onNavigateToInventory?: () => void }> = ({ 
  onNavigateToCars, 
  onNavigateToInventory 
}) => {
  const navigateInventory = onNavigateToCars || onNavigateToInventory || (() => {});
  const { submitCarForBrokerReview, settings, uploadPhoto } = useCars();

  const [submittedSuccess, setSubmittedSuccess] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [uploadingPhotos, setUploadingPhotos] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<{
    ownerName: string;
    ownerPhone: string;
    ownerWhatsapp: string;
    sameAsPhone: boolean;
    ownerNotes: string;
    brand: string;
    model: string;
    variant: string;
    manufacturingYear: number;
    registrationYear: number;
    price: string;
    kilometers: string;
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
  }>({
    ownerName: '',
    ownerPhone: '',
    ownerWhatsapp: '',
    sameAsPhone: true,
    ownerNotes: '',
    brand: 'Maruti Suzuki',
    model: '',
    variant: '',
    manufacturingYear: 2021,
    registrationYear: 2021,
    price: '',
    kilometers: '',
    fuelType: 'Petrol',
    transmission: 'Manual',
    bodyType: 'Hatchback',
    location: 'Ambasamudram, TN',
    owners: '1st Owner',
    registrationState: 'TN-72 (Tirunelveli)',
    rtoCode: 'TN-72',
    insuranceValidity: 'Comprehensive valid',
    color: 'White',
    description: '',
    images: [...PRESET_SUBMISSION_PHOTOS],
  });

  const [customPhotoUrl, setCustomPhotoUrl] = useState('');

  const handleAddPhotoUrl = () => {
    if (customPhotoUrl.trim() && !formData.images.includes(customPhotoUrl.trim())) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, customPhotoUrl.trim()],
      }));
      setCustomPhotoUrl('');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingPhotos(true);
    try {
      for (const file of Array.from(files) as File[]) {
        try {
          const downloadUrl = await uploadPhoto(file);
          setFormData((prev) => ({
            ...prev,
            images: [downloadUrl, ...prev.images],
          }));
        } catch {
          const reader = new FileReader();
          reader.onload = (uploadEvent) => {
            const result = uploadEvent.target?.result as string;
            if (result) {
              setFormData((prev) => ({
                ...prev,
                images: [result, ...prev.images],
              }));
            }
          };
          reader.readAsDataURL(file);
        }
      }
    } finally {
      setUploadingPhotos(false);
      e.target.value = '';
    }
  };

  const handleRemovePhoto = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Validate
    if (!formData.ownerName.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!formData.ownerPhone.trim() || formData.ownerPhone.replace(/\D/g, '').length < 10) {
      setErrorMsg('Please enter a valid 10-digit contact phone number.');
      return;
    }
    if (!formData.model.trim()) {
      setErrorMsg('Please enter the vehicle model name (e.g. Swift, Creta).');
      return;
    }
    const priceNum = Number(formData.price.replace(/\D/g, ''));
    if (!priceNum || priceNum < 50000) {
      setErrorMsg('Please enter a valid asking price (at least ₹50,000).');
      return;
    }
    const kmNum = Number(formData.kilometers.replace(/\D/g, ''));
    const finalWhatsapp = formData.sameAsPhone 
      ? formData.ownerPhone.trim() 
      : (formData.ownerWhatsapp.trim() || formData.ownerPhone.trim());

    const payload: CarSubmissionPayload = {
      brand: formData.brand,
      model: formData.model.trim(),
      variant: formData.variant.trim() || 'Standard',
      manufacturingYear: Number(formData.manufacturingYear),
      registrationYear: Number(formData.registrationYear || formData.manufacturingYear),
      price: priceNum,
      kilometers: kmNum || 45000,
      fuelType: formData.fuelType,
      transmission: formData.transmission,
      bodyType: formData.bodyType,
      location: formData.location.trim() || 'Ambasamudram, TN',
      owners: formData.owners,
      registrationState: formData.registrationState.trim() || 'TN-72 (Tirunelveli)',
      rtoCode: formData.rtoCode.trim() || 'TN-72',
      insuranceValidity: formData.insuranceValidity.trim() || 'Valid',
      color: formData.color.trim() || 'White',
      description: formData.description.trim() || `Clean and well maintained ${formData.brand} ${formData.model} from ${formData.location}. Verified service record.`,
      images: formData.images.length > 0 ? formData.images : PRESET_SUBMISSION_PHOTOS,
      features: ['Air Conditioning', 'Power Steering', 'Clean Interior', 'Verified Documents'],
      ownerName: formData.ownerName.trim(),
      ownerPhone: formData.ownerPhone.trim(),
      ownerWhatsapp: finalWhatsapp,
      ownerNotes: formData.ownerNotes.trim() || undefined,
    };

    setSubmitting(true);
    try {
      await submitCarForBrokerReview(payload);
      setSubmittedSuccess(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to submit vehicle';
      setErrorMsg(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (submittedSuccess) {
    return (
      <div className="min-h-[80vh] py-16 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto flex items-center justify-center">
        <div className="w-full rounded-3xl border border-emerald-500/30 bg-neutral-900/90 p-8 sm:p-12 text-center shadow-2xl backdrop-blur-xl">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="h-10 w-10" />
          </div>

          <span className="inline-block rounded-full bg-emerald-500/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-3 border border-emerald-500/20">
            Submission Secured
          </span>

          <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-white mb-4">
            Vehicle Submitted for Verification!
          </h2>

          <div className="rounded-2xl border border-neutral-800 bg-neutral-950/80 p-5 text-left mb-6 space-y-3 text-sm text-neutral-300">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold">
              <Lock className="h-4 w-4 shrink-0" />
              <span>Confidentiality Guarantee</span>
            </div>
            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
              Your name (<strong className="text-white">{formData.ownerName}</strong>) and personal phone/WhatsApp (<strong className="text-white">{formData.ownerPhone}</strong>) are securely protected. They will <strong className="text-red-400">never be exposed to public visitors</strong>.
            </p>
            <div className="border-t border-neutral-800 pt-3 flex items-start gap-2 text-xs text-neutral-400">
              <Clock className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
              <span>
                <strong>Next Step:</strong> AM Cars Ambai showroom management will privately call you to verify the RC details, schedule an inspection, and publish the vehicle with official AM Cars contact details.
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => {
                setSubmittedSuccess(false);
                setFormData((prev) => ({
                  ...prev,
                  model: '',
                  variant: '',
                  price: '',
                  kilometers: '',
                  description: '',
                  ownerNotes: '',
                }));
              }}
              className="w-full sm:w-auto rounded-xl border border-neutral-700 bg-neutral-800 px-6 py-3 text-sm font-semibold text-neutral-200 hover:bg-neutral-700 transition-colors"
            >
              Submit Another Car
            </button>
            <button
              onClick={navigateInventory}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-6 py-3 text-sm font-extrabold uppercase text-white hover:bg-red-500 transition-all shadow-lg active:scale-95"
            >
              <span>Explore Showroom</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  const numericPrice = Number(formData.price.replace(/\D/g, '')) || 0;
  const numericKm = Number(formData.kilometers.replace(/\D/g, '')) || 0;

  return (
    <div className="relative py-14 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Subtle background red aura */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-96 h-96 bg-red-600/10 blur-[140px] pointer-events-none" />

      {/* Top Value Banner */}
      <div className="relative z-10 mb-12 text-center space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-red-600/30 bg-red-600/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-red-400">
          <ShieldCheck className="h-4 w-4 text-red-500" />
          <span>OFFICIAL SELL & CONSIGNMENT DESK</span>
        </div>
        <h1 className="font-display text-3xl sm:text-5xl font-black text-white uppercase tracking-tight">
          Sell Your Car With <span className="text-red-500">{settings.businessName}</span>
        </h1>
        <p className="text-sm sm:text-base text-neutral-400 max-w-2xl mx-auto leading-relaxed">
          List your vehicle in Tamil Nadu’s premier pre-owned automotive showroom. We protect your privacy, handle buyer enquiries, manage price negotiations, and oversee 100% genuine RTO transfer.
        </p>

        {/* 3 Broker Guarantees */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-left">
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4">
            <div className="flex items-center gap-2.5 text-red-400 mb-1.5 font-bold text-sm">
              <EyeOff className="h-4 w-4 text-red-500" />
              <span>Zero Public Phone Exposure</span>
            </div>
            <p className="text-xs text-neutral-400">
              Your name and phone number are kept 100% confidential. Public buyers only contact AM Cars showroom.
            </p>
          </div>

          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4">
            <div className="flex items-center gap-2.5 text-emerald-400 mb-1.5 font-bold text-sm">
              <ShieldCheck className="h-4 w-4" />
              <span>Qualified Genuine Buyers</span>
            </div>
            <p className="text-xs text-neutral-400">
              No endless spam calls or casual time-wasters. We filter and qualify serious car buyers across Tirunelveli district.
            </p>
          </div>

          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4">
            <div className="flex items-center gap-2.5 text-neutral-200 mb-1.5 font-bold text-sm">
              <Sparkles className="h-4 w-4 text-red-500" />
              <span>Fast Settlement & RC Transfer</span>
            </div>
            <p className="text-xs text-neutral-400">
              Instant evaluation, full documentation assistance, and prompt payment directly to your bank account.
            </p>
          </div>
        </div>
      </div>

      {/* Submission Form */}
      <form onSubmit={handleSubmit} className="relative z-10 space-y-8">
        {errorMsg && (
          <div className="rounded-xl border border-red-500/40 bg-red-950/40 p-4 text-sm text-red-200 flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* SECTION 1: PRIVATE OWNER DETAILS (CONFIDENTIAL) */}
        <div className="rounded-3xl border border-neutral-800 bg-neutral-900/90 p-6 sm:p-8 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 rounded-bl-2xl bg-red-600/20 px-4 py-1.5 text-xs font-bold text-red-300 border-l border-b border-red-600/30 flex items-center gap-1.5">
            <Lock className="h-3.5 w-3.5 text-red-400" />
            <span>Confidential & Protected</span>
          </div>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-600/20 text-red-400 border border-red-600/30">
              <User className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-display text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                <span>1. Vehicle Owner Private Information</span>
              </h2>
              <p className="text-xs text-neutral-400">
                Visible ONLY to AM Cars verified management. Never published or displayed to public visitors.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Owner Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
                <input
                  type="text"
                  required
                  placeholder="e.g. M. Senthil Kumar"
                  value={formData.ownerName}
                  onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                  className="w-full rounded-xl border border-neutral-700 bg-neutral-950 pl-10 pr-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Private Contact Phone Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
                <input
                  type="tel"
                  required
                  placeholder="10-digit phone number"
                  value={formData.ownerPhone}
                  onChange={(e) => {
                    const val = e.target.value;
                    setFormData((prev) => ({
                      ...prev,
                      ownerPhone: val,
                      ownerWhatsapp: prev.sameAsPhone ? val : prev.ownerWhatsapp
                    }));
                  }}
                  className="w-full rounded-xl border border-neutral-700 bg-neutral-950 pl-10 pr-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                />
              </div>
            </div>

            <div className="sm:col-span-2 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
                  <MessageCircle className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Private WhatsApp Number <span className="text-red-500">*</span></span>
                </label>
                <label className="inline-flex items-center gap-2 text-xs text-neutral-400 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={formData.sameAsPhone}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setFormData((prev) => ({
                        ...prev,
                        sameAsPhone: checked,
                        ownerWhatsapp: checked ? prev.ownerPhone : prev.ownerWhatsapp
                      }));
                    }}
                    className="h-3.5 w-3.5 rounded border-neutral-700 bg-neutral-950 text-red-600 focus:ring-red-500"
                  />
                  <span>Same as Phone number</span>
                </label>
              </div>

              {!formData.sameAsPhone && (
                <div className="relative">
                  <MessageCircle className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-400" />
                  <input
                    type="tel"
                    required={!formData.sameAsPhone}
                    placeholder="10-digit WhatsApp number"
                    value={formData.ownerWhatsapp}
                    onChange={(e) => setFormData({ ...formData, ownerWhatsapp: e.target.value })}
                    className="w-full rounded-xl border border-neutral-700 bg-neutral-950 pl-10 pr-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                  />
                </div>
              )}
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Private Note for AM Cars Showroom Management (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. In-hand minimum ₹5.8L expected, available for showroom inspection this weekend"
                value={formData.ownerNotes}
                onChange={(e) => setFormData({ ...formData, ownerNotes: e.target.value })}
                className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: VEHICLE SPECIFICATIONS */}
        <div className="rounded-3xl border border-neutral-800 bg-neutral-900/70 p-6 sm:p-8 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-800 text-red-500 border border-neutral-700">
              <Car className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-display text-lg sm:text-xl font-bold text-white">
                2. Vehicle Specifications
              </h2>
              <p className="text-xs text-neutral-400">
                Accurate vehicle technical and registration details for showroom presentation.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Brand */}
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Brand / Make <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3.5 py-2.5 text-sm text-white focus:border-red-500 focus:outline-none"
              >
                {POPULAR_BRANDS.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            {/* Model */}
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Model Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Swift, Creta, Dzire"
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3.5 py-2.5 text-sm text-white placeholder-neutral-500 focus:border-red-500 focus:outline-none"
              />
            </div>

            {/* Variant */}
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Variant
              </label>
              <input
                type="text"
                placeholder="e.g. VXi, SX Executive, ZDi"
                value={formData.variant}
                onChange={(e) => setFormData({ ...formData, variant: e.target.value })}
                className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3.5 py-2.5 text-sm text-white placeholder-neutral-500 focus:border-red-500 focus:outline-none"
              />
            </div>

            {/* Asking Price */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-neutral-300">
                  Expected Price (₹) <span className="text-red-500">*</span>
                </label>
                {numericPrice > 0 && (
                  <span className="text-[11px] font-bold text-red-400">
                    ≈ {formatPriceLakh(numericPrice)} Lakhs
                  </span>
                )}
              </div>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500 font-bold">₹</span>
                <input
                  type="text"
                  required
                  placeholder="e.g. 6,50,000"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full rounded-xl border border-neutral-700 bg-neutral-950 pl-8 pr-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:border-red-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Kilometers */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-neutral-300">
                  KM Driven
                </label>
                {numericKm > 0 && (
                  <span className="text-[11px] font-medium text-neutral-400">
                    {formatKM(numericKm)}
                  </span>
                )}
              </div>
              <input
                type="text"
                placeholder="e.g. 42,000"
                value={formData.kilometers}
                onChange={(e) => setFormData({ ...formData, kilometers: e.target.value })}
                className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3.5 py-2.5 text-sm text-white placeholder-neutral-500 focus:border-red-500 focus:outline-none"
              />
            </div>

            {/* Fuel Type */}
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Fuel
              </label>
              <select
                value={formData.fuelType}
                onChange={(e) => setFormData({ ...formData, fuelType: e.target.value as FuelType })}
                className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3.5 py-2.5 text-sm text-white focus:border-red-500 focus:outline-none"
              >
                <option value="Petrol">Petrol</option>
                <option value="Diesel">Diesel</option>
                <option value="CNG">CNG</option>
                <option value="Electric">Electric</option>
              </select>
            </div>

            {/* Transmission */}
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Transmission
              </label>
              <select
                value={formData.transmission}
                onChange={(e) => setFormData({ ...formData, transmission: e.target.value as TransmissionType })}
                className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3.5 py-2.5 text-sm text-white focus:border-red-500 focus:outline-none"
              >
                <option value="Manual">Manual</option>
                <option value="Automatic">Automatic</option>
              </select>
            </div>

            {/* Body Type */}
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Body Type
              </label>
              <select
                value={formData.bodyType}
                onChange={(e) => setFormData({ ...formData, bodyType: e.target.value as BodyType })}
                className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3.5 py-2.5 text-sm text-white focus:border-red-500 focus:outline-none"
              >
                <option value="Hatchback">Hatchback</option>
                <option value="Sedan">Sedan</option>
                <option value="SUV">SUV</option>
                <option value="MUV">MUV</option>
              </select>
            </div>

            {/* Manufacturing Year */}
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Year (Manufacturing)
              </label>
              <input
                type="number"
                min="2005"
                max="2026"
                value={formData.manufacturingYear}
                onChange={(e) => {
                  const y = Number(e.target.value);
                  setFormData({ ...formData, manufacturingYear: y, registrationYear: y });
                }}
                className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3.5 py-2.5 text-sm text-white focus:border-red-500 focus:outline-none"
              />
            </div>

            {/* Registration State / District */}
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                RTO Registration Code
              </label>
              <input
                type="text"
                placeholder="e.g. TN-72 (Tirunelveli) or TN-76"
                value={formData.registrationState}
                onChange={(e) => setFormData({ ...formData, registrationState: e.target.value })}
                className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3.5 py-2.5 text-sm text-white placeholder-neutral-500 focus:border-red-500 focus:outline-none"
              />
            </div>

            {/* Location */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Vehicle Location
              </label>
              <input
                type="text"
                placeholder="e.g. Ambasamudram, TN"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3.5 py-2.5 text-sm text-white placeholder-neutral-500 focus:border-red-500 focus:outline-none"
              />
              {/* Quick location chips */}
              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] text-neutral-500">Quick select:</span>
                {QUICK_LOCATIONS.map((loc) => (
                  <button
                    key={loc}
                    type="button"
                    onClick={() => setFormData({ ...formData, location: loc })}
                    className={`rounded-lg px-2.5 py-0.5 text-[11px] font-medium transition-colors ${
                      formData.location === loc
                        ? 'bg-red-600 text-white font-bold'
                        : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700 hover:text-white'
                    }`}
                  >
                    {loc.replace(', TN', '')}
                  </button>
                ))}
              </div>
            </div>

            {/* Ownership */}
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Number of Owners
              </label>
              <select
                value={formData.owners}
                onChange={(e) => setFormData({ ...formData, owners: e.target.value as '1st Owner' | '2nd Owner' | '3rd Owner' })}
                className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3.5 py-2.5 text-sm text-white focus:border-red-500 focus:outline-none"
              >
                <option value="1st Owner">1st Owner</option>
                <option value="2nd Owner">2nd Owner</option>
                <option value="3rd Owner">3rd Owner</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="mt-5">
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
              Vehicle Description & Highlights
            </label>
            <textarea
              rows={3}
              placeholder="Mention insurance validity, tyre condition, service history, any aftermarket accessories..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full rounded-xl border border-neutral-700 bg-neutral-950 p-3.5 text-sm text-white placeholder-neutral-500 focus:border-red-500 focus:outline-none"
            />
          </div>
        </div>

        {/* SECTION 3: CAR PHOTOS */}
        <div className="rounded-3xl border border-neutral-800 bg-neutral-900/70 p-6 sm:p-8 shadow-xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-800 text-red-500 border border-neutral-700">
              <Upload className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-display text-lg sm:text-xl font-bold text-white">
                3. Vehicle Photos ({formData.images.length})
              </h2>
              <p className="text-xs text-neutral-400">
                Upload clear photos from your phone or device. Listings with clear photos sell much faster.
              </p>
            </div>
          </div>

          {/* Upload Button */}
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <label className={`inline-flex cursor-pointer items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-semibold text-white transition-colors ${uploadingPhotos ? 'bg-red-600/20 border-red-500/50 text-red-300 pointer-events-none' : 'bg-neutral-800 border-neutral-700 hover:bg-neutral-700'}`}>
              <Upload className={`h-4 w-4 text-red-500 ${uploadingPhotos ? 'animate-bounce' : ''}`} />
              <span>{uploadingPhotos ? 'Uploading to Firebase Storage...' : 'Upload Photos from Device'}</span>
              <input
                type="file"
                multiple
                accept="image/*"
                disabled={uploadingPhotos}
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>

            <div className="flex-1 flex min-w-[240px] gap-2">
              <input
                type="url"
                placeholder="Or paste image URL"
                value={customPhotoUrl}
                onChange={(e) => setCustomPhotoUrl(e.target.value)}
                className="flex-1 rounded-xl border border-neutral-700 bg-neutral-950 px-3.5 py-2 text-xs text-white placeholder-neutral-500 focus:border-red-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddPhotoUrl}
                className="rounded-xl bg-neutral-800 border border-neutral-700 px-3 py-2 text-xs font-semibold text-neutral-200 hover:bg-neutral-700"
              >
                Add URL
              </button>
            </div>
          </div>

          {/* Photo Previews */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {formData.images.map((img, i) => (
              <div key={i} className="group relative aspect-video rounded-xl overflow-hidden border border-neutral-800 bg-neutral-950">
                <img
                  src={img}
                  alt={`Car Preview ${i + 1}`}
                  className="h-full w-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <button
                  type="button"
                  onClick={() => handleRemovePhoto(i)}
                  className="absolute top-1.5 right-1.5 rounded-md bg-neutral-950/80 px-2 py-0.5 text-[10px] text-red-400 hover:bg-red-600 hover:text-white transition-colors"
                >
                  Remove
                </button>
                {i === 0 && (
                  <span className="absolute bottom-1.5 left-1.5 rounded-md bg-red-600 px-2 py-0.5 text-[10px] font-bold text-white">
                    Primary Photo
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* SUBMIT BUTTON & DISCLAIMER */}
        <div className="rounded-3xl border border-neutral-800 bg-neutral-900/90 p-6 text-center space-y-4">
          <div className="flex items-center justify-center gap-2 text-xs text-neutral-400">
            <Lock className="h-4 w-4 text-emerald-400" />
            <span>
              By submitting, your car enters <strong>AM Cars Showroom Verification</strong>. Your personal contact number is strictly protected.
            </span>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-2xl bg-red-600 hover:bg-red-500 px-10 py-4 text-sm sm:text-base font-black uppercase tracking-wider text-white shadow-xl shadow-red-950/50 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            {submitting ? (
              <span>Securing & Submitting Vehicle...</span>
            ) : (
              <>
                <span>Submit Vehicle for Verification</span>
                <ArrowRight className="h-5 w-5" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
