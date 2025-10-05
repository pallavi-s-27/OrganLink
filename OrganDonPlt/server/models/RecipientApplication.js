import mongoose from 'mongoose';

const recipientApplicationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    city: { type: String, required: true },
    country: { type: String, required: true },
    bloodGroup: { type: String, required: true },
    organType: { type: String, required: true },
    urgency: { type: Number, min: 1, max: 10, required: true },
    hospital: { type: String },
    diagnosis: { type: String },
    notes: { type: String },
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'approved', 'rejected'],
      default: 'pending'
    },
    approvedUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    reviewedAt: Date,
    reviewNotes: String
  },
  { timestamps: true }
);

recipientApplicationSchema.index({ email: 1, createdAt: -1 });

const RecipientApplication = mongoose.model('RecipientApplication', recipientApplicationSchema);

export default RecipientApplication;
