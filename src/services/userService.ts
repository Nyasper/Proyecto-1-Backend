import bcrypt from 'bcrypt';
import type { credentialsInterface, TokenPayload } from '../interfaces';
import { randomUUID } from 'node:crypto';
import { User } from '../db/entities/userEntity';
import { AppDataSource } from '../db/connection';
import jwt from 'jsonwebtoken';

export default class UserService {
	private static readonly UserRepository = AppDataSource.getRepository(User);

	public static async registerUser(credentials: credentialsInterface) {
		try {
			const existUser = await this.UserRepository.findOneBy({
				username: credentials.username,
			});

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

	public static generateToken(user: User) {
		const secret = process.env.TOKEN_SECRET;
		if (!secret) throw new Error('TOKEN_SECRETE missing on generateToken');
		const { id, username, admin } = user;
		const token = jwt.sign(
			{
				id,
				username,
				admin,
				exp: Date.now() + 7 * 24 * 60 * 60 * 1000, //7 days of expiration
			},
			secret
		);
		return token;
	}

	public static validateToken(token: string) {
		const secret = process.env.TOKEN_SECRET;
		if (!secret) throw new Error('TOKEN_SECRET missing on generateToken');

		if (!token) throw new Error('Token is missing');
		try {
			const payload = jwt.verify(token, secret) as TokenPayload;
			return payload;
		} catch (error) {
			console.error(error);
			throw new Error('Invalid token');
		}
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
