import PropTypes from 'prop-types';

const FormField = ({ label, error = '', children }) => (
  <label className="space-y-2">
    <span className="block text-sm font-medium text-white/70">{label}</span>
    {children}
    {error ? <span className="text-xs font-medium text-rose-300">{error}</span> : null}
  </label>
);

FormField.propTypes = {
  label: PropTypes.string.isRequired,
  error: PropTypes.string,
  children: PropTypes.node.isRequired
};

export default FormField;
