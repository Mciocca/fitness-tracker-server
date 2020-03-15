import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Timestamp,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import User from './User';
import WorkoutSet from './WorkoutSet';

@Entity()
export default class Workout extends BaseEntity {
  @ManyToOne(type => User, user => user.workouts)
  public user: User;

  @OneToMany(type => WorkoutSet, set => set.workout, { onDelete: 'CASCADE', eager: true })
  public sets: WorkoutSet[];

  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public title: string;

  @Column({ type: 'text', nullable: true })
  public notes: string;

  @Column({ nullable: true })
  public weight: number;

  @Column({ type: 'date' })
  public date: string;

  @CreateDateColumn()
  public createdAt: Timestamp;

  @UpdateDateColumn()
  public updatedAt: Timestamp;
}
