export interface UserInterface {
	id?: string;
	username: string;
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

export interface UsersListAdmin {
	id: string;
	username: string;
	tasks: number;
	admin: 1 | 0;
}

export interface UsersAdminTasksInterface {
	userid: string;
	username: string;
	taskid: string;
	title: string;
	created: string;
	description: string;
}

export interface UsersAdminTasksEncryptInterface {
	userid: string;
	username: string;
	taskid: string;
	title: string;
	description: string;
	created: string;
	iv: Buffer;
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
