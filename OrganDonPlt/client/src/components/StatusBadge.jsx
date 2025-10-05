import PropTypes from 'prop-types';
import clsx from 'classnames';

const variantClasses = {
  pending: 'bg-gradient-to-r from-amber-500/20 to-amber-400/10 text-amber-300 ring-amber-400/40 shadow-amber-500/20',
  reviewed: 'bg-gradient-to-r from-slate-500/20 to-slate-400/10 text-slate-200 ring-slate-400/40 shadow-slate-500/20',
  approved: 'bg-gradient-to-r from-emerald-500/20 to-emerald-400/10 text-emerald-300 ring-emerald-400/40 shadow-emerald-500/20',
  rejected: 'bg-gradient-to-r from-rose-500/20 to-rose-400/10 text-rose-300 ring-rose-400/40 shadow-rose-500/20',
  contacted: 'bg-gradient-to-r from-cyan-500/20 to-cyan-400/10 text-cyan-300 ring-cyan-400/40 shadow-cyan-500/20',
  in_transit: 'bg-gradient-to-r from-sky-500/20 to-sky-400/10 text-sky-300 ring-sky-400/40 shadow-sky-500/20',
  delivered: 'bg-gradient-to-r from-brand-500/20 to-brand-400/10 text-brand-200 ring-brand-400/40 shadow-brand-500/20'
};

const StatusBadge = ({ status }) => (
  <span
    className={clsx(
      'inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold ring-1 ring-inset backdrop-blur-sm shadow-lg transition-all duration-200 hover:scale-105',
      variantClasses[status] || 'bg-gradient-to-r from-white/10 to-white/5 text-white/70 ring-white/20 shadow-white/10'
    )}
  >
    <span className="status-indicator h-2 w-2 rounded-full bg-current">
      <span className="block h-full w-full rounded-full bg-current"></span>
    </span>
    <span className="capitalize">{status.replace('_', ' ')}</span>
  </span>
);

StatusBadge.propTypes = {
  status: PropTypes.string.isRequired
};

export default StatusBadge;
