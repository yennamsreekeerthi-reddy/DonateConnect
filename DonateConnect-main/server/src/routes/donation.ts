import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { requireAuth, requireRoles } from '../middleware/auth';
import Donation from '../models/Donation';
import NGOProfile from '../models/NGOProfile';

const router = Router();

// Optional auth middleware - extracts user if token present
const optionalAuth = (req: any, res: any, next: any) => {
  const header = req.headers.authorization;
  if (!header) {
    return next(); // No token, continue as guest
  }
  
  try {
    const jwt = require('jsonwebtoken');
    const token = header.replace('Bearer ', '');
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'changeme');
    req.user = payload;
  } catch (e) {
    // Invalid token, continue as guest
  }
  next();
};

// Create a donation (donor) - Allow both authenticated and guest donations
router.post('/',
  optionalAuth, // Use optional auth to capture user if logged in
  body('type').isIn(['BOOKS', 'CLOTHES', 'FOOD', 'MONEY', 'OTHER']),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          message: 'Validation failed', 
          errors: errors.array() 
        });
      }

      // Build donation data
      const donationData: any = {
        donor: req.user?.id || null, // Allow null for guest donations
        type: req.body.type,
        description: req.body.description,
        status: req.body.status || 'PENDING', // Allow custom status
      };

      console.log('🔐 Creating donation for user:', req.user?.id || 'GUEST');
      console.log('📝 Donation data:', donationData);

      // Add ngoId if provided (optional)
      if (req.body.ngoId) {
        donationData.ngo = req.body.ngoId;
      }

      // Add amount for MONEY donations
      if (req.body.type === 'MONEY' && req.body.amount) {
        donationData.amount = req.body.amount;
      }

      // Add quantity for non-money donations
      if (req.body.quantity) {
        donationData.quantity = req.body.quantity;
      }

      // Handle pickup information
      if (req.body.pickupRequired !== undefined) {
        donationData.pickupRequired = req.body.pickupRequired;
        
        if (req.body.pickupRequired) {
          donationData.pickupOption = 'HOME_PICKUP';
          donationData.pickupAddress = req.body.pickupAddress;
        } else {
          donationData.pickupOption = 'DROP_OFF';
        }
      }

      // Legacy support for old field names
      if (req.body.pickupOption) {
        donationData.pickupOption = req.body.pickupOption;
      }
      if (req.body.address) {
        donationData.address = req.body.address;
      }
      if (req.body.pickupDate) {
        donationData.pickupDate = req.body.pickupDate;
      }
      if (req.body.contactPhone) {
        donationData.contactPhone = req.body.contactPhone;
      }

      // Add payment information if provided
      if (req.body.paymentMethod) {
        donationData.paymentMethod = req.body.paymentMethod;
      }
      if (req.body.transactionId) {
        donationData.transactionId = req.body.transactionId;
      }
      if (req.body.paymentDetails) {
        donationData.paymentDetails = req.body.paymentDetails;
      }
      if (req.body.status === 'COMPLETED') {
        donationData.paidAt = new Date();
        donationData.paymentAmount = req.body.amount;
      }

      const donation = await Donation.create(donationData);
      
      // Populate NGO details if ngoId was provided
      const populatedDonation = await Donation.findById(donation._id).populate('ngo', 'organizationName email');
      
      res.status(201).json({ 
        message: 'Donation created successfully',
        donation: populatedDonation 
      });
    } catch (error: any) {
      console.error('Donation creation error:', error);
      res.status(500).json({ 
        message: 'Failed to create donation', 
        error: error.message 
      });
    }
  }
);

// Donor: my donations
router.get('/mine', requireAuth, requireRoles('DONOR'), async (req, res) => {
  try {
    const donations = await Donation.find({ donor: req.user!.id })
      .sort({ createdAt: -1 })
      .lean();

    // Manually populate NGO details by fetching NGOProfile data
    const donationsWithNGO = await Promise.all(
      donations.map(async (donation) => {
        if (donation.ngo) {
          // Try to find NGOProfile by the ngo field (which might be NGOProfile._id or User._id)
          let ngoProfile = await NGOProfile.findById(donation.ngo).lean();
          
          // If not found, try to find by user field (in case ngo is a User ID)
          if (!ngoProfile) {
            ngoProfile = await NGOProfile.findOne({ user: donation.ngo }).lean();
          }

          if (ngoProfile) {
            return {
              ...donation,
              ngo: {
                _id: ngoProfile._id,
                organizationName: ngoProfile.organizationName,
                focusAreas: ngoProfile.focusAreas || [],
                city: ngoProfile.city,
                state: ngoProfile.state,
                address: ngoProfile.address,
                contactPhone: ngoProfile.contactPhone
              }
            };
          }
        }
        return donation;
      })
    );

    res.json(donationsWithNGO);
  } catch (error: any) {
    console.error('Failed to fetch donations:', error);
    res.status(500).json({ 
      message: 'Failed to fetch donations', 
      error: error.message 
    });
  }
});

// NGO: list pending donations to accept
router.get('/pending', requireAuth, requireRoles('NGO'), async (_req, res) => {
  const items = await Donation.find({ status: 'PENDING' }).sort({ createdAt: -1 });
  res.json(items);
});

// NGO: accept a donation (assign to self)
router.post('/:id/accept', requireAuth, requireRoles('NGO'), async (req, res) => {
  const donation = await Donation.findByIdAndUpdate(
    req.params.id,
    { status: 'ACCEPTED', ngo: (req.user as any).id },
    { new: true }
  );
  res.json(donation);
});

// NGO: update status (PICKED_UP / DELIVERED)
router.post('/:id/status', requireAuth, requireRoles('NGO'), body('status').isIn(['PICKED_UP', 'DELIVERED']), async (req, res) => {
  const donation = await Donation.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true }
  );
  res.json(donation);
});

// Donor: Confirm payment for a donation
router.patch('/:id/payment', requireAuth, requireRoles('DONOR'), async (req, res) => {
  try {
    const { donationId, paymentMethod, amount, status, transactionId, paymentDetails } = req.body;

    // Update donation status to COMPLETED
    const donation = await Donation.findByIdAndUpdate(
      req.params.id,
      { 
        status: status || 'COMPLETED',
        paymentMethod,
        paymentAmount: amount,
        transactionId,
        paymentDetails,
        paidAt: new Date()
      },
      { new: true }
    ).populate('ngo', 'name organizationName email');

    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }

    res.json({ 
      message: 'Payment confirmed successfully',
      donation 
    });
  } catch (error: any) {
    console.error('Payment confirmation error:', error);
    res.status(500).json({ 
      message: 'Failed to confirm payment', 
      error: error.message 
    });
  }
});

export default router;
