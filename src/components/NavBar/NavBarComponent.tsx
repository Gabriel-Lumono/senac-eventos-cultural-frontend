import styles from './NavBar.module.css'
import { Link } from 'react-router'
import { useAuth } from '../../contexts/AuthContext'

export default function NavBarComponent() {
  const { user, logout } = useAuth()

  return (
    <nav className={styles.menu}>
      <div className={styles.logo}>Logo</div>
      <Link to="/">
        <div className={styles.logo}>
          <img src='/src/assets/Senac_logo.svg.png'></img>
        </div>
      </Link>

      <div className={styles['nav-links']}>
        {user ? (
          <>
            <Link to="/events">Eventos</Link>
            <Link to="/">Eventos</Link>
            <Link to="/my-events">Meus Eventos</Link>
            {user.role === 'ORGANIZER' && (
              <><Link to="/create_events">Painel de Eventos</Link>
              <Link to="/dashboard">Painel de Eventos</Link></>
            )}
            <button onClick={logout}>Sair</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Cadastro</Link>
          </>
        )}
      </div>
    </nav>
  )
}