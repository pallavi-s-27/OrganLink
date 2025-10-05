import mongoose from 'mongoose';

const waypointSchema = new mongoose.Schema(
  {
    lat: Number,
    lng: Number,
    timestamp: { type: Date, default: Date.now }
  },
  { _id: false }
);

const timelineSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    status: String,
    timestamp: { type: Date, default: Date.now }
  },
  { _id: false }
);

const transportSchema = new mongoose.Schema(
  {
    organRequest: { type: mongoose.Schema.Types.ObjectId, ref: 'OrganRequest', required: true },
    organType: String,
    courier: String,
    eta: String,
    hospital: {
      name: String,
      coordinates: {
        lat: Number,
        lng: Number
      }
    },
    currentLocation: {
      lat: { type: Number, default: 19.076 },
      lng: { type: Number, default: 72.8777 }
    },
    route: [waypointSchema],
    timeline: [timelineSchema]
  },
  { timestamps: true }
);

const Transport = mongoose.model('Transport', transportSchema);

export default Transport;
