import express, { Request, Response } from 'express';
import morgan from 'morgan';
import routes from './routes';
import cors from 'cors';
import session from 'express-session';
const SqliteStore = require('better-sqlite3-session-store')(session);
import Database_Sqlite from './db/sqlite3';

export const app = express();
app.use(morgan('tiny'));

app.use(
	cors({
		origin: true,
		credentials: true,
		maxAge: 6000000,
	})
);

app.use(
	session({
		store: new SqliteStore({
			client: Database_Sqlite.sessionDB,
			expired: {
				clear: true,
				intervalMs: 99900000,
			},
		}),
		secret: 'some secret',
		resave: false,
	})
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT ?? 3000;

app.use(routes);
app.get('/', (req: Request, res: Response) => {
	res.send('Proyecto 1 Backend');
});

app.listen(port, () => {
	console.log(`Server On http://localhost:${port}`);
});

export default app;
