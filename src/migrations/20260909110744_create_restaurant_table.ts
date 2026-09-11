import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
        CREATE TABLE restaurants (
            id BIGSERIAL PRIMARY KEY,
            owner_id BIGINT NOT NULL,



            name VARCHAR(255) NOT NULL UNIQUE,
            logo_url TEXT,
            primary_country VARCHAR(255) NOT NULL,
        
            status VARCHAR(50) NOT NULL CHECK (status IN ('active','suspended','disabled','pending')),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            status_updated_at TIMESTAMP NOT NULL,
            deleted_at TIMESTAMP DEFAULT NULL,

            CONSTRAINT fk_restaurants_owner_id FOREIGN KEY (owner_id) REFERENCES users(id)
        );
        CREATE INDEX idx_restaurants_name ON restaurants(name);
        CREATE INDEX idx_restaurants_owner_id ON restaurants(owner_id);
        CREATE INDEX idx_restaurants_status ON restaurants(status);
        CREATE INDEX idx_restaurants_created_at ON restaurants(created_at);
        CREATE INDEX idx_restaurants_primary_country ON restaurants(primary_country);
    `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`DROP TABLE restaurants;`);
}
