import dotenv from 'dotenv';
import { User } from './entities/userEntity';
import { Task } from './entities/taskEntity';
import { SessionEntity } from './entities/sessionEntity';
import { DataSource } from 'typeorm';

// const rutaActual = dirname(fileURLToPath(import.meta.url));
const rutaActual = __dirname;

dotenv.config({ path: `${rutaActual}/.env` });

//local
// export const AppDataSource = new DataSource({
// 	type: 'postgres',
// 	host: process.env.PG_LOCAL_HOST,
// 	port: Number(process.env.PG_LOCAL_PORT),
// 	username: process.env.PG_LOCAL_USER,
// 	password: process.env.PG_LOCAL_PASS,
// 	database: process.env.PG_LOCAL_DATABASE,
// 	entities: [User, Task, SessionEntity],
// 	synchronize: true,
// });

// CLOUD
console.log('comprobando env:', process.env.POSTGRES_URL);
export const AppDataSource = new DataSource({
	type: 'postgres',
	url: process.env.POSTGRES_URL,
	entities: [User, Task, SessionEntity],
	synchronize: true,
});

export default async function ConnectPostgreSql() {
	try {
		await AppDataSource.initialize();
		console.log('Conectado a PostgreSql');
	} catch (error) {
		console.error('Error al intentar conectar a PostgreSql', error);
	}
}
