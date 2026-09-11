import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
        CREATE TABLE customer_addresses (
            id SERIAL PRIMARY KEY,
            user_id BIGINT NOT NULL,
            label VARCHAR(255) NOT NULL,
            country VARCHAR(255) NOT NULL,
            city VARCHAR(255) NOT NULL,
            street_address VARCHAR(255) NOT NULL,
            building VARCHAR(50) ,
            apartment VARCHAR(50)  ,
            type VARCHAR(50) NOT NULL CHECK (type IN ('home', 'work', 'other')),
    
            lat DECIMAL(10, 7) NOT NULL,
            lng DECIMAL(10, 7) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            deleted_at TIMESTAMP DEFAULT NULL,
            is_default BOOLEAN NOT NULL,

            CONSTRAINT fk_customer_addresses_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        );
        CREATE INDEX idx_customer_addresses_user_id ON customer_addresses(user_id);
    `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`
        DROP TABLE customer_addresses;
    `);
}
