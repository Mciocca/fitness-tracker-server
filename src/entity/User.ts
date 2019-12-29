import bcrypt from 'bcrypt';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
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
} from 'typeorm';
import Profile from './Profile';

@Entity()
export default class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @OneToOne(type => Profile, profile => profile.user)
  public profile: Profile;

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

  @IsNotEmpty({ message: 'Password is required'})
  @MinLength(6, { message: 'Password must be at least 6 characters'})
  public password: string;

  @Column()
  private passwordHash: string;

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
