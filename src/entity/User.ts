import bcrypt from 'bcrypt';
import {
  IsEmail,
  IsNotEmpty,
  registerDecorator,
  ValidationOptions,
  ValidationArguments
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
} from 'typeorm';
import Profile from './Profile';

const userPasswordValidation = (validationOptions: ValidationOptions) => {
  return (object: object, propertyName: string) => {
    registerDecorator({
      name: 'userPasswordValidation',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const user = args.object as User;
          if (user.passwordHash && !value) {
            return true;
          }

          if (!user.passwordHash && !value) {
            return false;
          }

          if (!user.passwordHash && value && value.length >= 6 ) {
            return true;
          } else {
            return false;
          }
        }
      }
    });
  };
};

@Entity()
export default class User extends BaseEntity {
  @OneToOne(type => Profile, profile => profile.user, { cascade: true })
  public profile: Profile;

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
