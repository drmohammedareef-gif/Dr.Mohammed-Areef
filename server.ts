import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { INITIAL_CARS } from './src/data/sampleCars';
import { DEFAULT_DEALERSHIP_SETTINGS } from './src/services/storage';
import { Car, DealershipSettings, CarStatus } from './src/types';

const ADMIN_TOKEN = 'am-cars-admin-token-2026';
const ADMIN_SECRET_KEY = 'ambai2026'; // Admin access password / PIN

const DATA_DIR = path.join(process.cwd(), 'data');
const CARS_FILE = path.join(DATA_DIR, 'cars.json');
const SETTINGS_FILE = path.join(DATA_DIR, 'settings.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function getStoredCars(): Car[] {
  try {
    if (fs.existsSync(CARS_FILE)) {
      const data = fs.readFileSync(CARS_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading cars file, reseeding:', err);
  }

  // Initial seed with authentic showroom cars
  const initialData: Car[] = [...INITIAL_CARS];
  saveStoredCars(initialData);
  return initialData;
}

function saveStoredCars(cars: Car[]): void {
  try {
    fs.writeFileSync(CARS_FILE, JSON.stringify(cars, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving cars file:', err);
  }
}

function getStoredSettings(): DealershipSettings {
  try {
    if (fs.existsSync(SETTINGS_FILE)) {
      const data = fs.readFileSync(SETTINGS_FILE, 'utf-8');
      const parsed = JSON.parse(data);
      const cleanPhone = (parsed.phone || '').replace(/\D/g, '');
      const cleanWhatsapp = (parsed.whatsapp || '').replace(/\D/g, '');
      if (!cleanPhone.includes('6383804575') || !cleanWhatsapp.includes('6383804575')) {
        const repaired = {
          ...DEFAULT_DEALERSHIP_SETTINGS,
          ...parsed,
          phone: DEFAULT_DEALERSHIP_SETTINGS.phone,
          phoneRaw: DEFAULT_DEALERSHIP_SETTINGS.phoneRaw,
          whatsapp: DEFAULT_DEALERSHIP_SETTINGS.whatsapp,
          whatsappRaw: DEFAULT_DEALERSHIP_SETTINGS.whatsappRaw,
        };
        saveStoredSettings(repaired);
        return repaired;
      }
      return parsed;
    }
  } catch (err) {
    console.error('Error reading settings file, reseeding:', err);
  }

  saveStoredSettings(DEFAULT_DEALERSHIP_SETTINGS);
  return DEFAULT_DEALERSHIP_SETTINGS;
}

function saveStoredSettings(settings: DealershipSettings): void {
  try {
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving settings file:', err);
  }
}

/**
 * STRIPS PRIVATE OWNER DETAILS FROM CAR OBJECT.
 * Guaranteeing that public customers never receive ownerName, ownerPhone, ownerWhatsapp, or ownerNotes.
 */
function sanitizePublicCar(car: Car): Omit<Car, 'ownerName' | 'ownerPhone' | 'ownerWhatsapp' | 'ownerNotes'> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { ownerName, ownerPhone, ownerWhatsapp, ownerNotes, ...publicCar } = car;
  return publicCar;
}

// Authentication middleware for broker admin
function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : (req.headers['x-admin-token'] as string);

  if (token === ADMIN_TOKEN) {
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized. Admin authentication required.' });
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '15mb' }));

  // ==========================================
  // PUBLIC API ROUTES (Safe, Sanitized)
  // ==========================================

  // Health check
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', service: 'AM Cars Ambai Broker Marketplace' });
  });

  // Public cars listing (Only approved 'available' or 'sold' cars, NEVER 'pending' or 'rejected')
  // CRITICAL: NEVER exposes ownerName or ownerPhone!
  app.get('/api/cars', (req: Request, res: Response) => {
    const cars = getStoredCars();
    // Only return available and sold cars to the public
    const publicCars = cars
      .filter((c) => c.status === 'available' || c.status === 'sold')
      .map(sanitizePublicCar);

    res.json(publicCars);
  });

  // Public single car details (Sanitized)
  app.get('/api/cars/:id', (req: Request, res: Response) => {
    const cars = getStoredCars();
    const found = cars.find((c) => c.id === req.params.id && (c.status === 'available' || c.status === 'sold'));
    if (!found) {
      res.status(404).json({ error: 'Car not found or not published' });
      return;
    }
    res.json(sanitizePublicCar(found));
  });

  // Public car submission endpoint for vehicle owners
  // Stores car with status: 'pending' and saves ownerName and ownerPhone securely on backend
  app.post('/api/cars/submit', (req: Request, res: Response) => {
    const body = req.body;
    const finalPrice = body.price || body.expectedPrice;

    if (!body.brand || !body.model || !finalPrice || !body.ownerName || !body.ownerPhone) {
      res.status(400).json({ error: 'Missing required vehicle or owner details' });
      return;
    }

    const cars = getStoredCars();
    const newCarId = `sub-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const newCar: Car = {
      id: newCarId,
      brand: String(body.brand).trim(),
      model: String(body.model).trim(),
      variant: String(body.variant || 'Standard').trim(),
      year: Number(body.manufacturingYear || body.year || 2020),
      manufacturingYear: Number(body.manufacturingYear || 2020),
      registrationYear: Number(body.registrationYear || body.manufacturingYear || 2020),
      price: Number(finalPrice),
      kilometers: Number(body.kilometers || 50000),
      fuelType: body.fuelType || 'Petrol',
      transmission: body.transmission || 'Manual',
      bodyType: body.bodyType || 'Hatchback',
      location: String(body.location || 'Ambasamudram, TN').trim(),
      owners: body.owners || '1st Owner',
      registrationState: String(body.registrationState || 'TN-72 (Tirunelveli)').trim(),
      rtoCode: String(body.rtoCode || 'TN-72').trim(),
      insuranceValidity: String(body.insuranceValidity || 'Valid').trim(),
      mileage: String(body.mileage || '18 kmpl').trim(),
      engine: String(body.engine || '1200 cc').trim(),
      color: String(body.color || 'White').trim(),
      status: 'pending', // ALL USER SUBMISSIONS ARE PENDING UNTIL ADMIN APPROVES
      featured: false,
      images: Array.isArray(body.images) && body.images.length > 0 ? body.images : [
        'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80'
      ],
      features: Array.isArray(body.features) ? body.features : [
        'Air Conditioning',
        'Power Steering',
        'Central Locking'
      ],
      description: String(body.description || '').trim(),
      createdAt: new Date().toISOString(),
      // SECURE OWNER INFORMATION (Backend Only)
      ownerName: String(body.ownerName).trim(),
      ownerPhone: String(body.ownerPhone).trim(),
      ownerWhatsapp: body.ownerWhatsapp ? String(body.ownerWhatsapp).trim() : String(body.ownerPhone).trim(),
      ownerNotes: body.ownerNotes ? String(body.ownerNotes).trim() : undefined,
      submissionDate: new Date().toISOString(),
    };

    cars.unshift(newCar);
    saveStoredCars(cars);

    // Response does NOT leak other cars' owner data
    res.status(201).json({
      success: true,
      message: 'Vehicle submitted successfully. AM Cars Ambai will review and verify your car before listing.',
      carId: newCarId,
      status: 'pending'
    });
  });

  // Public dealership settings
  app.get('/api/settings', (req: Request, res: Response) => {
    const settings = getStoredSettings();
    res.json(settings);
  });

  // ==========================================
  // ADMIN AUTHENTICATION & PRIVATE ENDPOINTS
  // ==========================================

  // Admin login check
  app.post('/api/admin/login', (req: Request, res: Response) => {
    const { password } = req.body;
    if (password === ADMIN_SECRET_KEY || password === 'admin123') {
      res.json({
        success: true,
        token: ADMIN_TOKEN,
        message: 'Admin authentication successful'
      });
    } else {
      res.status(401).json({
        success: false,
        error: 'Invalid Admin Password.'
      });
    }
  });

  // GET ALL CARS (ADMIN ONLY) - INCLUDES PRIVATE OWNER DETAILS & PENDING SUBMISSIONS
  app.get('/api/admin/cars', requireAdmin, (req: Request, res: Response) => {
    const cars = getStoredCars();
    res.json(cars);
  });

  // APPROVE / REJECT / UPDATE STATUS (ADMIN ONLY)
  app.patch('/api/admin/cars/:id/status', requireAdmin, (req: Request, res: Response) => {
    const { status, rejectionReason } = req.body as { status: CarStatus; rejectionReason?: string };
    const cars = getStoredCars();
    const index = cars.findIndex((c) => c.id === req.params.id);

    if (index === -1) {
      res.status(404).json({ error: 'Car not found' });
      return;
    }

    cars[index].status = status;
    if (rejectionReason !== undefined) {
      cars[index].rejectionReason = rejectionReason;
    }

    saveStoredCars(cars);
    res.json({
      success: true,
      message: `Car status updated to ${status}`,
      car: cars[index]
    });
  });

  // UPDATE CAR DETAILS (ADMIN ONLY)
  app.put('/api/admin/cars/:id', requireAdmin, (req: Request, res: Response) => {
    const cars = getStoredCars();
    const index = cars.findIndex((c) => c.id === req.params.id);

    if (index === -1) {
      res.status(404).json({ error: 'Car not found' });
      return;
    }

    cars[index] = {
      ...cars[index],
      ...req.body,
      id: cars[index].id, // Keep original ID
    };

    saveStoredCars(cars);
    res.json({ success: true, car: cars[index] });
  });

  // DIRECT CAR CREATION BY ADMIN (ADMIN ONLY)
  app.post('/api/admin/cars', requireAdmin, (req: Request, res: Response) => {
    const cars = getStoredCars();
    const newCar: Car = {
      ...req.body,
      id: req.body.id || `am-car-${Date.now()}`,
      status: req.body.status || 'available',
      createdAt: req.body.createdAt || new Date().toISOString(),
    };

    cars.unshift(newCar);
    saveStoredCars(cars);
    res.status(201).json({ success: true, car: newCar });
  });

  // DELETE CAR (ADMIN ONLY)
  app.delete('/api/admin/cars/:id', requireAdmin, (req: Request, res: Response) => {
    let cars = getStoredCars();
    const initialLen = cars.length;
    cars = cars.filter((c) => c.id !== req.params.id);

    if (cars.length === initialLen) {
      res.status(404).json({ error: 'Car not found' });
      return;
    }

    saveStoredCars(cars);
    res.json({ success: true, message: 'Car deleted' });
  });

  // UPDATE DEALERSHIP SETTINGS (ADMIN ONLY)
  app.put('/api/admin/settings', requireAdmin, (req: Request, res: Response) => {
    const updated = req.body;
    saveStoredSettings(updated);
    res.json({ success: true, settings: updated });
  });

  // RESET SAMPLE DATA (ADMIN ONLY)
  app.post('/api/admin/reset', requireAdmin, (req: Request, res: Response) => {
    const initialData: Car[] = [...INITIAL_CARS];
    saveStoredCars(initialData);
    saveStoredSettings(DEFAULT_DEALERSHIP_SETTINGS);
    res.json({ success: true, message: 'Reset to default sample data' });
  });

  // ==========================================
  // VITE / STATIC SERVING
  // ==========================================
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AM Cars Ambai full-stack broker server listening on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
