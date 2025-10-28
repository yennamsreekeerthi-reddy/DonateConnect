import { Router } from 'express';
import { requireAuth, requireRoles } from '../middleware/auth';
import NGOProfile from '../models/NGOProfile';

const router = Router();

// Get all pending NGO verifications
router.get('/ngos/pending', requireAuth, requireRoles('ADMIN'), async (_req, res) => {
  const ngos = await NGOProfile.find({ 
    $or: [
      { verified: false },
      { verificationStatus: 'PENDING' }
    ]
  }).populate('user', 'name email');
  res.json(ngos);
});

// Get all verified NGOs
router.get('/ngos/verified', requireAuth, requireRoles('ADMIN'), async (_req, res) => {
  const ngos = await NGOProfile.find({ 
    verified: true,
    verificationStatus: 'APPROVED'
  }).populate('user', 'name email');
  res.json(ngos);
});

// Get all rejected NGOs
router.get('/ngos/rejected', requireAuth, requireRoles('ADMIN'), async (_req, res) => {
  const ngos = await NGOProfile.find({ 
    verificationStatus: 'REJECTED'
  }).populate('user', 'name email');
  res.json(ngos);
});

// Get NGO profile details for verification
router.get('/ngos/:id', requireAuth, requireRoles('ADMIN'), async (req, res) => {
  const profile = await NGOProfile.findById(req.params.id).populate('user', 'name email');
  if (!profile) {
    return res.status(404).json({ error: 'NGO profile not found' });
  }
  res.json(profile);
});

// Approve NGO verification
router.post('/ngos/:id/verify', requireAuth, requireRoles('ADMIN'), async (req, res) => {
  const { notes } = req.body;
  const profile = await NGOProfile.findByIdAndUpdate(
    req.params.id, 
    { 
      verified: true,
      verificationStatus: 'APPROVED',
      verificationNotes: notes || 'Verified by admin'
    }, 
    { new: true }
  ).populate('user', 'name email');
  
  if (!profile) {
    return res.status(404).json({ error: 'NGO profile not found' });
  }
  
  res.json({ 
    message: 'NGO verified successfully', 
    profile 
  });
});

// Reject NGO verification
router.post('/ngos/:id/reject', requireAuth, requireRoles('ADMIN'), async (req, res) => {
  const { reason } = req.body;
  const profile = await NGOProfile.findByIdAndUpdate(
    req.params.id, 
    { 
      verified: false,
      verificationStatus: 'REJECTED',
      verificationNotes: reason || 'Verification rejected by admin'
    }, 
    { new: true }
  ).populate('user', 'name email');
  
  if (!profile) {
    return res.status(404).json({ error: 'NGO profile not found' });
  }
  
  res.json({ 
    message: 'NGO verification rejected', 
    profile 
  });
});

export default router;
