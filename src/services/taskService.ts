import Task from '../db/entities/taskEntity';
import {
	DecryptedTaskInterface,
	taskFrontInterface,
	taskToUpdate,
} from '../interfaces';
import Encrypt from './encyrpt';
import { randomUUID } from 'node:crypto';
import { randomBytes } from 'node:crypto';
import { AppDataSource } from '../db/connection';
import User from '../db/entities/userEntity';

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
			task.iv = randomBytes(16);
			task.title = Encrypt.encryptTitle(taskParam.title, task.iv);
			task.description = Encrypt.encryptDescription(
				taskParam.description,
				task.iv
			);
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
			console.log({ userId });
			const tasks = await this.UserRepository.findOne({
				where: { id: userId },
				select: { id: true, tasks: true },
				relations: { tasks: true },
			});

			const desencryptedTasks: DecryptedTaskInterface[] = tasks?.tasks
				? Encrypt.decryptTasks(tasks.tasks)
				: [];

			return desencryptedTasks;
		} catch (error) {
			console.error(
				'Error al intentar obtener todas las tareas en funcion "TaskService.getAllUserTasks()"'
			);
			throw error;
		}
	}
	public static async getOneTaskById(id: string) {
		try {
			const taskEncrypted = await this.TaskRepository.findOneByOrFail({ id });
			const taskDecrypted = Encrypt.decryptOneTask(taskEncrypted);

			return taskDecrypted;
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
			task.iv = task.iv = randomBytes(16);
			task.title = Encrypt.encryptTitle(taskToUpdate.title, task.iv);
			task.description = Encrypt.encryptDescription(
				taskToUpdate.description,
				task.iv
			);
			await this.TaskRepository.save(task);
		} catch (error) {
			console.error(
				'ERROR al intentar actualizar una tarea en funcion "updateTask"'
			);
			throw error;
		}
	}
}
