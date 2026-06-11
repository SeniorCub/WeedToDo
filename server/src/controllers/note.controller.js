import { addFav, addNote, correctNote, getallNotes, getNote, removeNote } from "../models/note.model.js";

export const createNote = async (req, res) => {
     const { title, contet, category } = req.body;
     const user_id = req.user.id;
     if (!title || !contet || !category || !user_id) {
          return res.status(402).json({ message: 'please provide all details' })
     }
     try {
          const result = await addNote(title, contet, category, user_id);

          if (result.affectedRows === 0) {
               return res.status(402).json({ message: 'note not created' })
          } else {
               res.status(200).json({
                    message: 'note created successfully',
                    data: {
                         Id: result.insertId,
                         user_id: user_id
                    }
               })
          }
     } catch (error) {
          console.error(error.message)
          return res.status(500).json({ message: 'Server error', error: error.message });
     }
}

export const editNote = async (req, res) => {
     const { title, contet, category } = req.body;
     const user_id = req.user.id;
     if (!title || !contet || !category || !user_id) {
          return res.status(402).json({ message: 'please provide all details' })
     }
     const { id } = req.params
     if (!id) {
          return res.status(402).json({ message: 'please provide note id' })
     }
     try {
          const result = await correctNote(title, contet, category, user_id, id);
          console.log(result)
          if (result.affectedRows === 0) {
               return res.status(402).json({ message: 'Provide valid id' })
          } else {
               res.status(200).json({
                    message: 'note updated successfully',
                    data: {
                         Id: id,
                         user_id: user_id
                    }
               })
          }
     } catch (error) {
          console.error(error.message)
          return res.status(500).json({ message: 'Server error', error: error.message });
     }
}

export const fetchallNotes = async (req, res) => {
     const user_id = req.user.id;
     if (!user_id) {
          return res.status(402).json({ message: 'please provide user id' })
     }
     try {
          const result = await getallNotes(user_id)
          res.status(200).json({
               message: 'Notes fetched successfully',
               data: result
          })
     } catch (error) {
          console.error(error.message)
          return res.status(500).json({ message: 'Server error', error: error.message });
     ;
     }
}

export const fetchNote = async (req, res) => {
     const { id } = req.params;
     const user_id = req.user.id;
     if (!id) {
          return res.status(402).json({ message: 'please provide note id' })
     }
     try {
          const result = await getNote(id, user_id)
          res.status(200).json({
               message: 'note fetched successfully',
               data: result
          })
     } catch (error) {
          console.error(error.message)
          return res.status(500).json({ message: 'Server error', error: error.message });
     ;
     }
}

export const deleteNote = async (req, res) => {
     const { id } = req.params;
     const user_id = req.user.id;
     if (!id) {
          return res.status(402).json({ message: 'please provide note id' })
     }
     try {
          const result = await removeNote(id, user_id)
          if (result.affectedRows === 0) {
               return res.status(402).json({ message: 'note not found or deleted' })
          } else {
               res.status(200).json({
                    message: 'note deleted successfully',
                    id: id
               })
          }
     } catch (error) {
          console.error(error.message)
          return res.status(500).json({ message: 'Server error', error: error.message });
     }
}

export const favNote = async (req, res) => {
     const { id } = req.params;
     const user_id = req.user.id;
     if (!id) {
          return res.status(402).json({ message: 'please provide note id' })
     }
     try {
          const result = await addFav(id, user_id)
          if (result.affectedRows === 0) {
               return res.status(402).json({ message: 'note not found or added to favourite' })
          } else {
               res.status(200).json({
                    message: 'note added to favourite successfully',
                    id: id
               })
          }
     } catch (error) {
          console.error(error.message)
          return res.status(500).json({ message: 'Server error', error: error.message });
     } 
}