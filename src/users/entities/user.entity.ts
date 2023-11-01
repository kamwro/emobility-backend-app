import { AbstractEntity } from 'src/utils';
import { Authentication } from 'src/auth/entities';
import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';

@Entity({ name: 'users' })
export class User extends AbstractEntity {
  @Column({ unique: true })
  public login: string;

  @Column()
  public firstName: string;

  @Column()
  public lastName: string;

  @Column()
  public address: string;

  @Column()
  public birthday: Date;

  @Column({ default: false })
  public isActive: boolean;

  @OneToOne(() => Authentication, (auth: Authentication) => auth.user, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn()
  public authentication: Authentication;
}
