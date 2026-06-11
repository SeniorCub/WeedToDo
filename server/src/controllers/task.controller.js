import { addTask, getTask, isComplete, deleteTask, getaTask, correctTask } from "../models/task.model.js";

export const createTask = async (req, res) => {
     const {title, description, time, date} = req.body
     const user_id = req.user.id;
     if (!title || !description || !time || !date || !user_id) {
          return res.status(400).json({message:'all fields are required'})
     }
     try {
          const result = await addTask(title, description, time, date, user_id)

          if(result.affectedRows === 0){
               res.status(402).json({message:'task not created'})
           } else {
               res.status(200).json({
                    message:'task created successfully', 
                    id:result.insertId, 
                    user_id: parseInt(user_id) 
               })
           }
     } catch (error) {
          console.error(error.message);
          return res.status(500).json({ message: 'Server error', error: error.message });
     }
}

export const fetchTask = async (req, res) => {
     const user_id = req.user.id;
     if (!user_id) {
          return res.status(400).json({message:'user_id is required'})
     }
     try {
          const result = await getTask(user_id)
          res.status(200).json({
               message:'task fetched successfully', 
               data: result
          })
     } catch (error) {
          console.error(error.message);
          return res.status(500).json({ message: 'Server error', error: error.message });
     }
}

export const fetchAtask = async (req, res) => {
     const {id} = req.params
     const user_id = req.user.id;
     if (!id) {
          return res.status(400).json({message:'id is required'})
     }
     try {
          const result = await getaTask(id, user_id)
          res.status(200).json({
               message:'task found', 
               data: result})
     } catch (error) {
          console.error(error.message);
          return res.status(500).json({ message: 'Server error', error: error.message });
     }
}

export const completeTask = async (req, res) => {
     const {id} = req.params
     const user_id = req.user.id;
     if (!id) {
          return res.status(400).json({message:'id is required'})
     }
     try {
          const result = await isComplete(id, user_id)

          if(result.affectedRows === 0){
               res.status(402).json({message:'task not found or updated'})
           } else {
               res.status(200).json({
                    message:'task completed successfully', 
                    id: parseInt(id)
               })
           }
     } catch (error) {
          console.error(error.message);
          return res.status(500).json({ message: 'Server error', error: error.message });
     }
}

export const deleteTasks = async (req, res) => {
     const {id} = req.params
     const user_id = req.user.id;
     if (!id) {
          return res.status(400).json({message:'id is required'})
     }
     try {
          const result = await deleteTask(id, user_id)
          if (result.affectedRows === 0) {
               return res.status(402).json({ message: 'task not found or deleted' })
          } else {
               res.status(200).json({
                    message: 'task deleted successfully',
                    id: id
               })
          }
     } catch (error) {
          console.error(error.message);
          return res.status(500).json({ message: 'Server error', error: error.message });
     }
}

export const editTask = async (req, res) => {
     const {id} = req.params
     const {title, description, time, date} = req.body
     const user_id = req.user.id;
     if (!id) {
          return res.status(400).json({message:'id is required'})
     }
     try {
          const result = await correctTask(title, description, time, date, user_id, id)
          if(result.affectedRows === 0){
               res.status(402).json({message:'task not found or updated'})
           } else {
               res.status(200).json({
                    message:'task updated successfully', 
                    id: parseInt(id)
               })
           }
     } catch (error) {
          console.error(error.message);
          return res.status(500).json({ message: 'Server error', error: error.message });
     }
}