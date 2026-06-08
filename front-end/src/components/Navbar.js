import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const links = [
  { to: '/',               label: 'Dashboard'      },
  { to: '/vehicles',       label: 'Vehicles'       },
  { to: '/customers',      label: 'Customers'      },
  { to: '/promotions',     label: 'Promotions'     },
  { to: '/promo-vehicles', label: 'Promo-Vehicles' },
  { to: '/report',         label: 'Report'         },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  const navLink = (to, label, end = false) => (
    <NavLink
      key={to}
      to={to}
      end={end}
      onClick={() => setOpen(false)}
      className={({ isActive }) =>
        `px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
          isActive
            ? 'bg-accent-500 text-white font-semibold shadow-sm'
            : 'text-blue-100 hover:bg-accent-500/20 hover:text-white'
        }`
      }
    >
      {label}
    </NavLink>
  );

  return (
    <nav className="sticky top-0 z-40 bg-blue-900 shadow-lg border-b-[3px] border-accent-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between py-3 gap-2">

        {/* Brand */}
        <div className="text-white font-bold text-lg tracking-tight shrink-0">
          SwiftWheel<span className="font-normal text-sm text-accent-300 ml-1">PMS</span>
        </div>

        {/* Desktop links */}
        <div className="hidden lg:flex items-center gap-1 flex-1 justify-center">
          {links.map(l => navLink(l.to, l.label, l.to === '/'))}
        </div>

        {/* Desktop user */}
        <div className="hidden lg:flex items-center gap-3 text-white text-sm shrink-0">
          <span className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs">
            {user?.username}
            <span className="text-accent-300 ml-1">({user?.role})</span>
          </span>
          <button
            type="button" onClick={logout}
            className="text-sm px-3 py-1.5 rounded-lg border border-white/40 text-white hover:bg-white/10 transition font-medium"
          >
            Logout
          </button>
        </div>

        {/* Tablet user */}
        <div className="hidden md:flex lg:hidden items-center gap-2 text-white text-xs shrink-0">
          <span className="px-2 py-1 rounded-full bg-white/10 border border-white/20">{user?.username}</span>
          <button type="button" onClick={logout} className="px-3 py-1 rounded-lg border border-white/40 hover:bg-white/10 transition">Logout</button>
        </div>

        {/* Hamburger */}
        <button
          type="button"
          className="lg:hidden text-sm font-medium px-3 py-1.5 rounded-lg border border-white/40 text-white hover:bg-white/10 transition"
          onClick={() => setOpen(!open)}
        >
          {open ? 'Close' : 'Menu'}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="lg:hidden max-w-7xl mx-auto px-4 pb-4 flex flex-col gap-1 border-t border-white/10 pt-3">
          {links.map(l => navLink(l.to, l.label, l.to === '/'))}
          <div className="mt-3 pt-3 border-t border-white/20 flex items-center justify-between text-white text-xs">
            <span className="opacity-80">{user?.username} <span className="opacity-60">({user?.role})</span></span>
            <button type="button" onClick={logout} className="px-3 py-1 rounded-lg border border-white/40 hover:bg-white/10 transition">Logout</button>
          </div>
        </div>
      )}
    </nav>
  );
}
