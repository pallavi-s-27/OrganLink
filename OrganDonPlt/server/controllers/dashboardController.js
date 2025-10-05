import dayjs from 'dayjs';
import User from '../models/User.js';
import OrganRequest from '../models/OrganRequest.js';
import Transport from '../models/Transport.js';

const buildTrend = async () => {
  const start = dayjs().subtract(6, 'day').startOf('day');
  const pipeline = [
    {
      $match: {
        createdAt: { $gte: start.toDate() },
        status: { $in: ['approved', 'in_transit', 'delivered'] }
      }
    },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        total: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ];

  const result = await OrganRequest.aggregate(pipeline);
  const map = new Map(result.map((entry) => [entry._id, entry.total]));

  return Array.from({ length: 7 }).map((_, index) => {
    const day = start.add(index, 'day');
    const key = day.format('YYYY-MM-DD');
    return {
      label: day.format('DD MMM'),
      value: map.get(key) ?? 0
    };
  });
};

export const getOverview = async (req, res) => {
  const [donorsCount, recipientsCount, inTransit, delivered, activeMatches, transports, trend] = await Promise.all([
    User.countDocuments({ role: 'donor' }),
    User.countDocuments({ role: 'recipient' }),
    OrganRequest.countDocuments({ status: 'in_transit' }),
    OrganRequest.countDocuments({ status: 'delivered' }),
    OrganRequest.find({ status: { $in: ['approved', 'in_transit'] } })
      .populate('donor', 'name')
      .populate('recipient', 'name')
      .sort({ updatedAt: -1 })
      .limit(8)
      .lean({ virtuals: true }),
    Transport.find().sort({ updatedAt: -1 }).limit(1).lean(),
    buildTrend()
  ]);

  const stats = [
    {
      key: 'donors',
      value: donorsCount,
      change: '+8% vs last week'
    },
    {
      key: 'recipients',
      value: recipientsCount,
      change: '-3% vs last week'
    },
    {
      key: 'inTransit',
      value: inTransit,
      change: '+2 ongoing'
    },
    {
      key: 'successRate',
      value: recipientsCount ? `${Math.round((delivered / Math.max(recipientsCount, 1)) * 100)}%` : '0%',
      change: '+4% vs last week'
    }
  ];

  const formattedMatches = activeMatches.map((match) => ({
    id: match._id,
    donorId: match.donor?._id?.toString() ?? null,
    donorName: match.donor?.name ?? 'Pending assignment',
    recipientId: match.recipient?._id?.toString() ?? null,
    recipientName: match.recipient?.name ?? 'Unknown',
    organType: match.organType,
    hospital: match.hospital || 'Not set',
    status: match.status,
    updatedAt: match.updatedAt
  }));

  const transport = transports[0] ?? {
    courier: 'Unknown',
    eta: '45 mins',
    currentLocation: { lat: 19.076, lng: 72.8777 },
    route: [],
    hospital: {
      name: 'Awaiting assignment',
      coordinates: null
    },
    timeline: []
  };

  const fallbackTimeline = transport.timeline?.length
    ? transport.timeline
    : [
        {
          title: 'Organ recovered',
          status: 'approved',
          description: 'Donor organ preserved and sealed at source hospital',
          timestamp: dayjs().subtract(3, 'hour').toISOString()
        },
        {
          title: 'Courier dispatched',
          status: 'in_transit',
          description: 'Specialized courier departed via air transport',
          timestamp: dayjs().subtract(2, 'hour').toISOString()
        },
        {
          title: 'ETA updated',
          status: 'in_transit',
          description: 'Weather clearance confirmed, arrival window unchanged',
          timestamp: dayjs().subtract(30, 'minute').toISOString()
        }
      ];

  res.json({
    stats,
    activeMatches: formattedMatches,
    transports: [{
      courier: transport.courier ?? 'Specialist Courier',
      eta: transport.eta ?? '45 mins',
      currentLocation: transport.currentLocation ?? { lat: 19.076, lng: 72.8777 },
      route: transport.route ?? [],
      hospital: transport.hospital ?? { name: 'Recipient hospital', coordinates: null },
      timeline: fallbackTimeline
    }],
    timeline: fallbackTimeline,
    trend
  });
};
