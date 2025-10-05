import mongoose from 'mongoose';

const approvalSchema = new mongoose.Schema(
  {
    organRequest: { type: mongoose.Schema.Types.ObjectId, ref: 'OrganRequest', required: true },
    donorName: String,
    recipientName: String,
    organType: String,
    requestedBy: String,
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    }
  },
  { timestamps: true }
);

const Approval = mongoose.model('Approval', approvalSchema);

export default Approval;
