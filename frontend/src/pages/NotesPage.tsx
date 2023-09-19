import React from 'react';
import { Container } from 'react-bootstrap';
import { NotesLogoutView, NotesView } from '../components/NotesView';
import { User } from '../models/user';
import styles from '../styles/NotesPage.module.css';

interface NotesPageProps {
  loggedInUser: User | null,
}

const NotesPage: React.FC<NotesPageProps> = ({loggedInUser}) => {
  return (
    <Container className={styles.notesPage}>
        {
          loggedInUser
          ? <NotesView />
          : <NotesLogoutView />
        }
      </Container>
  )
}

export default NotesPage