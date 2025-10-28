import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import NGOProfile from '../models/NGOProfile';
import { requireAuth, requireRoles } from '../middleware/auth';

const router = Router();

const uploadDir = process.env.UPLOAD_DIR || 'uploads';
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, path.join(process.cwd(), uploadDir)),
  filename: (_req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });

// Create or update NGO profile (NGO role) - Enhanced with full verification details
router.post('/profile', requireAuth, requireRoles('NGO'), upload.array('documents', 10), async (req, res) => {
  try {
    const { 
      organizationName, 
      registrationNumber,
      yearEstablished,
      website,
      contactPhone, 
      address,
      city,
      state,
      pincode,
      focusAreas,
      description,
      lat, 
      lng 
    } = req.body;

    const documents = (req.files as Express.Multer.File[] | undefined)?.map(f => path.relative(process.cwd(), f.path)) || [];
    const location = (lat && lng) ? { type: 'Point' as const, coordinates: [Number(lng), Number(lat)] } : undefined;
    
    const parsedFocusAreas = focusAreas ? JSON.parse(focusAreas) : [];

    // Build update payload conditionally to support minimal submissions
    const updateData: any = {
      organizationName,
      registrationNumber,
      yearEstablished,
      website,
      contactPhone,
      focusAreas: parsedFocusAreas,
      description,
      verified: false,
      ...(location ? { location } : {})
    };

    // Only set address fields if provided
    if (address || city || state || pincode) {
      const parts = [address, city, state].filter(Boolean).join(', ');
      updateData.address = pincode ? `${parts}${parts ? ' - ' : ''}${pincode}` : parts;
      if (city) updateData.city = city;
      if (state) updateData.state = state;
      if (pincode) updateData.pincode = pincode;
    }

    // Only push documents if any uploaded
    if (documents.length > 0) {
      updateData.$push = { documents: { $each: documents } };
    }

    const profile = await NGOProfile.findOneAndUpdate(
      { user: req.user!.id },
      updateData,
      { upsert: true, new: true }
    );

    res.json({ 
      message: 'NGO profile created successfully. Awaiting admin verification.', 
      profile 
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Legacy endpoint for backward compatibility
router.post('/', requireAuth, requireRoles('NGO'), upload.array('documents', 5), async (req, res) => {
  const { organizationName, address, contactPhone, lat, lng } = req.body;
  const documents = (req.files as Express.Multer.File[] | undefined)?.map(f => path.relative(process.cwd(), f.path)) || [];
  const location = (lat && lng) ? { type: 'Point' as const, coordinates: [Number(lng), Number(lat)] } : undefined;
  const profile = await NGOProfile.findOneAndUpdate(
    { user: req.user!.id },
    { organizationName, address, contactPhone, $push: { documents: { $each: documents } }, ...(location ? { location } : {}) },
    { upsert: true, new: true }
  );
  res.json(profile);
});

// Get own NGO profile
router.get('/me', requireAuth, requireRoles('NGO'), async (req, res) => {
  const profile = await NGOProfile.findOne({ user: req.user!.id });
  res.json(profile);
});

// Public: list verified NGOs nearby
router.get('/nearby', async (req, res) => {
  const { lat, lng, radiusKm = '10' } = req.query as any;
  if (!lat || !lng) return res.status(400).json({ error: 'lat,lng required' });
  const meters = Number(radiusKm) * 1000;
  const ngos = await NGOProfile.find({
    verified: true,
    location: {
      $near: {
        $geometry: { type: 'Point', coordinates: [Number(lng), Number(lat)] },
        $maxDistance: meters,
      }
    }
  })
    .select('user organizationName address contactPhone location verified focusAreas description')
    .populate('user', 'email name'); // Populate user email and name for display
  res.json(ngos);
});

export default router;
