import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Timestamp,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import Workout from './Workout';
import Exercise from './Exercise';

@Entity()
export default class WorkoutSet extends BaseEntity {
  public static insertMany(records: []) {
    this.createQueryBuilder()
        .insert()
        .into('workout_set')
        .values(records)
        .execute();
  }

  @Column()
  public workoutId: number;
  @ManyToOne(type => Workout, workout => workout.sets)
  @JoinColumn({ name:  'workoutId' })
  public workout: Workout;

  @Column()
  public exerciseId: number;
  @ManyToOne(type => Exercise, exercise => exercise.sets, { eager: true })
  @JoinColumn({ name: 'exerciseId' })
  public exercise: Exercise;

  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ default: 0 })
  public reps: number;

  @Column({ default: 0})
  public weight: number;

  @CreateDateColumn()
  public createdAt: Timestamp;

  @UpdateDateColumn()
  public updatedAt: Timestamp;
}
