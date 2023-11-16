import { AbstractEntity } from '../../utils/abstracts/abstract-entity';
import { Entity, Column, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { Exclude } from 'class-transformer';

@Entity({ name: 'addresses' })
export class Address extends AbstractEntity {
  @Column()
  public country: string;

  @Column()
  public city: string;

  @Column()
  public postalCode: string;

  @Column()
  public street: string;

  @Column()
  public buildingNumber: string;

  @OneToMany(() => User, (user: User) => user.address)
  @Exclude()
  public user: User;
}
