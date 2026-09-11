import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
        CREATE TABLE users (
            id SERIAL PRIMARY KEY,

            email VARCHAR(255) NOT NULL UNIQUE,
            password_hash VARCHAR(255) NOT NULL,


            name VARCHAR(255) NOT NULL UNIQUE,
            phone_number VARCHAR(20) NOT NULL UNIQUE,
            system_role  VARCHAR(50) NOT NULL CHECK (system_role IN ('customer', 'restaurant_user', 
            'system_admin', 'delivery_agent')),
        
            status VARCHAR(50) NOT NULL CHECK (status IN ('active', 'inactive', 'suspended')),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            deleted_at TIMESTAMP DEFAULT NULL
        );
        CREATE INDEX idx_users_email ON users(email);
        CREATE INDEX idx_users_system_role ON users(system_role);
        CREATE INDEX idx_users_status ON users(status);
    `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`
        DROP TABLE users;
    
    `);
}
