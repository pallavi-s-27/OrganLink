import mongoose from 'mongoose';

const donationSchema = new mongoose.Schema(
  {
    donor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    organType: { type: String, required: true },
    hospital: String,
    preservationHours: { type: Number, default: 24 },
    notes: String,
    status: {
      type: String,
      enum: ['available', 'reserved', 'allocated', 'expired'],
      default: 'available'
    }
  },
  { timestamps: true }
);

const Donation = mongoose.model('Donation', donationSchema);

export default Donation;
