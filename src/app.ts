import express from 'express';
import morgan from 'morgan';
import session from 'express-session';
import routes from './routes';
import cors from 'cors';

const app = express();
app.use(morgan('tiny'));
app.use(
	cors({
		origin: true,
		credentials: true,
		maxAge: 6000000,
	})
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
	session({
		secret: 'some secret',
		saveUninitialized: false,
		resave: false,
		cookie: { maxAge: 60000 * 60 * 24 * 30 * 1 }, //1 month
	})
);

const port = process.env.PORT ?? 3000;

app.use(routes);
app.get('/', (req, res) => {
	res.send('Proyecto 1 Backend');
});

app.listen(port, () => {
	console.log(`Server On http://localhost:${port}`);
});

export default app;
