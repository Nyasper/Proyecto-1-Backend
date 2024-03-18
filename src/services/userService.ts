import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import type { credentialsInterface } from '../interfaces';
import { randomUUID } from 'node:crypto';
import { User } from '../db/entities/userEntity';
import { AppDataSource } from '../db/connection';

export default class UserService {
	private static readonly UserRepository = AppDataSource.getRepository(User);

	public static async registerUser(credentials: credentialsInterface) {
		try {
			const existUser = await this.loginUser(credentials);

			if (!existUser) {
				const user = new User();
				user.id = randomUUID();
				user.username = credentials.username;
				user.password = this.hashPassword(credentials.password);
				await this.UserRepository.save(user);
				return true;
			}
			return false;
		} catch (error) {
			console.error('Error al registrar usuario:', error);
			throw error;
		}
	}

	public static async loginUser(
		userCredentails: credentialsInterface
	): Promise<User | undefined> {
		const user = await this.UserRepository.findOneBy({
			username: userCredentails.username,
		});
		if (user && this.comparePasswords(userCredentails.password, user.password))
			return user;
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
}
