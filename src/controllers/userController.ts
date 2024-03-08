import { Router } from 'express';
import { Request, Response } from 'express';
import { UserInterface } from '../interfaces';
import UserService from '../services/userService';
import Middlewares from '../middlewares';

const router = Router();

router.get('/logged', (req, res) => {
	try {
		const logged = req.session.logged ?? false;
		const admin = req.session.admin ?? false;
		return res.status(200).json({ logged, admin });
	} catch (error) {
		console.log(error);
		return res.status(500).send('Internal Server Error');
	}
});

router.post(
	'/register',
	Middlewares.isNotLogged,
	async (req: Request, res: Response) => {
		try {
			const user = req.body as UserInterface;

			if (!user.username || !user.password) {
				return res.status(400).send('Bad Request');
			}

			const existUser = UserService.registerUser(user);
			if (!existUser)
				return res
					.status(409)
					.send('Ya existe un usuario con estas credenciales');

			return res.status(201).send('Usuario registrado exitosamente.');
		} catch (error) {
			console.log(error);
			return res.status(500).send('Internal Server Error');
		}
	}
);

router.post(
	'/login',
	Middlewares.isNotLogged,
	async (req: Request, res: Response) => {
		try {
			const { username, password } = req.body;

			if (!username || !password) return res.status(400).send('Bad Request');
			const user = UserService.loginUser(username, password);
			if (user) {
				req.session.logged = true;
				req.session.userId = user.id;
				req.session.username = user.username;
				req.session.admin = user.admin;
				return res.status(200).send('Loggin in Succefully');
			}
			return res.status(400).send('Invalid Credentials');
		} catch (error) {
			console.log(error);
			return res.status(500).send('Internal Server Error');
		}
	}
);

router.get('/logout', (req, res) => {
	req.session.destroy(function (err) {
		if (err) {
			console.error('ERROR trying to Logout:', err);
			return res.status(500).send('Internal Server Error');
		}
		res.status(200).send('logout succefully');
	});
});

export default router;
