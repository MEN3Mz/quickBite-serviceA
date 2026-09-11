import {
  createRestaurant as create,
  findAllRestaurants as findAll,
  findRestaurantById as findById,
  updateRestaurant as update,
} from "../repository/restaurant.repo.ts";

import { RestaurantNotFoundError } from "../errors.ts";
import {
  CreateRestaurantDTO,
  UpdateRestaurantDTO,
} from "../dto/restaurant.dto.ts";
import { Knex } from "knex";
import { RestaurantEntity } from "../entity/restaurant.entity.ts";
import { RestaurantStatus } from "../enums.ts";

export class RestaurantService {
  async getById(id: number) {
    const restaurant = await findById(id);
    if (!restaurant) throw RestaurantNotFoundError;

    return {
      id: restaurant.id,
      ownerId: restaurant.ownerId,
      name: restaurant.name,
      logoUrl: restaurant.logoURL,
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
      logoURL: data.logoUrl,
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
  ) {
    const result = await update(
      restaurantId,
      {
        name: data.name,
        logoURL: data.logoUrl,
        primaryCountry: data.primaryCountry,
        status: data.status,
      },
      userId,
    );
    if (!result) {
      throw RestaurantNotFoundError;
    }
    return result;
  }
}

export const restaurantService = new RestaurantService();
