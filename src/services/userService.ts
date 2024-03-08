import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { UserInterface } from '../interfaces';
import { randomUUID } from 'node:crypto';
import Database_Sqlite from '../db/sqlite3';

export default class UserService extends Database_Sqlite {
	public static async loginService(req: Request, res: Response) {
		return res.send('logeado exitosamente');
	}

	public static registerUser(user: UserInterface): boolean {
		try {
			const existUser = this.query(
				'SELECT username FROM users where username = ? '
			).get(user.username) as { username: string } | undefined;
			if (!existUser) {
				user.id = randomUUID();
				user.password = this.hashPassword(user.password);
				this.query(
					'INSERT INTO users(id, username, password) VALUES (?, ?, ?)'
				).run(user.id, user.username, user.password);
				return true;
			}
			return false;
		} catch (error) {
			console.error('Error al registrar usuario:', error);
			throw error;
		}
	}

	public static loginUser(username: string, password: string) {
		const user = this.query(
			'SELECT id, username, password, admin FROM users WHERE username = ?'
		).get(username) as UserInterface;
		if (user && this.comparePasswords(password, user.password)) return user;
		return undefined;
	}

	private static hashPassword(password: string) {
		const saltRounds = 11;
		try {
			const salt = bcrypt.genSaltSync(saltRounds);
			const hash = bcrypt.hashSync(password, salt);
			return hash;
		} catch (error) {
			console.error('Error al hashear la contraseña:', error);
			throw error;
		}
	}

	private static comparePasswords(
		password: string,
		hashedPassword: string
	): boolean {
		try {
			const result = bcrypt.compareSync(password, hashedPassword);
			return result;
		} catch (error) {
			console.error('Error al comparar contraseñas:', error);
			throw error;
		}
	}

	private static isAdmin(user: UserInterface): boolean {
		if (user.admin === 1) return true;
		else return false;
	}
}
