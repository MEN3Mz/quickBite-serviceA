import { Knex } from "knex";
import { UnAuthorizedError } from "../../branch/errors.ts";
import { RestaurantNotFoundError } from "../../restaurant/errors.ts";
import { findRestaurantById } from "../../restaurant/repository/restaurant.repo.ts";
import { SystemRole } from "../../user/enums.ts";
import { CreateProductDTO, UpdateProductDTO } from "../dto/product.dto.ts";
import {
  createCategory,
  getCategoryByName,
  getRestaurantCategories,
} from "../repository/product.category.repo.ts";
import {
  createProduct as create,
  getProductByName,
  getProductsByBranch,
  getProductsByRestaurant,
  updateProduct,
  deleteProduct,
  getProductById,
} from "../repository/product.repo.ts";
import { db } from "../../../common/db/knex.ts";
import { ProductDoesNotExistError } from "../errors.ts";
import { updateBranchDetails } from "../repository/pbd.repo.ts";

export class ProductService {
  async findCategoriesByRestaurant(id: number) {
    return await getRestaurantCategories(id);
  }
  async createProduct(
    userId: number,
    userRole: SystemRole,
    restaurantId: number,
    product: CreateProductDTO,
  ) {
    const restaurant = await findRestaurantById(restaurantId);
    if (!restaurant) throw RestaurantNotFoundError;
    if (userId != restaurant.ownerId && userRole != SystemRole.SYSTEM_ADMIN) {
      throw UnAuthorizedError;
    }
    return await db.transaction(async (trx) => {
      let categoryId: number | null = null;

      if (product.categoryName) {
        let category = await getCategoryByName(
          restaurantId,
          product.categoryName,
        );

        if (!category) {
          category = await createCategory(
            restaurantId,
            product.categoryName,
            trx,
          );
        }

        categoryId = category.id;
      }

      return await create(
        {
          ...product,
          restaurantId,
          categoryId,
        },
        trx,
      );
    });
  }
  async getByBranch(branchId: number) {
    return await getProductsByBranch(branchId);
  }
  async getByRestaurant(
    restaurantId: number,
    userId: number,
    userRole: SystemRole,
  ) {
    const restaurant = await findRestaurantById(restaurantId);
    if (!restaurant) throw RestaurantNotFoundError;
    if (
      userRole !== SystemRole.SYSTEM_ADMIN &&
      Number(restaurant.ownerId) !== Number(userId)
    ) {
      throw UnAuthorizedError;
    }
    return await getProductsByRestaurant(restaurantId);
  }

  async getByName(productName: string, branchId: number) {
    const result = await getProductByName(productName, branchId);
    if (!result) {
      throw ProductDoesNotExistError;
    }
    return result;
  }
  async updateProduct(
    data: UpdateProductDTO,
    productId: number,
    userId: number,
    userRole: SystemRole,
    branchId?: number,
  ) {
    const product = await getProductById(productId);
    if (!product) throw ProductDoesNotExistError;
    const restaurant = await findRestaurantById(product.restaurantId);
    if (!restaurant) throw RestaurantNotFoundError;
    if (
      userRole !== SystemRole.SYSTEM_ADMIN &&
      Number(restaurant.ownerId) !== userId
    ) {
      throw UnAuthorizedError;
    }
    const trx = await db.transaction();
    try {
      let categoryId: number | undefined = undefined;
      if (data.categoryName) {
        let category = await getCategoryByName(
          product.restaurantId,
          data.categoryName,
        );
        if (!category) {
          category = await createCategory(
            product.restaurantId,
            data.categoryName,
            trx,
          );
        }
        categoryId = category.id;
      }

      const productUpdate = {
        ...data,
        ...(categoryId !== undefined ? { categoryId } : {}),
      };
      const result = await updateProduct(productUpdate, trx, productId);
      await trx.commit();

      let branchDetails;
      if (
        branchId &&
        (data.price !== undefined ||
          data.stock !== undefined ||
          data.isAvailable !== undefined)
      ) {
        branchDetails = await updateBranchDetails(branchId, productId, {
          price: data.price,
          stock: data.stock,
          isAvailable: data.isAvailable,
        });
      }

      return { product: result, branchDetails };
    } catch (err) {
      trx.rollback();
      throw err;
    }
  }
  async deleteProduct(productId: number, userId: number, userRole: SystemRole) {
    const product = await getProductById(productId);
    if (!product) throw ProductDoesNotExistError;
    const restaurant = await findRestaurantById(product.restaurantId);
    if (!restaurant) throw RestaurantNotFoundError;
    if (restaurant.ownerId != userId && userRole != SystemRole.SYSTEM_ADMIN) {
      throw UnAuthorizedError;
    }
    const trx = await db.transaction();
    try {
      const result = deleteProduct(productId, trx);
      await trx.commit();
      return result;
    } catch (err) {
      trx.rollback();
      throw err;
    }
  }
  async findById(productId: number) {
    const result = await getProductById(productId);
    if (!result) throw ProductDoesNotExistError;
    return result;
  }
}

export const productService = new ProductService();
