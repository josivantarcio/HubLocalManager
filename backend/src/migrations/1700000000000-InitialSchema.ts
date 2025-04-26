import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1700000000000 implements MigrationInterface {
  name = 'InitialSchema1700000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "user" (
        "id" SERIAL NOT NULL,
        "name" character varying NOT NULL,
        "email" character varying NOT NULL,
        "password" character varying NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"),
        CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "company" (
        "id" SERIAL NOT NULL,
        "name" character varying NOT NULL,
        "cnpj" character varying NOT NULL,
        "website" character varying,
        "logoUrl" character varying,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "userId" integer,
        CONSTRAINT "UQ_9a97465b7959d86b674f5ae660e" UNIQUE ("cnpj"),
        CONSTRAINT "PK_056f7854a7afdba7cbd6d45fc20" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "location" (
        "id" SERIAL NOT NULL,
        "name" character varying NOT NULL,
        "cep" character varying NOT NULL,
        "street" character varying NOT NULL,
        "number" character varying NOT NULL,
        "neighborhood" character varying NOT NULL,
        "city" character varying NOT NULL,
        "state" character varying NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "companyId" integer,
        CONSTRAINT "PK_876d7bdba03c72251ec4c2dc827" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      ALTER TABLE "company"
      ADD CONSTRAINT "FK_9a97465b7959d86b674f5ae660e"
      FOREIGN KEY ("userId")
      REFERENCES "user"("id")
      ON DELETE CASCADE
      ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "location"
      ADD CONSTRAINT "FK_876d7bdba03c72251ec4c2dc827"
      FOREIGN KEY ("companyId")
      REFERENCES "company"("id")
      ON DELETE CASCADE
      ON UPDATE NO ACTION
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "location"
      DROP CONSTRAINT "FK_876d7bdba03c72251ec4c2dc827"
    `);

    await queryRunner.query(`
      ALTER TABLE "company"
      DROP CONSTRAINT "FK_9a97465b7959d86b674f5ae660e"
    `);

    await queryRunner.query(`DROP TABLE "location"`);
    await queryRunner.query(`DROP TABLE "company"`);
    await queryRunner.query(`DROP TABLE "user"`);
  }
} 