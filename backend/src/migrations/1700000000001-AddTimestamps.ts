import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTimestamps1700000000001 implements MigrationInterface {
    name = 'AddTimestamps1700000000001'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "user" 
            ADD COLUMN "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
            ADD COLUMN "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "user" 
            DROP COLUMN "createdAt",
            DROP COLUMN "updatedAt"
        `);
    }
} 