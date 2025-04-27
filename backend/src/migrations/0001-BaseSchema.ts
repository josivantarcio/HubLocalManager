import { MigrationInterface, QueryRunner } from 'typeorm';

export class BaseSchema1700000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Primeiro, adiciona a coluna website com valor padrão
    await queryRunner.query(`
      ALTER TABLE "company" 
      ADD COLUMN IF NOT EXISTS "website" character varying DEFAULT ''
    `);

    // Depois, atualiza os valores nulos para o valor padrão
    await queryRunner.query(`
      UPDATE "company" 
      SET "website" = '' 
      WHERE "website" IS NULL
    `);

    // Por fim, torna a coluna NOT NULL
    await queryRunner.query(`
      ALTER TABLE "company" 
      ALTER COLUMN "website" SET NOT NULL
    `);

    // Adiciona a coluna logoUrl se não existir
    await queryRunner.query(`
      ALTER TABLE "company" 
      ADD COLUMN IF NOT EXISTS "logoUrl" character varying
    `);

    // Cria a tabela de usuários se não existir
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "user" (
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

    // Cria a tabela de localizações se não existir
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "location" (
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

    // Adiciona as chaves estrangeiras se não existirem
    await queryRunner.query(`
      ALTER TABLE "company"
      ADD CONSTRAINT IF NOT EXISTS "FK_company_user"
      FOREIGN KEY ("userId") REFERENCES "user"("id")
      ON DELETE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE "location"
      ADD CONSTRAINT IF NOT EXISTS "FK_location_company"
      FOREIGN KEY ("companyId") REFERENCES "company"("id")
      ON DELETE CASCADE
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove as constraints primeiro
    await queryRunner.query(`
      ALTER TABLE "location" 
      DROP CONSTRAINT IF EXISTS "FK_location_company"
    `);
    
    await queryRunner.query(`
      ALTER TABLE "company" 
      DROP CONSTRAINT IF EXISTS "FK_company_user"
    `);

    // Remove as colunas adicionadas
    await queryRunner.query(`
      ALTER TABLE "company" 
      DROP COLUMN IF EXISTS "website",
      DROP COLUMN IF EXISTS "logoUrl"
    `);

    // Remove as tabelas se existirem
    await queryRunner.query(`DROP TABLE IF EXISTS "location"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "user"`);
  }
} 