import { Note } from "../models/note";
import env from '../utils/validateEnv'
import { fetchData } from "./fetchData";

const API_URI = env.REACT_APP_REST_API + "/notes";


export const fetchNotes = async (): Promise<Note[]> => {
  const res = await fetchData(API_URI, { method: 'GET', credentials: "include" });
  return res.json();
}

export interface NoteInput {
  title: string,
  text?: string,
}

export const createNote = async (note: NoteInput): Promise<Note> => {
  const res = await fetchData(API_URI,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(note),
      credentials: "include"
    }
  );

  return res.json();
}

export const updateNote = async (id: string, note: NoteInput): Promise<Note> => {
  const res = await fetchData(`${API_URI}/${id}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(note),
      credentials: "include"
    }
  );

  return res.json();
}

export const deleteNote = async (id: string) => {
  await fetchData(`${API_URI}/${id}`, { method: 'DELETE', credentials: "include" })
}