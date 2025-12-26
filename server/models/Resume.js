const mongoose = require('mongoose');

const verificationSchema = new mongoose.Schema({
  isVerified: {
    type: Boolean,
    default: false
  },
  verifiedBy: {
    type: String,
    default: null
  },
  verificationDate: {
    type: String,
    default: null
  },
  verifiedFields: {
    type: [String],
    default: []
  },
  confidence: {
    type: Number,
    default: 0
  },
  verifiedData: {
    name: String,
    email: String,
    phone: String,
    aadhaar: String,
    pan: String,
    address: String
  }
}, { _id: false });

const resumeSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  title: {
    type: String,
    default: 'My Resume'
  },
  template: {
    type: String,
    default: 'professional'
  },
  theme: {
    type: String,
    default: 'default'
  },
  basics: {
    name: String,
    label: String,
    image: String,
    email: String,
    phone: String,
    url: String,
    summary: String,
    location: {
      address: String,
      postalCode: String,
      city: String,
      countryCode: String,
      region: String
    },
    relExp: String,
    totalExp: String,
    objective: String,
    profiles: [{
      network: String,
      username: String,
      url: String
    }]
  },
  skills: {
    languages: [{ name: String, level: Number }],
    frameworks: [{ name: String, level: Number }],
    libraries: [{ name: String, level: Number }],
    databases: [{ name: String, level: Number }],
    technologies: [{ name: String, level: Number }],
    practices: [{ name: String, level: Number }],
    tools: [{ name: String, level: Number }]
  },
  work: [{
    company: String,
    position: String,
    website: String,
    startDate: String,
    endDate: String,
    summary: String,
    highlights: [String]
  }],
  education: [{
    institution: String,
    url: String,
    area: String,
    studyType: String,
    startDate: String,
    endDate: String,
    score: String,
    courses: [String]
  }],
  activities: {
    involvements: String,
    achievements: String
  },
  volunteer: [{
    organization: String,
    position: String,
    website: String,
    startDate: String,
    endDate: String,
    summary: String,
    highlights: [String]
  }],
  awards: [{
    title: String,
    date: String,
    awarder: String,
    summary: String
  }],
  labels: {
    labels: [String]
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  isDefault: {
    type: Boolean,
    default: false
  },
  verification: {
    type: verificationSchema,
    default: null
  }
}, {
  timestamps: true
});

// Indexes
resumeSchema.index({ userId: 1, isDefault: 1 });
resumeSchema.index({ userId: 1, isPublic: 1 });

// Ensure only one default resume per user
resumeSchema.pre('save', async function(next) {
  if (this.isDefault && this.isNew) {
    await this.constructor.updateMany(
      { userId: this.userId, isDefault: true },
      { $set: { isDefault: false } }
    );
  }
  next();
});

module.exports = mongoose.model('Resume', resumeSchema);

