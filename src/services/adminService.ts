import Database_Sqlite from '../db/sqlite3';
import Encrypt from './encyrpt';
import { AppDataSource } from '../db/connection';
import User from '../db/entities/userEntity';

export default class AdminService extends Database_Sqlite {
	private static UserRepository = AppDataSource.getRepository(User);
	public static async getAllUsers() {
		try {
			const allUsers = await this.UserRepository.find();

			return allUsers;
		} catch (error) {
			console.error(
				'\nError al obtener todos los usuarios con tareas en funcion "AdminService.getAllUsers()"'
			);
			throw error;
		}
	}

	public static async getOneUserTasks(username: string) {
		try {
			const user = await this.UserRepository.findOne({
				where: { username },
				relations: { tasks: true },
			});
			if (!user) return undefined;
			const tasksDecrypted = Encrypt.decryptTasks(user.tasks);
			return tasksDecrypted;
		} catch (error) {
			console.error(
				'\nError al obtener un usuario en funcion "AdminService.getOneUser()"'
			);
			throw error;
		}
	}

	public static async deleteUser(id: string) {
		try {
			const existUser = await this.UserRepository.findOneByOrFail({ id });

			await this.UserRepository.delete({ id: existUser.id });
			console.log(`user with ID ${id} deleted succefully`);
		} catch (error) {
			console.error(
				'Error al intentar eliminar usuario en funcion "deleteUser".',
				error
			);
		}
	}
}
