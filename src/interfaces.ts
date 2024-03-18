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
