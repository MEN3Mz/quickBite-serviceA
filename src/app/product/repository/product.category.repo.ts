import { Knex } from "knex";
import { db } from "../../../common/db/knex.ts";
import { ProductBranchDetails } from "../entity/pbd.entity.ts";
import { ProductCategory } from "../entity/product.category.entity.ts";
const CATEGORY_COLUMNS = [
  "id",
  "restaurant_id",
  "name",
  "created_at",
  "updated_at",
];

function toEntity(row: any): ProductCategory {
  return new ProductCategory({
    id: row.id,
    restaurantId: row.restaurant_id,
    name: row.name,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  });
}

export async function getRestaurantCategories(id: number) {
  const rows = await db("product_categories")
    .select(CATEGORY_COLUMNS)
    .where("restaurant_id", id);
  return rows.map(toEntity);
}
export async function getCategoryByName(restaurantId: number, name: string) {
  const [row] = await db("product_categories")
    .select(CATEGORY_COLUMNS)
    .where("restaurant_id", restaurantId)
    .where("name", name);

  return row ? toEntity(row) : undefined;
}
export async function getAllRestaurantCategories(restaurantId: number) {
  const rows = await db("product_categories")
    .select(CATEGORY_COLUMNS)
    .where("restaurant_id", restaurantId);
  return rows.map(toEntity);
}

export async function createCategory(
  restaurantId: number,
  restaurantName: string,
  conn: Knex = db,
) {
  const now = new Date();
  const [row] = await conn("product_categories")
    .insert({
      restaurant_id: restaurantId,
      name: restaurantName,
      created_at: now,
      updated_at: now,
    })
    .returning(CATEGORY_COLUMNS);
  return toEntity(row);
}
