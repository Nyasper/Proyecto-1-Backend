import { createClient } from 'redis';
require('dotenv').config({ path: './' });

export async function connectRedis() {
	console.log('intentando conectarse a ', process.env.KV_URL);
	const client = await createClient({ url: process.env.OTRO })
		.on('error', (err) => console.log('Redis Client Error', err))
		.connect();
	console.log('Connectado Existosamente a redis');
	await client.set('nombre', 'Karin');
	const value = await client.get('nombre');
	await client.disconnect();
}
