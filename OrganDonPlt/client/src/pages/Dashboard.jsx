import { useEffect, useMemo, useState } from 'react';
import { ArrowTrendingUpIcon, ClockIcon, HeartIcon, UserGroupIcon ,MapIcon} from '@heroicons/react/24/outline';
import PageHeader from '../components/PageHeader';
import StatCard from '../components/StatCard';
import DataTable from '../components/DataTable';
import Timeline from '../components/Timeline';
import MapTracker from '../components/MapTracker';
import api from '../services/api';
import toast from 'react-hot-toast';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useAuth } from '../hooks/useAuth';

const Dashboard = () => {
  const { user } = useAuth();
  const [overview, setOverview] = useState({
    stats: [],
    activeMatches: [],
    transports: [],
    timeline: [],
    trend: []
  });
  const [loading, setLoading] = useState(true);

  const role = user?.role;
  const userId = user?._id?.toString();
  const isAdminOrDoctor = role === 'admin' || role === 'doctor';
  const isDonor = role === 'donor';
  const isRecipient = role === 'recipient';

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const { data } = await api.get('/dashboard/overview');
        setOverview(data);
      } catch (error) {
        console.error(error);
        toast.error('Could not load dashboard data.');
      } finally {
        setLoading(false);
      }
    };

    fetchOverview();
  }, []);

  const matchesColumns = useMemo(() => (
    [
      { key: 'donorName', label: 'Donor' },
      { key: 'recipientName', label: 'Recipient' },
      { key: 'organType', label: 'Organ' },
      { key: 'hospital', label: 'Hospital' },
      { key: 'status', label: 'Status' },
      { key: 'updatedAt', label: 'Updated', format: 'date' }
    ]
  ), []);

  const matchesForRole = useMemo(() => {
    if (isAdminOrDoctor) {
      return overview.activeMatches;
    }
    if (!userId) {
      return [];
    }
    if (isDonor) {
      return overview.activeMatches.filter((match) => match.donorId === userId);
    }
    if (isRecipient) {
      return overview.activeMatches.filter((match) => match.recipientId === userId);
    }
    return [];
  }, [overview.activeMatches, isAdminOrDoctor, isDonor, isRecipient, userId]);

  const personalStats = useMemo(() => {
    if (!(isDonor || isRecipient)) {
      return [];
    }
    const approvedCount = matchesForRole.filter((match) => match.status === 'approved').length;
    const inTransitCount = matchesForRole.filter((match) => match.status === 'in_transit').length;
    const deliveredCount = matchesForRole.filter((match) => match.status === 'delivered').length;
    const totalMatches = matchesForRole.length;

    return [
      {
        key: 'total',
        title: isDonor ? 'Potential recipients matched' : 'Donor offers matched',
        value: totalMatches,
        change: totalMatches ? 'Live matches' : 'No matches yet',
        icon: HeartIcon,
        trend: totalMatches ? 'up' : undefined
      },
      {
        key: 'approved',
        title: 'Awaiting dispatch',
        value: approvedCount,
        change: 'Approved & scheduling',
        icon: ArrowTrendingUpIcon,
        trend: approvedCount ? 'up' : undefined
      },
      {
        key: 'inTransit',
        title: 'En route organs',
        value: inTransitCount,
        change: inTransitCount ? 'Courier active' : 'Idle',
        icon: ClockIcon,
        trend: inTransitCount ? 'up' : undefined
      },
      {
        key: 'delivered',
        title: 'Completed deliveries',
        value: deliveredCount,
        change: deliveredCount ? 'Successfully delivered' : 'Pending delivery',
        icon: UserGroupIcon,
        trend: deliveredCount ? 'up' : undefined
      }
    ];
  }, [isDonor, isRecipient, matchesForRole]);

  const headerTitle = useMemo(() => {
    if (isAdminOrDoctor) {
      return 'Mission Control';
    }
    if (isDonor) {
      return 'Your donor operations';
    }
    if (isRecipient) {
      return 'Your recipient journey';
    }
    return 'Mission Control';
  }, [isAdminOrDoctor, isDonor, isRecipient]);

  const headerDescription = useMemo(() => {
    if (isAdminOrDoctor) {
      return 'Real-time insights into organ availability, transports, and clinical outcomes.';
    }
    if (isDonor) {
      return 'Track your donor matches, logistics progress, and delivery milestones in one place.';
    }
    if (isRecipient) {
      return 'Stay informed about matched donors, courier status, and hospital coordination updates.';
    }
    return 'Real-time insights tailored to your role.';
  }, [isAdminOrDoctor, isDonor, isRecipient]);

  const hasTransportForMember = useMemo(
    () => matchesForRole.some((match) => match.status === 'in_transit'),
    [matchesForRole]
  );

  if (loading) {
    return (
      <div className="glass-panel grid place-items-center rounded-3xl py-24">
        <div className="h-14 w-14 animate-spin rounded-full border-4 border-brand-500/30 border-t-brand-500" />
      </div>
    );
  }

  const transport = overview.transports?.[0] ?? {
    currentLocation: { lat: 18.5204, lng: 73.8567 },
    route: [],
    hospital: { name: 'Recipient hospital', coordinates: null },
    eta: '45 mins'
  };

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8 animate-in px-2 sm:px-4 lg:px-0">
      <div className="relative overflow-hidden">
        {isAdminOrDoctor ? (
          <>
            <div className="absolute -top-20 -left-20 w-40 h-40 bg-brand-500/20 rounded-full blur-3xl animate-pulse hidden lg:block" />
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl animate-pulse delay-1000 hidden lg:block" />
          </>
        ) : null}
        <PageHeader
          title={
            <span className="bg-gradient-to-r from-white via-brand-200 to-purple-200 bg-clip-text text-transparent text-xl sm:text-2xl lg:text-3xl">
              {headerTitle}
            </span>
          }
          description={headerDescription}
        />
      </div>

      {isAdminOrDoctor ? (
        <>
          <div className="grid gap-3 sm:gap-4 lg:gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
            <div className="metric-card group relative">
              <StatCard
                title="Active Donors"
                value={overview.stats.find((item) => item.key === 'donors')?.value ?? 0}
                change={overview.stats.find((item) => item.key === 'donors')?.change ?? '∅'}
                icon={UserGroupIcon}
                trend="up"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-green-500/10 rounded-2xl sm:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <div className="metric-card group relative">
              <StatCard
                title="Recipients Waiting"
                value={overview.stats.find((item) => item.key === 'recipients')?.value ?? 0}
                change={overview.stats.find((item) => item.key === 'recipients')?.change ?? '∅'}
                icon={HeartIcon}
                trend="down"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-rose-500/10 to-pink-500/10 rounded-2xl sm:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <div className="metric-card group relative">
              <StatCard
                title="Organs In Transit"
                value={overview.stats.find((item) => item.key === 'inTransit')?.value ?? 0}
                change={overview.stats.find((item) => item.key === 'inTransit')?.change ?? '∅'}
                icon={ClockIcon}
                trend="up"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-2xl sm:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <div className="metric-card group relative">
              <StatCard
                title="Successful Matches"
                value={overview.stats.find((item) => item.key === 'successRate')?.value ?? '0%'}
                change={overview.stats.find((item) => item.key === 'successRate')?.change ?? '∅'}
                icon={ArrowTrendingUpIcon}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-brand-500/10 to-purple-500/10 rounded-2xl sm:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </div>

          <div className="grid gap-4 sm:gap-6 lg:grid-cols-5">
            <div className="glass-panel-elevated rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:col-span-3 group overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-2">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                    Matches This Week
                  </h3>
                  <p className="text-xs sm:text-sm text-white/60 mt-1">Aggregated view of confirmed pairings</p>
                </div>
                <div className="bg-brand-500/20 p-2 sm:p-3 rounded-xl sm:rounded-2xl self-start sm:self-auto">
                  <ArrowTrendingUpIcon className="h-5 w-5 sm:h-6 sm:w-6 text-brand-300" />
                </div>
              </div>
              <div className="h-48 sm:h-64 relative">
                <div className="absolute inset-0 bg-gradient-to-t from-brand-500/5 to-transparent rounded-xl sm:rounded-2xl" />
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={overview.trend}>
                    <defs>
                      <linearGradient id="colorMatches" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.9} />
                        <stop offset="50%" stopColor="#6366f1" stopOpacity={0.5} />
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1} />
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="label"
                      stroke="#94a3b8"
                      fontSize={10}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} width={30} />
                    <Tooltip
                      cursor={{ strokeDasharray: '4 4', stroke: 'rgba(148, 163, 184, 0.4)' }}
                      contentStyle={{
                        background: 'rgba(15, 23, 42, 0.95)',
                        borderRadius: '12px',
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: 'white',
                        backdropFilter: 'blur(20px)',
                        fontSize: '12px'
                      }}
                    />
                    <Area type="monotone" dataKey="value" stroke="#3b82f6" fill="url(#colorMatches)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="lg:col-span-2 space-y-3 sm:space-y-4">
              <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                <div className="bg-purple-500/20 p-2 rounded-xl">
                  <ClockIcon className="h-4 w-4 sm:h-5 sm:w-5 text-purple-300" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white">Transport Timeline</h3>
                  <p className="text-xs text-white/60">Live tracking updates</p>
                </div>
              </div>
              <div className="space-y-2 sm:space-y-3 max-h-64 sm:max-h-80 overflow-y-auto pr-1 sm:pr-2">
                <Timeline data={overview.timeline} />
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:gap-6 lg:grid-cols-5">
            <div className="lg:col-span-3 space-y-4 sm:space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <div className="bg-emerald-500/20 p-2 sm:p-3 rounded-xl sm:rounded-2xl self-start">
                  <HeartIcon className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-300" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-white to-emerald-200 bg-clip-text text-transparent">
                    Active Matches
                  </h3>
                  <p className="text-xs sm:text-sm text-white/60">Real-time view of approved organ matchings</p>
                </div>
              </div>
              <div className="glass-panel-elevated rounded-2xl sm:rounded-3xl overflow-hidden">
                <div className="overflow-x-auto">
                  <DataTable
                    data={matchesForRole}
                    columns={matchesColumns}
                    emptyLabel="No active matches yet."
                  />
                </div>
              </div>
            </div>
            <div className="lg:col-span-2 space-y-4 sm:space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <div className="relative self-start">
                  <div className="bg-cyan-500/20 p-2 sm:p-3 rounded-xl sm:rounded-2xl">
                    <MapIcon className="h-5 w-5 sm:h-6 sm:w-6 text-cyan-300" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full animate-pulse">
                    <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75"></div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent">
                    Live Courier
                  </h3>
                  <p className="text-xs sm:text-sm text-white/60">GPS telemetry from encrypted device</p>
                </div>
              </div>
              <div className="glass-panel-elevated rounded-2xl sm:rounded-3xl overflow-hidden border border-cyan-500/20 sm:border-2">
                <div className="h-48 sm:h-64">
                  <MapTracker
                    position={transport.currentLocation ?? { lat: 18.5204, lng: 73.8567 }}
                    path={transport.route ?? []}
                    hospital={transport.hospital}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                <div className="glass-panel rounded-xl sm:rounded-2xl p-3 sm:p-4 text-center">
                  <div className="text-xl sm:text-2xl font-bold text-green-400">{transport.eta ?? '—'}</div>
                  <div className="text-xs text-white/60">Estimated arrival</div>
                </div>
                <div className="glass-panel rounded-xl sm:rounded-2xl p-3 sm:p-4 text-center">
                  <div className="text-xl sm:text-2xl font-bold text-blue-400">98%</div>
                  <div className="text-xs text-white/60">GPS Signal</div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="grid gap-3 sm:gap-4 lg:gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
            {personalStats.map((stat) => (
              <div key={stat.key} className="metric-card group relative">
                <StatCard
                  title={stat.title}
                  value={stat.value}
                  change={stat.change}
                  icon={stat.icon}
                  trend={stat.trend}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/0 rounded-2xl sm:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            ))}
          </div>

          <div className="glass-panel-elevated rounded-2xl sm:rounded-3xl p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-2">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-white">Active matches</h3>
                <p className="text-xs sm:text-sm text-white/60">
                  {isDonor ? 'Recipients matched to your donor profile' : 'Donor offers assigned to you'}
                </p>
              </div>
            </div>
            {matchesForRole.length ? (
              <DataTable data={matchesForRole} columns={matchesColumns} emptyLabel="No active matches yet." />
            ) : (
              <p className="text-sm text-white/60">
                {isDonor
                  ? 'No recipients are matched to your availability yet. Update your availability to stay visible to transplant coordinators.'
                  : 'No donor offers have been matched to your case yet. Your care team will notify you as soon as a compatible organ is secured.'}
              </p>
            )}
          </div>

          <div className="glass-panel-elevated rounded-2xl sm:rounded-3xl p-4 sm:p-6">
            <div className="flex items-center gap-2 sm:gap-3 mb-4">
              <div className="bg-purple-500/20 p-2 rounded-xl">
                <ClockIcon className="h-4 w-4 sm:h-5 sm:w-5 text-purple-300" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white">Latest logistics updates</h3>
                <p className="text-xs text-white/60">Real-time checkpoints from courier and hospital coordination.</p>
              </div>
            </div>
            {overview.timeline?.length ? (
              <div className="space-y-2 sm:space-y-3 max-h-72 overflow-y-auto pr-1 sm:pr-2">
                <Timeline data={overview.timeline} />
              </div>
            ) : (
              <p className="text-sm text-white/60">No logistics updates yet.</p>
            )}
          </div>

          {hasTransportForMember && transport ? (
            <div className="glass-panel-elevated rounded-2xl sm:rounded-3xl p-4 sm:p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="relative">
                  <div className="bg-cyan-500/20 p-2 rounded-xl">
                    <MapIcon className="h-5 w-5 text-cyan-300" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse">
                    <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-60" />
                  </div>
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white">Courier tracking</h3>
                  <p className="text-xs text-white/60">Live GPS feed for your matched organ dispatch.</p>
                </div>
              </div>
              <div className="h-56 sm:h-64 rounded-2xl overflow-hidden border border-cyan-500/20">
                <MapTracker
                  position={transport.currentLocation ?? { lat: 19.076, lng: 72.8777 }}
                  path={transport.route ?? []}
                  hospital={transport.hospital}
                />
              </div>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
};

export default Dashboard;
