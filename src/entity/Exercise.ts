import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Timestamp,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm';

@Entity()
export default class Exercise extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ nullable: false })
  public name: string;

  @Column({ nullable: false })
  public muscleGroup: string;

  @CreateDateColumn()
  public createdAt: Timestamp;

  @UpdateDateColumn()
  public updatedAt: Timestamp;
}
