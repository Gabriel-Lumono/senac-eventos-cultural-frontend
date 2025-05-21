import NavBarComponent from '../../components/NavBar/NavBarComponent'
import styles from './EventsPage.module.css'

function EventsPage () {
    return (
        <>
            <NavBarComponent />
            <h1 className={styles.title}>Página de Eventos</h1>
        </>
        
    )
}

export default EventsPage