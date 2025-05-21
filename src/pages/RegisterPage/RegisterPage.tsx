// src/pages/Register.tsx
import React, { useState, type FormEvent } from 'react';
import styles from './RegisterPage.module.css';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';

interface RegisterProps {
  onRegisterSuccess?: () => void;
}

const RegisterPage: React.FC<RegisterProps> = ({ onRegisterSuccess }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'PARTICIPANT' | 'ORGANIZER'>('PARTICIPANT');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await fetch(
        'https://senac-eventos-cultural-backend-production.up.railway.app/auth/register',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password, role }),
        }
      );
      
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Falha no registro');
      }
      alert('Cadastro realizado com sucesso!');
      onRegisterSuccess?.();
      window.location.href = '/login';
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg);
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2 className={styles.title}>Registrar Usuário</h2>
        
        {
          error && <div className={styles.error}>{error}</div>
        }

        <label htmlFor="name" className={styles.label}>Nome</label>
        <input
          id="name"
          type="text"
          className={styles.input}
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />

        <label htmlFor="email" className={styles.label}>Email</label>
        <input
          id="email"
          type="email"
          className={styles.input}
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />

        <label htmlFor="password" className={styles.label}>Senha</label>
        <input
          id="password"
          type="password"
          className={styles.input}
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />

        <label htmlFor="role" className={styles.label}>Tipo</label>
        <select
          id="role"
          className={styles.select}
          value={role}
          onChange={e => setRole(e.target.value as 'PARTICIPANT' | 'ORGANIZER')}
        >
          <option value="PARTICIPANT">Participante</option>
          <option value="ORGANIZER">Organizador</option>
        </select>

        <ButtonComponent type="submit" text="Registrar" />
      </form>
    </div>
  );
};

export default RegisterPage;