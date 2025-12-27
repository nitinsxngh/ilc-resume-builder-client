/**
 * Resume Mongoose Model for Vercel/Next.js
 */

import mongoose, { Schema, Model, Document } from 'mongoose';

export interface IVerification {
  isVerified: boolean;
  verifiedBy?: string;
  verificationDate?: string;
  verifiedFields?: string[];
  confidence?: number;
  verifiedData?: {
    name?: string;
    email?: string;
    phone?: string;
    aadhaar?: string;
    pan?: string;
    address?: string;
  };
}

export interface IResume extends Document {
  userId: string;
  title: string;
  template: string;
  theme: string;
  basics: {
    name?: string;
    label?: string;
    image?: string;
    email?: string;
    phone?: string;
    url?: string;
    summary?: string;
    location?: {
      address?: string;
      postalCode?: string;
      city?: string;
      countryCode?: string;
      region?: string;
    };
    relExp?: string;
    totalExp?: string;
    objective?: string;
    profiles?: Array<{
      network: string;
      username: string;
      url: string;
    }>;
  };
  skills: {
    languages?: Array<{ name: string; level: number }>;
    frameworks?: Array<{ name: string; level: number }>;
    libraries?: Array<{ name: string; level: number }>;
    databases?: Array<{ name: string; level: number }>;
    technologies?: Array<{ name: string; level: number }>;
    practices?: Array<{ name: string; level: number }>;
    tools?: Array<{ name: string; level: number }>;
  };
  work?: Array<{
    company?: string;
    position?: string;
    website?: string;
    startDate?: string;
    endDate?: string;
    summary?: string;
    highlights?: string[];
  }>;
  education?: Array<{
    institution?: string;
    url?: string;
    area?: string;
    studyType?: string;
    startDate?: string;
    endDate?: string;
    score?: string;
    courses?: string[];
  }>;
  activities?: {
    involvements?: string;
    achievements?: string;
  };
  volunteer?: Array<{
    organization?: string;
    position?: string;
    website?: string;
    startDate?: string;
    endDate?: string;
    summary?: string;
    highlights?: string[];
  }>;
  awards?: Array<{
    title?: string;
    date?: string;
    awarder?: string;
    summary?: string;
  }>;
  labels?: {
    labels?: string[];
  };
  isPublic: boolean;
  isDefault: boolean;
  verification?: IVerification;
  createdAt?: Date;
  updatedAt?: Date;
}

const verificationSchema = new Schema<IVerification>({
  isVerified: { type: Boolean, default: false },
  verifiedBy: { type: String, default: null },
  verificationDate: { type: String, default: null },
  verifiedFields: { type: [String], default: [] },
  confidence: { type: Number, default: 0 },
  verifiedData: {
    name: String,
    email: String,
    phone: String,
    aadhaar: String,
    pan: String,
    address: String
  }
}, { _id: false });

const resumeSchema = new Schema<IResume>({
  userId: { type: String, required: true, index: true },
  title: { type: String, default: 'My Resume' },
  template: { type: String, default: 'professional' },
  theme: { type: String, default: 'default' },
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
  isPublic: { type: Boolean, default: false },
  isDefault: { type: Boolean, default: false },
  verification: { type: verificationSchema, default: null }
}, {
  timestamps: true
});

// Indexes
resumeSchema.index({ userId: 1, isDefault: 1 });
resumeSchema.index({ userId: 1, isPublic: 1 });

// Ensure only one default resume per user
resumeSchema.pre('save', async function(next) {
  if (this.isDefault && this.isNew) {
    await (this.constructor as Model<IResume>).updateMany(
      { userId: this.userId, isDefault: true },
      { $set: { isDefault: false } }
    );
  }
  next();
});

const Resume: Model<IResume> = mongoose.models.Resume || mongoose.model<IResume>('Resume', resumeSchema);

export default Resume;

