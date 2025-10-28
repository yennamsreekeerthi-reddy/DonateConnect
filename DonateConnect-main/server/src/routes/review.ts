import express from 'express';
import Review from '../models/Review';

const router = express.Router();

// Get all reviews (verified first, then new ones)
router.get('/', async (req, res) => {
  try {
    // Disable caching for this endpoint
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    
    const reviews = await Review.find()
      .sort({ verified: -1, createdAt: -1 })
      .limit(50);
    
    res.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

// Submit a new review
router.post('/', async (req, res) => {
  try {
    const { name, role, rating, text } = req.body;

    // Validation
    if (!name || !role || !rating || !text) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    const validRoles = ['Individual Donor', 'Corporate Donor', 'NGO Representative', 'Volunteer'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    // Create new review
    const review = new Review({
      name,
      role,
      rating,
      text,
      verified: false // New reviews are unverified by default
    });

    await review.save();

    res.status(201).json(review);
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ error: 'Failed to submit review' });
  }
});

// Admin: Verify a review (you can add auth middleware later)
router.patch('/:id/verify', async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { verified: true },
      { new: true }
    );

    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    res.json(review);
  } catch (error) {
    console.error('Error verifying review:', error);
    res.status(500).json({ error: 'Failed to verify review' });
  }
});

// Admin: Delete a review (you can add auth middleware later)
router.delete('/:id', async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);

    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ error: 'Failed to delete review' });
  }
});

export default router;
