import 'reflect-metadata';
import { User } from './entities/userEntity';
import { Task } from './entities/taskEntity';
import { DataSource } from 'typeorm';

// const rutaActual = dirname(fileURLToPath(import.meta.url));

//local
// export const AppDataSource = new DataSource({
// 	type: 'postgres',
// 	host: process.env.PG_LOCAL_HOST,
// 	port: Number(process.env.PG_LOCAL_PORT),
// 	username: process.env.PG_LOCAL_USER,
// 	password: process.env.PG_LOCAL_PASS,
// 	database: process.env.PG_LOCAL_DATABASE,
// 	entities: [User, Task],
// 	synchronize: true,
// });

// CLOUD
export const AppDataSource = new DataSource({
	type: 'postgres',
	url: process.env.POSTGRES_URL,
	entities: [User, Task],
	synchronize: false,
});
(async () => await AppDataSource.initialize())();

export default async function ConnectPostgreSql() {
	try {
		console.log('connected to PostgreSql succefully');
	} catch (error) {
		console.error('Error al intentar conectar a PostgreSql', error);
	}
}
