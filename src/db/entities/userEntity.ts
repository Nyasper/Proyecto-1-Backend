import {
	PrimaryColumn,
	Entity,
	Column,
	CreateDateColumn,
	OneToMany,
} from 'typeorm';
import Task from './taskEntity';

@Entity('users')
export default class User {
	@PrimaryColumn()
	id: string;

	@Column({ unique: true })
	username: string;

	@Column()
	password: string;

	@Column({ default: false })
	admin: boolean;

	@CreateDateColumn()
	createdAt: Date;

	@OneToMany(() => Task, (task) => task.user)
	tasks: Task[];
}
