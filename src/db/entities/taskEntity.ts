import {
	PrimaryColumn,
	Entity,
	Column,
	CreateDateColumn,
	ManyToOne,
} from 'typeorm';
import User from './userEntity';

@Entity('tasks')
export default class Task {
	@PrimaryColumn()
	id: string;

	@Column({ type: 'bytea' })
	title: Buffer;

	@Column({ type: 'bytea' })
	description: Buffer;

	@Column({ type: 'bytea' })
	iv: Buffer;

	@CreateDateColumn()
	createdAt: Date;

	@ManyToOne(() => User, (user) => user.tasks)
	user: User;
}
