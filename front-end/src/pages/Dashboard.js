import React, { useEffect, useState } from 'react';
import API from '../api';
import { PageLayout } from '../components/PageLayout';

const cards = [
  { key: 'vehicles',      label: 'Total Vehicles',      bg: 'bg-blue-900',   text: 'text-white' },
  { key: 'customers',     label: 'Total Customers',      bg: 'bg-accent-500', text: 'text-white' },
  { key: 'promotions',    label: 'Promotions',           bg: 'bg-blue-900',   text: 'text-white' },
  { key: 'promoVehicles', label: 'Promo-Vehicle Links',  bg: 'bg-accent-500', text: 'text-white' },
];

export default function Dashboard() {
  const [stats,   setStats]   = useState({ vehicles: 0, customers: 0, promotions: 0, promoVehicles: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      API.get('/vehicles'),
      API.get('/customers'),
      API.get('/promotions'),
      API.get('/promotion-vehicles'),
    ]).then(([v, c, p, pv]) =>
      setStats({ vehicles: v.data.length, customers: c.data.length, promotions: p.data.length, promoVehicles: pv.data.length })
    ).finally(() => setLoading(false));
  }, []);

  return (
    <PageLayout title="Dashboard" subtitle="SwiftWheel Enterprise — Promotion and Marketing System overview">
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-5">
        {cards.map((c, i) => (
          <div key={c.key} className={`${c.bg} ${c.text} rounded-2xl p-5 sm:p-6 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300`}
               style={{ animationDelay: `${i * 80}ms` }}>
            {loading
              ? <div className="h-10 w-16 mb-2 rounded-lg bg-white/20 animate-pulse" />
              : <div className="text-3xl md:text-4xl font-extrabold tracking-tight">{stats[c.key]}</div>
            }
            <div className="text-sm font-medium mt-1 opacity-80">{c.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border-l-4 border-accent-500 shadow-md p-5 sm:p-6 mt-6">
        <p className="font-bold text-base mb-2 text-blue-900">Huye, Rwanda</p>
        <p className="text-gray-600 leading-relaxed text-sm">
          SwiftWheel Enterprise PMS digitalises fleet promotions, customer tracking and marketing performance in one unified platform.
        </p>
      </div>
    </PageLayout>
  );
}
