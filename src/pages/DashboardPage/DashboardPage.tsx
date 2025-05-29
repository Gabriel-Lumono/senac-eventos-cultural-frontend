import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router';
import styles from './DashboardPage.module.css';

import NavBarComponent from '../../components/NavBar/NavBarComponent';
import ParticipantsModal from '../../components/ParticipantsModal/ParticipantsModal';

interface Event {
  id: number;
  title: string;
  description: string;
  location: string;
  bannerUrl: string;
  price: number | null;
  createdAt: string;
  subscriptionCount: number;
}

const baseUrl = 'https://senac-eventos-cultural-backend-production.up.railway.app';

const getToken = () => localStorage.getItem('token');

function DashboardPage() {
  const navigate = useNavigate();

  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [viewingEventId, setViewingEventId] = useState<number | null>(null);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [formData, setFormData] = useState<Partial<Event & { bannerFile?: File }>>({});

  const [modalError, setModalError] = useState<string | null>(null);
  const [modalSuccess, setModalSuccess] = useState<boolean>(false);

  const fetchEvents = async () => {
    const token = getToken();
    if (!token) {
      setError('Token não encontrado');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${baseUrl}/events/myevents`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error(`Erro ${res.status}`);

      const data: Event[] = await res.json();
      setEvents(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar eventos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const openEditModal = (event: Event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description,
      location: event.location,
      price: event.price ?? 0,
    });
    setModalError(null);
    setModalSuccess(false);
  };

  const handleUpdate = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingEvent) return;

    const token = getToken();
    if (!token) {
      setModalError('Token não encontrado');
      return;
    }

    const fd = new FormData();
    fd.append('title', formData.title!);
    fd.append('description', formData.description!);
    fd.append('location', formData.location!);
    fd.append('price', String(formData.price ?? 0));
    if (formData.bannerFile) {
      fd.append('banner', formData.bannerFile);
    }

    try {
      const res = await fetch(`${baseUrl}/events/${editingEvent.id}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || `Erro ${res.status}`);
      }

      setModalSuccess(true);
      fetchEvents();
      setEditingEvent(null);
    } catch (err) {
      setModalError(err instanceof Error ? err.message : 'Erro ao atualizar evento');
    }
  };

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm('Confirmar exclusão deste evento?');
    if (!confirmed) return;

    const token = getToken();
    if (!token) {
      alert('Token não encontrado');
      return;
    }

    try {
      const res = await fetch(`${baseUrl}/events/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error(`Erro ${res.status}`);

      fetchEvents();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erro ao apagar evento');
    }
  };

  if (loading) return <div className={styles.loading}>Carregando eventos…</div>;
  if (error) return <p className={styles.error}>{error}</p>;

  return (
    <>
      <NavBarComponent />
      <div className={styles.container}>
        <h1>Meus Eventos</h1>
        <div className={styles.addButtonContainer}>
          <button className={styles.addButton} onClick={() => navigate('/create_events')}>
            + Criar novo evento
          </button>
        </div>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Título</th>
              <th>Inscritos</th>
              <th>Criado em</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {events.map(event => (
              <tr key={event.id}>
                <td>{event.title}</td>
                <td>{event.subscriptionCount}</td>
                <td>{new Date(event.createdAt).toLocaleDateString()}</td>
                <td className={styles.actions}>
                  <button onClick={() => setViewingEventId(event.id)}>Visualizar participantes</button>
                  <button onClick={() => openEditModal(event)}>Editar</button>
                  <button
                    className={styles.deleteBtn}
                    onClick={() => handleDelete(event.id)}
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {viewingEventId !== null && (
        <ParticipantsModal
          eventId={viewingEventId}
          onClose={() => setViewingEventId(null)}
        />
      )}

      {editingEvent && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2>Editar Evento</h2>
            {modalError && <div className={styles.error}>{modalError}</div>}
            {modalSuccess && <div className={styles.success}>Evento atualizado com sucesso!</div>}
            <form onSubmit={handleUpdate}>
              <label>
                Título
                <input
                  type="text"
                  value={formData.title || ''}
                  onChange={e => setFormData(f => ({ ...f, title: e.target.value }))}
                  required
                />
              </label>
              <label>
                Descrição
                <textarea
                  value={formData.description || ''}
                  onChange={e => setFormData(f => ({ ...f, description: e.target.value }))}
                  required
                />
              </label>
              <label>
                Localização
                <input
                  type="text"
                  value={formData.location || ''}
                  onChange={e => setFormData(f => ({ ...f, location: e.target.value }))}
                  required
                />
              </label>
              <label>
                Preço (R$)
                <input
                  type="number"
                  min="0"
                  value={formData.price ?? ''}
                  onChange={e => setFormData(f => ({ ...f, price: Number(e.target.value) }))}
                  required
                />
              </label>
              <label>
                Novo Banner (opcional)
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => {
                    const file = e.target.files?.[0];
                    setFormData(f => ({ ...f, bannerFile: file }));
                  }}
                />
              </label>
              <div className={styles.modalActions}>
                <button type="button" onClick={() => setEditingEvent(null)}>
                  Cancelar
                </button>
                <button type="submit">Salvar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default DashboardPage;