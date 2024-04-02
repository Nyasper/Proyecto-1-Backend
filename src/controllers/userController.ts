import { Router } from 'express';
import { Request, Response } from 'express';
import type { credentialsInterface, TokenPayload } from '../interfaces';
import UserService from '../services/userService';
import Middlewares from '../middlewares';

const router = Router();

router.get('/auth', Middlewares.auth, (req, res) => {
	try {
		const user = req.user ?? {};
		return res.json(user);
	} catch (error) {
		console.error(error);
		return res.status(500).send('Internal Server Error');
	}
});

router.post(
	'/register',
	Middlewares.isNotLogged,
	async (req: Request, res: Response) => {
		try {
			const user: credentialsInterface = req.body;

			if (!user.username || !user.password) {
				return res.status(400).send('Bad Request');
			}

			const existUser = await UserService.registerUser(user);
			if (!existUser)
				return res
					.status(409)
					.send('Ya existe un usuario con estas credenciales');

			return res.status(201).send('Usuario registrado exitosamente.');
		} catch (error) {
			console.error(error);
			return res.status(500).send('Internal Server Error');
		}
	}
);

router.post(
	'/login',
	Middlewares.isNotLogged,
	async (req: Request, res: Response) => {
		try {
			const userCredentials: credentialsInterface = req.body;

			if (!userCredentials.username || !userCredentials.password)
				return res.status(400).send('username or password not provided.');
			const user = await UserService.loginUser(userCredentials);
			// const token = null;
			// res.json({ token });

			// const accessToken = generate;
			if (user) {
				user.password = '';
				const token = UserService.generateToken(user);

				return res.status(200).json({ token });
			}
			return res.status(400).send('Invalid Credentials');
		} catch (error) {
			console.error(error);
			return res.status(500).send('Internal Server Error');
		}
	}
);

export default router;
