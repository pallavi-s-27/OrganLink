import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import StatusBadge from './StatusBadge';

const TimelineItem = ({ item, isLast }) => (
  <div className="relative pl-6 sm:pl-8">
    <span className="absolute left-1 top-1.5 flex h-2.5 w-2.5 sm:h-3 sm:w-3 -translate-x-1/2 items-center justify-center rounded-full bg-brand-400" />
    {!isLast ? (
      <span className="absolute left-1 top-4 sm:top-5 -translate-x-1/2 h-full w-px bg-white/10" />
    ) : null}
    <div className="glass-panel mt-1 rounded-xl sm:rounded-2xl p-3 sm:p-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <p className="text-xs sm:text-sm font-semibold text-white truncate pr-2">{item.title}</p>
        <div className="self-start sm:self-auto">
          <StatusBadge status={item.status} />
        </div>
      </div>
      <p className="mt-2 text-xs sm:text-sm text-white/60 line-clamp-2">{item.description}</p>
      <p className="mt-2 sm:mt-3 text-xs text-white/40">
        <span className="hidden sm:inline">{dayjs(item.timestamp).format('MMM D, YYYY · h:mm A')}</span>
        <span className="sm:hidden">{dayjs(item.timestamp).format('MMM D · h:mm A')}</span>
      </p>
    </div>
  </div>
);

TimelineItem.propTypes = {
  item: PropTypes.shape({
    title: PropTypes.string.isRequired,
    timestamp: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired
  }).isRequired,
  isLast: PropTypes.bool
};

TimelineItem.defaultProps = {
  isLast: false
};

const Timeline = ({ data }) => (
  <div className="space-y-4 sm:space-y-6">
    {data.map((item, index) => (
      <TimelineItem key={item.id ?? item.timestamp} item={item} isLast={index === data.length - 1} />
    ))}
  </div>
);

Timeline.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      title: PropTypes.string.isRequired,
      timestamp: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired
    })
  ).isRequired
};

export default Timeline;
