import { AbstractEntity } from 'src/utils';
import { Entity, Column, OneToOne } from 'typeorm';
import { User } from 'src/users/entities';
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
