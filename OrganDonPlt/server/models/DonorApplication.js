import mongoose from 'mongoose';

const donorApplicationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    city: { type: String, required: true },
    country: { type: String, required: true },
    bloodGroup: { type: String, required: true },
    organType: { type: String, required: true },
    preferredHospital: { type: String },
    availability: { type: String },
    consent: { type: Boolean, default: false },
    notes: { type: String },
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'approved', 'contacted', 'rejected'],
      default: 'pending'
    },
    approvedUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    reviewedAt: Date,
    reviewNotes: String
  },
  { timestamps: true }
);

donorApplicationSchema.index({ email: 1, createdAt: -1 });

const DonorApplication = mongoose.model('DonorApplication', donorApplicationSchema);

export default DonorApplication;
