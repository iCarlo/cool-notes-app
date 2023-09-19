import styles from "../styles/Note.module.css";
import stylesUtils from "../styles/Utils.module.css";
import { Card } from "react-bootstrap"
import { Note as NoteModel } from "../models/note"
import { formatDate } from "../utils/formatDate";
import {MdDelete} from 'react-icons/md';

interface NoteProps {
  note: NoteModel,
  onNoteClicked: (note: NoteModel) => void,
  onDeleteNote: (note: NoteModel) => void,
  className?: string
}


const Note: React.FC<NoteProps> = ({note, onNoteClicked, onDeleteNote, className}) => {
  const {
    title,
    text,
    createdAt,
    updatedAt
  } = note;

  const generateFormatedDate = () => {
    let formatedDate: string;

    if(updatedAt > createdAt) {
      formatedDate = 'Updated: ' + formatDate(updatedAt);
    } else {
      formatedDate = 'Created: ' + formatDate(createdAt);
    }

    return formatedDate;
  }

  return (
   <Card 
    className={`${styles.noteCard} ${className}`}
    onClick={() => onNoteClicked(note)}
   >
    <Card.Body className={styles.cardBody}>
      <Card.Title className={stylesUtils.flexCenter}>
        {title}
        <MdDelete 
        className='text-muted ms-auto'
        onClick={(e) => {
          onDeleteNote(note);
          e.stopPropagation();
        }}
        />
      </Card.Title>
      <Card.Text className={styles.cardText}>{text}</Card.Text>
    </Card.Body>
    <Card.Footer className="text-muted">{generateFormatedDate()}</Card.Footer>
   </Card>
  )
}

export default Note;