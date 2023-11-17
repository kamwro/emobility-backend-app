import { AbstractEntity } from '../../utils/abstracts/abstract-entity';
import { Entity, Column, ManyToOne, JoinTable } from 'typeorm';
import { Exclude } from 'class-transformer';
import { Address } from './address.entity';

@Entity({ name: 'users' })
export class User extends AbstractEntity {
  @Column({ unique: true })
  public login: string;

  @Column()
  @Exclude()
  public password: string;

  @Column()
  public firstName: string;

  @Column()
  public lastName: string;

  @Column()
  public birthday: Date;

  @Column({ default: false })
  public isActive: boolean;

  @Column({ type: 'varchar', nullable: true })
  @Exclude()
  public hashedRefreshedToken: string | null;

  @ManyToOne(() => Address, (address: Address) => address.user, { cascade: true })
  @JoinTable()
  public address: Address;
}
