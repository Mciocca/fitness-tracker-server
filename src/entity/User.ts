import bcrypt from 'bcrypt';
import {
  IsEmail,
  IsNotEmpty,
} from 'class-validator';
import {
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Timestamp,
  UpdateDateColumn,
  OneToOne,
  OneToMany
} from 'typeorm';
import Profile from './Profile';
import Workout from './Workout';
import { userPasswordValidation } from './validations/UserValidations';

@Entity()
export default class User extends BaseEntity {
  @OneToOne(type => Profile, profile => profile.user, { cascade: true })
  public profile: Profile;

  @OneToMany(type => Workout, workout => workout.user)
  public workouts: Workout[];

  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  @IsNotEmpty({ message: 'First name is required'})
  public firstName: string;

  @Column()
  @IsNotEmpty({ message: 'Last name is required'})
  public lastName: string;

  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  }

  @Column({ unique: true })
  @IsEmail({}, { message: 'Email is not valid' })
  public email: string;

  @CreateDateColumn()
  public createdAt: Timestamp;

  @UpdateDateColumn()
  public updatedAt: Timestamp;

  @userPasswordValidation({ message: 'Password is required and must be at least 6 characters'})
  public password: string;

  @Column()
  public passwordHash: string;

  private saltRounds: number = 12;

  public async validLogin(passwordInput: string): Promise<boolean> {
    return await bcrypt.compare(passwordInput, this.passwordHash);
  }

  @BeforeUpdate()
  @BeforeInsert()
  private async encryptPassword() {
    if (this.password) {
      const salt = await bcrypt.genSalt(this.saltRounds);
      this.passwordHash = await bcrypt.hash(this.password, salt);
    }
  }
}
