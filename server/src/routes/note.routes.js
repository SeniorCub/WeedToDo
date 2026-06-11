import express from "express";
import { createNote, deleteNote, fetchallNotes, fetchNote, editNote, favNote } from "../controllers/note.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { noteSchema } from "../validators/index.js";

const router = express.Router();

router.post('/create', protect, validate(noteSchema), createNote)
router.get('/allnotes/:user_id', protect, fetchallNotes)
router.get('/note/:id', protect, fetchNote)
router.delete('/delete/:id', protect, deleteNote)
router.post('/edit/:id', protect, validate(noteSchema), editNote)
router.put('/fav/:id', protect, favNote)


export default router