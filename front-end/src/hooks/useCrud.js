import { useState, useEffect, useCallback } from 'react';
import API from '../api';
import { useFlash, useForm } from '../components/UI';

export default function useCrud(endpoint, entityName, { initialForm, onOpenEdit } = {}) {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
  const { alert, flash } = useFlash();
  const { form, setForm, f, reset: resetForm } = useForm(initialForm ?? {});
  const [editing, setEditing] = useState(null);
  const [modal, setModal] = useState(false);

  const load = useCallback(async (q = '') => {
    const r = await API.get(`${endpoint}?search=${q}`);
    setData(r.data);
  }, [endpoint]);

  useEffect(() => { load(); }, [load]);

  const openAdd = useCallback(() => {
    resetForm();
    setEditing(null);
    setModal(true);
  }, [resetForm]);

  const openEdit = useCallback((item) => {
    if (onOpenEdit) {
      setForm(onOpenEdit(item));
    } else {
      setForm(item);
    }
    setEditing(item.id);
    setModal(true);
  }, [onOpenEdit, setForm]);

  const handleSubmit = useCallback(async (e) => {
    e?.preventDefault();
    try {
      if (editing) {
        await API.put(`${endpoint}/${editing}`, form);
        flash(`${entityName} updated`);
      } else {
        await API.post(endpoint, form);
        flash(`${entityName} added`);
      }
      setModal(false);
      load(search);
    } catch (err) {
      flash(err.response?.data?.message || 'Error', 'error');
    }
  }, [editing, form, endpoint, entityName, flash, load, search]);

  const handleDelete = useCallback(async (id, confirmMsg) => {
    if (!window.confirm(confirmMsg || `Delete this ${entityName.toLowerCase()}?`)) return;
    try {
      await API.delete(`${endpoint}/${id}`);
      flash(`${entityName} deleted`);
      load(search);
    } catch (err) {
      flash(err.response?.data?.message || 'Error', 'error');
    }
  }, [endpoint, entityName, flash, load, search]);

  const closeModal = useCallback(() => setModal(false), []);

  return {
    data, setData, search, setSearch, load,
    alert, flash,
    form, setForm, f, editing, setEditing,
    modal, setModal, closeModal,
    openAdd, openEdit, handleSubmit, handleDelete,
  };
}
