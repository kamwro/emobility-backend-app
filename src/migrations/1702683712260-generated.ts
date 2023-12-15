import { MigrationInterface, QueryRunner } from "typeorm";

export class Generated1702683712260 implements MigrationInterface {
    name = 'Generated1702683712260'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "login" character varying NOT NULL, "password" character varying NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "birthday" TIMESTAMP NOT NULL, "isActive" boolean NOT NULL DEFAULT false, "refreshToken" character varying, "verificationKey" character varying NOT NULL DEFAULT 'placeholder', "country" character varying NOT NULL, "city" character varying NOT NULL, "postalCode" character varying NOT NULL, "street" character varying NOT NULL, "buildingNumber" character varying NOT NULL, CONSTRAINT "UQ_2d443082eccd5198f95f2a36e2c" UNIQUE ("login"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
