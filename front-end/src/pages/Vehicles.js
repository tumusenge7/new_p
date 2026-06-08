import React from 'react';
import { PageLayout } from '../components/PageLayout';
import { Modal, Alert, Badge, SearchBar, FormInput, FormSelect, btnPrimary, btnEdit, btnDelete, TABLE_TH, TABLE_TD, Card, TableEmpty, FormActions, FormGrid } from '../components/UI';
import useCrud from '../hooks/useCrud';

const EMPTY    = { Plate_Number:'', Brand:'', Model:'', Year:'', Vehicle_Type:'', Purchase_Price:'', Status:'Available' };
const STATUSES = ['Available','Rented','Sold','Under Maintenance'];
const TYPES    = ['Sedan','SUV','Van','Truck','Hatchback','Coupe','Convertible'];

export default function Vehicles() {
  const { data: vehicles, search, setSearch, load, alert, form, f, editing, modal, closeModal, openAdd, openEdit, handleSubmit, handleDelete } = useCrud('/vehicles', 'Vehicle', { initialForm: EMPTY });

  return (
    <PageLayout title="Vehicles" subtitle="Manage fleet inventory and registration"
      action={<button type="button" onClick={openAdd} className={btnPrimary}>+ Add Vehicle</button>}>
      {alert && <Alert {...alert} />}
      <SearchBar value={search} onChange={q => { setSearch(q); load(q); }} placeholder="Search by brand, model or plate..." />

      <Card>
        <table className="hidden sm:table min-w-full">
          <thead className="bg-blue-900 text-white border-b-[3px] border-accent-500">
            <tr>{['#','Plate','Brand','Model','Year','Type','Price','Status','Registered By','Actions'].map(h=><th key={h} className={TABLE_TH}>{h}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {vehicles.length===0 && <TableEmpty colSpan={10} message="No vehicles found" />}
            {vehicles.map((v,i) => (
              <tr key={v.id} className="hover:bg-accent-50 transition-colors">
                <td className={TABLE_TD}>{i+1}</td>
                <td className={`${TABLE_TD} font-mono font-medium`}>{v.Plate_Number}</td>
                <td className={TABLE_TD}>{v.Brand}</td>
                <td className={TABLE_TD}>{v.Model}</td>
                <td className={TABLE_TD}>{v.Year}</td>
                <td className={TABLE_TD}>{v.Vehicle_Type}</td>
                <td className={TABLE_TD}>{Number(v.Purchase_Price).toLocaleString()} RWF</td>
                <td className={TABLE_TD}><Badge label={v.Status} /></td>
                <td className={TABLE_TD}>{v.RegisteredByName||'—'}</td>
                <td className={`${TABLE_TD} flex gap-2`}>
                  <button type="button" onClick={()=>openEdit(v)} className={btnEdit}>Edit</button>
                  <button type="button" onClick={()=>handleDelete(v.id)} className={btnDelete}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex flex-col divide-y divide-gray-100 sm:hidden">
          {vehicles.length===0 && <p className="text-center py-10 text-gray-400 text-sm">No vehicles found</p>}
          {vehicles.map(v => (
            <div key={v.id} className="px-4 py-4 hover:bg-accent-50 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-blue-900 font-mono">{v.Plate_Number}</span>
                <Badge label={v.Status} />
              </div>
              <div className="space-y-1 mb-3 text-sm">
                {[['Brand / Model',`${v.Brand} ${v.Model}`],['Year / Type',`${v.Year} · ${v.Vehicle_Type}`],['Price',`${Number(v.Purchase_Price).toLocaleString()} RWF`],['Registered',v.RegisteredByName||'—']].map(([l,val])=>(
                  <div key={l} className="flex justify-between gap-2">
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide w-28 shrink-0">{l}</span>
                    <span className="text-gray-800 text-right">{val}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={()=>openEdit(v)} className={btnEdit}>Edit</button>
                <button type="button" onClick={()=>handleDelete(v.id)} className={btnDelete}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {modal && (
        <Modal title={editing ? 'Edit Vehicle' : 'Add Vehicle'} onClose={closeModal}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormGrid>
              <FormInput label="Plate Number" value={form.Plate_Number} onChange={f('Plate_Number')} required kind="alphanumeric" placeholder="e.g. RAA 001A" />
              <FormInput label="Brand"        value={form.Brand}        onChange={f('Brand')}        required kind="text" />
            </FormGrid>
            <FormGrid>
              <FormInput label="Model" value={form.Model} onChange={f('Model')} required kind="alphanumeric" />
              <FormInput label="Year"  type="number" value={form.Year} onChange={f('Year')} required kind="year" placeholder="e.g. 2023" />
            </FormGrid>
            <FormGrid>
              <FormSelect label="Vehicle Type"   value={form.Vehicle_Type}   onChange={f('Vehicle_Type')}   options={TYPES}    required />
              <FormInput  label="Purchase Price" type="number" step="0.01" value={form.Purchase_Price} onChange={f('Purchase_Price')} required kind="number" placeholder="e.g. 25000" />
            </FormGrid>
            <FormSelect label="Status" value={form.Status} onChange={f('Status')} options={STATUSES} />
            <FormActions onCancel={closeModal} editing={editing} />
          </form>
        </Modal>
      )}
    </PageLayout>
  );
}
