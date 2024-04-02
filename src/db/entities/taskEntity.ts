import {
	PrimaryColumn,
	Entity,
	Column,
	CreateDateColumn,
	ManyToOne,
} from 'typeorm';
import { User } from './userEntity';

@Entity('tasks')
export class Task {
	@PrimaryColumn()
	id: string;

	@Column({ nullable: false })
	title: string;

	@Column({ nullable: false })
	description: string;

	@CreateDateColumn()
	createdAt: Date;

	@ManyToOne(() => User, (user) => user.tasks)
	user: User;
}
