import { Knex } from "knex";
import { db } from "../../../common/db/knex.ts";
import { Address } from "../entity/address.entity.ts";

const ADDRESS_COLUMNS = [
  "id",
  "user_id",

  "label",

  "country",

  "city",

  "street_address",

  "building",

  "apartment",

  "type",

  "lat",
  "lng",

  "is_default",
  "created_at",
  "updated_at",
  "deleted_at",
];
function toEntity(row: any): Address {
  return new Address({
    id: row.id,
    userId: row.user_id,
    label: row.label,
    country: row.country,
    city: row.city,
    street: row.street_address,
    building: row.building,
    apartment: row.apartment,
    type: row.type,
    lat: Number(row.lat),
    lng: Number(row.lng),
    isDefault: row.is_default,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    deletedAt: row.deleted_at,
  });
}
export async function createAddress(
  address: Partial<Address>,
  conn: Knex = db,
): Promise<Address> {
  const [row] = await conn("customer_addresses")
    .insert({
      user_id: address.userId,
      label: address.label,
      country: address.country,
      city: address.city,
      street_address: address.street,
      building: address.building,
      apartment: address.apartment,
      type: address.type,
      lat: address.lat,
      lng: address.lng,
      is_default: address.isDefault,
      created_at: address.createdAt,
      updated_at: address.updatedAt,
      deleted_at: address.deletedAt,
    })
    .returning(ADDRESS_COLUMNS);

  return toEntity(row);
}

export async function findAllCustomerAddresses(
  userId: number,
): Promise<Address[]> {
  const rows = await db("customer_addresses")
    .select(ADDRESS_COLUMNS)
    .where("user_id", userId)
    .whereNull("deleted_at")
    .orderBy("is_default", "desc");
  return rows.map(toEntity);
}

export async function findCustomerAddressById(
  addressId: number,
  userId: number,
): Promise<Address | undefined> {
  const row = await db("customer_addresses")
    .select(ADDRESS_COLUMNS)
    .where("id", addressId)
    .where("user_id", userId)
    .whereNull("deleted_at")
    .first();
  return row ? toEntity(row) : undefined;
}
export async function updateCustomerAddress(
  userId: number,
  addressId: number,
  address: Partial<Address>,
): Promise<Address | undefined> {
  const updates: Record<string, string | number | boolean | Date | null> = {};

  if (address.label !== undefined) {
    updates.label = address.label;
  }

  if (address.country !== undefined) {
    updates.country = address.country;
  }

  if (address.city !== undefined) {
    updates.city = address.city;
  }

  if (address.street !== undefined) {
    updates.street_address = address.street;
  }

  if (address.building !== undefined) {
    updates.building = address.building;
  }

  if (address.apartment !== undefined) {
    updates.apartment = address.apartment;
  }

  if (address.type !== undefined) {
    updates.type = address.type;
  }

  if (address.lat !== undefined) {
    updates.lat = address.lat;
  }

  if (address.lng !== undefined) {
    updates.lng = address.lng;
  }

  if (address.isDefault !== undefined) {
    updates.is_default = address.isDefault;
  }

  if (Object.keys(updates).length === 0) {
    return findCustomerAddressById(addressId, userId);
  }

  updates.updated_at = new Date();

  const [row] = await db("customer_addresses")
    .where("id", addressId)
    .where("user_id", userId)
    .whereNull("deleted_at")
    .update(updates)
    .returning(ADDRESS_COLUMNS);

  return row ? toEntity(row) : undefined;
}

export async function deleteCustomerAddress(
  userId: number,
  addressId: number,
): Promise<Address | undefined> {
  const date = new Date();
  const [row] = await db("customer_addresses")
    .where("id", addressId)
    .where("user_id", userId)
    .whereNull("deleted_at")
    .update({
      deleted_at: date,
      updated_at: date,
    })
    .returning(ADDRESS_COLUMNS);
  return row ? toEntity(row) : undefined;
}

export async function clearDefaultByUserId(userId: number): Promise<void> {
  await db("customer_addresses")
    .where("user_id", userId)
    .where("is_default", true)
    .update({ is_default: false });
}
