import React, {useEffect, useState, type FormEvent} from "react";
import styles from './DashboardPage.module.css';
import NavBarComponent from "../../components/NavBar/NavBarComponent";
import { useNavigate } from "react-router";

interface Event {
    id: number;
    title:string;
    description:string;
    Location:string;
    bannerUrl:string;
    price:number | null;
    createdAt:string;
    subscriptionCount: number;
}

function DashBoardPage() {
    const navigate = useNavigate();
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [editing, setEditing] = useState<Event | null>(null);
    const [formData, setFormData] = useState<Partial<Event & {bannerFile?: File}>>({});
    const [modalError, setModalError] = useState<string | null>(null);
    const [modalSucess,setModalSucess] = useState<boolean>(false);

    const baseUrl = 'https://senac-eventos-cultural-backend-production.up.railway.app';

    const fetchEvents = async () => {
        setLoading(true);
        const token = LocalStorage.getItem('token');
        try {
            const res = await fetch(`${baseUrl}/events/myevents`, {
                headers: { Authorization: `Bearer ${token}`}
            });
            if (!res.ok) throw new Error(`Error ${res.status}`);
            const data: Events[] = await res.json();
            setEvents(data);
        }   catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message || 'Erro ao buscar eventos');
            } else {
                setError('Erro ao buscar eventos');
            } finally {
                setLoading(false);
            }
        };
    }

        const openEditModal = (evt: Event) => {
            setEditing(evt); 
            setFormData({
                title: evt.title,
                description: evt.description,
                Location: evt.Location,
                price: evt.price ?? 0
            });
            setModalError(null)
            setModalSucess(false)
        }

        const handleUpdate = async (e: FormEvent) => {
            e.preventDefault();
            if (!editing) return;
            setMordalError(null);
            setModalSucess(false);

            const token = localStorage.getItem('token');
            const fd = new FormData();
            fd.append('title', formData.title!);
            fd.append('description', formData.description);
            fd.append('location', formData.location!);
            fd.append('price', String(formData.price ?? 0));
            if (formData.bannerFile) fd.append('banner', formData.bannerFile);

            try {
                const res = await fetch(`${baseUrl}/events/${editing.id}`, {
                    method: 'PUT',
                    headers: { Authorization: `Bearer ${token}` },
                    body: fd
                });
                if (!res.ok) {
                    const err = await res.json();
                    throw new Error(err.message || `Error ${res.status}`);
                }
                setModalSucess(true); 
                fetchEvents();
                setEditing(null);
            } catch (err.unknown) {

            }
        };
        
        const handleDeLete = async (id:number) => {
            method: 'DELETE',
            headers: { Authorization: `Baber ${token}`,}
        });
        if (!res.ok) throw new Error(`Erro ${token}`);
        fetchEvents();
    }   catch (err: unknown) {
        if (err instanceof Error) {
            alert(err.message) || 'Erro ao apagar evento');
        } else {
            alert('Erro ao apagar evento');
        }
    }


    if (loading) return (
        <div className={styles.loading}>
            Carregando eventos...
        </div>
    )


    return() {
        <>
            <NavBarComponent/>
            <div className={styles.container}>
            <h1>Meus eventos</h1>
            <div className={styles.addButtonContainer}>
                
            </div>

            
            </div>

            {editing && ()}
        </>
    }


export default DashBoardPage    