import { TypeormStore } from 'connect-typeorm';
import { AppDataSource } from './connection';
import SessionEntity from './entities/sessionEntity';
import session from 'express-session';

const sessionRepository = AppDataSource.getRepository(SessionEntity);

export const sessionConfig = session({
	secret: 'somesecret',
	resave: false,
	saveUninitialized: false,
	store: new TypeormStore({
		cleanupLimit: 0,
		ttl: 86400,
	}).connect(sessionRepository),
});
