import { AbstractEntity } from '../../utils/abstracts/abstract-entity';
import { Entity, Column, ManyToOne, JoinTable } from 'typeorm';
import { ChargingStationType } from './station-type.entity';

@Entity({ name: 'charging_stations' })
export class ChargingStation extends AbstractEntity {
  @Column()
  public priceInEuro: number;

  @Column()
  public isAvailableAtHome: boolean;

  @Column()
  public isAvailableAtWorkPlace: boolean;

  @Column()
  public isAvailableInPublic: boolean;

  @ManyToOne(() => ChargingStationType, (type) => type.station)
  @JoinTable()
  public type: ChargingStationType;
}
