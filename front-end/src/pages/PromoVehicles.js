import React, { useEffect, useState } from 'react';
import API from '../api';
import { PageLayout } from '../components/PageLayout';
import { Modal, Alert, Badge, FormSelect, btnPrimary, btnEdit, btnDelete, TABLE_TH, TABLE_TD, Card, TableEmpty, FormActions, useFlash } from '../components/UI';

const PERFORMANCE = ['Excellent','Good','Average','Poor'];

export default function PromoVehicles() {
  const [links,      setLinks]      = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [vehicles,   setVehicles]   = useState([]);
  const [form,       setForm]       = useState({ Promotion_id: '', Vehicle_id: '', Performance: 'Good' });
  const [editing,    setEditing]    = useState(null);
  const [modal,      setModal]      = useState(false);
  const { alert, flash } = useFlash();

  const load = async () => {
    const [l, p, v] = await Promise.all([
      API.get('/promotion-vehicles'),
      API.get('/promotions'),
      API.get('/vehicles'),
    ]);
    setLinks(l.data); setPromotions(p.data); setVehicles(v.data);
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => {
    setForm({ Promotion_id: String(promotions[0]?.id || ''), Vehicle_id: String(vehicles[0]?.id || ''), Performance: 'Good' });
    setEditing(null); setModal(true);
  };
  const openEdit = (l) => {
    setForm({ Promotion_id: String(l.Promotion_id), Vehicle_id: String(l.Vehicle_id), Performance: l.Performance });
    setEditing(l.id); setModal(true);
  };
  const f = (k) => (v) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      editing ? await API.put(`/promotion-vehicles/${editing}`, { Performance: form.Performance })
              : await API.post('/promotion-vehicles', form);
      flash(editing ? 'Performance updated' : 'Vehicle assigned to promotion');
      setModal(false); load();
    } catch (err) { flash(err.response?.data?.message || 'Already assigned or error', 'error'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this assignment?')) return;
    try {
      await API.delete(`/promotion-vehicles/${id}`);
      flash('Removed'); load();
    } catch (err) { flash(err.response?.data?.message || 'Error removing assignment', 'error'); }
  };

  const fmtDiscount = (l) => l.Discount_Type === 'Percentage' ? `${l.Discount_Value}%` : l.Discount_Value;

  return (
    <PageLayout
      title="Promotion — Vehicles"
      subtitle="Link promotions to fleet vehicles and track performance"
      action={<button type="button" onClick={openAdd} className={btnPrimary}>+ Assign Vehicle</button>}
    >
      {alert && <Alert {...alert} />}

      <Card>
        <table className="hidden sm:table min-w-full">
          <thead className="bg-blue-900 text-white border-b-[3px] border-accent-500">
            <tr>
              {['#','Promotion','Discount','Vehicle','Type','Year','Performance','Assigned','Actions'].map(h => (
                <th key={h} className={TABLE_TH}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {links.length === 0 && <TableEmpty colSpan={9} message="No assignments found" />}
            {links.map((l, i) => (
              <tr key={l.id} className="hover:bg-accent-50 transition-colors">
                <td className={TABLE_TD}>{i + 1}</td>
                <td className={`${TABLE_TD} font-medium`}>{l.PromotionTitle}</td>
                <td className={TABLE_TD}>{l.Discount_Type} — {fmtDiscount(l)}</td>
                <td className={TABLE_TD}>{l.Brand} {l.Model} <span className="text-gray-500 font-mono text-xs">({l.Plate_Number})</span></td>
                <td className={TABLE_TD}>{l.Vehicle_Type}</td>
                <td className={TABLE_TD}>{l.Year}</td>
                <td className={TABLE_TD}><Badge label={l.Performance} /></td>
                <td className={TABLE_TD}>{new Date(l.AssignedAt).toLocaleDateString()}</td>
                <td className={`${TABLE_TD} flex gap-2`}>
                  <button type="button" onClick={() => openEdit(l)} className={btnEdit}>Edit</button>
                  <button type="button" onClick={() => handleDelete(l.id)} className={btnDelete}>Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex flex-col divide-y divide-gray-100 sm:hidden">
          {links.length === 0 && <p className="text-center py-10 text-gray-400 text-sm">No assignments found</p>}
          {links.map((l) => (
            <div key={l.id} className="px-4 py-4 hover:bg-accent-50 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-blue-900 text-sm">{l.PromotionTitle}</span>
                <Badge label={l.Performance} />
              </div>
              <div className="space-y-1 mb-3 text-sm">
                <div className="flex justify-between gap-2"><span className="text-xs font-semibold text-gray-400 uppercase tracking-wide w-28 shrink-0">Vehicle</span><span className="text-gray-800 text-right text-xs">{l.Brand} {l.Model}</span></div>
                <div className="flex justify-between gap-2"><span className="text-xs font-semibold text-gray-400 uppercase tracking-wide w-28 shrink-0">Plate</span><span className="text-gray-800 text-right font-mono text-xs">{l.Plate_Number}</span></div>
                <div className="flex justify-between gap-2"><span className="text-xs font-semibold text-gray-400 uppercase tracking-wide w-28 shrink-0">Discount</span><span className="text-gray-800 text-right text-xs">{l.Discount_Type} · {fmtDiscount(l)}</span></div>
                <div className="flex justify-between gap-2"><span className="text-xs font-semibold text-gray-400 uppercase tracking-wide w-28 shrink-0">Year / Type</span><span className="text-gray-800 text-right text-xs">{l.Year} · {l.Vehicle_Type}</span></div>
                <div className="flex justify-between gap-2"><span className="text-xs font-semibold text-gray-400 uppercase tracking-wide w-28 shrink-0">Assigned</span><span className="text-gray-800 text-right text-xs">{new Date(l.AssignedAt).toLocaleDateString()}</span></div>
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => openEdit(l)} className={btnEdit}>Edit</button>
                <button type="button" onClick={() => handleDelete(l.id)} className={btnDelete}>Remove</button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {modal && (
        <Modal title={editing ? 'Update Performance' : 'Assign Vehicle to Promotion'} onClose={() => setModal(false)}>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!editing && (
              <>
                <FormSelect
                  label="Promotion"
                  value={form.Promotion_id}
                  onChange={f('Promotion_id')}
                  options={promotions.map(p => ({ value: String(p.id), label: p.Title }))}
                  required
                />
                <FormSelect
                  label="Vehicle"
                  value={form.Vehicle_id}
                  onChange={f('Vehicle_id')}
                  options={vehicles.map(v => ({ value: String(v.id), label: `${v.Brand} ${v.Model} — ${v.Plate_Number}` }))}
                  required
                />
              </>
            )}
            <FormSelect label="Performance" value={form.Performance} onChange={f('Performance')} options={PERFORMANCE} />
            <FormActions onCancel={() => setModal(false)} editing={editing} createLabel="Assign" updateLabel="Update" />
          </form>
        </Modal>
      )}
    </PageLayout>
  );
}
