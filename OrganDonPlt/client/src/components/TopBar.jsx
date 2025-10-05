import { Bars3Icon, BellIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import PropTypes from 'prop-types';
import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { useAuth } from '../hooks/useAuth';
import clsx from 'classnames';

const TopBar = ({ onToggleSidebar = () => {} }) => {
  const { user, logout } = useAuth();

  return (
    <header
      className="glass-panel-elevated sticky top-0 z-30 flex items-center justify-between rounded-2xl sm:rounded-3xl px-3 sm:px-6 py-3 sm:py-4 border border-white/10"
      style={{ overflow: 'visible' }}
    >
      <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="inline-flex items-center justify-center rounded-xl sm:rounded-2xl bg-white/10 p-2 sm:p-3 text-white transition-all duration-200 hover:bg-white/20 hover:scale-105 lg:hidden flex-shrink-0"
        >
          <Bars3Icon className="h-5 w-5 sm:h-6 sm:w-6" />
        </button>
        <div className="min-w-0">
          <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
            Welcome back
          </h1>
          <p className="text-xs sm:text-sm text-white/60 font-medium truncate">
            {user ? `Here's what's happening with current organ transports.` : 'Please sign in to continue'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
        <button className="relative hidden rounded-xl sm:rounded-2xl bg-white/10 p-2 sm:p-3 text-white/70 transition-all duration-200 hover:text-white hover:bg-white/20 hover:scale-105 md:inline-flex">
          <BellIcon className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="absolute -top-1 -right-1 flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-xs font-bold text-white shadow-lg">
            3
          </span>
          <div className="absolute -top-1 -right-1 h-4 w-4 sm:h-5 sm:w-5 rounded-full bg-pink-500 animate-ping opacity-30" />
        </button>
        
        {user ? (
          <Menu as="div" className="relative inline-block text-left z-50">
            <Menu.Button className="inline-flex items-center gap-2 sm:gap-3 rounded-xl sm:rounded-2xl bg-gradient-to-r from-white/10 to-white/5 px-2 sm:px-4 py-2 sm:py-3 transition-all duration-200 hover:from-white/20 hover:to-white/10 hover:scale-105 border border-white/10">
              <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg sm:rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 text-white font-bold shadow-lg shadow-brand-500/30 text-sm sm:text-base">
                {user.name
                  .split(' ')
                  .map((n) => n[0]?.toUpperCase())
                  .slice(0, 2)
                  .join('')}
              </div>
              <div className="hidden text-left sm:block">
                <p className="text-sm font-semibold text-white truncate max-w-[120px]">{user.name}</p>
                <p className="text-xs capitalize text-white/60 font-medium">{user.role}</p>
              </div>
            </Menu.Button>
            
            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-150"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 mt-2 sm:mt-3 w-56 sm:w-64 origin-top-right rounded-xl sm:rounded-2xl bg-slate-900/95 backdrop-blur-2xl p-2 sm:p-3 text-sm text-white shadow-2xl ring-1 ring-white/10 border border-white/20 z-50">
                <div className="px-3 sm:px-4 py-2 sm:py-3 border-b border-white/10">
                  <p className="text-white font-semibold text-sm truncate">{user.name}</p>
                  <p className="text-white/60 text-xs capitalize mt-1 truncate">{user.role} • {user.organization || 'OrganLink'}</p>
                </div>
                
                <Menu.Item>
                  {({ active }) => (
                    <button
                      type="button"
                      onClick={logout}
                      className={clsx(
                        'flex w-full items-center gap-2 sm:gap-3 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-left mt-1 sm:mt-2 transition-all duration-200 text-sm',
                        active ? 'bg-white/10 text-white scale-105' : 'text-white/80'
                      )}
                    >
                      <ArrowRightOnRectangleIcon className="h-4 w-4" />
                      Sign out
                    </button>
                  )}
                </Menu.Item>
              </Menu.Items>
            </Transition>
          </Menu>
        ) : null}
      </div>
    </header>
  );
};

TopBar.propTypes = {
  onToggleSidebar: PropTypes.func
};



export default TopBar;