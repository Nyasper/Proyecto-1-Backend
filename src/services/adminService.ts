import {
	UsersAdminTasksInterface,
	UsersAdminTasksEncryptInterface,
	UsersListAdmin,
} from '../interfaces';
import Database_Sqlite from '../db/sqlite3';
import { Encrypt } from './encyrpt';

export default class AdminService extends Database_Sqlite {
	public static getAllUsers(): UsersListAdmin[] {
		try {
			return this.query(
				`SELECT u.id, u.username, COUNT(t.id) as tasks, u.admin
				FROM users u
				LEFT JOIN tasks t ON u.id = t.userid
				GROUP BY userid
				ORDER BY u.admin DESC,tasks DESC`
			).all() as UsersListAdmin[];
		} catch (error) {
			console.error(
				'\nError al obtener todos los usuarios con tareas en funcion "AdminService.getAllUsers()"'
			);
			throw error;
		}
	}

	public static getOneUserTasks(userId: string): UsersAdminTasksInterface[] {
		try {
			const encryptedUserTasks = this.query(
				`SELECT u.id as userid, u.username, t.id as taskid, t.title, t.description, t.created, iv
				FROM users u
				INNER JOIN tasks t ON u.id = t.userid
				WHERE userid = ?`
			).all(userId) as UsersAdminTasksEncryptInterface[];
			const user = Encrypt.decryptAdminUsersTasks(encryptedUserTasks);
			return user;
		} catch (error) {
			console.error(
				'\nError al obtener un usuario en funcion "AdminService.getOneUser()"'
			);
			throw error;
		}
	}

	public static deleteUser(userId: string) {
		try {
			const existUser = this.query('SELECT id FROM users WHERE id = ?').get(
				userId
			) as { id: string };
			if (existUser) {
				console.log('usuario existe:', existUser);
				this.query('DELETE FROM users WHERE id = ?').run(existUser.id);
			} else console.log('usuario no existe', existUser);
			throw new Error("User doesn't exists.");
		} catch (error) {
			console.error(
				'Error al intentar eliminar usuario en funcion "deleteUser".',
				error
			);
		}
	}
}
