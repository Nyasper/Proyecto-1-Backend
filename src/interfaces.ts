export interface credentialsInterface {
	username: string;
	password: string;
}

export interface taskFrontInterface {
	title: string;
	description: string;
}

export interface taskToUpdate {
	id: string;
	title: string;
	description: string;
}
export interface DecryptedTaskInterface {
	id: string;
	title: string;
	description: string;
	createdAt: Date;
}

export interface TokenPayload {
	id: string;
	username: string;
	admin: boolean;
	exp: number;
}

declare module 'express-session' {
	interface SessionData {
		logged: boolean;
		userId: string;
		username: string;
		admin: boolean;
	}
}

declare module 'express' {
	interface SessionData {
		session: any;
	}
}

declare global {
	namespace Express {
		interface Request {
			user?: TokenPayload; // Puedes ajustar el tipo de 'user' según la estructura de tus tokens
		}
	}
}
