import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: ['donor', 'recipient', 'doctor', 'admin'],
      default: 'donor'
    },
    phone: String,
    organization: String,
    city: String,
    country: String,
    bloodGroup: String,
    organType: String,
    urgency: Number,
    lastLoginAt: Date
  },
  { timestamps: true }
);

userSchema.pre('save', async function preSave(next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  return next();
});

userSchema.methods.comparePassword = async function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

userSchema.methods.toSafeObject = function toSafeObject() {
  const { password, __v, ...rest } = this.toObject({ versionKey: false });
  return rest;
};

const User = mongoose.model('User', userSchema);

export default User;
