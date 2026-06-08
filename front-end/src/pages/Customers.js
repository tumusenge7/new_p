import React from 'react';
import { PageLayout } from '../components/PageLayout';
import { Modal, Alert, Badge, SearchBar, FormInput, FormSelect, btnPrimary, btnEdit, btnDelete, TABLE_TH, TABLE_TD, Card, TableEmpty, FormActions, FormGrid } from '../components/UI';
import useCrud from '../hooks/useCrud';

const EMPTY    = { FirstName:'', LastName:'', Email:'', PhoneNumber:'', Status:'Active' };
const STATUSES = ['Active','Inactive','Blocked'];

export default function Customers() {
  const { data: customers, search, setSearch, load, alert, form, f, editing, modal, closeModal, openAdd, openEdit, handleSubmit, handleDelete } = useCrud('/customers', 'Customer', { initialForm: EMPTY });

  return (
    <PageLayout title="Customers" subtitle="Manage customer profiles and account status"
      action={<button type="button" onClick={openAdd} className={btnPrimary}>+ Add Customer</button>}>
      {alert && <Alert {...alert} />}
      <SearchBar value={search} onChange={q => { setSearch(q); load(q); }} placeholder="Search by name or email..." />

      <Card>
        <table className="hidden sm:table min-w-full">
          <thead className="bg-blue-900 text-white border-b-[3px] border-accent-500">
            <tr>{['#','Name','Email','Phone','Status','Joined','Actions'].map(h=><th key={h} className={TABLE_TH}>{h}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {customers.length===0 && <TableEmpty colSpan={7} message="No customers found" />}
            {customers.map((c,i) => (
              <tr key={c.id} className="hover:bg-accent-50 transition-colors">
                <td className={TABLE_TD}>{i+1}</td>
                <td className={`${TABLE_TD} font-medium`}>{c.FirstName} {c.LastName}</td>
                <td className={TABLE_TD}>{c.Email}</td>
                <td className={TABLE_TD}>{c.PhoneNumber}</td>
                <td className={TABLE_TD}><Badge label={c.Status} /></td>
                <td className={TABLE_TD}>{new Date(c.CreatedAt).toLocaleDateString()}</td>
                <td className={`${TABLE_TD} flex gap-2`}>
                  <button type="button" onClick={()=>openEdit(c)} className={btnEdit}>Edit</button>
                  <button type="button" onClick={()=>handleDelete(c.id)} className={btnDelete}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex flex-col divide-y divide-gray-100 sm:hidden">
          {customers.length===0 && <p className="text-center py-10 text-gray-400 text-sm">No customers found</p>}
          {customers.map(c => (
            <div key={c.id} className="px-4 py-4 hover:bg-accent-50 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-blue-900">{c.FirstName} {c.LastName}</span>
                <Badge label={c.Status} />
              </div>
              <div className="space-y-1 mb-3 text-sm">
                {[['Email',c.Email],['Phone',c.PhoneNumber],['Joined',new Date(c.CreatedAt).toLocaleDateString()]].map(([l,val])=>(
                  <div key={l} className="flex justify-between gap-2">
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide w-28 shrink-0">{l}</span>
                    <span className="text-gray-800 text-right text-xs">{val}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={()=>openEdit(c)} className={btnEdit}>Edit</button>
                <button type="button" onClick={()=>handleDelete(c.id)} className={btnDelete}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {modal && (
        <Modal title={editing ? 'Edit Customer' : 'Add Customer'} onClose={closeModal}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormGrid>
              <FormInput label="First Name" value={form.FirstName} onChange={f('FirstName')} required kind="text" />
              <FormInput label="Last Name"  value={form.LastName}  onChange={f('LastName')}  required kind="text" />
            </FormGrid>
            <FormInput label="Email" type="email" value={form.Email} onChange={f('Email')} required />
            <FormGrid>
              <FormInput  label="Phone Number" value={form.PhoneNumber} onChange={f('PhoneNumber')} required kind="phone" placeholder="+250780001001" />
              <FormSelect label="Status" value={form.Status} onChange={f('Status')} options={STATUSES} />
            </FormGrid>
            <FormActions onCancel={closeModal} editing={editing} />
          </form>
        </Modal>
      )}
    </PageLayout>
  );
}
