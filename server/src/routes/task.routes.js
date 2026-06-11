import express from "express";
import { createTask, fetchTask, completeTask, deleteTasks, fetchAtask, editTask } from "../controllers/task.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { taskSchema } from "../validators/index.js";

const router = express.Router()

router.post('/create', protect, validate(taskSchema), createTask)
router.get('/alltasks/:user_id', protect, fetchTask)
router.get('/task/:id', protect, fetchAtask)
router.put('/complete/:id', protect, completeTask)
router.delete('/delete/:id', protect, deleteTasks)
router.post('/edit/:id', protect, validate(taskSchema), editTask)

export default router