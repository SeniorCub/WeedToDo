import db from '../config/database.js'

export const addUser = async (fullname, email, photoUrl) => {
     try {
          const [result] = await db.query('INSERT INTO user_tb (fullname,email,photoUrl) VALUES (?,?,?)', [fullname, email, photoUrl])
          return result
     } catch (error) {
          console.error(error.message);
     }
}

export const getAUser = async (email) => {
     try {
          const [user] = await db.query('SELECT * FROM user_tb WHERE email = ?', [email])
          return user
     } catch (error) {
          console.error(error.message);
     }
}

export const getUserId = async (id) => {
     try {
          const [user] = await db.query('SELECT * FROM user_tb WHERE id = ?', [id])
          return user
     } catch (error) {
          console.error(error.message);
     }
}

export const removeUser = async (id) => {
     try {
          await db.query('DELETE FROM task_tb WHERE user_id = ?', [id])
          await db.query('DELETE FROM note_tb WHERE user_id = ?', [id])
          await db.query('DELETE FROM diary_tb WHERE user_id = ?', [id])
          const [result] = await db.query('DELETE FROM user_tb WHERE id = ?', [id])
          return result
     } catch (error) {
          console.error(error.message);
     }
}

