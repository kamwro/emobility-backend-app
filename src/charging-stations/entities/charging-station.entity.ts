import { AbstractEntity } from '../../utils/abstracts/abstract-entity';
import { Entity, Column, ManyToOne, JoinTable } from 'typeorm';
import { StationType } from './station-type.entity';

@Entity({ name: 'charging_stations' })
export class ChargingStation extends AbstractEntity {
  @Column()
  public trademark: string;

  @Column()
  public producer: string;

  @Column()
  public priceInEuro: number;

  @ManyToOne(() => StationType, (type) => type.station)
  @JoinTable()
  public type: StationType;
}
