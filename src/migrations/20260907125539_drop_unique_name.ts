import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
    ALTER TABLE users
    DROP CONSTRAINT IF EXISTS users_name_key
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`
    ALTER TABLE users
    ADD CONSTRAINT users_name_key UNIQUE (name)
  `);
}
