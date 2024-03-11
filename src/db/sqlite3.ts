import { join, resolve } from 'node:path';
import Database from 'better-sqlite3';

export default class Database_Sqlite {
	private static route = resolve(__dirname).replace('dist\\', '');

	private static db = new Database(
		join(this.route, 'proyecto-1-database.sqlite'),
		{
			verbose: console.log,
			fileMustExist: true,
			readonly: false,
		}
	);

	public static query(query: string) {
		return this.db.prepare(query);
	}

	public static sessionDB = new Database(join(this.route, 'session.sqlite'), {
		verbose: console.log,
		fileMustExist: false,
		readonly: false,
	});
}

//la ruta es: C:\Users\herre\Documents\PROGRAMACION WEB\Proyectos\Proyecto-1-backend\src\db
//la ruta es: C:\Users\herre\Documents\PROGRAMACION WEB\Proyectos\Proyecto-1-backend\src\db
