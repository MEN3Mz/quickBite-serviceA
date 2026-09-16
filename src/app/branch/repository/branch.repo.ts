import { db } from "../../../common/db/knex.ts";
import { Knex } from "knex";
import { BranchEntity } from "../entity/branch.entity.ts";

const BRANCH_COLUMNS = [
  "id",
  "restaurant_id",
  "country_code",
  "address_text",
  "label",
  "lat",
  "lng",
  "is_active",
  "opens_at",
  "closes_at",
  "accepting_orders",
  "created_at",
  "updated_at",
  "delivery_radius",
  "currency",
  "comission",
];

function toEntity(raw: any): BranchEntity {
  return new BranchEntity({
    id: raw.id,
    restaurantId: raw.restaurant_id,
    countryCode: raw.country_code,
    addressText: raw.address_text,
    label: raw.label,
    lat: raw.lat,
    lng: raw.lng,
    isActive: raw.is_active,
    opensAt: raw.opens_at,
    closesAt: raw.closes_at,
    acceptingOrders: raw.accepting_orders,
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
    deliveryRadius: raw.delivery_radius,
    currency: raw.currency,
    comission: raw.comission,
  });
}

export async function createBranch(
  data: Partial<BranchEntity>,
  conn: Knex = db,
): Promise<BranchEntity> {
  const now = new Date();
  const [row] = await conn("restaurant_branches")
    .insert({
      restaurant_id: data.restaurantId,
      country_code: data.countryCode,
      address_text: data.addressText,
      label: data.label,
      lat: data.lat,
      lng: data.lng,
      is_active: data.isActive ?? true,
      opens_at: data.opensAt,
      closes_at: data.closesAt,
      accepting_orders: data.acceptingOrders ?? true,
      created_at: data.createdAt ?? now,
      updated_at: data.updatedAt ?? now,
      delivery_radius: data.deliveryRadius,
      currency: data.currency,
      comission: data.comission,
    })
    .returning(BRANCH_COLUMNS);

  return toEntity(row);
}

export async function findNearbyBranches(
  lat: number,
  lng: number,
): Promise<BranchEntity[]> {
  /*const result = await db.raw(
    `
    SELECT
    b.id,
    b.restaurant_id,
    b.address_text,
    b.label,
    b.lat,
    b.lng,
    b.is_active,
    b.accepting_orders
    ,b.currency,
    r.name,
    r.logo_url from restaurant_branches b join restaurants r on b.restaurant_id=r.id
    WHERE b.is_active=true and r.status ='active'
    AND ST_DWithin(b.location,ST_MakePoint(?,?)::geography,b.delivery_radius*1000)

    
    
    `,
    [lng, lat],
  );*/
  const result = await db.raw(
    `
  SELECT
    b.id,
    b.restaurant_id,
    b.address_text,
    b.label,
    b.lat,
    b.lng,
    b.is_active,
    b.accepting_orders,
    b.currency,
    r.name,
    r.logo_url
  FROM restaurant_branches AS b
  INNER JOIN restaurants AS r
    ON r.id = b.restaurant_id
  WHERE    ST_DWithin(
      b.location,
      ST_SetSRID(
        ST_MakePoint(?, ?),
        4326
      )::geography,
      b.delivery_radius * 1000
    )
  `,
    [lng, lat],
  );

  console.log(result.rows);
  return result.rows;
}

export async function getRestaurantBranches(restaurantId: number) {
  const rows = await db("restaurant_branches")
    .select(BRANCH_COLUMNS)
    .where("restaurant_id", restaurantId);
  return rows.map(toEntity);
}

export async function updateBranch(
  id: number,
  data: Record<string, any>,
): Promise<BranchEntity> {
  const [row] = await db("restaurant_branches")
    .where("id", id)
    .update({
      label: data.label,
      address_text: data.addressText,
      lat: data.lat,
      lng: data.lng,
      opens_at: data.opensAt,
      closes_at: data.closesAt,
      delivery_radius: data.deliveryRadius,
      currency: data.currency,
      accept_orders: data.acceptOrders,
      updated_at: new Date(),
    })
    .returning(BRANCH_COLUMNS);
  return toEntity(row);
}

export async function updateBranchStatus(
  id: number,
  data: { isActive?: boolean; comission?: number },
): Promise<BranchEntity> {
  const [row] = await db("restaurant_branches")
    .where("id", id)
    .update({
      is_active: data.isActive,
      comission: data.comission,
      updated_at: new Date(),
    })
    .returning(BRANCH_COLUMNS);
  return toEntity(row);
}

export async function findBranchById(
  id: number,
): Promise<BranchEntity | undefined> {
  const row = await db("restaurant_branches")
    .select(BRANCH_COLUMNS)
    .where("id", id)
    .first();
  return row ? toEntity(row) : undefined;
}
