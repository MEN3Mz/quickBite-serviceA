import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
        CREATE TABLE password_resets (
            Id SERIAL PRIMARY KEY,
            user_id BIGINT NOT NULL,
            otp_hash VARCHAR(255) NOT NULL,
            expires_at TIMESTAMP NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            consumed_at TIMESTAMP DEFAULT NULL,

            CONSTRAINT fk_password_resets_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE

        );

        create index idx_password_resets_user_id on password_resets(user_id);
        create index idx_password_resets_expires_at on password_resets(expires_at);
    `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`
        DROP TABLE password_resets;
    `);
}
