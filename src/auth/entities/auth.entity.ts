import { AbstractEntity } from '../../utils/abstracts/abstract-entity';
import { Entity, Column, OneToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Exclude } from 'class-transformer';

@Entity({ name: 'authentications' })
export class Authentication extends AbstractEntity {
  @Column({ unique: true })
  public login: string;

  @Column()
  @Exclude()
  public password: string;

  @OneToOne(() => User, (user: User) => user.authentication)
  @Exclude()
  public user: User;
}
