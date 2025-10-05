import PropTypes from 'prop-types';

const PageHeader = ({ title, description, actions }) => (
  <div className="mb-4 sm:mb-6 lg:mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
    <div className="min-w-0 flex-1">
      <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-white">{title}</h2>
      {description ? <p className="mt-1 text-xs sm:text-sm text-white/60 line-clamp-2">{description}</p> : null}
    </div>
    {actions ? <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">{actions}</div> : null}
  </div>
);

PageHeader.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  actions: PropTypes.node
};

PageHeader.defaultProps = {
  description: '',
  actions: null
};

export default PageHeader;
