import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import User from './User';

enum Goals {
  GAIN = 'Gain weight',
  LOSE = 'Lose weight',
  MAINTAIN = 'Maintain weight',
}

enum Gender {
  MALE = 'Male',
  FEMALE = 'Female',
}

@Entity()
export default class Profile extends BaseEntity {
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
  public weight: number;

  @OneToOne(type => User, user => user.profile)
  @JoinColumn()
  public user: User;
}
