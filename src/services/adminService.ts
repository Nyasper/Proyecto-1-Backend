import { UserAdminInterface } from '../interfaces';
import Database_Sqlite from '../db/sqlite3';

export default class AdminService extends Database_Sqlite {
	static getAllUsers(): UserAdminInterface[] {
		try {
			return this.query(
				`SELECT u.id as userid, u.username, t.title, t.description
				FROM users u
				INNER JOIN tasks t ON u.id = t.userid`
			).all() as UserAdminInterface[];
		} catch (error) {
			console.error(
				'\nError al obtener todos los usuarios en funcion "AdminService.getAllUsers()"'
			);
			throw error;
		}
	}

	static getOneUser(userId: string): UserAdminInterface[] {
		try {
			return this.query(
				`SELECT u.id as userid, u.username, t.title, t.description
				FROM users u
				INNER JOIN tasks t ON u.id = t.userid
				WHERE u.id = ?;`
			).all(userId) as UserAdminInterface[];
		} catch (error) {
			console.error(
				'\nError al obtener un usuario en funcion "AdminService.getUserById()"'
			);
			throw error;
		}
	}
}
