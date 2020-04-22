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
  public static searchByName(name: string = '', muscleGroup: string = ''): Promise<Exercise[]> {
    return this.createQueryBuilder('exercise')
               .where('exercise.name ILIKE :name', { name: `%${name}%`})
               .andWhere('exercise.muscleGroup ILIKE :group', { group: `%${muscleGroup}%`})
               .limit(20)
               .getMany();
  }

  public static async getMuscleGroups(): Promise<string[]> {
    const muscleGroups = await this.createQueryBuilder('exercise')
                                   .select('DISTINCT "muscleGroup"')
                                   .orderBy('exercise.muscleGroup')
                                   .getRawMany();

    return muscleGroups.map((group) => group.muscleGroup);
  }

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
