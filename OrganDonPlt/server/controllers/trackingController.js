import dayjs from 'dayjs';
import Transport from '../models/Transport.js';

export const listShipments = async (req, res) => {
  const transports = await Transport.find().sort({ updatedAt: -1 }).limit(6).lean();

  if (!transports.length) {
    return res.json([
      {
        _id: 'demo-1',
        organType: 'Heart',
        courier: 'SkyBridge Medical',
        eta: '42 mins',
        currentLocation: { lat: 40.7128, lng: -74.006 },
        hospital: {
          name: 'Mount Sinai Hospital',
          coordinates: { lat: 40.7901, lng: -73.9533 }
        },
        route: [
          { lat: 40.6413, lng: -73.7781 },
          { lat: 40.6782, lng: -73.9442 },
          { lat: 40.7128, lng: -74.006 }
        ],
        timeline: [
          {
            id: 'tl-1',
            title: 'Organ recovered',
            description: 'Donor procedure completed at Mercy General',
            status: 'approved',
            timestamp: dayjs().subtract(3, 'hour').toISOString()
          },
          {
            id: 'tl-2',
            title: 'Courier departed',
            description: 'Air ambulance enroute to recipient city',
            status: 'in_transit',
            timestamp: dayjs().subtract(110, 'minute').toISOString()
          },
          {
            id: 'tl-3',
            title: 'Traffic advisory',
            description: 'Surface route optimized with hospital security escort',
            status: 'in_transit',
            timestamp: dayjs().subtract(25, 'minute').toISOString()
          }
        ]
      }
    ]);
  }

  res.json(
    transports.map((transport) => ({
      _id: transport._id,
      organType: transport.organType ?? 'Organ',
      courier: transport.courier,
      eta: transport.eta,
      currentLocation: transport.currentLocation,
      hospital: transport.hospital,
      route: transport.route,
      timeline: transport.timeline?.map((item, index) => ({
        ...item,
        id: item.id ?? `${transport._id}-${index}`
      })) ?? []
    }))
  );
};
