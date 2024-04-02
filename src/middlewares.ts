import { Request, Response, NextFunction } from 'express';
import UserService from './services/userService';

export default class Middlewares {
	public static auth(req: Request, res: Response, next: NextFunction) {
		try {
			const token = req.headers.authorization;

			if (!token || !token.startsWith('Bearer ')) {
				return res
					.status(401)
					.json({ message: 'Token de acceso no proporcionado' });
			}
			const tokenWithoutBearer = token.split(' ')[1];
			const decoded = UserService.validateToken(tokenWithoutBearer);
			req.user = decoded;
			next();
		} catch (error: any) {
			if (error.name === 'TokenExpiredError') {
				return res.status(401).json({ message: 'Token expirado' });
			}
			return res.status(401).json({ message: 'Token de acceso inválido' });
		}
	}

	public static authAdmin(req: Request, res: Response, next: NextFunction) {
		try {
			const token = req.headers.authorization;

			if (!token || !token.startsWith('Bearer ')) {
				return res
					.status(401)
					.json({ message: 'Token de acceso no proporcionado' });
			}
			const tokenWithoutBearer = token.split(' ')[1];
			const decoded = UserService.validateToken(tokenWithoutBearer);

			if (!decoded || !decoded.admin) {
				return res.status(403).json({ message: 'Acceso no autorizado' });
			}

			req.user = decoded;
			next();
		} catch (error: any) {
			if (error.name === 'TokenExpiredError') {
				return res.status(401).json({ message: 'Token expirado' });
			}
			return res.status(401).json({ message: 'Token de acceso inválido' });
		}
	}

	public static isAdmin(req: Request, res: Response, next: NextFunction) {
		if (req.user?.admin) {
			next();
		} else {
			res
				.status(403)
				.json({ message: 'Acceso no autorizado. No eres Administrador.' });
		}
	}

	public static isLogged(req: Request, res: Response, next: NextFunction) {
		if (req.user) {
			next();
		} else {
			res
				.status(403)
				.json({ message: 'Acceso no autorizado. Ya has iniciado sesion.' });
		}
	}

	public static isNotLogged(req: Request, res: Response, next: NextFunction) {
		if (!req.user) {
			next();
		} else {
			res
				.status(403)
				.json({ message: 'Acceso no autorizado. Necesitas inciar Sesion.' });
		}
	}
}
