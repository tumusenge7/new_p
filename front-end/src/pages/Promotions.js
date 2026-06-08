import React from 'react';
import { PageLayout } from '../components/PageLayout';
import { Modal, Alert, Badge, SearchBar, FormInput, FormSelect, btnPrimary, btnEdit, btnDelete, TABLE_TH, TABLE_TD, Card, TableEmpty, FormActions, FormGrid } from '../components/UI';
import useCrud from '../hooks/useCrud';

const TITLES   = ['New Year Sale','Holiday Price Slash','Weekend Flash Sale','Clearance Discount Offer','Seasonal Price Drop'];
const D_TYPES  = ['Free','Percentage','Flat_Rate','Cashback','Buy_One_Get_One','Bundle','Amount'];
const STATUSES = ['Active','Inactive','Expired'];
const EMPTY    = { Title:TITLES[0], Description:'', Discount_Type:'Percentage', Discount_Value:'', Start_Date:'', End_Date:'', Status:'Active' };

export default function Promotions() {
  const { data: promotions, search, setSearch, load, alert, form, f, editing, modal, closeModal, openAdd, openEdit, handleSubmit, handleDelete } = useCrud('/promotions', 'Promotion', {
    initialForm: EMPTY,
    onOpenEdit: (p) => ({ ...p, Start_Date: p.Start_Date?.split('T')[0], End_Date: p.End_Date?.split('T')[0] }),
  });

  const fmtValue = (p) => p.Discount_Type==='Percentage' ? `${p.Discount_Value}%` : `${Number(p.Discount_Value).toLocaleString()} RWF`;

  return (
    <PageLayout title="Promotions" subtitle="Create and manage marketing campaigns"
      action={<button type="button" onClick={openAdd} className={btnPrimary}>+ Add Promotion</button>}>
      {alert && <Alert {...alert} />}
      <SearchBar value={search} onChange={q => { setSearch(q); load(q); }} placeholder="Search promotions..." />

      <Card>
        <table className="hidden sm:table min-w-full">
          <thead className="bg-blue-900 text-white border-b-[3px] border-accent-500">
            <tr>{['#','Title','Discount Type','Value','Start','End','Status','Created By','Actions'].map(h=><th key={h} className={TABLE_TH}>{h}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {promotions.length===0 && <TableEmpty colSpan={9} message="No promotions found" />}
            {promotions.map((p,i) => (
              <tr key={p.id} className="hover:bg-accent-50 transition-colors">
                <td className={TABLE_TD}>{i+1}</td>
                <td className={`${TABLE_TD} font-medium`}>{p.Title}</td>
                <td className={TABLE_TD}>{p.Discount_Type}</td>
                <td className={`${TABLE_TD} font-semibold text-blue-900`}>{fmtValue(p)}</td>
                <td className={TABLE_TD}>{new Date(p.Start_Date).toLocaleDateString()}</td>
                <td className={TABLE_TD}>{new Date(p.End_Date).toLocaleDateString()}</td>
                <td className={TABLE_TD}><Badge label={p.Status} /></td>
                <td className={TABLE_TD}>{p.CreatedByName||'—'}</td>
                <td className={`${TABLE_TD} flex gap-2`}>
                  <button type="button" onClick={()=>openEdit(p)} className={btnEdit}>Edit</button>
                  <button type="button" onClick={()=>handleDelete(p.id)} className={btnDelete}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex flex-col divide-y divide-gray-100 sm:hidden">
          {promotions.length===0 && <p className="text-center py-10 text-gray-400 text-sm">No promotions found</p>}
          {promotions.map(p => (
            <div key={p.id} className="px-4 py-4 hover:bg-accent-50 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-blue-900 text-sm">{p.Title}</span>
                <Badge label={p.Status} />
              </div>
              <div className="space-y-1 mb-3 text-sm">
                {[['Type',p.Discount_Type],['Value',fmtValue(p)],['Period',`${new Date(p.Start_Date).toLocaleDateString()} → ${new Date(p.End_Date).toLocaleDateString()}`],['Created By',p.CreatedByName||'—']].map(([l,val])=>(
                  <div key={l} className="flex justify-between gap-2">
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide w-28 shrink-0">{l}</span>
                    <span className="text-gray-800 text-right text-xs">{val}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={()=>openEdit(p)} className={btnEdit}>Edit</button>
                <button type="button" onClick={()=>handleDelete(p.id)} className={btnDelete}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {modal && (
        <Modal title={editing ? 'Edit Promotion' : 'Add Promotion'} onClose={closeModal}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormGrid>
              <FormSelect label="Title"         value={form.Title}         onChange={f('Title')}         options={TITLES}  required />
              <FormSelect label="Discount Type" value={form.Discount_Type} onChange={f('Discount_Type')} options={D_TYPES} required />
            </FormGrid>
            <div>
              <label className="block text-sm font-semibold text-blue-900 mb-1.5">Description</label>
              <textarea value={form.Description} onChange={e=>f('Description')(e.target.value)} rows={3}
                className="w-full rounded-xl border border-gray-300 text-gray-900 text-sm px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-accent-400 focus:border-accent-400 transition" />
            </div>
            <FormGrid>
              <FormInput  label="Discount Value" type="number" step="0.01" value={form.Discount_Value} onChange={f('Discount_Value')} required kind="number" placeholder="e.g. 15" />
              <FormSelect label="Status" value={form.Status} onChange={f('Status')} options={STATUSES} />
            </FormGrid>
            <FormGrid>
              <FormInput label="Start Date" type="date" value={form.Start_Date} onChange={f('Start_Date')} required />
              <FormInput label="End Date"   type="date" value={form.End_Date}   onChange={f('End_Date')}   required />
            </FormGrid>
            <FormActions onCancel={closeModal} editing={editing} />
          </form>
        </Modal>
      )}
    </PageLayout>
  );
}
