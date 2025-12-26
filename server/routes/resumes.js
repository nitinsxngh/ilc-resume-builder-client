const express = require('express');
const router = express.Router();
const Resume = require('../models/Resume');

// Get all resumes for the authenticated user
router.get('/', async (req, res) => {
  try {
    const resumes = await Resume.find({ userId: req.user.uid })
      .sort({ updatedAt: -1 })
      .select('-__v');
    
    res.json({
      success: true,
      data: resumes,
      count: resumes.length
    });
  } catch (error) {
    console.error('Error fetching resumes:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch resumes'
    });
  }
});

// Get default resume for the authenticated user
router.get('/default', async (req, res) => {
  try {
    let resume = await Resume.findOne({ 
      userId: req.user.uid, 
      isDefault: true 
    }).select('-__v');

    // If no default resume, get the most recently updated one
    if (!resume) {
      resume = await Resume.findOne({ userId: req.user.uid })
        .sort({ updatedAt: -1 })
        .select('-__v');
    }

    if (!resume) {
      return res.json({
        success: true,
        data: null,
        message: 'No resume found'
      });
    }

    res.json({
      success: true,
      data: resume
    });
  } catch (error) {
    console.error('Error fetching default resume:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch default resume'
    });
  }
});

// Get a specific resume by ID
router.get('/:id', async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      userId: req.user.uid
    }).select('-__v');

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
    console.error('Error fetching resume:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch resume'
    });
  }
});

// Create a new resume
router.post('/', async (req, res) => {
  try {
    const resumeData = {
      ...req.body,
      userId: req.user.uid
    };

    // If this is set as default, unset other defaults
    if (resumeData.isDefault) {
      await Resume.updateMany(
        { userId: req.user.uid, isDefault: true },
        { $set: { isDefault: false } }
      );
    }

    const resume = new Resume(resumeData);
    await resume.save();

    res.status(201).json({
      success: true,
      data: resume
    });
  } catch (error) {
    console.error('Error creating resume:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create resume'
    });
  }
});

// Update an entire resume
router.put('/:id', async (req, res) => {
  try {
    const resume = await Resume.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.uid },
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).select('-__v');

    if (!resume) {
      return res.status(404).json({
        success: false,
        error: 'Resume not found'
      });
    }

    // If this is set as default, unset other defaults
    if (req.body.isDefault) {
      await Resume.updateMany(
        { userId: req.user.uid, isDefault: true, _id: { $ne: req.params.id } },
        { $set: { isDefault: false } }
      );
    }

    res.json({
      success: true,
      data: resume
    });
  } catch (error) {
    console.error('Error updating resume:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update resume'
    });
  }
});

// Update a specific section of a resume
router.patch('/:id/:section', async (req, res) => {
  try {
    const { id, section } = req.params;
    const updateData = { [`${section}`]: req.body, updatedAt: new Date() };

    const resume = await Resume.findOneAndUpdate(
      { _id: id, userId: req.user.uid },
      { $set: updateData },
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
    console.error('Error updating resume section:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update resume section'
    });
  }
});

// Delete a resume
router.delete('/:id', async (req, res) => {
  try {
    const resume = await Resume.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.uid
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        error: 'Resume not found'
      });
    }

    res.json({
      success: true,
      message: 'Resume deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting resume:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete resume'
    });
  }
});

// Duplicate a resume
router.post('/:id/duplicate', async (req, res) => {
  try {
    const originalResume = await Resume.findOne({
      _id: req.params.id,
      userId: req.user.uid
    });

    if (!originalResume) {
      return res.status(404).json({
        success: false,
        error: 'Resume not found'
      });
    }

    const duplicateData = originalResume.toObject();
    delete duplicateData._id;
    delete duplicateData.createdAt;
    delete duplicateData.updatedAt;
    duplicateData.title = `${duplicateData.title} (Copy)`;
    duplicateData.isDefault = false;

    const duplicate = new Resume(duplicateData);
    await duplicate.save();

    res.status(201).json({
      success: true,
      data: duplicate
    });
  } catch (error) {
    console.error('Error duplicating resume:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to duplicate resume'
    });
  }
});

// Set a resume as default
router.post('/:id/set-default', async (req, res) => {
  try {
    // Unset all other defaults for this user
    await Resume.updateMany(
      { userId: req.user.uid, isDefault: true },
      { $set: { isDefault: false } }
    );

    // Set this resume as default
    const resume = await Resume.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.uid },
      { $set: { isDefault: true } },
      { new: true }
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
    console.error('Error setting default resume:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to set default resume'
    });
  }
});

// Get resume statistics
router.get('/stats/overview', async (req, res) => {
  try {
    const userId = req.user.uid;
    
    const totalResumes = await Resume.countDocuments({ userId });
    const publicResumes = await Resume.countDocuments({ userId, isPublic: true });
    const defaultResume = await Resume.countDocuments({ userId, isDefault: true });
    const lastModified = await Resume.findOne({ userId })
      .sort({ updatedAt: -1 })
      .select('updatedAt');

    res.json({
      success: true,
      data: {
        totalResumes,
        publicResumes,
        defaultResume,
        lastModified: lastModified?.updatedAt || null
      }
    });
  } catch (error) {
    console.error('Error fetching resume stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch resume statistics'
    });
  }
});

// Get public resume by ID
router.get('/public/:id', async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      isPublic: true
    }).select('-__v');

    if (!resume) {
      return res.status(404).json({
        success: false,
        error: 'Resume not found or not public'
      });
    }

    res.json({
      success: true,
      data: resume
    });
  } catch (error) {
    console.error('Error fetching public resume:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch public resume'
    });
  }
});

// Search public resumes
router.get('/public/search', async (req, res) => {
  try {
    const query = req.query.q || '';
    const limit = parseInt(req.query.limit) || 10;

    const searchRegex = new RegExp(query, 'i');
    const resumes = await Resume.find({
      isPublic: true,
      $or: [
        { 'basics.name': searchRegex },
        { 'basics.label': searchRegex },
        { 'basics.summary': searchRegex },
        { title: searchRegex }
      ]
    })
      .limit(limit)
      .select('-__v')
      .sort({ updatedAt: -1 });

    res.json({
      success: true,
      data: resumes,
      count: resumes.length
    });
  } catch (error) {
    console.error('Error searching public resumes:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to search public resumes'
    });
  }
});

module.exports = router;

