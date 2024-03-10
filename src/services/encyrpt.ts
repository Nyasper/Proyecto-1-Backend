import crypto from 'node:crypto';
import {
	TaskInterface,
	EncrypedTaskInterface,
	UsersAdminTasksInterface,
	UsersAdminTasksEncryptInterface,
} from '../interfaces';

export class Encrypt {
	private static key = 'uk561-c115-1v24-aca-245-612-664f';

	public static encrypt(data: string, iv: Buffer) {
		const cipher = crypto.createCipheriv('aes-256-cbc', this.key, iv);
		let encryptedData = cipher.update(data, 'utf8', 'hex');
		encryptedData += cipher.final('hex');
		return encryptedData;
	}

	// Función para descifrar los datos
	public static decrypt(encryptedData: string, iv: Buffer) {
		const decipher = crypto.createDecipheriv('aes-256-cbc', this.key, iv);
		let decryptedData = decipher.update(encryptedData, 'hex', 'utf8');
		decryptedData += decipher.final('utf8');
		return decryptedData;
	}

	public static encryptTask(
		task: TaskInterface,
		ivParam?: Buffer
	): EncrypedTaskInterface {
		const iv = ivParam ?? crypto.randomBytes(16);
		const encryptedTask: EncrypedTaskInterface = {
			id: task.id,
			userid: task.userid,
			iv,
			created: task.created,
			title: this.encryptTitle(task.title, iv),
			description: this.encryptDescription(task.description, iv),
		};
		return encryptedTask;
	}

	public static decryptTasks(
		tasksEncrypted: EncrypedTaskInterface[]
	): TaskInterface[] {
		const taskDecrypted: TaskInterface[] = tasksEncrypted.map((task) => {
			return {
				id: task.id,
				userid: task.userid,
				title: this.decryptTitle(task.title, task.iv as Buffer),
				description: this.decryptDescription(
					task.description,
					task.iv as Buffer
				),
				created: task.created,
			};
		});
		return taskDecrypted;
	}

	public static decryptOneTask(
		taskEncrypted: EncrypedTaskInterface
	): TaskInterface {
		const descryptedTask: TaskInterface = {
			id: taskEncrypted.id,
			userid: taskEncrypted.userid,
			title: this.decryptTitle(taskEncrypted.title, taskEncrypted.iv as Buffer),
			description: this.decryptDescription(
				taskEncrypted.description,
				taskEncrypted.iv as Buffer
			),
			created: taskEncrypted.created,
		};
		return descryptedTask;
	}

	public static decryptAdminUsersTasks(
		userAdminEncrypted: UsersAdminTasksEncryptInterface[]
	): UsersAdminTasksInterface[] {
		const userAdminDecrypted: UsersAdminTasksInterface[] =
			userAdminEncrypted.map((user) => {
				return {
					userid: user.userid,
					username: user.username,
					taskid: user.taskid,
					title: this.decryptTitle(user.title, user.iv),
					description: this.decryptDescription(user.description, user.iv),
					created: user.created,
				};
			});
		return userAdminDecrypted;
	}

	private static encryptTitle = (taskTitle: string, iv: Buffer) =>
		Encrypt.encrypt(taskTitle, iv);
	private static encryptDescription = (taskDescription: string, iv: Buffer) =>
		Encrypt.encrypt(taskDescription, iv);
	private static decryptTitle = (taskTitle: string, iv: Buffer) =>
		Encrypt.decrypt(taskTitle, iv);
	private static decryptDescription = (taskDescription: string, iv: Buffer) =>
		Encrypt.decrypt(taskDescription, iv);
}
