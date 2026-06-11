import db from '../config/database.js';

export const addDiary = async (user_id, type, content, created_at) => {
     try {
          const [result] = await db.query('INSERT INTO diary_tb (user_id, type, content, created_at) VALUES (?,?,?,?)',[user_id, type, content, created_at]);
          return result;
     } catch (error) {
          console.error('Database error:', error.message);
          throw error;
     }
}

export const getDiaryByUserId = async (user_id) => {
     try {
          const [result] = await db.query('SELECT * FROM diary_tb WHERE user_id = ? ORDER BY created_at DESC',[user_id]);
          return result;
     } catch (error) {
          console.error('Database error:', error.message);
          throw error;
     }
}

export const removeDiary = async (id, user_id) => {
     try {
          const [result] = await db.query('DELETE FROM diary_tb WHERE id = ? AND user_id = ?', [id, user_id]);
          return result
     } catch (error) {
          console.error('Database error:', error.message);
          throw error;
     }
}