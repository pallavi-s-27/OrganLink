import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import clsx from 'classnames';

const navLinks = [
  { label: "Home", to: "/" },
  { label: "How it works", to: "#how-it-works" },
  { label: "Clinician login", to: "/login" },
];

const PublicNavbar = () => {
  const [open, setOpen] = useState(false);

  const handleToggle = () => setOpen((prev) => !prev);
  const handleClose = () => setOpen(false);

  return (
    <header className="sticky top-0 z-30 mb-8 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-4 sm:px-6 lg:px-10">
        <Link
          to="/"
          className="flex items-center gap-3 rounded-2xl bg-white/5 px-4 py-2 text-white shadow-lg shadow-brand-500/10"
          onClick={handleClose}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 text-lg font-black text-white">
            OL
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold text-white">OrganLink</p>
            <p className="text-xs uppercase tracking-[0.3em] text-white/60">Transplant network</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-semibold text-white/70 lg:flex">
          {navLinks.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              className={({ isActive }) =>
                clsx(
                  'transition-colors duration-200 hover:text-white',
                  isActive ? 'text-white' : undefined
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
          <div className="flex items-center gap-3">
            <Link to="/donor-registration" className="btn-primary">
              Become a donor
            </Link>
            <Link to="/recipient-registration" className="btn-secondary">
              Request transplant
            </Link>
          </div>
        </nav>

        <button
          type="button"
          onClick={handleToggle}
          className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 p-2 text-white lg:hidden"
          aria-label={open ? 'Close navigation' : 'Open navigation'}
        >
          {open ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
        </button>
      </div>

      <nav
        className={clsx(
          'lg:hidden',
          open ? 'block' : 'hidden'
        )}
      >
        <div className="space-y-2 border-t border-white/10 bg-slate-950/95 px-4 py-6 sm:px-6">
          {navLinks.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              onClick={handleClose}
              className={({ isActive }) =>
                clsx(
                  'block rounded-2xl px-4 py-3 text-sm font-semibold transition-all duration-200',
                  isActive
                    ? 'bg-brand-500/20 text-white'
                    : 'bg-white/5 text-white/80 hover:bg-white/10 hover:text-white'
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
          <Link
            to="/donor-registration"
            onClick={handleClose}
            className="btn-primary inline-flex w-full justify-center"
          >
            Become a donor
          </Link>
          <Link
            to="/recipient-registration"
            onClick={handleClose}
            className="btn-secondary inline-flex w-full justify-center"
          >
            Request transplant
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default PublicNavbar;
