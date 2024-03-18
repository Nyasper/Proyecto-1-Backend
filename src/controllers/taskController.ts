import { Router } from 'express';
import { taskFrontInterface, taskToUpdate } from '../interfaces';
import TaskService from '../services/taskService';

const router = Router();

router.post('/', async (req, res) => {
	try {
		const task: taskFrontInterface = req.body;

		if (!task.title || !task.description || !req.session.userId)
			return res
				.status(400)
				.send('Bad Request, title or description not provided.');

		await TaskService.createTask(req.session.userId, task);

		return res.status(201).send('tarea creada');
	} catch (error) {
		console.log(error);
		return res.status(500).send('Internal Server Error');
	}
});

router.get('/all', async (req, res) => {
	try {
		const tasks = await TaskService.getAllUserTasks(
			req.session.userId as string
		);

		if (!tasks) return res.status(400).send('Bad Request');

		return res.status(200).json(tasks);
	} catch (error) {
		console.log(error);
		return res.status(500).send('Internal Server Error');
	}
});

router.get('/:taskId', async (req, res) => {
	try {
		const { taskId } = req.params;
		if (!taskId)
			return res.status(400).send('Bad Request, task ID not provided');
		const task = await TaskService.getOneTaskById(taskId);
		return res.status(200).json(task);
	} catch (error) {
		console.log(error);
		return res.status(500).send('Internal Server Error');
	}
});

router.put('/', async (req, res) => {
	try {
		const taskToUpdate: taskToUpdate = req.body;
		await TaskService.updateTask(taskToUpdate);
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
