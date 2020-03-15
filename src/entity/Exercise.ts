import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Timestamp,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany
} from 'typeorm';
import WorkoutSet from './WorkoutSet';

@Entity()
export default class Exercise extends BaseEntity {
  @OneToMany(type => WorkoutSet, workoutSet => workoutSet.exercise)
  public sets: WorkoutSet[];

  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ nullable: false, unique: true })
  public name: string;

  @Column({ nullable: false })
  public muscleGroup: string;

  @CreateDateColumn()
  public createdAt: Timestamp;

  @UpdateDateColumn()
  public updatedAt: Timestamp;
}
