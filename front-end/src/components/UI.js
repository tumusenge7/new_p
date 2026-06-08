import React, { useState, useCallback } from 'react';

// ── Shared Tailwind class strings ───────────────────────────
export const TABLE_TH = 'px-4 py-3.5 text-left whitespace-nowrap font-semibold text-xs uppercase tracking-wider';
export const TABLE_TD = 'px-4 py-3.5 border-t border-gray-50 text-sm text-gray-800';

// ── Reusable Tailwind class strings ─────────────────────────
export const btnPrimary = 'inline-flex items-center justify-center font-semibold rounded-xl bg-accent-500 hover:bg-accent-600 text-white text-xs sm:text-sm px-3 sm:px-5 py-2 sm:py-2.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent-400 focus:ring-offset-2 disabled:opacity-50 whitespace-nowrap shadow-md';
export const btnSecondary = 'inline-flex items-center justify-center font-semibold rounded-xl bg-white hover:bg-blue-50 text-blue-800 text-xs sm:text-sm px-3 sm:px-5 py-2 sm:py-2.5 border border-blue-200 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 whitespace-nowrap';
export const btnEdit   = 'inline-flex items-center justify-center font-medium rounded-lg bg-accent-50 hover:bg-accent-100 text-accent-700 text-xs px-3 py-1.5 border border-accent-200 transition-all duration-200';
export const btnDelete = 'inline-flex items-center justify-center font-medium rounded-lg bg-blue-800 hover:bg-blue-900 text-white text-xs px-3 py-1.5 transition-all duration-200';

// ── Badge map: pure Tailwind classes ────────────────────────
const badgeMap = {
  active:              'bg-accent-100 text-accent-800',
  inactive:            'bg-gray-100 text-gray-600',
  blocked:             'bg-blue-900 text-white',
  expired:             'bg-gray-100 text-gray-600',
  available:           'bg-accent-100 text-accent-800',
  rented:              'bg-blue-800 text-white',
  sold:                'bg-gray-700 text-white',
  'under maintenance': 'bg-yellow-100 text-yellow-800',
  excellent:           'bg-blue-800 text-white',
  good:                'bg-accent-500 text-white',
  average:             'bg-accent-100 text-accent-800',
  poor:                'bg-gray-200 text-gray-700',
};

export function Badge({ label }) {
  const cls = badgeMap[label?.toLowerCase()] || 'bg-gray-100 text-gray-700';
  return (
    <span className={`inline-flex items-center text-xs font-semibold px-2.5 py-0.5 rounded-full ${cls}`}>
      {label}
    </span>
  );
}

export function Alert({ msg, type }) {
  const cls = type === 'error'
    ? 'bg-red-50 border border-red-300 text-red-800'
    : 'bg-accent-50 border border-accent-300 text-accent-900';
  return <div className={`rounded-xl px-4 py-3 text-sm mb-4 ${cls}`}>{msg}</div>;
}

export function Modal({ title, onClose, children }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-blue-950/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[92dvh] overflow-y-auto mx-2 sm:mx-0 border border-gray-100"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 rounded-t-2xl"
             style={{ background: 'linear-gradient(90deg,#1e3a8a,#1d4ed8)' }}>
          <h3 className="text-base sm:text-lg font-bold text-white">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-white/70 hover:text-white text-sm font-medium px-2 py-1 rounded-lg hover:bg-white/10 transition"
          >
            Close
          </button>
        </div>
        {/* Body */}
        <div className="px-4 sm:px-6 py-4 sm:py-5">{children}</div>
      </div>
    </div>
  );
}

export function SearchBar({ value, onChange, placeholder }) {
  return (
    <div className="mb-5">
      <input
        className="w-full sm:w-80 md:w-96 rounded-xl border border-gray-300 text-gray-900 text-sm px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-accent-400 focus:border-accent-400 transition"
        placeholder={placeholder || 'Search...'}
        value={value}
        onChange={e => onChange(e.target.value)}
      />
    </div>
  );
}

// ── Validators ───────────────────────────────────────────────
const VALIDATORS = {
  text:         { pattern: /^[A-Za-zÀ-ÿ\s'-]*$/, onKey: (e) => { if (!/[A-Za-zÀ-ÿ\s'-]/.test(e.key) && !['Backspace','Delete','ArrowLeft','ArrowRight','Tab'].includes(e.key)) e.preventDefault(); }, hint: 'Letters only' },
  phone:        { pattern: /^[+\d]{0,13}$/, onKey: (e) => { if (!/[\d+]/.test(e.key) && !['Backspace','Delete','ArrowLeft','ArrowRight','Tab'].includes(e.key)) e.preventDefault(); if (e.key==='+' && e.target.value.includes('+')) e.preventDefault(); if (e.key!=='+' && e.key!=='Backspace' && e.target.value.replace(/\D/g,'').length>=12 && !['Delete','ArrowLeft','ArrowRight','Tab'].includes(e.key)) e.preventDefault(); }, hint: 'Format: +250xxxxxxxxx' },
  year:         { pattern: /^\d{0,4}$/, onKey: (e) => { if (!/\d/.test(e.key) && !['Backspace','Delete','ArrowLeft','ArrowRight','Tab'].includes(e.key)) e.preventDefault(); }, hint: '4-digit year' },
  number:       { pattern: /^\d*\.?\d*$/, onKey: (e) => { if (!/[\d.]/.test(e.key) && !['Backspace','Delete','ArrowLeft','ArrowRight','Tab'].includes(e.key)) e.preventDefault(); if (e.key==='.' && e.target.value.includes('.')) e.preventDefault(); }, hint: 'Numbers only' },
  alphanumeric: { pattern: /^[A-Za-z0-9\s]*$/, onKey: (e) => { if (!/[A-Za-z0-9\s]/.test(e.key) && !['Backspace','Delete','ArrowLeft','ArrowRight','Tab'].includes(e.key)) e.preventDefault(); }, hint: 'Letters and numbers only' },
};

