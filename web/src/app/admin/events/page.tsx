'use client';

import { useEffect, useState } from 'react';
import { API_ENDPOINTS } from '@/lib/api';
import { useAdminAuth, useDebounce } from '@/hooks';
import { AdminLayout, FilterBar, FormModal } from '@/components/admin';
import { StatusBadge } from '@/components/ui/status-badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Event {
  id: string;
  titulo: string;
  descricao: string;
  data: string;
  horaInicio: string;
  horaFim: string;
  local: string;
  categoria: string;
  online: boolean;
  preco: number;
  vagas: number;
  imagem?: string;
  ativo: boolean;
}

export default function AdminEventsPage() {
  useAdminAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    data: '',
    horaInicio: '',
    horaFim: '',
    local: '',
    categoria: 'Evento',
    online: false,
    preco: 0,
    vagas: 50,
    ativo: true,
  });

  const debouncedSearch = useDebounce(search);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(API_ENDPOINTS.events.list, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setEvents(data.eventos || data.data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const url = editingEvent
        ? API_ENDPOINTS.events.update(editingEvent.id)
        : API_ENDPOINTS.events.create;
      const res = await fetch(url, {
        method: editingEvent ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        fetchEvents();
        setShowModal(false);
        resetForm();
      } else {
        alert(data.message || 'Erro ao salvar evento');
      }
    } catch (error) {
      console.error('Error saving event:', error);
      alert('Erro ao salvar evento');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (event: Event) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(API_ENDPOINTS.events.update(event.id), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ativo: !event.ativo }),
      });
      const data = await res.json();
      if (data.success) fetchEvents();
    } catch (error) {
      console.error('Error toggling status:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir?')) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(API_ENDPOINTS.events.delete(id), {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) fetchEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const openEditModal = (event: Event) => {
    setEditingEvent(event);
    setFormData({
      titulo: event.titulo,
      descricao: event.descricao || '',
      data: event.data ? event.data.split('T')[0] : '',
      horaInicio: event.horaInicio || '',
      horaFim: event.horaFim || '',
      local: event.local || '',
      categoria: event.categoria,
      online: event.online || false,
      preco: event.preco || 0,
      vagas: event.vagas || 50,
      ativo: event.ativo,
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setEditingEvent(null);
    setFormData({
      titulo: '', descricao: '', data: '', horaInicio: '', horaFim: '',
      local: '', categoria: 'Evento', online: false, preco: 0, vagas: 50, ativo: true,
    });
  };

  const filteredEvents = events.filter((e) => {
    const matchesSearch = e.titulo.toLowerCase().includes(debouncedSearch.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || e.categoria === categoryFilter;
    const matchesStatus = statusFilter === 'all' || (statusFilter === 'ATIVO' && e.ativo) || (statusFilter === 'INATIVO' && !e.ativo);
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const filterOptions = [
    { value: 'all', label: 'Todas as categorias' },
    { value: 'Evento', label: 'Evento' },
    { value: 'Workshop', label: 'Workshop' },
    { value: 'Palestra', label: 'Palestra' },
    { value: 'Webinar', label: 'Webinar' },
  ];

  const statusOptions = [
    { value: 'all', label: 'Todos os status' },
    { value: 'ATIVO', label: 'Ativo' },
    { value: 'INATIVO', label: 'Inativo' },
  ];

  return (
    <AdminLayout
      title="Gerenciar Eventos"
      actions={<Button onClick={() => { resetForm(); setShowModal(true); }}>+ Novo Evento</Button>}
    >
      <FilterBar
        searchPlaceholder="Buscar eventos..."
        searchValue={search}
        onSearchChange={setSearch}
        filters={[
          { options: filterOptions, value: categoryFilter, onChange: setCategoryFilter },
          { options: statusOptions, value: statusFilter, onChange: setStatusFilter },
        ]}
      />

      {loading ? (
        <div className="text-center py-12">Carregando...</div>
      ) : (
        <div className="bg-white rounded-xl border border-[var(--border)] overflow-hidden">
          <table className="w-full">
            <thead className="bg-[var(--gray-50)]">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium">Título</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Data</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Local</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Categoria</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Vagas</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Status</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredEvents.map((event) => (
                <tr key={event.id} className="border-t border-[var(--border)]">
                  <td className="px-6 py-4">{event.titulo}</td>
                  <td className="px-6 py-4">
                    {event.data ? new Date(event.data).toLocaleDateString('pt-BR') : '-'}
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{event.local || (event.online ? 'Online' : '-')}</td>
                  <td className="px-6 py-4"><span className="px-2 py-1 bg-gray-100 rounded text-sm">{event.categoria}</span></td>
                  <td className="px-6 py-4">{event.vagas || '-'}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={event.ativo ? 'ATIVO' : 'INATIVO'} onClick={() => handleToggleStatus(event)} />
                  </td>
                  <td className="px-6 py-4">
                    <button onClick={() => openEditModal(event)} className="text-secondary hover:underline mr-3">Editar</button>
                    <button onClick={() => handleDelete(event.id)} className="text-red-500 hover:underline">Excluir</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {filteredEvents.length === 0 && !loading && <div className="text-center py-12 text-muted-foreground">Nenhum evento encontrado.</div>}

      <FormModal
        isOpen={showModal}
        onClose={() => { setShowModal(false); resetForm(); }}
        title={editingEvent ? 'Editar Evento' : 'Novo Evento'}
        onSubmit={handleSubmit}
        loading={saving}
        submitLabel={editingEvent ? 'Atualizar' : 'Criar'}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Título *</label>
            <Input value={formData.titulo} onChange={(e) => setFormData({ ...formData, titulo: e.target.value })} required placeholder="Título do evento" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Descrição</label>
            <textarea value={formData.descricao} onChange={(e) => setFormData({ ...formData, descricao: e.target.value })} className="w-full px-3 py-2 border rounded-lg" rows={3} placeholder="Descrição do evento" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Data</label>
              <Input type="date" value={formData.data} onChange={(e) => setFormData({ ...formData, data: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Categoria</label>
              <select value={formData.categoria} onChange={(e) => setFormData({ ...formData, categoria: e.target.value })} className="w-full px-3 py-2 border rounded-lg">
                <option value="Evento">Evento</option>
                <option value="Workshop">Workshop</option>
                <option value="Palestra">Palestra</option>
                <option value="Webinar">Webinar</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Hora Início</label>
              <Input type="time" value={formData.horaInicio} onChange={(e) => setFormData({ ...formData, horaInicio: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Hora Fim</label>
              <Input type="time" value={formData.horaFim} onChange={(e) => setFormData({ ...formData, horaFim: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Local</label>
            <Input value={formData.local} onChange={(e) => setFormData({ ...formData, local: e.target.value })} placeholder="Local do evento" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Vagas</label>
              <Input type="number" value={formData.vagas} onChange={(e) => setFormData({ ...formData, vagas: parseInt(e.target.value) || 0 })} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Preço</label>
              <Input type="number" step="0.01" value={formData.preco} onChange={(e) => setFormData({ ...formData, preco: parseFloat(e.target.value) || 0 })} />
            </div>
            <div className="flex items-center gap-2 pt-6">
              <input type="checkbox" id="online" checked={formData.online} onChange={(e) => setFormData({ ...formData, online: e.target.checked })} />
              <label htmlFor="online" className="text-sm">Online</label>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="ativo" checked={formData.ativo} onChange={(e) => setFormData({ ...formData, ativo: e.target.checked })} />
            <label htmlFor="ativo" className="text-sm">Ativo</label>
          </div>
        </div>
      </FormModal>
    </AdminLayout>
  );
}
