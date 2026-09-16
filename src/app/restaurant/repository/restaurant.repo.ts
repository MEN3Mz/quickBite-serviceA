import { RestaurantEntity } from "../entity/restaurant.entity.ts";

import { db } from "../../../common/db/knex.ts";
import { Knex } from "knex";
import { RestaurantStatus } from "../enums.ts";
import { RegisterDTO } from "../../auth/dto/auth.dto.ts";

const RESTAURANT_COLUMNS = [
  "id",
  "owner_id",
  "name",
  "logo_url",
  "status",
  "primary_country",
  "created_at",
  "updated_at",
  "status_updated_at",
];

function toEntity(row: any): RestaurantEntity {
  return new RestaurantEntity({
    id: row.id,
    ownerId: row.owner_id,
    name: row.name,
    logoUrl: row.logo_url,
    status: row.status,
    primaryCountry: row.primary_country,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    statusUpdatedAt: row.status_updated_at,
  });
}

export async function findRestaurantById(
  id: number,
): Promise<RestaurantEntity> {
  const row = await db("restaurants")
    .select(RESTAURANT_COLUMNS)
    .where("id", id)
    .whereNull("deleted_at")
    .first();
  return toEntity(row);
}

export async function findRestaurantByOwnerId(
  id: number,
): Promise<RestaurantEntity | undefined> {
  const row = await db("restaurants")
    .select(RESTAURANT_COLUMNS)
    .where("owner_id", id)
    .whereNull("deleted_at")
    .first();
  return row ? toEntity(row) : undefined;
}

export async function findRestaurantByName(
  name: string,
): Promise<RestaurantEntity | undefined> {
  const row = await db("restaurants")
    .select(RESTAURANT_COLUMNS)
    .where("name", name)
    .whereNull("deleted_at")
    .first();
  return row ? toEntity(row) : undefined;
}

export async function findAllRestaurants(): Promise<RestaurantEntity[]> {
  const rows = await db("restaurants")
    .select(RESTAURANT_COLUMNS)
    .whereNull("deleted_at");
  return rows.map(toEntity);
}

export async function createRestaurant(
  restaurant: Partial<RestaurantEntity>,
  conn: Knex = db,
): Promise<RestaurantEntity> {
  const [row] = await conn("restaurants")
    .insert({
      owner_id: restaurant.ownerId,
      name: restaurant.name,
      logo_url: restaurant.logoUrl,
      status: restaurant.status,
      primary_country: restaurant.primaryCountry,
      created_at: restaurant.createdAt,
      updated_at: restaurant.updatedAt,
      status_updated_at: restaurant.statusUpdatedAt,
    })
    .returning(RESTAURANT_COLUMNS);

  return toEntity(row);
}
export async function updateRestaurant(
  id: number,
  data: { name?: string; logoUrl?: string; primaryCountry?: string },
): Promise<RestaurantEntity> {
  const [row] = await db("restaurants")
    .where("id", id)
    .update({
      name: data.name,
      logo_url: data.logoUrl,
      primary_country: data.primaryCountry,

      updated_at: new Date(),
    })
    .returning(RESTAURANT_COLUMNS);
  return toEntity(row);
}

export async function updateRestaurantStatus(
  id: number,
  status: string,
): Promise<RestaurantEntity> {
  const now = new Date();
  const [row] = await db("restaurants")
    .where("id", id)
    .update({
      status,
      status_updated_at: now,
      updated_at: now,
    })
    .returning(RESTAURANT_COLUMNS);
  return toEntity(row);
}
