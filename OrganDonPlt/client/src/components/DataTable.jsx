import PropTypes from 'prop-types';
import StatusBadge from './StatusBadge';
import dayjs from 'dayjs';

const DataTable = ({ data, columns, emptyLabel }) => {
  if (!data.length) {
    return (
      <div className="glass-panel-elevated grid place-items-center rounded-3xl py-20 text-center">
        <div className="space-y-4">
          <div className="w-16 h-16 mx-auto bg-white/10 rounded-2xl flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-white/20 border-dashed rounded-xl" />
          </div>
          <p className="text-white/60 font-medium">{emptyLabel}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-panel-elevated overflow-hidden rounded-2xl sm:rounded-3xl border border-white/10">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-white/10">
          <thead className="bg-gradient-to-r from-white/5 to-white/10">
            <tr>
              {columns.map((column, index) => (
                <th 
                  key={column.key} 
                  scope="col" 
                  className={`px-3 sm:px-6 py-3 sm:py-5 text-left text-xs font-semibold text-white/70 uppercase tracking-wider ${
                    index === 0 ? 'rounded-tl-2xl sm:rounded-tl-3xl' : ''
                  } ${index === columns.length - 1 ? 'rounded-tr-2xl sm:rounded-tr-3xl' : ''}`}
                >
                  <span className="hidden sm:inline">{column.label}</span>
                  <span className="sm:hidden">{column.label.length > 8 ? column.label.substring(0, 6) + '..' : column.label}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {data.map((row, rowIndex) => (
              <tr 
                key={row.id} 
                className="group transition-all duration-200 hover:bg-gradient-to-r hover:from-white/5 hover:to-white/2 hover:shadow-lg"
              >
                {columns.map((column, colIndex) => {
                  const value = row[column.key];

                  if (column.key === 'status') {
                    return (
                      <td key={column.key} className="whitespace-nowrap px-3 sm:px-6 py-3 sm:py-5">
                        <StatusBadge status={value} />
                      </td>
                    );
                  }

                  if (column.format === 'date') {
                    return (
                      <td key={column.key} className="whitespace-nowrap px-3 sm:px-6 py-3 sm:py-5 text-xs sm:text-sm text-white/80 font-medium">
                        <span className="hidden sm:inline">{dayjs(value).format('MMM D, YYYY · h:mm A')}</span>
                        <span className="sm:hidden">{dayjs(value).format('MMM D')}</span>
                      </td>
                    );
                  }

                  return (
                    <td 
                      key={column.key} 
                      className={`whitespace-nowrap px-3 sm:px-6 py-3 sm:py-5 text-xs sm:text-sm font-medium ${
                        colIndex === 0 ? 'text-white' : 'text-white/80'
                      }`}
                    >
                      <div className="max-w-[120px] sm:max-w-none truncate" title={value}>
                        {value}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

DataTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object),
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      format: PropTypes.oneOf(['date'])
    })
  ).isRequired,
  emptyLabel: PropTypes.string
};

DataTable.defaultProps = {
  data: [],
  emptyLabel: 'No records found yet.'
};

export default DataTable;
