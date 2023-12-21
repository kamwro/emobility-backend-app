import { MigrationInterface, QueryRunner } from 'typeorm';
import { SqlReader } from 'node-sql-reader';
import * as path from 'path';

export class Initial1703130028707 implements MigrationInterface {
  name = 'Initial1703130028707';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "charging_station_types" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "trademark" character varying NOT NULL, "model" character varying NOT NULL, "producer" character varying NOT NULL, "current" character varying NOT NULL, "maxPlugsConnected" integer NOT NULL, "maxPowerUsedInKWh" integer NOT NULL, "hasWirelessCharging" boolean NOT NULL, CONSTRAINT "UQ_5712ea73d66ca181cd43e752989" UNIQUE ("trademark"), CONSTRAINT "PK_5a24348d3967802d2ce07c0db91" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "charging_stations" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "priceInEuro" integer NOT NULL, "isAvailableAtHome" boolean NOT NULL, "isAvailableAtWorkPlace" boolean NOT NULL, "isAvailableInPublic" boolean NOT NULL, "typeId" integer, CONSTRAINT "PK_1c6b0929c2ea47fddae66e120c0" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "charging_stations" ADD CONSTRAINT "FK_b967d6e0a3d1e44439af635a76f" FOREIGN KEY ("typeId") REFERENCES "charging_station_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );

    // add 10 charging station types
    for (let i = 0; i < 10; i++) {
      if (i % 2) {
        await queryRunner.query(
          `INSERT INTO "charging_station_types" ("trademark", "model", "producer", "current", "maxPlugsConnected", "maxPowerUsedInKWh", "hasWirelessCharging") VALUES ('charger${
            i + 1
          }', 'model${i + 1}', 'company${i + 1}', 'AC', ${i + 1}, 8, TRUE )`,
        );
      } else {
        await queryRunner.query(
          `INSERT INTO "charging_station_types" ("trademark", "model", "producer", "current", "maxPlugsConnected", "maxPowerUsedInKWh", "hasWirelessCharging") VALUES ('charger${
            i + 1
          }', 'model${i + 1}', 'company${i + 1}', 'DC', ${i}, 9, FALSE )`,
        );
      }
    }

    // generate 1000 records for charging stations
    let queries = SqlReader.readSqlFile(path.join(__dirname, 'charging-stations.sql'));
    for (let query of queries) {
      await queryRunner.query(`${query}`);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`TRUNCATE "charging_stations"`);
    await queryRunner.query(`TRUNCATE "charging_station_types"`);
    await queryRunner.query(`ALTER TABLE "charging_stations" DROP CONSTRAINT "FK_b967d6e0a3d1e44439af635a76f"`);
    await queryRunner.query(`DROP TABLE "charging_stations"`);
    await queryRunner.query(`DROP TABLE "charging_station_types"`);
  }
}
