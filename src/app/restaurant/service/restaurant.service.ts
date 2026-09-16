import {
  createRestaurant as create,
  findAllRestaurants as findAll,
  findRestaurantById as findById,
  updateRestaurant as update,
  updateRestaurantStatus,
} from "../repository/restaurant.repo.ts";

import { RestaurantNotFoundError } from "../errors.ts";
import {
  CreateRestaurantDTO,
  UpdateRestaurantDTO,
  UpdateRestaurantStatusDTO,
} from "../dto/restaurant.dto.ts";
import { Knex } from "knex";
import { RestaurantEntity } from "../entity/restaurant.entity.ts";
import { RestaurantStatus } from "../enums.ts";
import { SystemRole } from "../../user/enums.ts";
import { UnAuthorizedError } from "../../branch/errors.ts";
import {
  createUser,
  findUserExistsByEmailOrPhoneNumber,
} from "../../user/repository/user.repo.ts";
import { UserAlreadyExistsError } from "../../auth/errors.ts";
import { hashPassword } from "../../auth/utils/hash.ts";
import { db } from "../../../common/db/knex.ts";

export class RestaurantService {
  async getById(id: number) {
    const restaurant = await findById(id);
    if (!restaurant) throw RestaurantNotFoundError;

    return {
      id: restaurant.id,
      ownerId: restaurant.ownerId,
      name: restaurant.name,
      logoUrl: restaurant.logoUrl,
      primaryCountry: restaurant.primaryCountry,
      status: restaurant.status,
      createdAt: restaurant.createdAt,
      updatedAt: restaurant.updatedAt,
    };
  }

  async getAll() {
    const result = await findAll();
    return result;
  }

  async createRestaurant(userId: number, data: CreateRestaurantDTO, trx: Knex) {
    const now = new Date();
    const restaurant = new RestaurantEntity({
      ownerId: userId,
      name: data.name,
      logoUrl: data.logoUrl,
      primaryCountry: data.primaryCountry,
      status: RestaurantStatus.PENDING,
      createdAt: now,
      updatedAt: now,
      statusUpdatedAt: now,
    });
    const result = await create(restaurant, trx);

    return result;
  }
  async update(
    restaurantId: number,
    data: UpdateRestaurantDTO,
    userId: number,
    userRole: SystemRole,
  ) {
    const restaurant = await findById(restaurantId);
    if (!restaurant) {
      throw RestaurantNotFoundError;
    }

    if (
      userRole != SystemRole.SYSTEM_ADMIN &&
      Number(restaurant.ownerId) !== Number(userId)
    )
      throw UnAuthorizedError;
    const result = await update(restaurantId, data);

    return result;
  }
  async createWithOwner(data: CreateRestaurantDTO, userRole: SystemRole) {
    if (userRole !== SystemRole.SYSTEM_ADMIN) {
      throw UnAuthorizedError;
    }
    const existing = await findUserExistsByEmailOrPhoneNumber(
      data.owner!.email,
      data.owner!.phoneNumber,
    );
    if (existing) throw UserAlreadyExistsError;
    const hashedPassword = await hashPassword(data.owner!.password);
    const now = new Date();
    const trx = await db.transaction();

    try {
      const user = await createUser(
        {
          email: data.owner.email,
          phoneNumber: data.owner.phoneNumber,
          name: data.owner.name,
          passwordHash: hashedPassword,
          systemRole: SystemRole.RESTAURANT_USER,
          createdAt: now,
          updatedAt: now,
        },
        trx,
      );

      const restaurant = await this.createRestaurant(user.id, data, trx);
      await trx.commit();
      return {
        restaurant,
        owner: {
          id: user.id,
          email: user.email,
          phone: user.phoneNumber,
          name: user.name,
          systemRole: user.systemRole,
        },
      };
    } catch (err) {
      await trx.rollback();
      throw err;
    }
  }
  updateStatus = async (
    id: number,
    userRole: SystemRole,
    data: UpdateRestaurantStatusDTO,
  ) => {
    if (userRole !== SystemRole.SYSTEM_ADMIN) {
      throw UnAuthorizedError;
    }
    const restaurant = await findById(id);
    if (!restaurant) {
      throw RestaurantNotFoundError;
    }
    return await updateRestaurantStatus(id, data.status);
  };
}

export const restaurantService = new RestaurantService();
