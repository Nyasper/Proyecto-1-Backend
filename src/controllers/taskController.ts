import { Router } from 'express';
import { TaskInterface, taskToUpdate } from '../interfaces';
import TaskService from '../services/taskService';

const router = Router();

router.post('/', (req, res) => {
	try {
		const task = req.body as TaskInterface;

		if (!task.title || !task.description || !req.session.userId)
			return res.status(400).send('Bad Request');

		TaskService.createTask(req.session.userId, task);

		return res.status(201).send('tarea creada');
	} catch (error) {
		console.log(error);
		return res.status(500).send('Internal Server Error');
	}
});

router.get('/all', (req, res) => {
	try {
		const tasks = TaskService.getAllUserTasks(req.session.userId as string);
		console.log('el id del user', req.session.userId);
		if (!tasks) return res.status(400).send('Bad Request');

		return res.status(200).json(tasks);
	} catch (error) {
		console.log(error);
		return res.status(500).send('Internal Server Error');
	}
});

router.get('/:taskId', (req, res) => {
	try {
		const { taskId } = req.params;
		const task = TaskService.getOneTaskById(taskId);
		if (!task) return res.status(400).send('Bad Request');
		return res.status(200).json(task);
	} catch (error) {
		console.log(error);
		return res.status(500).send('Internal Server Error');
	}
});

router.put('/', (req, res) => {
	try {
		const taskToUpdate = req.body as taskToUpdate;
		TaskService.updateTask(taskToUpdate);
		return res.status(200).send('Task Updated Succefully');
	} catch (error) {
		console.log(error);
		return res.status(500).send('Internal Server Error');
	}
});

router.delete('/:taskId', (req, res) => {
	try {
		const { taskId } = req.params;
		TaskService.deleteTaskById(taskId);
		return res.status(200).send(`Task with ID: ${taskId} Deleted Succefully.`);
	} catch (error) {
		console.log(error);
		return res.status(500).send('Internal Server Error');
	}
});

export default router;
