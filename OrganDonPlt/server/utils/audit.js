import AuditLog from '../models/AuditLog.js';

export const createAuditLog = async ({ action, actor, entity, metadata }) => {
  try {
    await AuditLog.create({
      action,
      actor: actor
        ? {
            id: actor._id,
            name: actor.name,
            role: actor.role
          }
        : undefined,
      entity: entity
        ? {
            type: entity.type,
            id: entity.id?.toString(),
            name: entity.name
          }
        : undefined,
      metadata
    });
  } catch (error) {
    console.error('Failed to create audit log', error);
  }
};

export const fetchRecentLogs = async (limit = 20) => {
  return AuditLog.find().sort({ createdAt: -1 }).limit(limit).lean();
};
