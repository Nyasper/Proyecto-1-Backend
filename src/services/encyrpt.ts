import crypto from 'node:crypto';
import { DecryptedTaskInterface } from '../interfaces';
import Task from '../db/entities/taskEntity';

export default class Encrypt {
	private static key = 'uk561-c115-1v24-aca-245-612-664f';

	public static encrypt(data: string, iv: Buffer) {
		const cipher = crypto.createCipheriv(
			'aes-256-cbc',
			Buffer.from(this.key),
			iv
		);
		let encryptedData = cipher.update(data, 'utf8');
		encryptedData = Buffer.concat([encryptedData, cipher.final()]);
		return encryptedData;
	}

	public static decrypt(encryptedData: Buffer, iv: Buffer) {
		const decipher = crypto.createDecipheriv(
			'aes-256-cbc',
			Buffer.from(this.key),
			iv
		);
		let decryptedData = decipher.update(encryptedData);
		decryptedData = Buffer.concat([decryptedData, decipher.final()]);
		return decryptedData.toString('utf8');
	}

	public static decryptTasks(tasksEncrypted: Task[]): DecryptedTaskInterface[] {
		const taskDecrypted: DecryptedTaskInterface[] = tasksEncrypted.map(
			(task) => {
				return {
					id: task.id,
					title: this.decryptTitle(task.title, task.iv),
					description: this.decryptDescription(task.description, task.iv),
					createdAt: task.createdAt,
				};
			}
		);
		return taskDecrypted;
	}

	public static decryptOneTask(taskEncrypted: Task): DecryptedTaskInterface {
		const taskDecrypted: DecryptedTaskInterface = {
			id: taskEncrypted.id,
			title: this.decryptTitle(taskEncrypted.title, taskEncrypted.iv),
			description: this.decryptDescription(
				taskEncrypted.description,
				taskEncrypted.iv
			),
			createdAt: taskEncrypted.createdAt,
		};
		return taskDecrypted;
	}

	public static encryptTitle = (taskTitle: string, iv: Buffer) =>
		Encrypt.encrypt(taskTitle, iv);
	public static encryptDescription = (taskDescription: string, iv: Buffer) =>
		Encrypt.encrypt(taskDescription, iv);
	private static decryptTitle = (taskTitle: Buffer, iv: Buffer) =>
		Encrypt.decrypt(taskTitle, iv);
	private static decryptDescription = (taskDescription: Buffer, iv: Buffer) =>
		Encrypt.decrypt(taskDescription, iv);
}
