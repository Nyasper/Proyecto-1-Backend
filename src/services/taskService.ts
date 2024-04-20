import { taskFrontInterface, taskToUpdate } from '../interfaces';
import { User } from '../db/entities/userEntity';
import { Task } from '../db/entities/taskEntity';
import { randomUUID } from 'node:crypto';
import { AppDataSource } from '../db/orm.config';

export default class TaskService {
	private static readonly TaskRepository = AppDataSource.getRepository(Task);
	private static readonly UserRepository = AppDataSource.getRepository(User);
	public static async createTask(
		userId: string,
		taskParam: taskFrontInterface
	) {
		try {
			const task = new Task();

			task.id = randomUUID();
			task.title = taskParam.title;
			task.description = taskParam.description;
			task.user = await this.UserRepository.findOneByOrFail({
				id: userId,
			});

			await this.TaskRepository.save(task);
		} catch (error) {
			console.error(
				'\nError al intentar crear tarea en funcion "TaskService.createTask()"'
			);
			throw error;
		}
	}

	public static async getAllUserTasks(userId: string) {
		try {
			const tasks = await this.UserRepository.findOne({
				where: { id: userId },
				select: { id: true, tasks: true },
				relations: { tasks: true },
			});

			return tasks?.tasks ?? [];
		} catch (error) {
			console.error(
				'Error al intentar obtener todas las tareas en funcion "TaskService.getAllUserTasks()"'
			);
			throw error;
		}
	}
	public static async getOneTaskById(id: string) {
		try {
			const task = await this.TaskRepository.findOneByOrFail({ id });

			return task;
		} catch (error) {
			console.error(
				'Error al intentar obtener todas las tareas en funcion "TaskSertvice.getAllUserTasks()"'
			);
			throw error;
		}
	}
	public static async deleteTaskById(id: string) {
		try {
			return await this.TaskRepository.delete({ id });
		} catch (error) {
			console.error(
				'ERROR al intentar eliminar una tarea en funcion "deleteTaskById"'
			);
			throw error;
		}
	}

	public static async updateTask(taskToUpdate: taskToUpdate) {
		try {
			const task = await this.TaskRepository.findOneByOrFail({
				id: taskToUpdate.id,
			});
			task.title = taskToUpdate.title;
			task.description = taskToUpdate.description;
			await this.TaskRepository.save(task);
		} catch (error) {
			console.error(
				'ERROR al intentar actualizar una tarea en funcion "updateTask"'
			);
			throw error;
		}
	}
}
