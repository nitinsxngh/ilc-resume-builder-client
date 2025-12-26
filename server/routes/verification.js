const express = require('express');
const router = express.Router();
const Resume = require('../models/Resume');

// Save verification data for a resume
router.post('/:id/verification', async (req, res) => {
  try {
    const { id } = req.params;
    const verificationData = req.body;

    const resume = await Resume.findOneAndUpdate(
      { _id: id, userId: req.user.uid },
      { 
        $set: { 
          verification: verificationData,
          updatedAt: new Date()
        }
      },
      { new: true, runValidators: true }
    ).select('-__v');

    if (!resume) {
      return res.status(404).json({
        success: false,
        error: 'Resume not found'
      });
    }

    res.json({
      success: true,
      data: resume
    });
  } catch (error) {
    console.error('Error saving verification data:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to save verification data'
    });
  }
});

// Get verification data for a resume
router.get('/:id/verification', async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      userId: req.user.uid
    }).select('verification');

    if (!resume) {
      return res.status(404).json({
        success: false,
        error: 'Resume not found'
      });
    }

    res.json({
      success: true,
      data: resume.verification || null
    });
  } catch (error) {
    console.error('Error fetching verification data:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch verification data'
    });
  }
});

module.exports = router;

