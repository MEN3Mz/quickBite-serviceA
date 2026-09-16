import { Knex } from "knex";
import { db } from "../../../common/db/knex.ts";
import { Product } from "../entity/product.entity.ts";

const PRODUCT_COLUMNS = [
  "id",
  "name",
  "description",
  "image_url",
  "restaurant_id",
  "category_id",
  "created_at",
  "updated_at",
  "deleted_at",
];

function toEntity(row: any): Product {
  return new Product({
    id: row.id,
    name: row.name,
    description: row.description,
    imageUrl: row.image_url,
    restaurantId: row.restaurant_id,
    categoryId: row.category_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    deletedAt: row.deleted_at,
  });
}

export async function createProduct(
  product: Partial<Product>,
  conn: Knex = db,
) {
  const now = new Date();
  const [row] = await conn("products")
    .insert({
      name: product.name,
      description: product.description,
      image_url: product.imageUrl,
      restaurant_id: product.restaurantId,
      category_id: product.categoryId,
      created_at: now,
      updated_at: now,
      deleted_at: null,
    })
    .returning(PRODUCT_COLUMNS);

  return toEntity(row);
}

export async function updateProduct(
  data: Record<string, any>,
  conn: Knex = db,
  productId: number,
) {
  const now = new Date();
  const updates: Record<string, unknown> = { updated_at: now };

  if (data.name !== undefined) updates.name = data.name;
  if (data.description !== undefined) updates.description = data.description;
  if (data.imageUrl !== undefined) updates.image_url = data.imageUrl;
  if (data.categoryId !== undefined) updates.category_id = data.categoryId;

  const [row] = await conn("products")
    .where("id", productId)
    .update(updates)
    .returning(PRODUCT_COLUMNS);
  return toEntity(row);
}

export async function getProductByName(name: string, branchId: number) {
  const [row] = await db("products as p")
    .join("product_branch_details as pbd", "p.id", "pbd.product_id")
    .where("pbd.branch_id", branchId)
    .whereNull("p.deleted_at")
    .where("p.name", name)
    .select(
      "p.id",
      "p.name",
      "p.description",
      "p.image_url",
      "p.restaurant_id",
      "p.category_id",
      "pbd.price",
      "pbd.stock",
      "pbd.is_available",
    );
  return row ? toEntity(row) : undefined;
}

export async function getProductsByRestaurant(restaurantId: number) {
  const rows = await db("products")
    .select(PRODUCT_COLUMNS)
    .where("restaurant_id", restaurantId)
    .whereNull("deleted_at");
  return rows.map(toEntity);
}

export async function getProductsByBranch(branchId: number) {
  const rows = await db("products as p")
    .join("product_branch_details as pbd", "p.id", "pbd.product_id")
    .leftJoin("product_categories as c", "p.category_id", "c.id")
    .where("pbd.branch_id", branchId)
    .whereNull("p.deleted_at")
    .select(
      "p.id",
      "p.name",
      "p.description",
      "p.image_url",
      "p.restaurant_id",
      "p.category_id",
      "c.name as category_name",
      "pbd.price",
      "pbd.stock",
      "pbd.is_available",
    );
  return rows.map((row: any) => ({
    id: row.id,
    name: row.name,
    description: row.description,
    imageUrl: row.image_url,
    restaurantId: row.restaurant_id,
    categoryId: row.category_id,
    categoryName: row.category_name,
    price: row.price,
    stock: row.stock,
    isAvailable: row.is_available,
  }));
}

export async function deleteProduct(productId: number, conn: Knex = db) {
  const [row] = await conn("products")
    .where("id", productId)
    .update({
      deleted_at: new Date(),
    })
    .returning(PRODUCT_COLUMNS);
  return toEntity(row);
}

export async function getProductById(productId: number) {
  const [row] = await db("products")
    .select(PRODUCT_COLUMNS)
    .where("id", productId)
    .whereNull("deleted_at");

  return row ? toEntity(row) : undefined;
}