export function FormInput({ label, type='text', value, onChange, required, step, placeholder, kind }) {
  const [touched,  setTouched]  = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState('');
  const vr = VALIDATORS[kind] || null;

  const validate = (val) => {
    if (!vr) return '';
    if (required && !val) return `${label} is required`;
    if (val && vr.pattern && !vr.pattern.test(val)) return vr.hint;
    if (kind === 'phone' && val && val.replace(/\D/g,'').length !== 12) return 'Must have exactly 12 digits (e.g. +250780001001)';
    if (kind === 'year'  && val) { const y = parseInt(val,10); if (isNaN(y)||y<1900||y>2099) return 'Year must be between 1900 and 2099'; }
    return '';
  };

  const handleChange = (e) => {
    const val = e.target.value;
    if (vr && vr.pattern && val && !vr.pattern.test(val)) return;
    onChange(val);
    if (touched) setErrorMsg(validate(val));
  };

  const handleBlur = (e) => { setTouched(true); setErrorMsg(validate(e.target.value)); };

  const base = 'w-full rounded-xl border text-gray-900 text-sm px-3 py-2 shadow-sm transition focus:outline-none focus:ring-2';
  const cls  = touched && errorMsg
    ? `${base} border-red-400 focus:ring-red-400 focus:border-red-400`
    : `${base} border-gray-300 focus:ring-accent-400 focus:border-accent-400`;

  return (
    <div>
      <label className="block text-sm font-semibold text-blue-900 mb-1.5">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <input
        type={type} value={value} onChange={handleChange} onBlur={handleBlur}
        onKeyDown={vr?.onKey} required={required} step={step}
        placeholder={placeholder || (vr ? vr.hint : '')}
        className={cls}
      />
      {touched && errorMsg && <p className="text-xs text-red-500 mt-1">{errorMsg}</p>}
    </div>
  );
}

// ── Shared layout components ────────────────────────────────
export function Card({ children, className = '' }) {
  return <div className={`bg-white rounded-2xl border border-gray-100 shadow-md overflow-hidden ${className}`}>{children}</div>;
}

export function FormGrid({ children }) {
  return <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{children}</div>;
}

export function TableEmpty({ colSpan, message = 'No data found' }) {
  return <tr><td colSpan={colSpan} className="text-center py-12 text-gray-400">{message}</td></tr>;
}

export function FormActions({ onCancel, editing, createLabel = 'Add', updateLabel = 'Update' }) {
  return (
    <div className="flex justify-end gap-3 pt-2">
      <button type="button" onClick={onCancel}
        className="inline-flex items-center justify-center font-semibold rounded-xl bg-white hover:bg-blue-50 text-blue-800 text-sm px-5 py-2.5 border border-blue-200 transition">
        Cancel
      </button>
      <button type="submit" className={btnPrimary}>{editing ? updateLabel : createLabel}</button>
    </div>
  );
}

// ── Custom hooks ────────────────────────────────────────────
export function useFlash() {
  const [alert, setAlert] = useState(null);
  const flash = useCallback((msg, type = 'success') => {
    setAlert({ msg, type });
    setTimeout(() => setAlert(null), 3000);
  }, []);
  return { alert, flash };
}

export function useForm(initial) {
  const [form, setForm] = useState(initial);
  const f = useCallback((k) => (v) => setForm(p => ({ ...p, [k]: v })), []);
  const reset = useCallback((v) => setForm(v ?? initial), [initial]);
  return { form, setForm, f, reset };
}

export function FormSelect({ label, value, onChange, options, required }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-blue-900 mb-1.5">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <select
        value={value} onChange={e => onChange(e.target.value)} required={required}
        className="w-full rounded-xl border border-gray-300 text-gray-900 text-sm px-3 py-2 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-accent-400 focus:border-accent-400 transition"
      >
        {options.map(o => typeof o === 'string'
          ? <option key={o} value={o}>{o}</option>
          : <option key={o.value} value={o.value}>{o.label}</option>
        )}
      </select>
    </div>
  );
}
