import React, { useEffect, useState } from "react";
import styles from './HomePage.module.css';
import NavBarComponent from "../../components/NavBar/NavBarComponent";

interface Event {
  id: number;
  title: string;
  description: string;
  location: string;
  bannerUrl: string;
  price: number;
  organizerId: number;
  createAt: string;
}

export default function HomePage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Usuário não autenticado.');
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(
          'https://senac-eventos-cultural-backend-production.up.railway.app/events',
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.message || `Erro ${res.status}`);
        }

        const data: Event[] = await res.json();
        setEvents(data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <div className={styles.loading}>
        Carregando eventos...
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <p>Erro: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <NavBarComponent />
      <div className={styles.container}>
        <h1>Eventos Cadastrados</h1>
        {events.length === 0 ? (
          <p>Nenhum evento encontrado.</p>
        ) : (
          <div className={styles.grid}>
            {events.map((evt) => (
              <div key={evt.id} className={styles.card}>
                <img
                  src={evt.bannerUrl}
                  alt={`Banner de ${evt.title}`}
                  className={styles.banner}
                />
                <div className={styles.info}>
                  <h2 className={styles.title}>{evt.title}</h2>
                  <p className={styles.location}>Local: {evt.location}</p>
                  <p className={styles.description}>{evt.description}</p>
                  <p className={styles.price}>
                    {evt.price > 0 ? `R$ ${evt.price.toFixed(2)}` : "Gratuito"}
                  </p>
                  <p className={styles.date}>
                    Criado em: {new Date(evt.createAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}