import db from '../config/database.js'

export const addTask = async (title, description, time, date, user_id) => {
     try {
          const [result] = await db.query('INSERT INTO task_tb (title, description, time, date, user_id) VALUES (?,?,?,?,?)', [title, description, time, date, user_id])
          return result
     } catch (error) {
          console.error(error.message);
     }
}

export const getTask = async (user_id) => {
     try {
          const [result] = await db.query('SELECT * FROM task_tb WHERE user_id = ? ORDER BY date DESC', [user_id])
          return result
     } catch (error) {
          console.error(error.message);
     }
}

export const getaTask = async (id, user_id) => {
     try {
          const [result] = await db.query('SELECT * FROM task_tb WHERE id = ? AND user_id = ?', [id, user_id])
          return result
     } catch (error) {
          console.error(error.message);
     }
}

export const isComplete = async (id, user_id) => {
     try {
          const [result] = await db.query('UPDATE task_tb SET isComplete = 1 WHERE id = ? AND user_id = ?', [id, user_id])
          return result
     } catch (error) {
          console.error(error.message);
     }
}

export const deleteTask = async (id, user_id) => {
     try {
          const [result] = await db.query('DELETE FROM task_tb WHERE id = ? AND user_id = ?', [id, user_id])
          return result
     } catch (error) {
          console.error(error.message);
     }
}

export const correctTask = async (title, description, time, date, user_id, id) => {
     try {
          const [result] = await db.query('UPDATE task_tb SET title = ?, description = ?, time = ?, date = ?, isComplete = 0 WHERE id = ? AND user_id = ?', [title, description, time, date, id, user_id])
          return result
     } catch (error) {
          console.error(error.message);
     }
}