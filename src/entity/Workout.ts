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
  JoinColumn,
} from 'typeorm';
import User from './User';
import WorkoutSet from './WorkoutSet';
import { IsDefined, IsString, IsNumber } from 'class-validator';

@Entity()
export default class Workout extends BaseEntity {
  @ManyToOne(type => User, user => user.workouts)
  @JoinColumn()
  public user: User;

  @OneToMany(type => WorkoutSet, set => set.workout, { onDelete: 'CASCADE', eager: true })
  @JoinColumn()
  public sets: WorkoutSet[];

  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  @IsDefined()
  @IsString()
  public title: string;

  @Column({ type: 'text', nullable: true })
  @IsString()
  public notes: string;

  @Column({ nullable: true })
  @IsNumber()
  public weight: number;

  @Column({ type: 'date' })
  @IsDefined({ message: 'Date is required'})
  public date: Date;

  @CreateDateColumn()
  public createdAt: Timestamp;

  @UpdateDateColumn()
  public updatedAt: Timestamp;
}
