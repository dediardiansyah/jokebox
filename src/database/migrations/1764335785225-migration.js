/**
 * @typedef {import('typeorm').MigrationInterface} MigrationInterface
 * @typedef {import('typeorm').QueryRunner} QueryRunner
 */

/**
 * @class
 * @implements {MigrationInterface}
 */
module.exports = class Migration1764335785225 {
    name = 'Migration1764335785225'

    /**
     * @param {QueryRunner} queryRunner
     */
    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying(255) NOT NULL, "name" character varying(255) NOT NULL, "password" character varying(255) NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "canvas_designs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, "data" jsonb NOT NULL, "description" text, "image_url" character varying(255), "price" integer NOT NULL DEFAULT '0', "is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_d51e0edb52eb0f79c714650cfad" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "categories" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, "description" text, "image_url" character varying(255), "is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "transactions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "design_id" uuid NOT NULL, "total" integer NOT NULL DEFAULT '0', "description" text, "key" character varying(255), "token" character varying(255), "status" character varying(50) NOT NULL DEFAULT 'pending', "settled_at" TIMESTAMP, "is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a219afd8dd77ed80f5a862f1db9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "canvas_design_categories" ("design_id" uuid NOT NULL, "category_id" uuid NOT NULL, CONSTRAINT "PK_22e61d6781e22d09b213e0ebf26" PRIMARY KEY ("design_id", "category_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_6b468fb9c40b9aac7e96767815" ON "canvas_design_categories" ("design_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_1c031904de55bd67f202180636" ON "canvas_design_categories" ("category_id") `);
        await queryRunner.query(`ALTER TABLE "transactions" ADD CONSTRAINT "FK_883a4f2416ddceca5ceec81e686" FOREIGN KEY ("design_id") REFERENCES "canvas_designs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "canvas_design_categories" ADD CONSTRAINT "FK_6b468fb9c40b9aac7e96767815d" FOREIGN KEY ("design_id") REFERENCES "canvas_designs"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "canvas_design_categories" ADD CONSTRAINT "FK_1c031904de55bd67f2021806366" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    /**
     * @param {QueryRunner} queryRunner
     */
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "canvas_design_categories" DROP CONSTRAINT "FK_1c031904de55bd67f2021806366"`);
        await queryRunner.query(`ALTER TABLE "canvas_design_categories" DROP CONSTRAINT "FK_6b468fb9c40b9aac7e96767815d"`);
        await queryRunner.query(`ALTER TABLE "transactions" DROP CONSTRAINT "FK_883a4f2416ddceca5ceec81e686"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_1c031904de55bd67f202180636"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_6b468fb9c40b9aac7e96767815"`);
        await queryRunner.query(`DROP TABLE "canvas_design_categories"`);
        await queryRunner.query(`DROP TABLE "transactions"`);
        await queryRunner.query(`DROP TABLE "categories"`);
        await queryRunner.query(`DROP TABLE "canvas_designs"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }
}
