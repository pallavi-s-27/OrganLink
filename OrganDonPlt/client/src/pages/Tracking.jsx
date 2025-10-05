import { useEffect, useMemo, useState } from 'react';
import PageHeader from '../components/PageHeader';
import MapTracker from '../components/MapTracker';
import Timeline from '../components/Timeline';
import api from '../services/api';
import toast from 'react-hot-toast';
import clsx from 'classnames';

const TrackingPage = () => {
  const [shipments, setShipments] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchShipments = async () => {
    try {
      const { data } = await api.get('/tracking/shipments');
      setShipments(data);
      setActiveId(data[0]?._id ?? null);
    } catch (error) {
      console.error(error);
      toast.error('Unable to load tracking data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShipments();
    const interval = setInterval(fetchShipments, 20000);
    return () => clearInterval(interval);
  }, []);

  const activeShipment = useMemo(() => shipments.find((shipment) => shipment._id === activeId), [activeId, shipments]);

  if (loading) {
    return (
      <div className="glass-panel grid place-items-center rounded-3xl py-24">
        <div className="h-14 w-14 animate-spin rounded-full border-4 border-brand-500/30 border-t-brand-500" />
      </div>
    );
  }

  if (!shipments.length) {
    return (
      <div className="glass-panel rounded-3xl p-10 text-center text-white/70">
        <PageHeader title="No active transports" description="New transports will display here in real time." />
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <PageHeader
        title="Courier telemetry"
        description="Monitor real-time courier position, ETA windows, and compliance checkpoints."
      />

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="space-y-4 lg:col-span-2">
          <div className="glass-panel rounded-3xl p-4">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-white/60">Active transports</h3>
            <div className="mt-4 space-y-2">
              {shipments.map((shipment) => (
                <button
                  type="button"
                  key={shipment._id}
                  onClick={() => setActiveId(shipment._id)}
                  className={clsx(
                    'w-full rounded-2xl px-4 py-3 text-left transition',
                    shipment._id === activeId ? 'bg-brand-500/20 text-white' : 'bg-white/5 text-white/70 hover:bg-white/10'
                  )}
                >
                  <p className="text-sm font-semibold">{shipment.organType}</p>
                  <p className="text-xs text-white/50">Courier: {shipment.courier}</p>
                  <p className="text-xs text-white/50">ETA · {shipment.eta}</p>
                </button>
              ))}
            </div>
          </div>
          <div className="glass-panel rounded-3xl p-4">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-white/60">Compliance checks</h3>
            <ul className="mt-3 space-y-2 text-sm text-white/70">
              <li>✔ Temperature within safe range</li>
              <li>✔ Chain of custody validated</li>
              <li>✔ GPS beacon active (refresh every 20s)</li>
            </ul>
          </div>
        </div>
        <div className="lg:col-span-3 space-y-4">
          {activeShipment ? (
            <>
              <MapTracker
                position={activeShipment.currentLocation}
                path={activeShipment.route}
                hospital={activeShipment.hospital}
              />
              <div className="glass-panel rounded-3xl p-6">
                <h3 className="text-lg font-semibold text-white">Transport timeline</h3>
                <p className="text-sm text-white/60">Live telemetry from dispatch to handoff.</p>
                <div className="mt-6">
                  <Timeline data={activeShipment.timeline} />
                </div>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default TrackingPage;
