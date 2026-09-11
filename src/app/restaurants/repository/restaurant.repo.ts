import { RestaurantEntity } from "../entity/restaurant.entity.ts";

import { db } from "../../../common/db/knex.ts";
import { Knex } from "knex";
import { RestaurantStatus } from "../enums.ts";

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
): Promise<RestaurantEntity | undefined> {
  const row = await db("restaurants")
    .select(RESTAURANT_COLUMNS)
    .where("id", id)
    .whereNull("deleted_at")
    .first();
  return row ? toEntity(row) : undefined;
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
  restaurant: Partial<RestaurantEntity>,
  userId: number,
  conn: Knex = db,
) {
  const updates: Record<string, string | RestaurantStatus | undefined | Date> =
    {};
  const now = new Date();
  if (restaurant.name !== undefined) {
    updates.name = restaurant.name;
  }
  if (restaurant.logoUrl !== undefined) {
    updates.logo_url = restaurant.logoUrl;
  }
  if (restaurant.primaryCountry !== undefined)
    updates.primary_country = restaurant.primaryCountry;
  if (restaurant.status !== undefined) {
    updates.status = restaurant.status;
    updates.status_updated_at = now;
  }

  if (Object.keys(updates).length === 0) return undefined;

  updates.updated_at = now;
  const [row] = await conn("restaurants")
    .where("id", id)
    .whereNull("deleted_at")
    .where("owner_id", userId)
    .update(updates)
    .returning(RESTAURANT_COLUMNS);

  return row ? toEntity(row) : undefined;
}
