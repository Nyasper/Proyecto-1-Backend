require('dotenv').config();
import 'reflect-metadata';
import express from 'express';
import morgan from 'morgan';
import routes from './routes';
import cors from 'cors';

export const app = express();

//morgan logger
app.use(morgan('tiny'));

//CORS
app.use(
	cors({
		origin: true,
		credentials: true,
		maxAge: 6000000,
	})
);

//Express Configs
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//router config
app.use(routes);

app.get('/', (req, res) => {
	res.send('Proyecto 1 Backend');
});
