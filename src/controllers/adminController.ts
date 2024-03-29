import { Router } from 'express';
import { Request, Response } from 'express';
import AdminServices from '../services/adminService';

const router = Router();

router.get('/user/all', async (req: Request, res: Response) => {
	try {
		const users = await AdminServices.getAllUsers();

		if (!users) return res.status(400).send('Bad Request');

		return res.status(200).json(users);
	} catch (error) {
		console.error('Error al registrar usuario:', error);
		return res.status(500).send('Internal Server Error');
	}
});

router.get('/user/:username', async (req: Request, res: Response) => {
	try {
		const { username } = req.params;
		const user = await AdminServices.getOneUserTasks(username);

		if (!user) return res.status(400).send('Username Doesnt exists');

		return res.status(200).json(user);
	} catch (error) {
		console.error('Error al obtner usuario desde admin:', error);
		return res.status(500).send('Internal Server Error');
	}
});

router.delete('/user/:userId', async (req: Request, res: Response) => {
	try {
		const { userId } = req.params;
		AdminServices.deleteUser(userId);

		return res.status(200).send('User Deleted succefully');
	} catch (error) {
		console.error('Error al obtner usuario desde admin:', error);
		return res.status(500).send('Internal Server Error');
	}
});

export default router;
