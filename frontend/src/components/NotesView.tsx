import { useEffect, useState } from 'react';
import { Button, Col, Row, Spinner } from 'react-bootstrap';
import { FaPlus } from 'react-icons/fa';
import AddEditNoteDialog from './AddEditNoteDialog';
import Note from './Note';
import { Note as NoteModel } from '../models/note';
import { deleteNote, fetchNotes } from '../service/notes_api';
import styles from '../styles/NotesPage.module.css';
import styleUtils from '../styles/Utils.module.css';

interface FetchNotesState {
  notesLoading: boolean,
  showNotesLoadingError: boolean
}

export const NotesView = () => {
  const [notes, setNotes] = useState<NoteModel[]>([]);

  const [showDialog, setShowDialog] = useState(false);
  const [noteToEdit, setNoteToEdit] = useState<NoteModel|null>(null)

  const [fetchNotesState, setFetchNotesState] = useState<FetchNotesState>({
    notesLoading: true,
    showNotesLoadingError: false
  })

  useEffect(()=> {
    async function loadNotes() {
      try {
        const notes = await fetchNotes();

        setNotes(notes);
      } catch (err) {
        console.log(err);
        setFetchNotesState(prev => {
          return {
            ...prev,
            showNotesLoadingError: true
          }
        })
      } finally {
        setFetchNotesState({
          notesLoading: false,
          showNotesLoadingError: false
        })
      } 
    }

    loadNotes();

  }, [])


  const noteSavedHandler = (newNote: NoteModel) => {
    setNotes((prev) => [...prev, newNote]);
    setShowDialog(false);
  }

  const noteUpdatedHandler = (updatedNote: NoteModel) => {
    setNotes((prev) => prev.map(existingNote => existingNote._id === updatedNote._id ? updatedNote : existingNote));
    setNoteToEdit(null);
    setShowDialog(false);
    
  }

  const deleteNoteHandler = async (note: NoteModel) => {
    try {
      await deleteNote(note._id);
      setNotes(prev => prev.filter(currentNote => currentNote._id !== note._id));

    } catch (err) {
      console.log(err);
      alert(err);
    }
  }


  const notesGrid = <Row xs={1} md={2} lg={3} className={`g-4 ${styles.notesGrid}`}>
  {notes.map(note => (
    <Col key={note._id}>
      <Note 
      note={note} 
      onNoteClicked={setNoteToEdit}
      onDeleteNote={deleteNoteHandler}
      className={styles.note} />
    </Col>
  ))}

  </Row>


  return (
    <>
      <Button 
        className={`${styleUtils.blockCenter} ${styleUtils.flexCenter} mb-4`}
        onClick={() => setShowDialog(true)}>
          <FaPlus />
          Add new note
        </Button>

        {fetchNotesState.notesLoading && <Spinner animation='border' variant='primary' />}
        {fetchNotesState.showNotesLoadingError && <p>Something went wrong. Please refresh the page</p>}
        {!fetchNotesState.notesLoading && !fetchNotesState.showNotesLoadingError && 
          <>
            {notes.length > 0 
            ?  notesGrid
            : <p>You don't have any notes yet.</p>
          }
          </>
        }

        {showDialog && <AddEditNoteDialog onDismiss={() => setShowDialog(false)} onNoteSaved={noteSavedHandler} />}
        
        {noteToEdit && <AddEditNoteDialog noteToEdit={noteToEdit} onDismiss={() => setNoteToEdit(null)} onNoteSaved={noteUpdatedHandler} />}
    </>
  )
}




export const NotesLogoutView = () => {
  return (
    <p>Please login to see your notes.</p>
  )
}

