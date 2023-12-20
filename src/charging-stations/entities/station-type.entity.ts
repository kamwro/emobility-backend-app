import { Exclude } from 'class-transformer';
import { AbstractEntity } from '../../utils/abstracts/abstract-entity';
import { Entity, Column, OneToMany } from 'typeorm';
import { ChargingStation } from './charging-station.entity';

@Entity({ name: 'charging_stations' })
export class StationType extends AbstractEntity {
  @Column({ unique: true })
  public name: string;

  @Column()
  public current: 'AC' | 'DC';

  @Column('string', { array: true })
  public usedConnectors: [string];

  @Column()
  public chargingSpeed: {
    minKPH: number;
    minKPM: number;
    maxKPH: number;
    maxKPM: number;
  };

  @Column()
  public isAvailable: {
    atHome: boolean;
    atWorkplace: boolean;
    inPublic: boolean;
  };

  @Column()
  public hasWirelessCharging: boolean;

  @OneToMany(() => ChargingStation, (station) => station.type)
  @Exclude()
  station: ChargingStation;
}
