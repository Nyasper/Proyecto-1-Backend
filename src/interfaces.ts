export interface UserInterface {
	id?: string;
	username: string;
	mail: `${string}@${string}.${string}`;
	password: string;
	admin?: 0 | 1;
}

export interface TaskInterface {
	id: string;
	userid: string;
	title: string;
	description: string;
	created: string;
	iv?: Buffer;
}

export interface EncrypedTaskInterface {
	id: string;
	userid: string;
	title: string;
	description: string;
	iv: Buffer;
	created: string;
}

export interface taskToUpdate {
	id: string;
	title: string;
	description: string;
}

export interface UserAdminInterface {
	userid: string;
	username: string;
	title: string;
	description: string;
}

declare module 'express-session' {
	interface SessionData {
		logged: boolean;
		userId: string;
		username: string;
		admin: 1 | 0;
	}
}

declare module 'express' {
	interface SessionData {
		session: any;
	}
}
