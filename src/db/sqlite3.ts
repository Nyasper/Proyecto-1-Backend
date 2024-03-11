import { join } from 'node:path';
import Database from 'better-sqlite3';

export default class Database_Sqlite {
	private static db = new Database(
		join(__dirname, '..', '..', 'proyecto-1-database.sqlite'),
		{
			verbose: console.log,
			fileMustExist: true,
			readonly: false,
		}
	);

	public static query(query: string) {
		return this.db.prepare(query);
	}

	public static sessionDB = new Database(
		join(__dirname, '..', '..', 'session.sqlite'),
		{
			verbose: console.log,
			fileMustExist: false,
			readonly: false,
		}
	);
}
