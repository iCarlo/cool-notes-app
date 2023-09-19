import React from 'react'
import { Button, Form, Modal } from 'react-bootstrap'
import { Note } from '../models/note'
import { useForm } from 'react-hook-form'
import { NoteInput, createNote, updateNote } from '../service/notes_api'
import TextInputField from './form/TextInputField'

interface AddEditNoteDialogProps {
  noteToEdit?: Note,
  onDismiss: () => void,
  onNoteSaved: (note: Note) => void,
}

const AddEditNoteDialog: React.FC<AddEditNoteDialogProps> = ({noteToEdit, onDismiss, onNoteSaved}) => {
  const {register, handleSubmit, formState: {errors, isSubmitting}} = useForm<NoteInput>({
    defaultValues: {
      title: noteToEdit?.title || "",
      text: noteToEdit?.text || ""
    }
  })

  const onSubmit =async (input:NoteInput) => {
    try {
      const res =  await (noteToEdit ? updateNote(noteToEdit._id, input) : createNote(input));
      onNoteSaved(res);

    } catch (err) {
      console.log(err);
      alert(err);
    }

  }

  return (
    <Modal show onHide={onDismiss}>
      <Modal.Header closeButton>
        <Modal.Title>{noteToEdit ? "Edit" : "Add"} Note</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form id='addEditNoteForm' onSubmit={handleSubmit(onSubmit)}>
          <TextInputField 
            name='title'
            label='Title'
            type='text'
            placeholder='Title'
            register={register}
            registerOptions={{required: "Required"}}
            error={errors.title}
          />

          <TextInputField
            name='text'
            label='Text'
            as="textarea"
            placeholder='Text'
            rows={5}
            register={register}
          />
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button
          type='submit'
          form='addEditNoteForm'
          disabled={isSubmitting}
        >
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default AddEditNoteDialog