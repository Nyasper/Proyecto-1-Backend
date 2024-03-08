import Database_Sqlite from '../db/sqlite3';
import {
	EncrypedTaskInterface,
	TaskInterface,
	taskToUpdate,
} from '../interfaces';
import { Encrypt } from './encyrpt';
import { randomUUID } from 'node:crypto';

export default class TaskService extends Database_Sqlite {
	public static createTask(userId: string, task: TaskInterface) {
		try {
			task.id = randomUUID();

			const encryptedTask = Encrypt.encryptTask(task);

			return this.query(
				'INSERT INTO tasks (userid, id, title, description, iv) VALUES (?, ?, ?, ?, ?)'
			).run(
				userId,
				encryptedTask.id,
				encryptedTask.title,
				encryptedTask.description,
				encryptedTask.iv
			);
		} catch (error) {
			console.error(
				'\nError al intentar crear tarea en funcion "TaskService.createTask()"'
			);
			throw error;
		}
	}

	public static getAllUserTasks(userId: string) {
		try {
			const tasks = this.query(
				'SELECT id,title,description,iv,created FROM tasks WHERE userid = ?'
			).all(userId) as EncrypedTaskInterface[];
			const desencryptedTasks: TaskInterface[] = Encrypt.decryptTasks(tasks);
			return desencryptedTasks;
		} catch (error) {
			console.error(
				'Error al intentar obtener todas las tareas en funcion "TaskService.getAllUserTasks()"'
			);
			throw error;
		}
	}

	public static getOneTaskById(taskId: string) {
		try {
			const taskEncrypted = this.query(
				'SELECT id,title,description,iv FROM tasks WHERE id = ?'
			).get(taskId) as EncrypedTaskInterface;

			const decryptedTask = Encrypt.decryptOneTask(taskEncrypted);
			return decryptedTask;
		} catch (error) {
			console.error(
				'Error al intentar obtener todas las tareas en funcion "TaskSertvice.getAllUserTasks()"'
			);
			throw error;
		}
	}

	public static deleteTaskById(taskId: string) {
		try {
			return this.query('DELETE FROM tasks where id = ?').run(taskId);
		} catch (error) {
			console.error(
				'ERROR al intentar eliminar una tarea en funcion "deleteTaskById"'
			);
			throw error;
		}
	}

	public static updateTask(taskToUpdate: taskToUpdate) {
		try {
			const { id: existTask, iv } = this.query(
				'SELECT id, iv FROM tasks WHERE id = ?'
			).get(taskToUpdate.id) as { id: string; iv: Buffer };
			if (existTask) {
				const encryptTask = Encrypt.encryptTask(
					taskToUpdate as TaskInterface,
					iv
				);
				return this.query(
					'UPDATE tasks SET title = ?, description = ? WHERE id = ?'
				).run(encryptTask.title, encryptTask.description, taskToUpdate.id);
			}
		} catch (error) {
			console.error(
				'ERROR al intentar actualizar una tarea en funcion "updateTask"'
			);
			throw error;
		}
	}
}
