import { Exclude } from 'class-transformer';
import { AbstractEntity } from '../../utils/abstracts/abstract-entity';
import { Entity, Column, OneToMany } from 'typeorm';
import { ChargingStation } from './charging-station.entity';

@Entity({ name: 'charging_station_types' })
export class ChargingStationType extends AbstractEntity {
  @Column({ unique: true })
  public trademark: string;

  @Column()
  public model: string;

  @Column()
  public producer: string;

  @Column()
  public current: 'AC' | 'DC';

  @Column()
  public maxPlugsConnected: number;

  @Column()
  public maxPowerUsedInKWh: number;

  @Column()
  public hasWirelessCharging: boolean;

  @OneToMany(() => ChargingStation, (station) => station.type)
  @Exclude()
  station: ChargingStation;
}
