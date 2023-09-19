import { RequestHandler } from "express";
import NoteModel from '../models/note';
import createHttpError from "http-errors";
import mongoose from "mongoose";
import { assertIsDefined } from "../utils/assertIsDefined";


export const getNotes: RequestHandler = async (req, res, next) => {
  const authenticatedUserId = req.session.userId;

  try {

    assertIsDefined(authenticatedUserId);

    const notes = await NoteModel.find({ userId: authenticatedUserId }).exec();
    res.status(200).json(notes);

  } catch (err) {
    next(err)
  }
}

export const getNote: RequestHandler = async (req, res, next) => {
  const noteId = req.params.id;
  const authenticatedUserId = req.session.userId;

  try {
    assertIsDefined(authenticatedUserId);

    if (!mongoose.isValidObjectId(noteId)) {
      throw createHttpError(400, "Not valid note id");
    }

    const note = await NoteModel.findById(noteId).exec();

    if (!note) {
      throw createHttpError(404, "Note not found.")
    }

    if (!note.userId?.equals(authenticatedUserId)) {
      throw createHttpError(401, "You cannot access this note.")
    }

    res.status(200).json(note);

  } catch (err) {
    next(err);
  }
}


interface NoteBody {
  title?: string;
  text?: string;
}

export const createNote: RequestHandler<unknown, unknown, NoteBody, unknown> = async (req, res, next) => {
  const { title, text } = req.body;
  const authenticatedUserId = req.session.userId;


  try {
    assertIsDefined(authenticatedUserId);

    if (!title) {
      throw createHttpError(400, "Note must have a title.")
    }

    const newNote = await NoteModel.create({ userId: authenticatedUserId, title, text });
    res.status(201).json(newNote);

  } catch (err) {
    next(err);
  }
}


interface UpdateNoteParams {
  id: string,
}

export const updateNote: RequestHandler<UpdateNoteParams, unknown, NoteBody, unknown> = async (req, res, next) => {
  const noteId = req.params.id;
  const { title, text } = req.body;
  const authenticatedUserId = req.session.userId;

  try {
    assertIsDefined(authenticatedUserId);

    if (!mongoose.isValidObjectId(noteId)) {
      throw createHttpError(400, "Not valid note id");
    }
    if (!title) {
      throw createHttpError(400, "Note must have a title.")
    }

    const note = await NoteModel.findById(noteId).exec();

    if (!note) {
      throw createHttpError(404, "Note not found.")
    }

    if (!note.userId?.equals(authenticatedUserId)) {
      throw createHttpError(401, "You cannot access this note.")
    }

    note.title = title;
    note.text = text;

    const updatedNote = await note.save();

    res.status(200).json(updatedNote);

  } catch (err) {
    next(err);
  }
}

export const deleteNote: RequestHandler = async (req, res, next) => {
  const noteId = req.params.id;
  const authenticatedUserId = req.session.userId;

  try {
    assertIsDefined(authenticatedUserId);

    if (!mongoose.isValidObjectId(noteId)) {
      throw createHttpError(400, "Not valid note id");
    }

    const note = await NoteModel.findById(noteId).exec();

    if (!note) {
      throw createHttpError(404, "Note not found.")
    }

    if (!note.userId?.equals(authenticatedUserId)) {
      throw createHttpError(401, "You cannot access this note.")
    }

    await note.deleteOne();

    res.sendStatus(204);

  } catch (err) {
    next(err);
  }
}