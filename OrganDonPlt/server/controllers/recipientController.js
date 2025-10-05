import User from '../models/User.js';

export const listRecipients = async (req, res) => {
  const recipients = await User.find({ role: 'recipient' })
    .select('name email bloodGroup organType urgency organization city country createdAt')
    .sort({ createdAt: -1 });
  res.json(
    recipients.map((recipient) => ({
      id: recipient._id,
      name: recipient.name,
      email: recipient.email,
      bloodGroup: recipient.bloodGroup,
      organType: recipient.organType,
      urgency: recipient.urgency,
      organization: recipient.organization,
      city: recipient.city,
      country: recipient.country,
      createdAt: recipient.createdAt
    }))
  );
};
