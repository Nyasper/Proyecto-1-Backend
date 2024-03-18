require('dotenv').config();
import express from 'express';
import morgan from 'morgan';
import routes from './routes';
import cors from 'cors';
import 'reflect-metadata';
import ConnectPostgreSql from './db/connection';
import { sessionConfig } from './db/sessionConfig';

ConnectPostgreSql();

export const app = express();

app.use(morgan('tiny'));
//CORS
app.use(
	cors({
		origin: true,
		credentials: true,
		maxAge: 6000000,
	})
);
//session
app.use(sessionConfig);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(routes);

app.get('/', (req, res) => {
	res.send('Proyecto 1 Backend');
});
