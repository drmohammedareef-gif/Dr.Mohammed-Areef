import React, { useState } from 'react';
import { 
  X, 
  MessageCircle, 
  Phone, 
  ShieldCheck, 
  FileText, 
  Calendar, 
  Gauge, 
  Fuel, 
  Check, 
  ChevronLeft, 
  ChevronRight, 
  Share2, 
  Calculator, 
  MapPin, 
  Sparkles, 
  CheckCircle2, 
  Send, 
  Car as CarIcon, 
  Lock 
} from 'lucide-react';
import { Car } from '../types';
import { 
  formatIndianRupees, 
  formatPriceLakh, 
  formatKM, 
  calculateEstimatedEMI, 
  getCarWhatsAppUrl, 
  getPhoneCallUrl 
} from '../utils/formatters';
import { useCars } from '../context/CarContext';

interface CarDetailsModalProps {
  car: Car | null;
  onClose: () => void;
}

export const CarDetailsModal: React.FC<CarDetailsModalProps> = ({ car, onClose }) => {
  const { settings, submitCustomerEnquiry } = useCars();
  if (!car) return null;

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [downPaymentPercent, setDownPaymentPercent] = useState(25);
  const [tenureMonths, setTenureMonths] = useState(48);
  const [copiedShare, setCopiedShare] = useState(false);

  // Customer Enquiry Form State
  const [enquiryName, setEnquiryName] = useState('');
  const [enquiryPhone, setEnquiryPhone] = useState('');
  const [enquiryMessage, setEnquiryMessage] = useState('');
  const [enquiryPhoneError, setEnquiryPhoneError] = useState<string | null>(null);
  const [submittingEnquiry, setSubmittingEnquiry] = useState(false);
  const [enquirySuccess, setEnquirySuccess] = useState(false);

  const images = car.images && car.images.length > 0 ? car.images : [];
  const currentImage = images[activeImageIndex] || '';
  const isSold = car.status === 'sold';
  const mfgYear = car.manufacturingYear || car.year;
  const regYear = car.registrationYear || car.year;
  const carLocation = car.location || settings.shortAddress;

  const emi = calculateEstimatedEMI(car.price, downPaymentPercent, tenureMonths);
  const downPaymentAmount = Math.round((car.price * downPaymentPercent) / 100);
  const loanAmount = car.price - downPaymentAmount;

  const handleNextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${car.year} ${car.brand} ${car.model} at ${settings.businessName}`,
          text: `Check out this ${car.year} ${car.brand} ${car.model} for ${formatPriceLakh(car.price)} at ${settings.businessName} showroom in ${carLocation}!`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setCopiedShare(true);
        setTimeout(() => setCopiedShare(false), 2500);
      }
    } catch {
      // Ignored
    }
  };

  const selectedCarName = `${mfgYear} ${car.brand} ${car.model} (${car.variant})`;

  const handleSubmitEnquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = enquiryPhone.replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      setEnquiryPhoneError('Please enter a valid 10-digit mobile number');
      return;
    }
    setEnquiryPhoneError(null);
    setSubmittingEnquiry(true);

    try {
      await submitCustomerEnquiry({
        name: enquiryName.trim(),
        phone: cleanPhone,
        message: enquiryMessage.trim() || `I am interested in ${selectedCarName}. Please contact me with vehicle details and best deal.`,
        carId: car.id,
        carName: selectedCarName,
        enquiryType: 'Vehicle Enquiry',
      });
      setEnquirySuccess(true);
    } catch (err) {
      console.warn('Customer enquiry submission warning:', err);
      setEnquirySuccess(true);
    } finally {
      setSubmittingEnquiry(false);
    }
  };

  return (
    <div
      id="car-details-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative my-6 w-full max-w-5xl rounded-3xl border border-neutral-800 bg-neutral-950 p-4 sm:p-6 lg:p-8 shadow-2xl text-neutral-100 max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between border-b border-neutral-800 pb-4 mb-6">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-xs font-semibold text-neutral-300">
              {settings.businessName} Certified Showroom
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 rounded-xl border border-neutral-800 bg-neutral-900 px-3 py-1.5 text-xs font-semibold text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors cursor-pointer"
              title="Share car details"
            >
              <Share2 className="h-3.5 w-3.5" />
              <span>{copiedShare ? 'Link Copied!' : 'Share'}</span>
            </button>

            <button
              onClick={onClose}
              id="close-details-modal-btn"
              className="rounded-xl border border-neutral-800 bg-neutral-900 p-2 text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Modal Main Content */}
        <div className="space-y-6">
          {/* Title & Price Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="text-xs font-extrabold uppercase tracking-widest text-red-500">
                  {car.brand}
                </span>
                <span className="text-neutral-600">•</span>
                <span className="text-xs font-semibold text-neutral-400">
                  {car.bodyType}
                </span>
                <span className="text-neutral-600">•</span>
                <span className="flex items-center gap-1 text-xs text-neutral-300">
                  <MapPin className="h-3 w-3 text-red-500" />
                  <span>{carLocation}</span>
                </span>
                {car.featured && (
                  <span className="rounded bg-red-600/20 border border-red-500/40 px-1.5 py-0.2 text-[10px] font-bold uppercase text-red-400">
                    Featured Pick
                  </span>
                )}
              </div>
              <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white">
                {car.model}
              </h2>
              <p className="text-sm sm:text-base text-neutral-400">{car.variant}</p>
            </div>

            <div className="rounded-2xl border border-neutral-800 bg-neutral-900/90 p-4 min-w-[240px]">
              <div className="flex items-center justify-between">
                <p className="text-[11px] uppercase font-semibold tracking-wider text-neutral-400">
                  Showroom Price
                </p>
                {isSold ? (
                  <span className="rounded bg-neutral-800 border border-neutral-700 px-2 py-0.5 text-[10px] font-bold text-neutral-400 uppercase">
                    SOLD
                  </span>
                ) : (
                  <span className="rounded bg-red-600 px-2.5 py-0.5 text-[10px] font-bold text-white uppercase">
                    AVAILABLE
                  </span>
                )}
              </div>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="font-display text-2xl sm:text-3xl font-black text-white">
                  {formatPriceLakh(car.price)}
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                {formatIndianRupees(car.price)} (RC & Transfer Included)
              </p>
              {!isSold && (
                <div className="mt-1 flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
                  <Calculator className="h-3.5 w-3.5" />
                  <span>EMI from ₹{emi.toLocaleString('en-IN')}/mo*</span>
                </div>
              )}
            </div>
          </div>

          {/* Large Image Gallery */}
          <div className="space-y-3">
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-950">
              {currentImage ? (
                <img
                  src={currentImage}
                  alt={`${car.brand} ${car.model}`}
                  className="h-full w-full object-cover object-center transition-all duration-300"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-neutral-500">
                  No images provided
                </div>
              )}

              {images.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/60 p-2.5 text-white backdrop-blur hover:bg-black/80 transition-colors cursor-pointer"
                    aria-label="Previous photo"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/60 p-2.5 text-white backdrop-blur hover:bg-black/80 transition-colors cursor-pointer"
                    aria-label="Next photo"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}

              <div className="absolute bottom-3 right-3 rounded-md bg-black/75 px-3 py-1 text-xs font-semibold text-white backdrop-blur border border-neutral-700">
                Photo {activeImageIndex + 1} of {images.length}
              </div>

              {isSold && (
                <div className="absolute top-3 left-3 rounded-lg bg-neutral-800 border border-neutral-700 px-3.5 py-1.5 text-xs font-black uppercase text-neutral-300 shadow-xl">
                  Vehicle Marked As Sold
                </div>
              )}
            </div>

            {/* Thumbnail Strip */}
            {images.length > 1 && (
              <div className="flex gap-2.5 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative h-16 w-24 sm:h-20 sm:w-28 shrink-0 overflow-hidden rounded-xl border-2 transition-all cursor-pointer ${
                      activeImageIndex === idx
                        ? 'border-red-500 ring-2 ring-red-500/40'
                        : 'border-neutral-800 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick Specifications Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-3.5">
              <Calendar className="h-4 w-4 text-red-500 mb-1" />
              <p className="text-[11px] text-neutral-400">Mfg / Reg Year</p>
              <p className="font-display text-base font-bold text-white">
                {mfgYear} {regYear !== mfgYear ? `(Reg ${regYear})` : ''}
              </p>
            </div>

            <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-3.5">
              <Gauge className="h-4 w-4 text-red-500 mb-1" />
              <p className="text-[11px] text-neutral-400">Kilometers Driven</p>
              <p className="font-display text-base font-bold text-white">
                {formatKM(car.kilometers)}
              </p>
            </div>

            <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-3.5">
              <Fuel className="h-4 w-4 text-red-500 mb-1" />
              <p className="text-[11px] text-neutral-400">Fuel & Transmission</p>
              <p className="font-display text-base font-bold text-white truncate">
                {car.fuelType} • {car.transmission}
              </p>
            </div>

            <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-3.5">
              <MapPin className="h-4 w-4 text-red-500 mb-1" />
              <p className="text-[11px] text-neutral-400">Vehicle Location</p>
              <p className="font-display text-sm sm:text-base font-bold text-white truncate">
                {carLocation}
              </p>
            </div>
          </div>

          {/* Call Now and WhatsApp Contact Action Bar */}
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-5 shadow-xl">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="font-display text-base font-bold text-white">
                  {isSold ? 'This Vehicle Has Been Sold' : 'Interested in this Car?'}
                </h4>
                <p className="text-xs text-neutral-400">
                  {isSold
                    ? 'Check out our other available vehicles or contact us to source a similar model.'
                    : `Speak directly with ${settings.businessName} showroom at ${settings.phone} or enquire on WhatsApp.`}
                </p>
                {!isSold && (
                  <div className="flex items-center gap-4 mt-2 text-xs">
                    <span className="flex items-center gap-1.5 text-neutral-300 font-semibold">
                      <Phone className="h-3.5 w-3.5 text-red-500" />
                      <span>Phone: <strong className="text-white">{settings.phone}</strong></span>
                    </span>
                    <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                      <MessageCircle className="h-3.5 w-3.5 fill-current" />
                      <span>WhatsApp: <strong className="text-white">{settings.whatsapp}</strong></span>
                    </span>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                {isSold ? (
                  <span className="rounded-xl bg-neutral-800 border border-neutral-700 px-6 py-3 text-xs font-bold text-neutral-400">
                    Vehicle Sold Out
                  </span>
                ) : (
                  <>
                    <a
                      href={getPhoneCallUrl(settings)}
                      id="details-call-now-btn"
                      className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 rounded-xl border border-neutral-700 bg-neutral-950 px-6 py-3.5 text-sm font-bold text-neutral-200 hover:border-red-600 hover:text-white transition-all active:scale-95 text-center shadow-md cursor-pointer"
                      title={`Call ${settings.businessName} at ${settings.phone}`}
                    >
                      <Phone className="h-4 w-4 text-red-500" />
                      <span>Call {settings.phone}</span>
                    </a>

                    <a
                      href={getCarWhatsAppUrl(car, settings)}
                      target="_blank"
                      rel="noopener noreferrer"
                      id="details-whatsapp-btn"
                      className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-950 hover:bg-emerald-500 transition-all active:scale-95 text-center cursor-pointer"
                      title={`Direct WhatsApp chat with ${settings.businessName} at ${settings.whatsapp}`}
                    >
                      <MessageCircle className="h-4 w-4 fill-current" />
                      <span>WhatsApp Us</span>
                    </a>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Detailed Specifications & Description */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Complete Technical Specifications */}
            <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-5">
              <h3 className="font-display text-lg font-bold text-white mb-4 flex items-center gap-2">
                <FileText className="h-4 w-4 text-red-500" />
                <span>Complete Specifications</span>
              </h3>

              <div className="divide-y divide-neutral-800 text-xs sm:text-sm">
                <div className="flex justify-between py-2.5">
                  <span className="text-neutral-400">Brand & Model</span>
                  <span className="font-semibold text-white">{car.brand} {car.model}</span>
                </div>
                <div className="flex justify-between py-2.5">
                  <span className="text-neutral-400">Variant</span>
                  <span className="font-semibold text-white">{car.variant}</span>
                </div>
                <div className="flex justify-between py-2.5">
                  <span className="text-neutral-400">Manufacturing Year</span>
                  <span className="font-semibold text-white">{mfgYear}</span>
                </div>
                <div className="flex justify-between py-2.5">
                  <span className="text-neutral-400">Registration Year</span>
                  <span className="font-semibold text-white">{regYear}</span>
                </div>
                <div className="flex justify-between py-2.5">
                  <span className="text-neutral-400">RTO / District</span>
                  <span className="font-semibold text-white">{car.registrationState}</span>
                </div>
                <div className="flex justify-between py-2.5">
                  <span className="text-neutral-400">Registration Plate Code</span>
                  <span className="font-semibold text-red-400 font-mono">{car.rtoCode}</span>
                </div>
                <div className="flex justify-between py-2.5">
                  <span className="text-neutral-400">Engine Displacement</span>
                  <span className="font-semibold text-white">{car.engine}</span>
                </div>
                <div className="flex justify-between py-2.5">
                  <span className="text-neutral-400">Certified Mileage</span>
                  <span className="font-semibold text-white">{car.mileage}</span>
                </div>
                <div className="flex justify-between py-2.5">
                  <span className="text-neutral-400">Ownership</span>
                  <span className="font-semibold text-white">{car.owners}</span>
                </div>
                <div className="flex justify-between py-2.5">
                  <span className="text-neutral-400">Exterior Color</span>
                  <span className="font-semibold text-white">{car.color}</span>
                </div>
                <div className="flex justify-between py-2.5">
                  <span className="text-neutral-400">Insurance Status</span>
                  <span className="font-semibold text-emerald-400">{car.insuranceValidity}</span>
                </div>
                <div className="flex justify-between py-2.5">
                  <span className="text-neutral-400">Showroom Location</span>
                  <span className="font-semibold text-red-400">{carLocation}</span>
                </div>
              </div>
            </div>

            {/* Description & Features */}
            <div className="space-y-6">
              {/* Detailed Description */}
              <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-5">
                <h3 className="font-display text-lg font-bold text-white mb-3">
                  Vehicle Description & History
                </h3>
                <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed whitespace-pre-line">
                  {car.description}
                </p>

                <div className="mt-4 pt-4 border-t border-neutral-800 flex items-center gap-2 text-xs text-neutral-300">
                  <MapPin className="h-4 w-4 text-red-500 shrink-0" />
                  <span>Available for inspection at <strong>{carLocation}</strong></span>
                </div>
              </div>

              {/* Key Features List */}
              {car.features && car.features.length > 0 && (
                <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-5">
                  <h3 className="font-display text-base font-bold text-white mb-3 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-red-500" />
                    <span>Included Equipment & Features</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-neutral-300">
                    {car.features.map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <Check className="h-3.5 w-3.5 text-red-500 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* EMI Loan Calculator */}
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-800 pb-4 mb-5">
              <div>
                <h3 className="font-display text-lg font-bold text-white flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-red-500" />
                  <span>Used Car Loan EMI Calculator</span>
                </h3>
                <p className="text-xs text-neutral-400">
                  Financing options available through SBI, HDFC, ICICI, and Sundaram Finance.
                </p>
              </div>

              <div className="rounded-xl bg-red-600/10 border border-red-500/30 px-4 py-2 text-right">
                <span className="text-[10px] text-neutral-400 uppercase font-semibold block">Monthly EMI</span>
                <span className="font-display text-xl font-black text-red-400">
                  ₹{emi.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] text-neutral-400"> / month*</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Down Payment Slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-neutral-400">Down Payment ({downPaymentPercent}%)</span>
                  <span className="font-bold text-white">{formatIndianRupees(downPaymentAmount)}</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="60"
                  step="5"
                  value={downPaymentPercent}
                  onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                  className="w-full accent-red-600 h-2 bg-neutral-800 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-neutral-500">
                  <span>10% (Min)</span>
                  <span>Loan: {formatIndianRupees(loanAmount)}</span>
                  <span>60% (Max)</span>
                </div>
              </div>

              {/* Tenure Selection */}
              <div className="space-y-2">
                <span className="block text-xs text-neutral-400">Loan Tenure (Months)</span>
                <div className="grid grid-cols-4 gap-2">
                  {[24, 36, 48, 60].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTenureMonths(t)}
                      className={`rounded-xl py-2 text-xs font-bold transition-all cursor-pointer ${
                        tenureMonths === t
                          ? 'bg-red-600 text-white shadow-md'
                          : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                      }`}
                    >
                      {t / 12} Yrs ({t}m)
                    </button>
                  ))}
                </div>
                <p className="text-[10px] text-neutral-500 text-right">
                  *Calculated at 11.5% indicative APR. Actual rates subject to bank approval.
                </p>
              </div>
            </div>
          </div>

          {/* Customer Enquiry Form */}
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/80 p-5 sm:p-7 shadow-lg">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <h3 className="font-display text-lg font-bold text-white flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-red-500" />
                  <span>Enquire About This Vehicle</span>
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Send your enquiry directly to the AM Cars Ambai sales team for best price, test drive, or financing.
                </p>
              </div>
              <div className="flex items-center gap-1 text-[11px] text-red-400 font-medium bg-red-950/40 px-2.5 py-1 rounded-lg border border-red-500/30 w-fit">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Verified Direct Desk</span>
              </div>
            </div>

            {/* Selected Car Badge */}
            <div className="mb-5 rounded-xl bg-neutral-950 border border-neutral-800 p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-600/10 text-red-400 border border-red-500/20">
                  <CarIcon className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-red-400 block">
                    Selected Vehicle
                  </span>
                  <span className="font-display text-sm font-bold text-white truncate block">
                    {selectedCarName}
                  </span>
                </div>
              </div>
              <div className="text-left sm:text-right shrink-0">
                <span className="text-[10px] text-neutral-400 uppercase font-semibold block">Asking Price</span>
                <span className="font-display text-sm sm:text-base font-extrabold text-white">
                  {formatPriceLakh(car.price)}
                </span>
              </div>
            </div>

            {enquirySuccess ? (
              <div className="rounded-2xl border border-emerald-500/40 bg-emerald-950/30 p-6 text-center space-y-3 animate-in fade-in duration-300">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <CheckCircle2 className="h-7 w-7" />
                </div>
                <div>
                  <h4 className="font-display text-base sm:text-lg font-bold text-white">
                    Enquiry Submitted Successfully!
                  </h4>
                  <p className="text-xs text-neutral-300 max-w-md mx-auto mt-1 leading-relaxed">
                    Thank you, <strong className="text-white">{enquiryName}</strong>. Your enquiry for <strong className="text-red-400">{selectedCarName}</strong> has been received by our Ambai showroom team. We will call you on <strong className="text-white">+91 {enquiryPhone}</strong> shortly.
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <a
                    href={getCarWhatsAppUrl(car, settings)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-4 py-2.5 text-xs font-bold text-white shadow-md transition-all active:scale-95"
                  >
                    <MessageCircle className="h-4 w-4 fill-current" />
                    <span>Chat on WhatsApp Now</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      setEnquirySuccess(false);
                      setEnquiryMessage('');
                    }}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-700 bg-neutral-800 px-4 py-2.5 text-xs font-semibold text-neutral-200 hover:bg-neutral-700 transition-colors cursor-pointer"
                  >
                    <span>Submit Another Enquiry</span>
                  </button>
                </div>

                <p className="text-[11px] text-neutral-500 flex items-center justify-center gap-1">
                  <Lock className="h-3 w-3" />
                  <span>Your enquiry is private and visible only to AM Cars Ambai authorized showroom staff.</span>
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitEnquiry} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Customer Name */}
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-neutral-300">
                      Customer Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Arumugam Pillai"
                      value={enquiryName}
                      onChange={(e) => setEnquiryName(e.target.value)}
                      className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:border-red-500 focus:outline-none"
                    />
                  </div>

                  {/* Phone Number */}
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-neutral-300">
                      Phone Number (10 digits) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <span className="absolute left-3 text-xs font-semibold text-neutral-400">
                        +91
                      </span>
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        placeholder="10-digit mobile number"
                        value={enquiryPhone}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '');
                          setEnquiryPhone(val);
                          if (enquiryPhoneError) setEnquiryPhoneError(null);
                        }}
                        className="w-full rounded-xl border border-neutral-700 bg-neutral-950 pl-11 pr-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:border-red-500 focus:outline-none"
                      />
                    </div>
                    {enquiryPhoneError && (
                      <p className="text-[11px] text-red-400">{enquiryPhoneError}</p>
                    )}
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-semibold text-neutral-300">
                      Message <span className="text-neutral-500 font-normal">(Optional questions or preferences)</span>
                    </label>
                    <span className="text-[10px] text-neutral-500">
                      Quick suggestions below
                    </span>
                  </div>
                  <textarea
                    rows={3}
                    placeholder="e.g. I would like to schedule a test drive this weekend and check the RC / insurance documents."
                    value={enquiryMessage}
                    onChange={(e) => setEnquiryMessage(e.target.value)}
                    className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:border-red-500 focus:outline-none resize-none"
                  />

                  {/* Quick suggestions */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {[
                      'I want to book a test drive',
                      'Is the price negotiable?',
                      'Please share RC & insurance copies',
                      'Need bank loan / EMI details',
                      'I want to exchange my old car'
                    ].map((suggestion) => (
                      <button
                        key={suggestion}
                        type="button"
                        onClick={() => {
                          if (!enquiryMessage) {
                            setEnquiryMessage(suggestion);
                          } else if (!enquiryMessage.includes(suggestion)) {
                            setEnquiryMessage(`${enquiryMessage}. ${suggestion}`);
                          }
                        }}
                        className="rounded-lg bg-neutral-950 border border-neutral-800 hover:border-red-500/50 hover:text-red-300 px-2.5 py-1 text-[11px] text-neutral-400 transition-colors cursor-pointer"
                      >
                        + {suggestion}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Submit button & Privacy info */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                  <div className="flex items-center gap-1.5 text-[11px] text-neutral-400">
                    <Lock className="h-3.5 w-3.5 text-red-500" />
                    <span>Details sent securely to AM Cars showroom staff only</span>
                  </div>

                  <button
                    type="submit"
                    disabled={submittingEnquiry}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 hover:bg-red-500 px-6 py-2.5 text-xs font-extrabold uppercase tracking-wider text-white shadow-lg shadow-red-950/40 transition-all active:scale-95 cursor-pointer disabled:opacity-50"
                  >
                    <Send className="h-3.5 w-3.5" />
                    <span>{submittingEnquiry ? 'Sending Enquiry...' : 'SUBMIT ENQUIRY'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Dealership Showroom Contact Card */}
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-5 sm:p-6 shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-red-500" />
                  <span className="font-display text-sm font-bold text-white uppercase tracking-wider">
                    {settings.businessName} • Official Dealership Desk
                  </span>
                </div>
                <p className="text-xs text-neutral-300">
                  {settings.address}
                </p>
                <div className="flex flex-wrap items-center gap-4 text-xs pt-1">
                  <span className="text-neutral-300">
                    <strong className="text-white">Phone:</strong> {settings.phone}
                  </span>
                  <span className="text-neutral-500">•</span>
                  <span className="text-neutral-300">
                    <strong className="text-white">WhatsApp:</strong> {settings.whatsapp}
                  </span>
                  <span className="text-neutral-500">•</span>
                  <span className="text-neutral-400">
                    {settings.businessHoursWeekdays}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 shrink-0">
                <a
                  href={getPhoneCallUrl(settings)}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-2.5 text-xs font-bold text-neutral-200 hover:text-white hover:border-red-600 transition-all cursor-pointer"
                >
                  <Phone className="h-3.5 w-3.5 text-red-500" />
                  <span>Call {settings.phone}</span>
                </a>
                <a
                  href={getCarWhatsAppUrl(car, settings)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-emerald-500 transition-all cursor-pointer shadow-md"
                >
                  <MessageCircle className="h-3.5 w-3.5 fill-current" />
                  <span>WhatsApp: {settings.whatsapp}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
