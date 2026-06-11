import { addDiary, getDiaryByUserId, removeDiary } from "../models/diary.model.js";

export const createDiary = async (req, res) => {
     const { type, content, created_at } = req.body;
     const user_id = req.user.id;

     if (!user_id || !type || !created_at) {
          return res.status(400).json({ message: 'Please provide all required fields' });
     }

     try {
          if (type === 'text') {
               if (!content) {
                    return res.status(400).json({ message: 'Content is required for text diary' });
               }

               const result = await addDiary(user_id, type, content, created_at);
               return res.status(201).json({
                    message: 'Diary entry created successfully',
                    data: result
               });
          } else if (type === 'audio') {
               if (!req.file) {
                    return res.status(400).json({ message: 'Audio file is required for audio diary' });
               }

               const filePath = `uploads/${req.file.filename}`;
               const result = await addDiary(user_id, type, filePath, created_at);

               return res.status(201).json({
                    message: 'Audio diary created successfully',
                    data: result
               });
          } else {
               return res.status(400).json({ message: 'Invalid diary type. Must be "text" or "audio"' });
          }
     } catch (error) {
          console.error('Error creating diary:', error.message);
          return res.status(500).json({ message: 'Server error', error: error.message });
     }
}

export const getDiaries = async (req, res) => {
     const user_id = req.user.id;
     if (!user_id) {
          return res.status(400).json({ message: 'Please provide user ID' });
     }
     try {
          const diaries = await getDiaryByUserId(user_id);

          return res.status(200).json({
               message: 'Diaries fetched successfully',
               data: diaries
          });
     } catch (error) {
          console.error('Error fetching diaries:', error.message);
          return res.status(500).json({ message: 'Server error', error: error.message });
     }
}

export const deleteDiary = async (req, res) => {
     const { id } = req.params;
     const user_id = req.user.id;
     if (!id) {
          return res.status(400).json({ message: 'Please provide entry ID' });
     }
     try {
          const result = await removeDiary(id, user_id)
          if (result.affectedRows === 0) {
               return res.status(402).json({ message: 'diary entry not found or deleted' })
          } else {
               res.status(200).json({
                    message: 'diary entry deleted successfully',
                    id: id
               })
          }
     } catch (error) {
          console.error('Error deleting diary entry:', error.message);
          return res.status(500).json({ message: 'Server error', error: error.message });
     }
}