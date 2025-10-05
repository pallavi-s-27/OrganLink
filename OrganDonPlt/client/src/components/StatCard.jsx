import PropTypes from 'prop-types';
import clsx from 'classnames';

const StatCard = ({ title, value, change = '', icon: Icon, trend }) => (
  <div className="relative overflow-hidden">
    <div className="flex flex-col gap-3 sm:gap-4 p-4 sm:p-6 h-full">
      <div className="flex items-center justify-between">
        <p className="text-xs sm:text-sm font-medium text-white/70 tracking-wide truncate pr-2">{title}</p>
        <div className="relative flex-shrink-0">
          <div className={clsx("rounded-xl sm:rounded-2xl p-2 sm:p-3 transition-colors duration-300", {
            'bg-emerald-500/20 text-emerald-300': trend === 'up',
            'bg-rose-500/20 text-rose-300': trend === 'down',
            'bg-brand-500/20 text-brand-300': !trend
          })}>
            {Icon ? <Icon className="h-4 w-4 sm:h-6 sm:w-6" /> : null}
          </div>
          {trend && (
            <div className={clsx("absolute -top-1 -right-1 w-2 h-2 sm:w-3 sm:h-3 rounded-full animate-pulse", {
              'bg-emerald-400': trend === 'up',
              'bg-rose-400': trend === 'down'
            })} />
          )}
        </div>
      </div>
      <div className="flex-1 flex flex-col justify-center">
        <p className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-br from-white to-slate-300 bg-clip-text text-transparent mb-1 sm:mb-2 tracking-tight">
          {value}
        </p>
        <div className="flex items-center gap-1 sm:gap-2">
          <div className={clsx('flex items-center gap-1 text-xs sm:text-sm font-semibold px-2 py-1 rounded-full', {
            'text-emerald-400 bg-emerald-500/10': trend === 'up',
            'text-rose-400 bg-rose-500/10': trend === 'down',
            'text-white/60 bg-white/5': !trend
          })}>
            {trend === 'up' && <span className="text-xs">↗</span>}
            {trend === 'down' && <span className="text-xs">↘</span>}
            <span className="truncate">{change}</span>
          </div>
        </div>
      </div>
    </div>
    <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
    <div className={clsx("absolute bottom-0 left-0 right-0 h-0.5 sm:h-1 transition-all duration-500", {
      'bg-gradient-to-r from-emerald-500/50 to-emerald-400/50': trend === 'up',
      'bg-gradient-to-r from-rose-500/50 to-rose-400/50': trend === 'down',
      'bg-gradient-to-r from-brand-500/50 to-brand-400/50': !trend
    })} />
  </div>
);

StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  change: PropTypes.string,
  icon: PropTypes.elementType,
  trend: PropTypes.oneOf(['up', 'down'])
};



export default StatCard;
