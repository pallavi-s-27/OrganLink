import mongoose from 'mongoose';

const organRequestSchema = new mongoose.Schema(
  {
    organType: { type: String, required: true },
    urgency: { type: Number, min: 1, max: 10, default: 5 },
    notes: String,
    hospital: String,
    status: {
      type: String,
      enum: ['pending', 'review', 'approved', 'in_transit', 'delivered', 'rejected'],
      default: 'pending'
    },
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    donor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    matchScore: Number,
    requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
  },
  { timestamps: true }
);

organRequestSchema.virtual('urgencyLabel').get(function urgencyLabel() {
  if (this.urgency >= 8) return 'Critical';
  if (this.urgency >= 5) return 'High';
  if (this.urgency >= 3) return 'Moderate';
  return 'Low';
});

const OrganRequest = mongoose.model('OrganRequest', organRequestSchema);

export default OrganRequest;
