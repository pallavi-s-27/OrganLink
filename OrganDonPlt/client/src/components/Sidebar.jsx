import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import {
  UserPlusIcon,
  Squares2X2Icon,
  ClipboardDocumentListIcon,
  MapIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import clsx from 'classnames';
import { useAuth } from '../hooks/useAuth';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Squares2X2Icon },
  { name: 'Registration', href: '/register', icon: UserPlusIcon, roles: ['admin'] },
  { name: 'Organ Requests', href: '/organ-requests', icon: ClipboardDocumentListIcon },
  { name: 'Tracking', href: '/tracking', icon: MapIcon },
  { name: 'Admin', href: '/admin', icon: ShieldCheckIcon, roles: ['admin', 'doctor'] }
];

const Sidebar = ({ isOpen = false, onClose = () => {} }) => {
  const { user } = useAuth();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"
          aria-hidden="true"
          onClick={onClose}
        />
      )}
      
      <aside
        className={clsx(
          'glass-panel-elevated fixed inset-y-0 left-0 z-40 flex flex-col transition-all duration-300 border-r border-white/10',
          'w-72 sm:w-80 lg:static lg:translate-x-0',
          'px-4 sm:px-6 py-4 sm:py-6 lg:py-8',
          {
            '-translate-x-full lg:-translate-x-0': !isOpen,
            'translate-x-0': isOpen
          }
        )}
      >
      <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
        <div className="relative">
          <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl sm:rounded-3xl bg-gradient-to-br from-brand-500 to-brand-600 text-white shadow-lg shadow-brand-500/30">
            <span className="text-xl sm:text-2xl font-black">OL</span>
          </div>
          <div className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-green-500 rounded-full border-2 border-slate-900">
            <div className="absolute inset-0 bg-green-500 rounded-full animate-pulse"></div>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-lg sm:text-xl font-bold bg-gradient-to-r from-white to-brand-200 bg-clip-text text-transparent">
            OrganLink
          </p>
          <p className="text-xs sm:text-sm text-white/60 font-medium">Saving lives together</p>
        </div>
      </div>

      <div className="space-y-1 sm:space-y-2 flex-1">
        {navigation
          .filter((item) => !item.roles || item.roles.includes(user?.role))
          .map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              onClick={() => onClose()}
              className={({ isActive }) =>
                clsx(
                  'group relative flex items-center gap-3 sm:gap-4 rounded-xl sm:rounded-2xl px-3 sm:px-4 py-3 sm:py-4 text-sm font-semibold transition-all duration-200 overflow-hidden',
                  isActive
                    ? 'bg-gradient-to-r from-brand-500/20 to-brand-400/10 text-white border border-brand-500/30 shadow-lg shadow-brand-500/20'
                    : 'text-white/70 hover:bg-gradient-to-r hover:from-white/10 hover:to-white/5 hover:text-white hover:border hover:border-white/20'
                )
              }
            >
              <div className={clsx('p-1.5 sm:p-2 rounded-lg sm:rounded-xl transition-colors duration-200', {
                'bg-brand-500/20 text-brand-200': false, // isActive will be handled by NavLink
                'bg-white/10 text-white/70 group-hover:bg-white/20 group-hover:text-white': true
              })}>
                <item.icon className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <span className="relative z-10 text-xs sm:text-sm truncate">{item.name}</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500" />
            </NavLink>
          ))}
      </div>

      {user && (
        <div className="mt-6 sm:mt-8 glass-panel rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-white/10">
          <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
            <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-brand-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm sm:text-lg flex-shrink-0">
              {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-white truncate text-sm sm:text-base">{user.name}</p>
              <p className="text-xs sm:text-sm text-brand-300 capitalize font-medium">{user.role}</p>
            </div>
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-500 rounded-full animate-pulse flex-shrink-0" />
          </div>
          <div className="grid grid-cols-2 gap-2 sm:gap-3 text-xs">
            <div className="bg-white/5 rounded-lg sm:rounded-xl p-2 sm:p-3 text-center">
              <div className="text-white/50 mb-1 text-xs">Blood Group</div>
              <div className="text-white font-semibold text-xs sm:text-sm">{user.bloodGroup || '—'}</div>
            </div>
            <div className="bg-white/5 rounded-lg sm:rounded-xl p-2 sm:p-3 text-center">
              <div className="text-white/50 mb-1 text-xs">Organ Focus</div>
              <div className="text-white font-semibold text-xs sm:text-sm truncate" title={user.organType || '—'}>
                {user.organType || '—'}
              </div>
            </div>
          </div>
        </div>
      )}
    </aside>
    </>
  );
};

Sidebar.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func
};

export default Sidebar;
