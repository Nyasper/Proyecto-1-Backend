import { Request, Response, NextFunction } from 'express';

export default class Middlewares {
	public static isAdmin(req: Request, res: Response, next: NextFunction) {
		if (req.session && req.session.logged && req.session.admin) {
			next();
		} else {
			res
				.status(403)
				.json({ message: 'Acceso no autorizado. No eres Administrador.' });
		}
	}

	public static isNotLogged(req: Request, res: Response, next: NextFunction) {
		if (req.session && !req.session.logged) {
			return next();
		}
		return res
			.status(403)
			.json({ message: 'Acceso no autorizado. Ya has iniciado Sesion.' });
	}

	public static isLogged(req: Request, res: Response, next: NextFunction) {
		if (req.session && req.session.logged) {
			return next();
		}
		return res
			.status(403)
			.json({ message: 'Acceso no autorizado. Debes iniciar sesión.' });
	}
}
