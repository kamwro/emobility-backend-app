import { MigrationInterface, QueryRunner } from "typeorm";

export class Generated1702601636979 implements MigrationInterface {
    name = 'Generated1702601636979'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "hashedRefreshToken" TO "refreshToken"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "refreshToken" TO "hashedRefreshToken"`);
    }

}
