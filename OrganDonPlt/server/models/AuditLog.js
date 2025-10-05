import mongoose from 'mongoose';

const auditActorSchema = new mongoose.Schema(
  {
    id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: String,
    role: String
  },
  { _id: false }
);

const auditEntitySchema = new mongoose.Schema(
  {
    type: { type: String },
    id: { type: String },
    name: String
  },
  { _id: false }
);

const auditLogSchema = new mongoose.Schema(
  {
    action: { type: String, required: true },
    actor: { type: auditActorSchema, default: undefined },
    entity: { type: auditEntitySchema, default: undefined },
    metadata: { type: mongoose.Schema.Types.Mixed, default: undefined }
  },
  { timestamps: true }
);

const AuditLog = mongoose.model('AuditLog', auditLogSchema);

export default AuditLog;
