import { AbstractEntity } from '../utils/abstracts/abstract-entity';
import { Entity, Column } from 'typeorm';
import { Exclude } from 'class-transformer';

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
  public hashedRefreshToken: string | null;

  @Column({ default: 'placeholder' })
  public verificationKey: string;

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
}
