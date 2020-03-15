import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Timestamp,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import Workout from './Workout';
import Exercise from './Exercise';

@Entity()
export default class WorkoutSet extends BaseEntity {
  @ManyToOne(type => Workout, workout => workout.sets)
  public workout: Workout;

  @ManyToOne(type => Exercise, exercise => exercise.sets, { eager: true })
  public exercise: Exercise;

  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public reps: number;

  @Column()
  public weight: number;

  @CreateDateColumn()
  public createdAt: Timestamp;

  @UpdateDateColumn()
  public updatedAt: Timestamp;
}
