import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Timestamp
} from 'typeorm';
import User from './User';

export enum Goals {
  MAINTAIN = 'Maintain weight',
  GAIN = 'Gain weight',
  LOSE = 'Lose weight',
}

export enum Gender {
  MALE = 'Male',
  FEMALE = 'Female',
}

@Entity()
export default class Profile extends BaseEntity {
  @OneToOne(type => User, user => user.profile)
  @JoinColumn()
  public user: User;

  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ type: 'int', nullable: true })
  public age: number;

  @Column({
    default: Goals.MAINTAIN,
    enum: Goals,
    type: 'enum',
  })
  public goal: Goals;

  @Column({
    default: Gender.MALE,
    enum: Gender,
    type: 'enum',
  })
  public gender: Gender;

  @Column({ nullable: true })
  public startingWeight: number;

  @Column({nullable: true})
  public height: number;

  @CreateDateColumn()
  public createdAt: Timestamp;

  @UpdateDateColumn()
  public updatedAt: Timestamp;
}
